# Generated by Django 3.2.6 on 2021-08-25 00:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='LeaveMaster',
            fields=[
                ('leave_type', models.CharField(max_length=200, primary_key=True, serialize=False, unique=True)),
                ('yearly_quota', models.FloatField()),
                ('monthly_quota', models.FloatField()),
            ],
            options={
                'db_table': 'leave_master',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_name', models.CharField(max_length=200, primary_key=True, serialize=False, unique=True)),
                ('password', models.CharField(max_length=200)),
                ('full_name', models.CharField(max_length=200)),
                ('email_id', models.CharField(max_length=200, unique=True)),
                ('enabled', models.BooleanField(default=True)),
                ('user_id', models.CharField(max_length=15, unique=True)),
                ('user_role', models.CharField(max_length=15)),
                ('leave_remaining', models.JSONField()),
                ('user_phone', models.CharField(max_length=15)),
                ('is_deleted', models.BooleanField(default=False)),
                ('created_by', models.CharField(default='SYSTEM', max_length=200)),
                ('created_at', models.TimeField(auto_now_add=True)),
                ('updated_by', models.CharField(default='SYSTEM', max_length=200)),
                ('updated_at', models.TimeField(auto_now=True)),
            ],
            options={
                'db_table': 'User',
            },
        ),
        migrations.CreateModel(
            name='LeavesData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('remaing_leave_monthly', models.FloatField()),
                ('remaing_leave_yearly', models.FloatField()),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('leave_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Login.leavemaster')),
            ],
            options={
                'db_table': 'leaves_data',
            },
        ),
        migrations.CreateModel(
            name='LeaveRequests',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=200)),
                ('leave_type', models.CharField(max_length=200)),
                ('total_days', models.FloatField()),
                ('leave_from', models.DateField(null=True)),
                ('leave_to', models.DateField(null=True)),
                ('paid_leave', models.BooleanField(default=False)),
                ('status', models.CharField(default='pending', max_length=200)),
                ('is_deleted', models.BooleanField(default=False)),
                ('created_by', models.CharField(default='SYSTEM', max_length=200)),
                ('created_at', models.DateField(auto_now_add=True, null=True)),
                ('updated_by', models.CharField(default='SYSTEM', max_length=200)),
                ('updated_at', models.DateField(auto_now=True, null=True)),
                ('user_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Login.user')),
            ],
            options={
                'db_table': 'leave_request',
            },
        ),
    ]
