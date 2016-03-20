
import datetime

import smtplib

from .models import (
    Users,
)

upload_dir = './uploads'

def get_payload(request):
    try:
        payload = request.json_body
        for key in payload:
            if '_datetime' in key:
                dt = datetime.datetime.strptime(payload[key], '%m/%d/%Y')
                payload[key] = dt
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
            # prevent too much server thrashing ...
            if count > 1000:
                count = 1000
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
        try:
            token = request.GET['token']
        except:
            pass
    if token:
        user = Users.get_by_token(token)
    return user 


def send_registration_email(config, user):

    #try:
    if True:

        import os
        os.system('pwd')

        # open the template, and read it's contents
        with open('email_templates/verification_email.template', 'r') as f:
            text = f.read()

        # replace the important parts with the user info
        text = text.replace('{{first}}', user.first)
        text = text.replace('{{last}}', user.last)
        text = text.replace('{{email}}', user.email)
        text = text.replace('{{validation_token}}', user.validation_token)

        # create the server connection
        password =  config['notification_email_password']; 
        server = smtplib.SMTP()
        server.connect(config['notification_email_server'], config['notification_email_server_port'])
        server.ehlo()
        server.starttls()
        server.ehlo()

        # perform the login
        server.login(config['notification_email_address'], password)

        # message config
        part1 = MIMEText(text, 'plain')
        #part2 = MIMEText(html, 'html')
        msg.attach(part1)
        #msg.attach(part2)

        # send the info
        server.sendmail(
            config['notification_email_address'],
            target_user.email,
            msg.as_string()
        )

        # close the connection
        server.quit()
    
    #except:
    #    pass
    return 
