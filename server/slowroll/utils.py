
from .models import (
    Users,
)

upload_dir = './uploads'

def get_payload(request):
    try:
        payload = request.json_body
    except:
        payload = None
    return payload


def build_paging(request):
    start = 0
    count = 50
    if 'start' in request.GET and 'count' in request.GET:
        try:
            start = int(float(request.GET['start']))
            count = int(float(request.GET['count']))
            if count > 50:
                count = 50
        except:
            start = 0
            count = 50
    return start, count


def authenticate(request):
    token = None
    user = None
    try:
        token = request.session['token']
    except:
        pass
    if token:
        user = Users.get_by_token(token)
    return user 



