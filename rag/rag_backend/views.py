
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from dotenv import load_dotenv
import asyncio
import threading
import time
import uuid
import logging
from raganything import RAGAnything, RAGAnythingConfig
from lightrag.llm.openai import openai_complete_if_cache, openai_embed
from lightrag.utils import EmbeddingFunc

# Load environment variables
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
BASE_URL = "https://api.openai.com/v1"

# RAGAnything config (can be customized)
config = RAGAnythingConfig(
	working_dir="./rag_storage",
	parser="mineru",
	parse_method="auto",
	enable_image_processing=True,
	enable_table_processing=True,
	enable_equation_processing=True,
)

def llm_model_func(prompt, system_prompt=None, history_messages=[], **kwargs):
	return openai_complete_if_cache(
		"gpt-4o-mini",
		prompt,
		system_prompt=system_prompt,
		history_messages=history_messages,
		api_key=API_KEY,
		base_url=BASE_URL,
		**kwargs,
	)

def vision_model_func(prompt, system_prompt=None, history_messages=[], image_data=None, messages=None, **kwargs):
	if messages:
		return openai_complete_if_cache(
			"gpt-4o",
			"",
			system_prompt=None,
			history_messages=[],
			messages=messages,
			api_key=API_KEY,
			base_url=BASE_URL,
			**kwargs,
		)
	elif image_data:
		return openai_complete_if_cache(
			"gpt-4o",
			"",
			system_prompt=None,
			history_messages=[],
			messages=[
				{"role": "system", "content": system_prompt} if system_prompt else None,
				{
					"role": "user",
					"content": [
						{"type": "text", "text": prompt},
						{"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}},
					],
				} if image_data else {"role": "user", "content": prompt},
			],
			api_key=API_KEY,
			base_url=BASE_URL,
			**kwargs,
		)
	else:
		return llm_model_func(prompt, system_prompt, history_messages, **kwargs)

embedding_func = EmbeddingFunc(
	embedding_dim=3072,
	max_token_size=8192,
	func=lambda texts: openai_embed(
		texts,
		model="text-embedding-3-large",
		api_key=API_KEY,
		base_url=BASE_URL,
	),
)

rag = RAGAnything(
	config=config,
	llm_model_func=llm_model_func,
	vision_model_func=vision_model_func,
	embedding_func=embedding_func,
)

# Global task storage for tracking background jobs
TASK_STORAGE = {}

class TaskStatus:
	PENDING = "pending"
	PROCESSING = "processing" 
	COMPLETED = "completed"
	FAILED = "failed"

class ProcessingTask:
	def __init__(self, task_id, file_path):
		self.task_id = task_id
		self.file_path = file_path
		self.status = TaskStatus.PENDING
		self.progress = 0
		self.logs = []
		self.result = None
		self.error = None
		self.start_time = time.time()
		self.end_time = None
		
	def add_log(self, message):
		timestamp = time.strftime("%H:%M:%S")
		log_entry = f"[{timestamp}] {message}"
		self.logs.append(log_entry)
		print(log_entry)  # Also print to console
		
	def update_progress(self, progress, message=None):
		self.progress = progress
		if message:
			self.add_log(f"Progress: {progress}% - {message}")
			
	def complete(self, result=None):
		self.status = TaskStatus.COMPLETED
		self.progress = 100
		self.result = result
		self.end_time = time.time()
		self.add_log("Processing completed successfully!")
		
	def fail(self, error):
		self.status = TaskStatus.FAILED
		self.error = str(error)
		self.end_time = time.time()
		self.add_log(f"Processing failed: {error}")
		
	def get_duration(self):
		"""Get processing duration, handling None end_time"""
		if self.end_time is None:
			return time.time() - self.start_time
		return self.end_time - self.start_time

def process_document_async(task_id, file_path, output_dir, parse_method):
	"""Background processing function"""
	task = TASK_STORAGE[task_id]
	try:
		task.status = TaskStatus.PROCESSING
		task.add_log(f"Starting document processing: {os.path.basename(file_path)}")
		task.update_progress(5, "Initializing RAG pipeline...")
		
		# Capture stdout to detect cached vs new processing
		original_logs_count = len(task.logs)
		
		async def run_processing():
			task.update_progress(10, "Processing document with RAGAnything...")
			task.add_log("Checking if document is already processed...")
			
			await rag.process_document_complete(
				file_path=file_path,
				output_dir=output_dir,
				parse_method=parse_method
			)
			task.update_progress(95, "Finalizing processing...")
			
		# Run the async processing
		asyncio.run(run_processing())
		
		# Determine if this was cached or new processing
		was_cached = any("already exists" in log or "cached" in log.lower() for log in task.logs[original_logs_count:])
		processing_type = "Cached document - used existing results" if was_cached else "New document - full processing completed"
		
		task.add_log(f"Processing type: {processing_type}")
		
		task.complete({
			"file_path": file_path,
			"output_dir": output_dir,
			"processing_time": task.get_duration(),
			"processing_type": processing_type,
			"was_cached": was_cached
		})
		
	except Exception as e:
		task.fail(e)

@csrf_exempt
def process_document(request):
	if request.method == "POST":
		file_path = request.POST.get("file_path")
		output_dir = request.POST.get("output_dir", "./output")
		parse_method = request.POST.get("parse_method", "auto")
		
		if not file_path:
			return JsonResponse({"error": "file_path is required"}, status=400)
		
		if not os.path.exists(file_path):
			return JsonResponse({"error": f"File not found: {file_path}"}, status=400)
		
		# Generate unique task ID
		task_id = str(uuid.uuid4())
		
		# Create and store task
		task = ProcessingTask(task_id, file_path)
		TASK_STORAGE[task_id] = task
		
		# Start background processing
		thread = threading.Thread(
			target=process_document_async,
			args=(task_id, file_path, output_dir, parse_method)
		)
		thread.daemon = True
		thread.start()
		
		return JsonResponse({
			"task_id": task_id,
			"status": "processing",
			"message": "Document processing started in background"
		})
		
	return JsonResponse({"error": "POST required"}, status=405)

@csrf_exempt 
def task_status(request, task_id):
	"""Get status and logs for a processing task"""
	if request.method == "GET":
		task = TASK_STORAGE.get(task_id)
		if not task:
			return JsonResponse({"error": "Task not found"}, status=404)
			
		response_data = {
			"task_id": task_id,
			"status": task.status,
			"progress": task.progress,
			"logs": task.logs[-50:],  # Return last 50 log entries
			"file_path": os.path.basename(task.file_path),
			"start_time": task.start_time,
		}
		
		if task.end_time:
			response_data["end_time"] = task.end_time
			response_data["duration"] = task.get_duration()
		else:
			response_data["duration"] = task.get_duration()
			
		if task.result:
			response_data["result"] = task.result
			
		if task.error:
			response_data["error"] = task.error
			
		return JsonResponse(response_data)
		
	return JsonResponse({"error": "GET required"}, status=405)

@csrf_exempt
def clear_cache(request):
	"""Clear RAG processing cache to force fresh processing"""
	if request.method == "POST":
		try:
			import shutil
			
			# Remove the rag_storage directory to clear all cache
			rag_storage_path = "./rag_storage"
			if os.path.exists(rag_storage_path):
				shutil.rmtree(rag_storage_path)
				return JsonResponse({
					"message": "Cache cleared successfully",
					"next_processing": "Will be fresh processing (10+ minutes)"
				})
			else:
				return JsonResponse({
					"message": "No cache found to clear",
					"next_processing": "Will be fresh processing (10+ minutes)"
				})
				
		except Exception as e:
			return JsonResponse({"error": str(e)}, status=500)
			
	return JsonResponse({"error": "POST required"}, status=405)

@csrf_exempt
def query_document(request):
	if request.method == "POST":
		query = request.POST.get("query")
		mode = request.POST.get("mode", "hybrid")
		multimodal_content = request.POST.get("multimodal_content")
		if not query:
			return JsonResponse({"error": "query is required"}, status=400)
		async def run():
			if multimodal_content:
				import json
				try:
					mm_content = json.loads(multimodal_content)
				except Exception:
					mm_content = []
				result = await rag.aquery_with_multimodal(query, multimodal_content=mm_content, mode=mode)
			else:
				result = await rag.aquery(query, mode=mode)
			return {"result": result}
		response = asyncio.run(run())
		return JsonResponse(response)
	return JsonResponse({"error": "POST required"}, status=405)
