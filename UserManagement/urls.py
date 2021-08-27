from django.contrib import admin
from django.urls import path, include
from UserManagement import views

urlpatterns = [
    path('', views.userListing),
    path('list-leave-request/', views.listLeaveRequests),
    path('leave-request-action/', views.leaveRequestsAction),
    path('user-action/', views.userAction),
    path('list-leave/', views.leaveTypListing),
    path('add-leave/', views.addLeaveType),
    path('dashboard/', views.viewDashboard),
    path('check-paid/', views.checkLeavePaidOrUnpaid)
]
