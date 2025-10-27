from django.urls import path
from . import views

app_name = 'rag_backend'

urlpatterns = [
    path('process_document/', views.process_document, name='process_document'),
    path('task_status/<str:task_id>/', views.task_status, name='task_status'),
    path('query_document/', views.query_document, name='query_document'),
    path('clear_cache/', views.clear_cache, name='clear_cache'),
]