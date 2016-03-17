
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
)

from .utils import *

import datetime

@view_defaults(route_name='/')
class Index(object):

    def __init__(self, request):
        self.request = request

    @view_config(request_method='GET', renderer='templates/index.mak')
    def get(self):
        return {}


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
        resp = {}
        if self.payload and all(r in self.payload for r in self.post_req):
            email = self.payload['email']
            password = self.payload['password']
            user = Users.authenticate(email, password)
            if user:
                self.request.session['token'] = user.token
                resp = user.to_dict()
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
        resp = {}
        if 'token' in self.request.session:
            token = self.request.session['token']
            if token:
                user = Users.invalidate_token(token)
                if not user:
                    self.request.response.status = 403
        return resp    


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
        self.request = request
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
        print(self.payload)
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

'''
@view_defaults(route_name='/api/partner_levels', renderer='json')
class PartnerLevelsAPI(object):

    req = ('title', 'short_description', 'description', 'value')

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request) 

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = {'partner_levels': []}
        if self.user and self.user.is_admin:
            partner_levels = PartnerLevels.get_all()
            if partner_levels:
                resp = {'partner_levels': partner_levels.to_dict()}
            else:
                self.request.response.status = 404
        else:
            self.request.response.status = 403
        return resp

    # [ POST ]
    @view_config(request_method='POST')
    def post(self):
        resp = {'partner_level': None}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                try:
                    partner_level = PartnerLevels.add(**self.payload)
                    if partner_level:
                        resp = {'partner_level': partner_level.to_dict()}
                except:
                    self.request.response.status = 400
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp


@view_defaults(route_name='/api/partner_levels/{id}', renderer='json')
class PartnerLevelAPI(object):

    req = ('title', 'short_description', 'description', 'value')

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = {'partner_level': []}
        if self.user and self.user.is_admin:
            _id = self.request.matchdict['id']
            partner_level = PartnerLevels.get_by_id(_id)
            if partner_level:
                resp = {'partner_level': partner_level.to_dict()}
            else:
                self.request.response.status = 404
        else:
            self.request.response.status = 403
        return resp

    # [ PUT ]
    @view_config(request_method='PUT')
    def post(self):
        resp = {'partner_level': None}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                _id = self.request.matchdict['id'],
                partner_level = PartnerLevels.update(_id, **self.payload)
                if partner_level:
                    resp = {'partner_level': partner_level.to_dict()}
                else:
                    # nothing good ...
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp
'''

@view_defaults(route_name='/api/partners', renderer='json')
class PartnersAPI(object):

    req = ('name', 'description', 'address_0', 'address_1', 'city',
           'state', 'zipcode', 'notification_text',
           'fence_top_left_lat', 'fence_top_left_lng', 
           'fence_bottom_right_lat', 'fence_bottom_right_lng')

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = []
        if self.user and self.user.is_admin:
            partners = Partners.get_all()
            if partners:
                resp = [p.to_dict() for p in partners]
            else:
                self.request.response.status = 404
        else:
            self.request.response.status = 403
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
           'state', 'zipcode', 'notification_text',
           'fence_top_left_lat,' 'fence_top_left_lng',
           'fence_bottom_right_lat', 'fence_bottom_right_lng')

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
            _id = self.request.matchdict['id']
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
    def post(self):
        resp = {}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                _id = self.request.matchdict['id'],
                partner = Partners.update(_id, **self.payload)
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

    req = ('title', 'description', 'address_0', 'address_1', 
           'city', 'state', 'zipcode')

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = []
        if self.user and self.user.is_admin:
            _rides = Rides.get_paged(self.start, self.count)
            if _rides:
                resp = []
                for ride, sponsor in _rides:
                    resp.append({
                        'ride': ride.to_dict(),
                        'sponsor': sponsor.to_dict(),
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
           'city', 'state', 'zipcode')

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
            _id = self.request.matchdict['id']
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
    def post(self):
        resp = {}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                _id = self.request.matchdict['id']
                ride = Rides.update(_id, **self.payload)
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

'''
@view_defaults(route_name='/api/ride_sponsors', renderer='json')
class RideSponsorsAPI(object):

    req = ('ride_id', 'partner_id') 

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = {'ride_sponsors': []}
        if self.user and self.user.is_admin:
            ride_sponsors = RideSponsors.get_all()
            if ride_sponsors:
                resp = {'ride_sponsors': ride_sponsors.to_dict()}
            else:
                self.request.response.status = 404
        else:
            self.request.response.status = 403
        return resp

    # [ POST ]
    @view_config(request_method='POST')
    def post(self):
        resp = {'ride': None}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                ride_sponsor = RideSponsors.add(**self.payload)
                if ride_sponsor:
                    resp = {'ride_sponsor': ride_sponsor.to_dict()}
                else:
                    # nothing good ...
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp


@view_defaults(route_name='/api/ride_sponsors/{id}', renderer='json')
class RideSponsorAPI(object):

    req = ('ride_id', 'partner_id')

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = {'ride_sponsors': []}
        if self.user and self.user.is_admin:
            _id = self.request.matchdict['id']
            ride_sponsors = RideSponsors.get_by_id(_id)
            if ride_sponsors:
                resp = {'ride_sponsors': ride_sponsors.to_dict()}
            else:
                self.request.response.status = 404
        else:
            self.request.response.status = 403
        return resp

    # [ PUT ]
    @view_config(request_method='PUT')
    def post(self):
        resp = {'ride_sponsor': None}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                _id = self.request.matchdict['id'],
                ride_sponsor = RideSponsors.update(_id, **self.payload)
                if ride_sponsor:
                    resp = {'ride_sponsor': ride_sponsor.to_dict()}
                else:
                    # nothing good ...
                    pass
            else:
                self.request.response.status = 400
        else:
            self.request.response.status = 403
        return resp
'''

@view_defaults(route_name='/api/checkins', renderer='json')
class CheckinsAPI(object):

    req = ('race_id', 'user_id', 'accepts_terms')

    def __init__(self, request):
        self.request = request
        self.start, self.count = build_paging(request)
        self.user = authenticate(request)
        self.payload = get_payload(request)

    # [ GET ]
    @view_config(request_method='GET')
    def get(self):
        resp = []
        if self.user and self.user.is_admin:
            checkins = Checkins.get_all()
            if checkins:
                resp = [c.to_dict() for c in checkins]
            else:
                self.request.response.status = 404
        else:
            self.request.response.status = 403
        return resp

    # [ POST ]
    @view_config(request_method='POST')
    def post(self):
        resp = {}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
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

    req = ('race_id', 'user_id', 'accepts_terms')

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
            _id = self.request.matchdict['id']
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
    def post(self):
        resp = {'checkin': None}
        if self.user and self.user.is_admin:
            if self.payload and all(r in self.payload for r in self.req):
                _id = self.request.matchdict['id'],
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
