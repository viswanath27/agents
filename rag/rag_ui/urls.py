from django.urls import path
from . import views

app_name = 'rag_ui'

urlpatterns = [
    # Frontend routes
    path('', views.index, name='index'),  # Main dashboard
    path('upload/', views.upload_file, name='upload_file'),  # File upload
    path('process_file/', views.process_file, name='process_file'),  # Process document
    
    # API routes for configuration and chat
    path('api/config/save/', views.save_config, name='save_config'),
    path('api/config/load/', views.load_config, name='load_config'),
    path('api/chat/', views.chat_query, name='chat_query'),
]