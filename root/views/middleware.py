# coding: utf-8
# +-------------------------------------------------------------------
# | Project     : f2d6
# | Author      : 晴天雨露
# | QQ/Email    : 184566608<qingyueheji@qq.com>
# | Time        : 2020-02-08 10:04
# | Describe    : middleware
# +-------------------------------------------------------------------
from django.shortcuts import redirect, reverse

from root.views.utils import users


class AuthMiddleware:
    '''路由权限处理'''

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user_id = request.session.get('username')

        if user_id not in users and request.path != '/':
            return redirect(reverse('index'))

        return self.get_response(request)