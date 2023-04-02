from os import read
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
import pprint
import bcrypt
from Login.models import *
from django.core.paginator import Paginator
from django.db.models import Q
from RequestForms.ListingForm import ListingForm
from django.template import loader
from django.core import serializers
from common.commonFunction import checkSession, getExpires, setCookies, getJsonResponse
from common import constants
from datetime import datetime, timedelta
import dateutil.parser as parser
import calendar
# from fcm_django.models import FCMDevice

@csrf_exempt
def viewDashboard(request):
    try:
        cookie = request.COOKIES
        userInfo = checkSession(request)
        # if userInfo['user'] == 'admin':
        #     return HttpResponseRedirect('../../users/list-leave-request/') commented for testing

        if request.method == "GET":
            result = {
                "totalRecords": 0,
                "results": []
            }
            response = render(
                request, "UserManagement/Dashboard.html", {"result": result})

        elif request.method == "POST":
            data = json.loads(request.body)
            print('1')
            print(data)
            leaveList = []
            leaveTypeSet = LeaveMaster.objects.all().order_by('leave_type')
            if "search" in data and data['search'] != '':
                leaveTypeSet = leaveTypeSet.filter(leave_type__icontains=data['search'])
            print('4')
            for leaves in leaveTypeSet:
                allowed_leaves = {
                    "leave_type":leaves.leave_type,
                    "total_leaves_year":leaves.yearly_quota,
                    "total_leaves_month":leaves.monthly_quota,
                }
                leavesSet = LeavesData.objects.filter(user_name_id =cookie['user_session'],leave_type_id = leaves.leave_type ).order_by('leave_type').first()
                if leavesSet:
                    allowed_leaves['remaining_leaves_month'] = leavesSet.remaining_leave_monthly
                    allowed_leaves['remaining_leaves_year'] = leavesSet.remaining_leave_yearly
                else:
                    allowed_leaves['remaining_leaves_month'] = leaves.monthly_quota
                    allowed_leaves['remaining_leaves_year'] = leaves.yearly_quota
                leaveList.append(allowed_leaves)
                print(leaveList)

            totalRecords = len(leaveList)
            # print('3')
            paginator = Paginator(leaveList, data['pageLimit'])
            leavesInPage = paginator.get_page(data['pageOffset'])
            # print(list(leavesInPage))
            response = HttpResponse(json.dumps(
                {"result": list(leavesInPage),"totalRecords": totalRecords}), content_type='application/json')

        return setCookies(cookie, response)
    except (Exception) as error:
        print('error ',error)
        return JsonResponse({'statusMessage': str(error), 'status': constants.ERROR_CODE}, status=500, safe=False)




@csrf_exempt
def leaveTypListing(request):
    try:
        cookie = request.COOKIES
        userInfo = checkSession(request)
        if userInfo['user'] != 'admin':
            return HttpResponseRedirect('../../users/dashboard/')

        if request.method == "GET":
            result = {
                "totalRecords": 0,
                "results": []
            }
            response = render(
                request, "UserManagement/LeaveSettings.html", {"result": result})

        elif request.method == "POST":
            data = json.loads(request.body)
            leaveList = []
            leavesSet = LeaveMaster.objects.all().order_by('leave_type')
            if "search" in data and data['search'] != '':
                leavesSet = leavesSet.filter(leave_type__icontains=data['search'])
            if ("sortType" in data and (data['sortType'] != "" and data['sortType'] != "-")) or "sortType" not in data:
                data['sortType'] = ""

            if ("sortColumn" in data and data['sortColumn'] == "") or "sortColumn" not in data:
                data['sortColumn'] = 'leave_type'

            leavesSet = leavesSet.order_by(data['sortType'] + data['sortColumn'])        
             
            totalRecords = len(leavesSet)
            paginator = Paginator(leavesSet, data['pageLimit'])
            leavesInPage = paginator.get_page(data['pageOffset'])
            for leaves in leavesInPage:
                leavesObj = {
                    "leave_type":leaves.leave_type,
                    "monthly_quota":leaves.monthly_quota,
                    "yearly_quota":leaves.yearly_quota
         
                }
                leaveList.append(leavesObj)
            response = HttpResponse(json.dumps(
                {"result": leaveList,"totalRecords": totalRecords}), content_type='application/json')

        return setCookies(cookie, response)
    except (Exception) as error:
        print('leaveTypListing ',error)
        return JsonResponse({'statusMessage': str(error), 'status': constants.ERROR_CODE}, status=500, safe=False)

@csrf_exempt
def addLeaveType(request):
    try:
        print(request)
        data = json.loads(request.body)
        print(data)
        leaveObj = LeaveMaster()
        leaveObj.leave_type = data['leave_name']
        leaveObj.monthly_quota = data['monthly_quota']
        leaveObj.yearly_quota = data['yearly_quota']
        leaveObj.save()
        result = ({"status": constants.SUCCESS_CODE, "message": "Leave Added"})
        return getJsonResponse(request, result)
    except (Exception) as error:
        print(error)
        return JsonResponse({'statusMessage': str(error), 'status': constants.ERROR_CODE}, status=500, safe=False)

@csrf_exempt
def userListing(request):
    '''
    API endpoint for listing user.
    '''
    allUserList = []
    try:
        userInfo = checkSession(request)
        cookie = request.COOKIES
        if userInfo['user'].lower() != 'admin':
            return HttpResponseRedirect('../users/dashboard/')
        expires = getExpires(1800)

        if request.method == "GET":

            data = dict()
            data['pageLimit'] = 10
            data['pageOffset'] = 1
            listResult = getUsers(data)

            response = render(request, "UserManagement/UserListing.html",
                              {"result": listResult, "userInfo": userInfo})

        elif request.method == "POST":

            data = json.loads(request.body)
            userSet = []
            listingForm = ListingForm(json.loads(request.body))
            assert listingForm.is_valid()
            listResult = getUsers(data)

            response = HttpResponse(json.dumps(
                {"result": listResult, "userInfo": userInfo}), content_type='application/json')

        return setCookies(cookie, response)
    except AssertionError as error:
        print(error)
        return JsonResponse({'statusMessage': str(error), 'status': constants.ERROR_CODE}, status=500, safe=False)

    except Exception as error:
        print(error)
        return JsonResponse({'statusMessage': str(error), 'status': constants.ERROR_CODE}, status=500, safe=False)


@csrf_exempt
def userAction(request):
    try:
        cookie = request.COOKIES
        userInfo = checkSession(request)
        expires = getExpires(1800)

        assert request.method == "POST", constants.POST_METHOD_ERROR
        data = json.loads(request.body)
        status = True
        if data['action'] == "add":
            status = addUser(data)
        elif data['action'] == "update":
            status = updateUser(data)
        elif data['action'] == "delete":
            status = deleteUser(data)
        elif data['action'] == "enable_disable":
            status = enableDisableUser(data)
        else:
            return JsonResponse({'statusMessage': "Action is not valid", 'status': constants.ERROR_CODE}, status=500, safe=False)

        # return JsonResponse(status, safe=False)
        return getJsonResponse(request, status)

    except AssertionError as error:
        print(error)
        return JsonResponse({'statusMessage': str(error), 'status': constants.ERROR_CODE}, status=500, safe=False)

    except (Exception) as error:
        print(error)
        return JsonResponse({"status": constants.ERROR_CODE, "message": str(error)})


def getUsers(data):
    '''
    '''
    userList = []

    if ("sortType" in data and (data['sortType'] != "" and data['sortType'] != "-")) or "sortType" not in data:
        data['sortType'] = ""

    if ("sortColumn" in data and data['sortColumn'] == "") or "sortColumn" not in data:
        data['sortColumn'] = 'created_at'

    if "search" in data and data['search'] != '':
        userSet = User.objects.filter(full_name__icontains=data['search'], is_deleted=False).order_by(
            data['sortType'] + data['sortColumn'])
    else:
        userSet = User.objects.filter(is_deleted=False).order_by(
            data['sortType'] + data['sortColumn'])

    totalRecords = len(userSet)
    paginator = Paginator(userSet, data['pageLimit'])
    userInPage = paginator.get_page(data['pageOffset'])

    for user in userInPage:
        user_data = {
            "user_name": user.user_name,
            "full_name": user.full_name,
            "email_id": user.email_id,
            "user_id": user.user_id,
            "user_role": user.user_role,
            "user_phone": user.user_phone,
        }
        if user.enabled:
            user_data["enabled"] = "enabled"
        else:
            user_data["enabled"] = "disabled"
        userList.append(user_data)
    return {"userList": userList, "totalRecords": totalRecords}

@csrf_exempt
def checkLeavePaidOrUnpaid(request):
    try:
    # if True:
        data = json.loads(request.body)
        print(data)
        paidUnapaid = ''
        # filtering Leaves setting table to get allowed leaves
        leaveObj = LeaveMaster.objects.get(leave_type = data['leave_type'])
        # fetching amount of leaves user has taken this month
        fromDate = parser.parse(data['from_date'])
        toDate = parser.parse(data['to_date'])
        lastDayOfMonth = calendar.monthrange(fromDate.year,fromDate.month)
        lastDayOfMonth = lastDayOfMonth[1]
        currentMonthDayStart = str(fromDate.year)
        currentMonthDayEnd = str(fromDate.year)
        if fromDate.month <10:
            currentMonthDayStart += '-0'+str(fromDate.month)+'-'+ '01'
        else:
            currentMonthDayStart += '-'+str(fromDate.month)+'-'+ '01'
        if toDate.month <10:
            currentMonthDayEnd += '-0'+str(fromDate.month)+'-'+ str(lastDayOfMonth)
        else:
            currentMonthDayEnd += str(fromDate.month)+'-'+ str(lastDayOfMonth)
        
        curentMontLeavesTaken = LeaveRequests.objects.filter(created_at__range=(currentMonthDayStart,currentMonthDayEnd),leave_type = data['leave_type']).count()
        print(curentMontLeavesTaken,leaveObj.monthly_quota,data['total_days'] )
        print(curentMontLeavesTaken > leaveObj.monthly_quota)
        print(data['total_days'] > leaveObj.monthly_quota)
        if (curentMontLeavesTaken > leaveObj.monthly_quota) or data['total_days'] > leaveObj.monthly_quota:
            paidUnapaid = 'unpaid'
        # if: curentMontLeavesTaken == 0:
        else:
            paidUnapaid = 'paid'
        status = {"status": 200, "paid_unpaid": paidUnapaid}
        return getJsonResponse(request, status)
    except (Exception) as error: 
        print(error)
        return JsonResponse({'statusMessage': str(error), 'status': constants.ERROR_CODE}, status=500, safe=False)


@csrf_exempt
def listLeaveRequests(request):
    '''
    '''
    try:
        cookie = request.COOKIES
        userInfo = checkSession(request)
        if not userInfo:
            return HttpResponseRedirect('../../')
        leave_types = list(LeaveMaster.objects.values_list('leave_type',flat = True))
        if request.method == "GET":
            result = {
                "totalRecords": 0,
                "results": []
            }
            response = render(
                request, "UserManagement/LeaveRquests.html", {"result": result,"leave_types":leave_types})

        elif request.method == "POST":
            data = json.loads(request.body)
            leaveList = []
            if ("sortType" in data and (data['sortType'] != "" and data['sortType'] != "-")) or "sortType" not in data:
                data['sortType'] = ""

            if ("sortColumn" in data and data['sortColumn'] == "") or "sortColumn" not in data:
                data['sortColumn'] = 'created_at'

            if "search" in data and data['search'] != '':
                leavesSet = LeaveRequests.objects.filter(full_name__icontains=data['search'], is_deleted=False).order_by(
                    data['sortType'] + data['sortColumn'])
            else:
                leavesSet = LeaveRequests.objects.filter(is_deleted=False).order_by(
                    data['sortType'] + data['sortColumn'])
            
            if data['user_role'].lower() == "employee":
                leavesSet = leavesSet.filter(user_name_id = data['user_name']) # Employe can see only his own requests

            totalRecords = len(leavesSet)
            paginator = Paginator(leavesSet, data['pageLimit'])
            leavesInPage = paginator.get_page(data['pageOffset'])
            leave_types = list(LeaveMaster.objects.values_list('leave_type',flat = True))
            for leaves in leavesInPage:
                leavesObj = {
                    "id":leaves.id,
                    "status":leaves.status,
                    "full_name":leaves.full_name,
                    "leave_type":leaves.leave_type,
                    "total_days":leaves.total_days,
                    "leave_from":str(leaves.leave_from),
                    "leave_to":str(leaves.leave_to),
                    "rejected_reason": leaves.rejected_reason if leaves.rejected_reason else "-"
                }
                if leaves.paid_leave:
                    leavesObj['paid_leave'] = "paid"
                else:
                    leavesObj['paid_leave'] = "unpaid"                  
                leaveList.append(leavesObj)
            response = HttpResponse(json.dumps(
                {"result": leaveList,"totalRecords": totalRecords,"leave_types":leave_types}), content_type='application/json')

        return setCookies(cookie, response)
    except (Exception) as error:
        print(error)
        return JsonResponse({'statusMessage': str(error), 'status': constants.ERROR_CODE}, status=500, safe=False)

def addUser(data):
    '''
    add new user information in the database
    '''
    try:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw((data['password']).encode('utf-8'), salt)
        if(User.objects.filter(user_phone=data['phone_number'])).exists():
            return ({"status": constants.ERROR_CODE, "message": constants.PHONE_EXISTS})
        else:
            newUser = User(
                user_name=data['user_name'],
                password=hashed.decode("utf-8"),
                # password=hashed,
                full_name=data['full_name'],
                email_id=data['email'],
                user_id=data['userId'],
                user_role=data['userRole'],
                user_phone=data['phone_number'],
                created_by=data['user_name'],
                updated_by=data['user_name'],
                is_deleted=False
            )
            newUser.save()
            return ({"status": constants.SUCCESS_CODE, "message": constants.USER_ADDED})

    except Exception as error:
        print(error)
        return ({"status": constants.ERROR_CODE, "message": str(error)})


def deleteUser(data):
    '''
    soft delete user from the database
    '''
    try:
        userName = data['user_name']
        deleteUser = User.objects.get(user_name=userName)
        deleteUser.is_deleted = True
        deleteUser.updated_by = userName
        deleteUser.save()
        return ({"status": constants.SUCCESS_CODE, "message": constants.USER_DELETED})

    except Exception as error:
        print(error)
        return ({"status": constants.ERROR_CODE, "message": str(error)})

def enableDisableUser(data):
    '''
    soft delete user from the database
    '''
    try:
        userName = data['user_name']
        deleteUser = User.objects.get(user_name=userName)
        if deleteUser.enabled:
            deleteUser.enabled = False
            message = "user disalbed successfully"
        else:
            deleteUser.enabled = True
            message = "user enabled successfully"
        deleteUser.updated_by = userName
        deleteUser.save()
        return ({"status": constants.SUCCESS_CODE, "message": message})

    except Exception as error:
        print(error)
        return ({"status": constants.ERROR_CODE, "message": str(error)})



def updateUser(data):
    '''
    Update the user information in the database
    '''
    try:
        # if(User.objects.filter(user_phone = data['phone_number'])).exists():
        #     return ({"status": constants.ERROR_CODE, "message": constants.PHONE_EXISTS})
        # else:
        oldUserName = data['oldUserName']
        updateUser = User.objects.get(user_name=oldUserName)
        if 'password' in data and data['password'] != '':
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw((data['password']).encode('utf-8'), salt)
            updateUser.password = hashed.decode("utf-8")

        updateUser.user_name = data['user_name']
        updateUser.updated_by = data['user_name']
        updateUser.full_name = data['full_name']
        updateUser.email_id = data['email']
        updateUser.user_id = data['userId']
        updateUser.user_role = data['userRole']
        updateUser.user_phone = data['phone_number']
        if 'enabled' in data :
            updateUser.enabled = data['enabled']
        updateUser.save()
        return ({"status": constants.SUCCESS_CODE, "message": constants.USER_EDITED})

    except Exception as error:
        print(error)
        return ({"status": constants.ERROR_CODE, "message": str(error)})


@csrf_exempt
def leaveRequestsAction(request):
    try:
        cookie = request.COOKIES
        userInfo = checkSession(request)
        expires = getExpires(1800)

        assert request.method == "POST"
        data = json.loads(request.body)
        status = True
        if data['action'] == "add":
            status = addLeaveRequest(data)
        elif data['action'] == "approve" or data['action']=='reject':
            status = approveRejectLeaveRequest(data)
        else:
            return JsonResponse({'statusMessage': "Action is not valid", 'status': constants.ERROR_CODE}, status=500, safe=False)

        # return JsonResponse(status, safe=False)
        return getJsonResponse(request, status)

    except AssertionError as error:
        print(error)
        return JsonResponse({'statusMessage': str(error), 'status': constants.ERROR_CODE}, status=500, safe=False)

    except (Exception) as error:
        print(error)
        return JsonResponse({"status": constants.ERROR_CODE, "message": str(error)})

def addLeaveRequest(data):
    try:
        if data['paid_leave'].lower() == 'paid':
            data['paid_leave'] = True
        else :
            data['paid_leave'] = False
        leaveObj = LeaveRequests()
        leaveObj.user_name_id = data['user_name']
        leaveObj.full_name = data['full_name']
        leaveObj.leave_type = data['leave_type']
        leaveObj.total_days = data['total_days']
        leaveObj.leave_from = data['leave_from']
        leaveObj.leave_to = data['leave_to']
        leaveObj.paid_leave = data['paid_leave']
        leaveObj.created_by =  data['created_by']
        leaveObj.updated_by =  data['created_by']
        status = leaveObj.save()
        return ({"status": constants.SUCCESS_CODE, "message":"Leave Created scuccessfully"})
    except (Exception) as error:
        print(error)
        return ({"status": constants.ERROR_CODE, "message": str(error)})

def approveRejectLeaveRequest(data):
    try:
        print(data)
        id = data['id']
        if data['action'] == "approve":
            leaveObject = LeaveRequests.objects.get(id =id )
            print(leaveObject.total_days    )
            leaveObject.stauts = 'approved'
            message = "leave approved successfully"
            leaveData = LeavesData()
            leaveData.leave_type_id = leaveObject.leave_type
            leaveData.user_name_id = data['user_name']
            leaveData.paid_leave = leaveObject.paid_leave
            leaveLimitObj = LeaveMaster.objects.get(leave_type =leaveObject.leave_type)
            if leaveData.paid_leave:
                leaves_allowed_in_month = leaveLimitObj.monthly_quota
                leaves_allowed_in_year = leaveLimitObj.yearly_quota
                if leaveObject.total_days >= leaves_allowed_in_month:
                    leaveData.remaining_leave_monthly = 0
                elif not leaveData.remaining_leave_monthly:
                    leaveData.remaining_leave_monthly = leaveLimitObj.monthly_quota - leaveObject.total_days
                else :
                    leaveData.remaining_leave_monthly -= leaveObject.total_days

                if leaveObject.total_days >= leaves_allowed_in_year:
                    leaveData.remaining_leave_yearly = 0
                elif not leaveData.remaining_leave_yearly:
                    leaveData.remaining_leave_yearly = leaveLimitObj.yearly_quota - leaveObject.total_days
                else:
                    leaveData.remaining_leave_yearly -= leaveObject.total_days

            leaveData.save()
            leaveObject.status = 'approved'
            leaveObject.save()
        else:
            leaveObject = LeaveRequests.objects.get(id =id )
            # print(leaveObject)
            # if leaveObject.stauts and leaveObject.stauts =="rejected":
            #     return ({"status": constants.ERROR_CODE, "message":"Leave already rejected"})
            leaveObject.status = 'rejected'
            leaveObject.rejected_reason = data['rejected_reason']
            leaveObject.updated_by = data['updated_by']
            message = "leave rejected successfully"
            leaveObject.save()
        return ({"status": constants.SUCCESS_CODE, "message":message})

    except Exception as error:
        print(error)
        return ({"status": constants.ERROR_CODE, "message": str(error)})