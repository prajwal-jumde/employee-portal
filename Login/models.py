# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class User(models.Model):
    user_name = models.CharField(max_length=200, unique=True,primary_key=True)
    password = models.CharField(max_length=200)
    full_name = models.CharField(max_length=200)
    email_id = models.CharField(max_length=200, unique=True)
    enabled= models.BooleanField(default=True)
    user_id = models.CharField(max_length=15, unique=True)
    user_role = models.CharField(max_length=15)
    user_phone = models.CharField(max_length=15)
    is_deleted = models.BooleanField(default=False)
    created_by = models.CharField(max_length=200, default="SYSTEM")
    created_at = models.TimeField(auto_now_add=True)
    updated_by = models.CharField(max_length=200, default="SYSTEM")
    updated_at = models.TimeField(auto_now=True)
    class Meta:
        db_table = "User"
    
        

class LeaveMaster(models.Model):
    leave_type = models.CharField(max_length=200, unique=True,primary_key=True)
    yearly_quota = models.FloatField()
    monthly_quota = models.FloatField()
    class Meta:
        db_table = "leave_master"

class LeaveRequests(models.Model):
    user_name = models.ForeignKey('User', on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    leave_type = models.CharField(max_length=200)
    total_days = models.FloatField()
    leave_from = models.DateField(null=True)
    leave_to = models.DateField(null=True)
    paid_leave = models.BooleanField(default=False)
    status = models.CharField(max_length=200, default="pending")
    rejected_reason = models.CharField(max_length=200,null=True)
    is_deleted = models.BooleanField(default=False)
    created_by = models.CharField(max_length=200, default="SYSTEM")
    created_at = models.DateField(auto_now_add=True,null=True)
    updated_by = models.CharField(max_length=200, default="SYSTEM")
    updated_at = models.DateField(auto_now=True,null=True)
    class Meta:
        db_table = "leave_request"  

class LeavesData(models.Model):
    leave_type = models.ForeignKey('LeaveMaster', on_delete=models.CASCADE)
    remaining_leave_monthly = models.FloatField()
    remaining_leave_yearly = models.FloatField()
    created_at = models.DateField(auto_now_add=True,null=True)
    user_name = models.ForeignKey('User', on_delete=models.CASCADE)
    paid_leave = models.BooleanField(default=False)
    class Meta:
        db_table = "leaves_data"
        unique_together = ('leave_type','user_name')
         