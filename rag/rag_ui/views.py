
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
import os
import requests
import json

def index(request):
    """Main dashboard view"""
    # Get CSRF token for the template
    csrf_token = get_token(request)
    
    # List uploaded files or demo files
    base_dir = os.path.join(os.path.dirname(__file__), '../rag_backend/RAG-Anything/test')
    files = []
    
    # Check if test directory exists and has files
    if os.path.exists(base_dir):
        files = [f for f in os.listdir(base_dir) 
                if f.lower().endswith(('.pdf', '.doc', '.docx', '.txt', '.md'))]
    
    return render(request, 'file_browser.html', {
        'files': files, 
        'csrf_token': csrf_token
    })

def upload_file(request):
    """Handle file upload"""
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        
        # Validate file type
        allowed_extensions = ['.pdf', '.doc', '.docx', '.txt', '.md', '.jpg', '.jpeg', '.png']
        file_ext = os.path.splitext(uploaded_file.name)[1].lower()
        
        if file_ext not in allowed_extensions:
            return JsonResponse({
                'error': f'File type {file_ext} not supported. Allowed: {", ".join(allowed_extensions)}'
            }, status=400)
        
        # Save file to test directory
        base_dir = os.path.join(os.path.dirname(__file__), '../rag_backend/RAG-Anything/test')
        os.makedirs(base_dir, exist_ok=True)
        
        file_path = os.path.join(base_dir, uploaded_file.name)
        
        # Save the file
        with open(file_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        
        return JsonResponse({
            'success': True,
            'message': f'File {uploaded_file.name} uploaded successfully',
            'file_name': uploaded_file.name,
            'file_size': uploaded_file.size
        })
    
    return JsonResponse({'error': 'No file provided'}, status=400)

@csrf_exempt
def process_file(request):
    """Process uploaded file"""
    if request.method == 'POST':
        file_name = request.POST.get('file_name')
        if not file_name:
            return JsonResponse({'error': 'No file selected'}, status=400)
            
        # Build absolute path
        base_dir = os.path.join(os.path.dirname(__file__), '../rag_backend/RAG-Anything/test')
        file_path = os.path.join(base_dir, file_name)
        
        if not os.path.exists(file_path):
            return JsonResponse({'error': f'File {file_name} not found'}, status=404)
        
        # Call rag_backend endpoint
        backend_url = 'http://localhost:8000/api/process_document/'
        payload = {
            'file_path': file_path,
            'output_dir': os.path.join(base_dir, 'output'),
            'parse_method': 'auto'
        }
        
        try:
            resp = requests.post(backend_url, data=payload)
            return JsonResponse(resp.json())
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'POST required'}, status=405)

def save_config(request):
    """Save configuration settings"""
    if request.method == 'POST':
        try:
            config_data = json.loads(request.body)
            
            # Save to a config file (in production, save to database)
            config_dir = os.path.join(os.path.dirname(__file__), '../config')
            os.makedirs(config_dir, exist_ok=True)
            
            config_file = os.path.join(config_dir, 'rag_config.json')
            with open(config_file, 'w') as f:
                json.dump(config_data, f, indent=2)
            
            return JsonResponse({
                'success': True,
                'message': 'Configuration saved successfully'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'POST required'}, status=405)

def load_config(request):
    """Load configuration settings"""
    try:
        config_file = os.path.join(os.path.dirname(__file__), '../config/rag_config.json')
        
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                config_data = json.load(f)
            return JsonResponse({
                'success': True,
                'config': config_data
            })
        else:
            # Return default configuration
            return JsonResponse({
                'success': True,
                'config': {}
            })
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def chat_query(request):
    """Handle chat queries against processed documents"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            query = data.get('query', '').strip()
            
            if not query:
                return JsonResponse({'error': 'Query cannot be empty'}, status=400)
            
            # Call rag_backend query endpoint (you'll need to implement this)
            backend_url = 'http://localhost:8000/api/query/'
            payload = {'query': query}
            
            resp = requests.post(backend_url, json=payload)
            if resp.status_code == 200:
                return JsonResponse(resp.json())
            else:
                return JsonResponse({
                    'error': 'Failed to process query',
                    'details': resp.text
                }, status=resp.status_code)
                
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'POST required'}, status=405)
