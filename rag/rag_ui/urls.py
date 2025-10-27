from django.urls import path
from . import views

app_name = 'rag_ui'

urlpatterns = [
    # Frontend routes will go here
    path('', views.index, name='index'),  # Main frontend entry point
]