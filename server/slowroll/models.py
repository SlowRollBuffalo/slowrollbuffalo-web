from uuid import uuid4
import hashlib

from time import sleep
from random import randint
import datetime

from sqlalchemy.sql import func
from sqlalchemy_utils import UUIDType
from sqlalchemy import (
    Column,
    cast,
    Date,
    ForeignKey,
    Integer,
    Float,
    Boolean,
    UnicodeText,
    DateTime,
    Index,
    CHAR,
    distinct,
    func,
    desc,
)

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import (
    relationship,
    scoped_session,
    sessionmaker,
)

DBSession = scoped_session(sessionmaker(expire_on_commit=False))
Base = declarative_base()


class TimeStampMixin(object):
    creation_datetime = Column(DateTime, server_default=func.now())
    modified_datetime = Column(DateTime, server_default=func.now())


class CreationMixin():

    id = Column(UUIDType(binary=False), primary_key=True, unique=True)

    @classmethod
    def add(cls, **kwargs):
        thing = cls(**kwargs)
        if thing.id is None:
            thing.id = str(uuid4())
        DBSession.add(thing)
        DBSession.commit()
        return thing

    @classmethod
    def get_all(cls):
        things = DBSession.query(
            cls,
        ).all()
        return things

    @classmethod
    def get_paged(cls, start=0, count=25):
        things = DBSession.query(
            cls,
        ).slice(start, start+count).all()
        return things

    @classmethod
    def get_by_id(cls, id):
        thing = DBSession.query(
            cls,
        ).filter(
            cls.id == id,
        ).first()
        return thing

    @classmethod
    def delete_by_id(cls, id):
        thing = cls.get_by_id(id)
        if thing is not None:
            DBSession.delete(thing)
            DBSession.commit()
        return thing

    @classmethod
    def update_by_id(cls, id, **kwargs):
        keys = set(cls.__dict__)
        thing = DBSession.query(cls).filter(cls.id==id).first() #cls.get_by_id(id)
        if thing is not None:
            for k in kwargs:
                if k in keys:
                    setattr(thing, k, kwargs[k])
            thing.modified_datetime = datetime.datetime.now()
            DBSession.add(thing)
            DBSession.commit()
        return thing

    @classmethod
    def reqkeys(cls):
        keys = []
        for key in cls.__table__.columns:
            if '__required__' in type(key).__dict__:
                keys.append(str(key).split('.')[1])
        return keys

    def to_dict(self):
        return {
            'id': str(self.id),
            'creation_datetime': str(self.creation_datetime),
        }


class Users(Base, TimeStampMixin, CreationMixin):

    __tablename__ = 'users'

    is_admin = Column(Boolean, nullable=False)
    first = Column(UnicodeText, nullable=False)
    last = Column(UnicodeText, nullable=False)
    email = Column(UnicodeText, nullable=False)
    pass_salt = Column(UnicodeText, nullable=False)
    pass_hash = Column(UnicodeText, nullable=False)
    token = Column(UnicodeText, nullable=True)
    token_expire_datetime = Column(DateTime, nullable=True)

    @classmethod
    def create_new_user(cls, first, last, email, password, is_admin):
        user = None
        salt_bytes = hashlib.sha256(str(uuid4()).encode('utf-8')).hexdigest()
        pass_bytes = hashlib.sha256(password.encode('utf-8')).hexdigest()
        pass_val = pass_bytes + salt_bytes
        pass_hash = hashlib.sha256(pass_val.encode('utf-8')).hexdigest()
        user = Users.add(
            is_admin = is_admin,
            first = first,
            last = last,
            email = email,
            pass_salt = salt_bytes,
            pass_hash = pass_hash,
            token = None,
            token_expire_datetime = None,
        )
        return user


    @classmethod
    def get_by_token(cls, token):
        user = DBSession.query(
            Users,
        ).filter(
            Users.token == token,
        ).first()
        return user


    @classmethod
    def get_by_email(cls, email):
        user = DBSession.query(
            Users,
        ).filter(
            Users.email == email,
        ).first()
        return user


    @classmethod
    def authenticate(cls, email, password):
        _user = Users.get_by_email(email)
        user = None
        if _user is not None:
            if isinstance(_user.pass_salt, bytes):
                salt_bytes = _user.pass_salt.decode('utf-8')
            elif isinstance(_user.pass_salt, str):
                salt_bytes = _user.pass_salt
            else:
                salt_bytes = _user.pass_salt
            pass_bytes = hashlib.sha256(password.encode('utf-8')).hexdigest()
            pass_val = pass_bytes + salt_bytes
            pass_hash = hashlib.sha256(pass_val.encode('utf-8')).hexdigest()
            if (_user.pass_hash == pass_hash):
                token = str(uuid4())
                token_expire_datetime = datetime.datetime.now() + datetime.timedelta(hours=24*30)
                user = Users.update_by_id(
                    _user.id,
                    token=token,
                    token_expire_datetime=token_expire_datetime,
                )
        return user


    @classmethod
    def validate_token(cls, token):
        user = Users.get_by_token(token)
        valid = False
        if user != None:
            if user.token_expire_datetime > datetime.datetime.now():
                valid = True
        return valid, user


    @classmethod
    def invalidate_token(cls, token):
        user = Users.get_by_token(token)
        if user != None:
            user = Users.update_by_id(
                user.id,
                token=None,
                token_expire_datetime=None,
            )
        return user


    def to_dict(self):
        resp = super(Users, self).to_dict()
        resp.update(
            is_admin = self.is_admin,
            first = self.first,
            last = self.last,
            email = self.email, 
            token = self.token,
            token_expire_datetime = str(self.token_expire_datetime),
        )
        return resp


class PartnerLevels(Base, TimeStampMixin, CreationMixin):

    __tablename__ = 'partner_levels'
    title = Column(UnicodeText, nullable=False)
    short_description = Column(UnicodeText, nullable=False)
    description = Column(UnicodeText, nullable=False)
    value = Column(Float, nullable=False)

    def to_dict(self):
        resp = super(PartnerLevels, self).to_dict()
        resp.update(
            title=self.title,
            short_description=self.short_description,
            description=self.description,
            value=self.value,
        )
        return resp


class Partners(Base, TimeStampMixin, CreationMixin):

    __tablename__ = 'partners'
    name = Column(UnicodeText, nullable=False)
    description = Column(UnicodeText, nullable=False)
    partner_level_id = Column(ForeignKey('partner_levels.id'), nullable=False)
    notification_text = Column(UnicodeText, nullable=False)
    fence_top_left_lat = Column(Float, nullable=False)
    fence_top_left_lng = Column(Float, nullable=False)
    fence_bottom_right_lat = Column(Float, nullable=False)
    fence_bottom_right_lng = Column(Float, nullable=False)
    
    def to_dict(self):
        resp = super(Partners, self).to_dict()
        resp.update(
            name=self.name,
            description=self.description,
            fence_top_left_lat=self.fence_top_left_lat,
            fence_top_left_lng=self.fence_top_left_lng,
            fence_bottom_right_lat=self.fence_bottom_right_lat,
            fence_bottom_right_lng=self.fence_bottom_right_lng,
        )
        return resp


class Rides(Base, TimeStampMixin, CreationMixin):

    __tablename__ = 'rides'
    title = Column(UnicodeText, nullable=False)
    description = Column(UnicodeText, nullable=False)
    address_0 = Column(UnicodeText, nullable=False)
    address_1 = Column(UnicodeText, nullable=False)
    city = Column(UnicodeText, nullable=False)
    state = Column(UnicodeText, nullable=False)
    zipcode = Column(UnicodeText, nullable=False)

    # todo: add get and get_collection overrides to include 
    #       ride sponsors

    def to_dict(self):
        resp = super(Rides, self).to_dict()
        resp.update(
            title=self.title,
            description=self.description,
            address_0=self.address_0,
            address_1=self.address_1,
            city=self.city,
            state=self.state,
            zipcode=self.zipcode,
        )
        return resp
    

class RideSponsors(Base, TimeStampMixin, CreationMixin):

    __tablename__ = 'ride_sponsors'
    ride_id = Column(ForeignKey('rides.id'), nullable=False)
    partner_id = Column(ForeignKey('partners.id'), nullable=False)

    def to_dict(self):
        resp = super(RideSpondor, self).to_dict()
        resp.update(
            
        )

class Checkins(Base, TimeStampMixin, CreationMixin):

    __tablename__ = 'checkins'
    race_id = Column(ForeignKey('rides.id'), nullable=False)
    user_id = Column(ForeignKey('users.id'), nullable=False)
    accepts_terms = Column(Boolean, nullable=False)    

    @classmethod
    def get_by_race_id(cls, race_id, start=0, count=50):
        users = DBSession.query(
            Users,
        ).outerjoin(
            Checkins, Checkins.user_id == Users.id,
        ).filter(
            Checkins.race_id == race_id,
        ).slice(start, start+count).all()
        return users

    def to_dict(self):
        resp = super(Checkins, self).to_dict()
        resp.update(
            race_id=self.race_id,
            user_id=self.user_id,
            accepts_terms=self.accepts_terms,
        )
        return resp
