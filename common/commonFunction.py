from Login.models import User
from datetime import datetime, timedelta
from common import constants
import json
from django.http import HttpResponse
from django.shortcuts import render


def checkSession(request):
    ''' 
    Check for user session in the request.
    '''
    try:
        cookie = request.COOKIES

        user = User.objects.get(user_name=cookie['user_session'])
        return {"full_name": user.full_name, "user_name": user.user_name, 'user_role': cookie['user_role'], 'user': cookie['user']}
    except:
        return False


def getExpires(seconds):
    return datetime.now() + timedelta(seconds=seconds)


def setCookies(cookie, response):
    expires = getExpires(constants.EXPIRES_IN_SECOND)

    if 'user_session' in cookie:
        response.set_cookie(key='user_session',
                            value=cookie['user_session'], expires=expires)
    if 'user_full_name' in cookie:
        response.set_cookie(key='user_full_name',
                            value=cookie['user_full_name'], expires=expires)
    if 'user' in cookie:
        response.set_cookie(key='user', value=cookie['user'], expires=expires)

    return response


def getJsonResponse(request, content):
    cookie = request.COOKIES
    # print(cookie)
    response = HttpResponse(json.dumps(
        content), content_type='application/json')

    return setCookies(cookie, response)


def getRenderResponse(request, URL, context):
    cookie = request.COOKIES
    response = render(request, URL, context)
    return setCookies(cookie, response)
