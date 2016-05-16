
from pyramid.response import Response
from pyramid.response import FileResponse
from pyramid.view import view_defaults
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound

from sqlalchemy.exc import DBAPIError

from .models import (
    DBSession,
    Users,
    #PartnerLevels,
    Partners,
    Rides,
    #RideSponsors,
    Checkins,
    Settings,
)

from .utils import *

import datetime
import json

@view_defaults(route_name='/')
class Index(object):

    def __init__(self, request):
        self.request = request

    @view_config(request_method='GET', renderer='templates/index.mak')
    def get(self):
        rides = []
        _rides = Rides.get_paged('00000000-0000-0000-0000-000000000000', 0, 10)
        if _rides:
            for ride, partner, checkin_count, checked_in in _rides:
                rides.append({
                    'ride': ride.to_dict(),
                    'partner': partner.to_dict() if partner != None else None,
                    'checkin_count': checkin_count,
                    'checked_in': checked_in,
                })
        return {'rides': rides}


@view_defaults(route_name='/admin')
class Admin(object):

    def __init__(self, request):
        self.request = request
        self.user = authenticate(request)

    @view_config(request_method='GET', renderer='templates/admin.mak')
    def get(self):
        if self.user and self.user.is_admin:
            return {}
        return HTTPFound(location='/login')


@view_defaults(route_name='/login')
class Login(object):
    
    def __init__(self, request):
        self.request = request
    
    @view_config(request_method='GET', renderer='templates/login.mak')
    def get(self):
        return {}


@view_defaults(route_name='/checkin')
class Checkin(object):
    
    post_req = (
        'first',
        'last',
        'ride_id',
    )

    def __init__(self, request):
        self.request = request
        self.payload = get_payload(self.request)
    
    @view_config(request_method='GET', renderer='templates/checkin.mak')
    def get(self):
        resp = {}
        if 'ride_id' in self.request.GET:
            resp = {}
        else:
            return HTTPFound(location='/')
        return resp

    @view_config(request_method='POST', renderer='json')
    def post(self):
        resp = {}
        if self.payload and all(r in self.payload for r in self.post_req):
            ride_id = self.request.GET['ride_id']
            user = Users.create_new_user(
                first=payload['first'],
                last=payload['last'],
                email=payload['email'],
                password=hashlib.sha256(str(uuid4()).encode('utf-8')).hexdigest(), # random string
                is_admin=False,
                temporary=True,
            )
            checkin = Checkin.add(
                ride_id=ride_id,
                user_id=user.id,
                platform='webform',
            )
            resp = {
                'checkin': checkin.to_dict(),
            }
        else:
            self.request.response.status = 400

        return resp


@view_defaults(route_name='/checkins')
class CheckinsPrintablePage(object):

    def __init__(self, request):
        #self.request = build_request(request)
        self.request = request
        self.user = authenticate(request)
        
    @view_config(request_method='GET', renderer='templates/checkins.mak')
    def get(self):
        if self.user and self.user.is_admin:
            if 'ride_id' in self.request.GET:
                ride_id = self.request.GET['ride_id']
                ride = Rides.get_by_id(ride_id)
                checkins = Checkins.get_by_ride_id(ride_id)
                return {
                    'ride': ride,
                    'checkins': checkins,
                    'now': str(datetime.datetime.now()).split('.')[0]
                }
        return HTTPFound(location='/login')


@view_defaults(route_name='/api/users/login', renderer='json')
class UserLoginAPI(object):

    post_req = (
        'email',
        'password',
        'platform',
        'version',
    )

    def __init__(self, request):
        self.request = build_request(request)
        start, count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

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

        print('\napi/users/login [POST]')
        print('GET:')
        print(self.request.GET)
        print('\n')


        resp = {}
        if self.payload and all(r in self.payload for r in self.post_req):
            admin = False
            if 'admin' in self.request.GET and self.request.GET['admin'] == '1':
                admin = True
            email = self.payload['email']
            password = self.payload['password']
            user = Users.authenticate(email, password, admin)
            if user:
                if admin:
                    self.request.session['token'] = user.admin_token
                else:
                    self.request.session['token'] = user.token
                resp = user.to_dict()
                Users.update_by_id(
                    user.id,
                    platform=self.payload['platform'],
                    last_login=datetime.datetime.now(),
                )
                print(resp)
            else:
                #print('User was none.')
                self.request.response.status = 403
        else:
            self.request.response.status = 400
        #print('\n')
        return resp


@view_defaults(route_name='/api/users/logout', renderer='json')
class UserLogoutAPI(object):


    def __init__(self, request):
        self.request = request
        #self.request.response.headerlist.append(('Access-Control-Allow-Origin', '*'))
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    #[ POST ] - logs the user out
    @view_config(request_method='POST')
    def post(self):
        resp = {}
        if 'token' in self.request.session:
            token = self.request.session['token']
            if token:
                user = Users.invalidate_token(token)
                if not user:
                    self.request.response.status = 403
        return resp    


@view_defaults(route_name='/api/users/register', renderer='json')
class RegisterAPI(object):

    post_req = (
        'first',
        'last',
        'email',
        'password',
        #'platform',
        #'version',
    )

    def __init__(self, request):
        self.request = request
        #self.request.response.headerlist.append(('Access-Control-Allow-Origin', '*'))
        start, count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    #[ POST ] - perform login
    @view_config(request_method='POST')
    def post(self):
        resp = {}
        if self.payload and all(r in self.payload for r in self.post_req):
            first = self.payload['first']
            last = self.payload['last']
            email = self.payload['email']
            password = self.payload['password']
            user = Users.create_new_user(first, last, email, password, )
            if user:

                Users.update_by_id(
                    user.id,
                    validated=True
                )

                #config = {
                #    'notification_email_server': '',
                #    'notification_email_server_port': 0,
                #    'notification_email_address': '',
                #    'notification_email_password': '',
                #}

                # send the registration email
                #send_registration_email(config, user)

                resp = user.to_dict()
            else:
                resp = {'error': 1} # already registered
                self.request.response.status = 403
        else:
            self.request.response.status = 400
        #print('\n')
        return resp


@view_defaults(route_name='/api/users/legal', renderer='json')
class Legal(object):

    req = (
        'value'
    )

    def __init__(self, request):
        self.request = request
        #self.request.response.headerlist.append(('Access-Control-Allow-Origin', '*'))
        self.user = authenticate(request)
        self.payload = get_payload(request)

    @view_config(request_method='GET')
    def get(self):
        legal_notice = Settings.get_setting_value('legal_notice')
        resp = {'legal_notice': legal_notice}
        return resp 

    #[ PUT ]
    @view_config(request_method='PUT')
    def put(self):
        resp = {}
        if self.user and self.user.is_admin:
            legal_notice_setting = Settings.get_by_name('legal_notice')
            if legal_notice_setting and self.payload and 'value' in self.payload:
                Settings.update_by_id(
                    legal_notice_setting.id,
                    value=self.payload['value'],
                )
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp

@view_defaults(route_name='/validate')
class Validate(object):

    def __init__(self, request):
        self.request = request

    @view_config(request_method='GET', renderer='templates/validate.mak')
    def get(self):
        if 'validation_token' in self.request.GET:
            validation_token = self.request.GET['validation_token']
            if validation_token:
                user = Users.validate(validation_token)
                if user:
                    # validated!
                    return {}
                #else:
                #    # invalid token, or error ...
                #    return HTTPFound(location='/')
        return HTTPFound(location='/')


@view_defaults(route_name='/api/users', renderer='json')
class UsersAPI(object):

    post_req = {
        'first',
        'last',
        'email',
        'password',
        'is_admin',
    }

    def __init__(self, request):
        self.request = build_request(request)
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    #[ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = []
        if self.user and self.user.is_admin:
            if self.start == -1:
                _users = Users.get_paged(self.start, self.count)
            else:
                _users = Users.get_paged(self.start, self.count)
            resp = [u.to_dict() for u in _users]
        else:
            self.request.response.status = 403
        return resp

    #[ POST ]
    @view_config(request_method='POST')
    def post(self):
        resp = {'user': None}
        if self.user and self.user.is_admin:
            if all(r in self.payload for r in self.post_req):
                try:
                    user = Users.create_new_user(
                        first=self.payload['first'],
                        last=self.payload['last'],
                        email=self.payload['email'],
                        password=self.payload['password'],
                        is_admin=self.payload['is_admin'],
                    )
                    if user:
                        resp = user.to_dict()
                    else:
                        # something bad happened
                        pass
                except:
                    self.request.response.status = 400
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp


@view_defaults(route_name='/api/users/{id}', renderer='json')
class UserAPI(object):

    req = {
        'first',
        'last',
        'email',
        #'password',
        'is_admin',
    }

    def __init__(self, request):
        self.request = build_request(request)
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    #[ PUT ]
    @view_config(request_method='PUT')
    def put(self):
        resp = {}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                _id = self.request.matchdict['id'].replace('-','')
                user = Users.update_by_id(
                    _id,
                    first=self.payload['first'],
                    last=self.payload['last'],
                    email=self.payload['email'],
                    is_admin=self.payload['is_admin'],
                )
                if user:
                    resp = user.to_dict()
                else:
                    # nothing good ...
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp


@view_defaults(route_name='/api/users/{id}/push_registration', renderer='json')
class UserPushRegistrationAPI(object):

    req = {
        'google_registration_id',
    }

    def __init__(self, request):
        self.request = build_request(request)
        #self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    #[ PUT ]
    @view_config(request_method='PUT')
    def put(self):
        print('\n[INFO] /api/users/{id}/push_registration\n')
        resp = {}
        if self.user:
            if self.payload and all(r in self.payload for r in self.req):
                _id = self.request.matchdict['id'].replace('-','')
                user = Users.update_by_id(
                    _id,
                    google_registration_id=self.payload['google_registration_id'],
                )
                if user:
                    resp = user.to_dict()
                else:
                    # nothing good ...
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp


@view_defaults(route_name='/api/partners', renderer='json')
class PartnersAPI(object):

    req = ('name', 'description', 'address_0', 'address_1', 'city',
           'state', 'zipcode', 'notification_text', )
           #'fence_top_left_lat', 'fence_top_left_lng', 
           #'fence_bottom_right_lat', 'fence_bottom_right_lng')

    def __init__(self, request):
        self.request = build_request(request)
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = []
        if self.user:
            partners = Partners.get_all()
            if partners:
                resp = [p.to_dict() for p in partners]
            #else:
            #    self.request.response.status = 404
        else:
            self.request.response.status = 403
        print('\n')
        return resp

    # [ POST ]
    @view_config(request_method='POST')
    def post(self):
        resp = {}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                partner = Partners.add(**self.payload)
                if partner:
                    resp = partner.to_dict()
                else:
                    # nothing good ...
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp


@view_defaults(route_name='/api/partners/{id}', renderer='json')
class PartnerAPI(object):

    req = ('name', 'description', 'address_0', 'address_1', 'city',
           'state', 'zipcode', 'notification_text', )
           #'fence_top_left_lat', 'fence_top_left_lng',
           #'fence_bottom_right_lat', 'fence_bottom_right_lng', )

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = {}
        if self.user and self.user.is_admin:
            _id = self.request.matchdict['id'].replace('-','')
            partner = Partners.get_by_id(_id)
            if partner:
                resp = partners.to_dict()
            else:
                self.request.response.status = 404
        else:
            self.request.response.status = 403
        return resp

    # [ PUT ]
    @view_config(request_method='PUT')
    def put(self):
        resp = {}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                _id = self.request.matchdict['id'].replace('-','')
                partner = Partners.update_by_id(_id, **self.payload)
                if partner:
                    resp = partner.to_dict()
                else:
                    # nothing good ...
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp


@view_defaults(route_name='/api/rides', renderer='json')
class RidesAPI(object):

    req = ('title', 'description', 'ride_datetime', 'address_0', 'address_1', 
           'city', 'state', 'zipcode', )

    def __init__(self, request):
        self.request = build_request(request)
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = []
        if self.user:
            _rides = Rides.get_paged(self.user.id, self.start, self.count)
            if _rides:
                resp = []
                for ride, partner, count, checked_in in _rides:
                    resp.append({
                        'ride': ride.to_dict(),
                        'partner': partner.to_dict() if partner != None else None,
                        'checkin_count': count,
                        'checked_in': checked_in,
                    })
            #else:
            #    self.request.response.status = 404
        else:
            self.request.response.status = 403
        return resp

    # [ POST ]
    @view_config(request_method='POST')
    def post(self):
        resp = {}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                ride = Rides.add(**self.payload)
                if ride:
                    resp = ride.to_dict()
                else:
                    # nothing good ...
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp


@view_defaults(route_name='/api/rides/{id}', renderer='json')
class RideAPI(object):

    req = ('title', 'description', 'address_0', 'address_1', 
           'city', 'state', 'zipcode', )

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = {}
        if self.user and self.user.is_admin:
            _id = self.request.matchdict['id'].replace('-','')
            ride = Rides.get_by_id(_id)
            if ride:
                resp = ride.to_dict()
            else:
                self.request.response.status = 404
        else:
            self.request.response.status = 403
        return resp

    # [ PUT ]
    @view_config(request_method='PUT')
    def put(self):
        resp = {}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                _id = self.request.matchdict['id'].replace('-','')
                ride = Rides.update_by_id(_id, **self.payload)
                if ride:
                    resp = ride.to_dict()
                    print('\n\n')
                    print(ride.to_dict())
                    print('\n\n')
                else:
                    # nothing good ...
                    raise Exception('BUD ID in /api/rides/{id} [PUT]')
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp

    # [ DELETE ]
    @view_config(request_method='DELETE')
    def delete(self):
        resp = {}
        if self.user and self.user.is_admin:
            _id = self.request.matchdict['id'].replace('-','')
            ride = Rides.delete_by_id(_id)
            if ride:
                resp = ride.to_dict()
            else:
                # nothing good ...
                pass
        else:
            self.request.response.status = 403
        return resp


@view_defaults(route_name='/api/checkins', renderer='json')
class CheckinsAPI(object):

    req = ('ride_id',)

    def __init__(self, request):
        self.request = build_request(request)
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = []
        if self.user and self.user.is_admin:
            if 'ride_id' in self.request.GET:
                ride_id = self.request.GET['ride_id']
                _checkins = Checkins.get_by_ride_id(ride_id)
                if _checkins:
                    for checkin, user in _checkins:
                        resp.append(dict(
                            checkin=checkin.to_dict(),
                            user=user.to_dict(),
                        ))
                #else:
                #    self.request.response.status = 404
            else:
                checkins = Checkins.get_all()
                if checkins:
                    resp = [c.to_dict() for c in checkins]
                #else:
                #    self.request.response.status = 404
        else:
            self.request.response.status = 403
        return resp

    # [ POST ]
    @view_config(request_method='POST')
    def post(self):
        resp = {}
        if self.user:
            if self.payload and all(r in self.payload for r in self.req):
                self.payload.update(
                    user_id=self.user.id,
                    platform='api',
                )
                checkin = Checkins.add(**self.payload)
                if checkin:
                    resp = checkin.to_dict()
                else:
                    # nothing good ...
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp


@view_defaults(route_name='/api/checkins/{id}', renderer='json')
class CheckinAPI(object):

    req = ('ride_id', 'user_id')

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = {}
        if self.user and self.user.is_admin:
            _id = self.request.matchdict['id'].replace('-','')
            checkins = Checkins.get_by_id(_id)
            if checkins:
                resp = checkins.to_dict()
            else:
                self.request.response.status = 404
        else:
            self.request.response.status = 403
        return resp

    # [ PUT ]
    @view_config(request_method='PUT')
    def put(self):
        resp = {'checkin': None}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                _id = self.request.matchdict['id'].replace('-','')
                checkin = Checkins.update(_id, **self.payload)
                if checkin:
                    resp = {'checkin': checkin.to_dict()}
                else:
                    # nothing good ...
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp
