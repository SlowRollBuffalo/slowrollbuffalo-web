
import requests
import json
import hashlib

base_url = 'http://localhost:6543'

def build_url(model, token, _id=False):
    if _id:
        return base_url + '/api/' + model + '/' + _id + '?token=' + token
    else:
        return base_url + '/api/' + model + '?token=' + token

def do_login(email, password):
    data = json.dumps({
        'email': email,
        'password': hashlib.sha256('password'.encode('utf-8')).hexdigest(), 
    })
    resp = requests.post(base_url + '/api/users/login', data)
    return json.loads(resp.text)

def do_get(model, _id):
    resp = requests.get(build_url(url, _id))
    return json.loads(resp.text)

def do_get_all(model):
    resp = requests.get(build_url(url))
    return json.loads(resp.text)

def do_post(token, model, payload):
    data = json.dumps(payload)
    resp = requests.post(build_url(model, token), data)
    return json.loads(resp.text)

def do_load(token, model, fields, data):
    resp = []
    for d in data:
        payload = {}
        i = 0
        for f in fields:
            payload[f] = d[i]
            i += 1
        r = do_post(token, model, payload)
        resp.append(r)
    return resp

def load_partner_levels(token):

    print('########################################')
    print('# Loading Partner levels')
    print('########################################')

    fields = ('title', 'short_description', 'description', 'value')
    data = (
        ('HUB','Presenting Partner', 'Prominent Logo and Title display in ALL material', 30000),
        ('CASSETTE', 'Season Partner', 'Recognition in all 26 rides; in all press and promo campaigns', 15000),
        ('RIM', 'Spotlight Partner', 'Recognition at 13 rides in all press and promo material, in all media campaigns', 5000),
        ('TIRE', '"Placemaking" Partner', 'Naming rights to on eof our placemeker rides', 1000),
        ('SPOKE', "Ride Partner", 'Naming/Venue Rights to one of weekly rides', 750),
        ('VALVE', 'Promo Partner', 'Tabling/Vending/Banner Placement at one of our weekly rides', 3000),
    )
    partner_levels = do_load(token, 'partner_levels', fields, data)
    return partner_levels

def load_partners(token, partner_levels):

    print('########################################')
    print('# Loading Partners')
    print('########################################')

    fields = ('name', 'description', 'address_0', 'address_1', 'city',
           'state', 'zipcode', 'partner_level_id', 'notification_text',
           'fence_top_left_lat', 'fence_top_left_lng',
           'fence_bottom_right_lat', 'fence_bottom_right_lng')

    data = (
        ('Big Ditch Brewing', 'The Big Ditch Brewing Company is awesome!', '1 street st.', '',
         'Buffalo', 'NY', '14200', partner_levels[2]['partner_level']['id'].replace('-',''), 'Hey, check out Big Ditch Brewing!', 
         42.9047, -78.8494, 42.9037, -78.8594),
        ('Buffalo River Works', 'So much river. So much works.', '-1 infinity way', 'suite i', 
         'Buffalo', 'NY', '14201', partner_levels[3]['partner_level']['id'].replace('-', ''),
         "Let's get ... imaginary", 42.9047, -78.8494, 42.9037, -78.8594), 
    )
    partners = do_load(token, 'partners', fields, data)
    return partners

def load_rides(token, partners):

    print('########################################')
    print('# Loading Rides')
    print('########################################')

    fields = ('title', 'description', 'address_0', 'address_1',
              'city', 'state', 'zipcode')

    data = (
        ('Dig the Ditch', "Big Ditch Brewing is amazeballs, let's support them!", '42 answer blvd.',
         '', 'Buffalo', 'NY', '14202'),
        ('Work dat flow', "Buffalo River Works is doing work, let's support them!", '1234 general ct.',
         '', 'Buffalo', 'NY', '14203'),
    )
    rides = do_load(token, 'rides', fields, data)
    return rides

def load_ride_sponsors(token, rides, partners):

    print('########################################')
    print('# Loading Ride Sponsors')
    print('########################################')

    fields = ('ride_id', 'partner_id')

    data = (
        (rides[0]['ride']['id'], partners[0]['partner']['id']),
        (rides[1]['ride']['id'], partners[1]['partner']['id']),
    )
    ride_sponsors = do_load(token, 'ride_sponsors', fields, data)
    return ride_sponsors

def load_checkins(roken, rides, users):

    print('########################################')
    print('# Loading Ride Sponsors')
    print('########################################')

    fields = ('race_id', 'user_id', 'accepts_terms')

    data = (
        (rides[0]['ride']['id'], users[0]['user']['id'], True),
    )
    checkins = do_load(token, 'checkins', fields, data)
    return checkins

if __name__ == '__main__':

    print('start.\n')

    sys_user = do_login('system', 'password')
    token = sys_user['user']['token']

    partner_levels = load_partner_levels(token)
    print('%i Partner levels Loaded.\n' % len(partner_levels))
    partners = load_partners(token, partner_levels)
    print('%i Partners loaded.\n' % len(partners))
    rides = load_rides(token, partners)
    print('%i Rides loaded.\n' % len(rides))
    ride_sponsors = load_ride_sponsors(token, rides, partners)
    print('%i Ride Sponsors loaded.\n' % len(rides))
    checkins = load_checkins(token, rides, [sys_user])
    print('%i Checkins loaded.\n' % len(checkins))

    print('\ndone.')
