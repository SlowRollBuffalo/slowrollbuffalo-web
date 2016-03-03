
from pyramid.response import Response
from pyramid.response import FileResponse
from pyramid.view import view_defaults
from pyramid.view import view_config

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    Users,
)

from .utils import *

@view_defaults(route_name='/')
class Index(object):

    def __init__(self, request):
        self.request = request

    @view_config(request_method='GET', renderer='templates/index.mak')
    def get(self):
        return {}


@view_defaults(route_name='/login')
class Login(object):
    
    def __init__(self, request):
        self.request = request
    
    @view_config(request_method='GET', renderer='templates/login.mak')
    def get(self):
        return {}


@view_defaults(route_name='/api/users/login', renderer='json')
class UserLoginAPI(object):

    post_req = (
        'email',
        'password',
    )

    def __init__(self, request):
        self.request = request
        start, count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)
        print(self.payload)

    #[ GET ] - check if logged in
    @view_config(request_method='GET')
    def get(self):
        resp = {'loggedin': False}
        if self.user:
            resp = {'loggedin': True, 'user': self.user.to_dict()}
        return resp

    #[ POST ] - perform login
    @view_config(request_method='POST')
    def post(self):
        resp = {'user': None}
        if self.payload and all(r in self.payload for r in self.post_req):
            email = self.payload['email']
            password = self.payload['password']
            user = Users.authenticate(email, password)
            if user:
                self.request.session['token'] = user.token
                resp = {'user': user.to_dict()}
            else:
                self.request.response.status = 403
        else:
            self.request.response.status = 400
        return resp


@view_defaults(route_name='/api/users/logout', renderer='json')
class UserLogoutAPI(object):


    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    #[ POST ] - logs the user out
    @view_config(request_method='POST')
    def post(self):
        resp = {'user': None}
        if 'token' in self.request.session:
            token = self.request.session['token']
            if token:
                user = Users.invalidate_token(token)
                if not user:
                    self.request.response.status = 403
        return resp    


@view_defaults(route_name='/api/users', renderer='json')
class UsersAPI(object):

    post_req = (
        'first',
        'last',
        'email',
        'password',
        'is_admin',
    )

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    #[ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = {'users': []}
        if self.user and self.user.is_admin:
            _users = Users.get_all()
            resp = {'users': [u.to_dict() for u in _users]}
        else:
            self.request.response.status = 403
        return resp

    #[ POST ]
    @view_config(request_method='POST')
    def post(self):
        resp = {'user': None}
        print(self.payload)
        if self.user and self.user.is_admin:
            if all(r in self.payload for r in self.post_req):
                user = Users.create_new_user(
                    first=self.payload['first'],
                    last=self.payload['last'],
                    email=self.payload['email'],
                    password=self.payload['password'],
                    is_admin=self.payload['is_admin'],
                )
                if user:
                    resp = {'user': user.to_dict()}
                else:
                    # something bad happened
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp



