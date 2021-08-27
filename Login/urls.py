from django.contrib import admin
from django.urls import path, include
from Login import views

urlpatterns = [
    path('', views.login),
    path('check-cred/', views.check_cred),
]
