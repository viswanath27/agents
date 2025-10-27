from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("RAG UI - Frontend Entry Point")
