from pyramid.config import Configurator
from sqlalchemy import engine_from_config

from pyramid.session import SignedCookieSessionFactory

from .models import (
    DBSession,
    Base,
    )


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    config = Configurator(settings=settings)
    config.include('pyramid_chameleon')
    config.add_static_view('static', 'static', cache_max_age=3600)

    secret = config.get_settings().get('slowroll.secret')
    if not secret:
        secret = 'yellr_secret'
    httponly = False if config.get_settings().get('slowroll.header_httponly') == 'false' else True
    secure = False if config.get_settings().get('slowroll.header_secure') == 'false' else True
    my_session_factory = SignedCookieSessionFactory(
        secret,
        httponly=httponly,
        secure=secure,
    )
    config.set_session_factory(my_session_factory)

    config.add_route('/', '/')
    config.add_route('/login', '/login')

    config.add_route('/api/users/login', '/api/users/login')
    config.add_route('/api/users/logout', '/api/users/logout')
    config.add_route('/api/users', '/api/users')
    config.add_route('/api/users/{id}', '/api/users/{id}')

    config.scan()
    return config.make_wsgi_app()
