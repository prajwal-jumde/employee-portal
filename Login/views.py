from __future__ import unicode_literals
from common import constants
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
import pprint
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from Login.models import User
from django.core import serializers
import bcrypt
from common.commonFunction import checkSession, getExpires, setCookies


def login(request):
    cookie = request.COOKIES
    userInfo = checkSession(request)
    # print(userInfo)
    if isinstance(userInfo, bool):
        return render(request, constants.LOGIN_PAGE_ADDR, {})

    else:
        response = HttpResponseRedirect('users/')

    return setCookies(cookie, response)


@csrf_exempt
def check_cred(request):
    data = json.loads(request.body)

    user = data['user']
    username = data['username']
    password = data['password']
    # if data['user'] == "admin":
    userResult = check_user(request, user, username,password)
    if userResult:
        return userResult

    return JsonResponse({'statusMessage': constants.WRONG_PASSWORD, 'status': constants.ERROR_CODE}, status=500, safe=False)



def check_user(request, user, username, password):
    try:
        expires = getExpires(1800) 
        print(user, username, password)
        if user == "employee":
            users_object = User.objects.get(
                user_name=username, is_deleted=False,enabled = True,user_role = user)
            response = HttpResponse(json.dumps(
                {'success': True, 'status_code': 200, 'user': user}
            ), content_type='application/json')

            response.set_cookie(key='user_session',
                                value=username, expires=expires)
            response.set_cookie(
                key='user_full_name', value=users_object.full_name, expires=expires)
            response.set_cookie(key='user', value=user, expires=expires)

            return response
        else:
            users_object = User.objects.get(
                user_name=username, is_deleted=False,enabled = True,user_role = user)
            hashed = (users_object.password).encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), hashed):
                response = HttpResponse(json.dumps(
                    {'success': True, 'status_code': 200, 'user': user,
                        'RoleOfUser': users_object.user_role}
                ), content_type='application/json')

                response.set_cookie(key='user_session',
                                    value=username, expires=expires)
                response.set_cookie(
                    key='user_full_name', value=users_object.full_name, expires=expires)
                # response.set_cookie(
                    # key='user_role', value=users_object.user_role, expires=expires)
                response.set_cookie(key='user', value=user, expires=expires)
                response.set_cookie(key='user_role', value=user, expires=expires)
                return response
            else:
                return JsonResponse({'statusMessage': constants.WRONG_PASSWORD, 'status': constants.ERROR_CODE}, status=500, safe=False)

    except Exception as error:
        print(error)
        return JsonResponse({'statusMessage': str(error), 'status': constants.ERROR_CODE}, status=500, safe=False)
