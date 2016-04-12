import os
import sys
import transaction

from sqlalchemy import engine_from_config

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from ..models import (
    DBSession,
    Base,
    Users,
    Settings,
    )

import hashlib

def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.create_all(engine)

    Users.create_new_user(
        is_admin = True,
        first = 'SYSTEM',
        last = 'USER',
        email = 'system',
        password = hashlib.sha256('password'.encode('utf-8')).hexdigest(),
    )

    # need to add the legel notice, since the REST API only implements
    # GET and PUT
    Settings.add(
        name='legal_notice',
        value='Legal Notice',
        content_type='text',
    )