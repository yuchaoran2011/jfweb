# MiniTrace Web Application

Aug 30, 2017

MiniTrace project contains several components.

1. Static contents: HTML, and CSS (Bootstrap etc) 
2. Survey JS library: <https://surveyjs.io/Examples/Library/>
3. SQLite
4. Django

The first two components comprise the frontend of the web application. The entire contents are served on
a web server using Django and Nginx. SQLite acts as a lightweight file-based database that stores data 
collected from the web pages. For now, only survey-related data are collected, e.g. duration a user spent
on each question of the survey, survey results and what references, if any, the user has checked during
the survey.

## Project structure

The structure of the project reflects that of a typical Django app. Shown below are the
structure and some important files in each directory.
```
/mysite
    /minitrace
        models.py
        urls.py
        views.py
    /mysite
        settings.py
        urls.py
        views.py
    /static
        /assets
            /css
            /html
            /images
            /js
    db.sqlite3
    manage.py
```

* `/minitrace/models.py` contains the schema of the data stored in SQLite. The current schema contains five 
fields i.e. MTurk ID of the user (empty for all users for now), survey results, duration the user used
to complete the survey in ms, references the user checked and their orders, and duration spent on each
question in ms. `models.py` can be modified to add new fields or change the type of existing fields. But the 
latter and other operations that do not conform to schema evolution rules risk losing existing data or simply 
causing Django to throw errors. For all possible field types, see <https://docs.djangoproject.com/en/1.11/ref/models/fields/#field-types>.
`Django Operations` section covers how to update the schema in SQLite once `models.py` is updated.

* `/mysite/urls.py` and `minitrace/urls.py` contains web endpoint definitions. The former is app-wide definitions
e.g. Django admin interface and index page, but the latter is responsible for real MiniTrace endpoint handling. In
some cases, a web endpoint simply responds to the web request by responding with an HTML page, but the interesting part
happens when custom logic is involved in handling a request. For example, `minitrace/urls.py` has the following definition:
    ```
    url(r'^postsurveyresults$', views.survey_results_controller, name='survey_results_controller')
    ```
    This line tells Django that requests received at `/postsurveyresults` endpoint will be redirected to `survey_results_controller`, 
which is defined in `/minitrace/views.py`, for processing. 

* Similar to `urls.py`, there are two copies of `views.py` in the same locations, respectively. `survey_results_controller`
defined in `/minitrace/views.py` parses the JSON contained in the request to extract the fields and then store the processed
data in SQLite.

* `/static` directory contains static files in the project. Do NOT directly modify files here unless during local development/
debugging, because they will be served via Nginx once deployed to the server. More details are available in `Django Operations`
section.

* `db.sqlite3` is the SQLite file. Note that it is simply a file, meaning it can be easily backed up or copied elsewhere
for further processing. Django does support more advanced database backends such as MySQL and PostgresSQL. But SQLite 
already meets our requirements due to its simplicity and ease of development and deployment. To access the contents of the 
file, first make sure `sqlite3` CLI is installed on the machine, then run it from the directory where the db file is located.
    ```
    [~/jfweb/mysite]$ sqlite3 
    SQLite version 3.16.0 2016-11-04 19:09:39
    Enter ".help" for usage hints.
    Connected to a transient in-memory database.
    Use ".open FILENAME" to reopen on a persistent database.
    sqlite> .open db.sqlite3 
    sqlite> .tables
    auth_group                  django_admin_log          
    auth_group_permissions      django_content_type       
    auth_permission             django_migrations         
    auth_user                   django_session            
    auth_user_groups            minitrace_surveyresults   
    auth_user_user_permissions
    sqlite> select * from minitrace_surveyresults;
    1||{'1': ['Facility'], '3': ['Socialogical'], '2': ['Photos-People'], '5': ['Situation evolvement'], '4': ['Hunman-source intelligence'], '7': ['Identify location of an object/person/facility (Where is it?)'], '6': ['Subject matter familiarity'], '9': ['What are the goals/intentions of certain persons/groups/state?'], '8': ['What are the needs of this state, group or person with respect to us?']}|13673|[]|[1843, 1240, 1665, 1519, 1231, 2045, 1486, 1407, 1236]
    sqlite> 
    ```

* `manage.py` plays a key role in most Django commands. More on it in `Django Operations`.


## Deployment

Django offers a convenient development server. It can be started by running `python manage.py runserver`. But it is not 
suitable for production use. To deploy Django in production, there are many options, but most involve three components,
a frontend server serving static contents and manage load balancing etc., A WSGI layer that acts an an intermediary between
a web server and a Python-web application e.g. Django and Flask.

We choose Nginx together with uWSGI as our Django deployment setup.

* Django

  To get Django ready for production deployment, first we need to get static files in place. Because unlike during development,
  static files would not be served by Django. We put all static files (the entire `assets` folder) in `/var/www/test.traceproject.syr.edu`,
  then run `collectstatic` command introduced in `Django Operations` section below. This command would collect them, along with
  static files used by Django Admin page in the `jfweb/mysite/static` folder.
  
  Second, go to `settings.py` and make sure the following configurations are set to
  appropriate values:
 
  ```python
  import os
  import os.path
  import posixpath
  
  DEBUG = False
  
  ALLOWED_HOSTS = ['.syr.edu']
  
  PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
  STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')
  
  STATIC_URL = '/static/'
  STATICFILES_DIRS = ('/var/www/test.traceproject.syr.edu',)
  
  SESSION_COOKIE_SECURE = True
  CSRF_COOKIE_SECURE = True
  SECURE_SSL_REDIRECT = True
  SECURE_BROWSER_XSS_FILTER = True
  SECURE_CONTENT_TYPE_NOSNIFF = True
  X_FRAME_OPTIONS = 'DENY'
  ```
  
  These settings mainly concern security of the web app. For example, only hosts in the syr.edu domain are allowed to send
  requests to Django. Make sure `DEBUG` is set to `False`, as this would ensure users don't see Django error messages, if 
  there are any, and that they see proper 404 pages when they access non-existing endpoints. 
  
* uWSGI

  First we create a `uwsgi.service` file under `/etc/systemd/system/` to make it a systemd-managed service. This file
  tells systemd that when uwsgi is started, start an 'emperor' service using the configuration file available at
  `/etc/uwsgi/sites` and set appropriate ownership to `/tmp` directory, where the socket file will be created.
  
  ```
  [Unit]
  Description=uWSGI Emperor service
  
  [Service]
  ExecStartPre=/bin/bash -c 'chown root:www-data /tmp'
  ExecStart=/usr/local/bin/uwsgi --emperor /etc/uwsgi/sites
  Restart=always
  KillSignal=SIGQUIT
  Type=notify
  NotifyAccess=all
  
  [Install]
  WantedBy=multi-user.target
  ```

  Under `/etc/uwsgi/sites/`, we create a `mysite.ini` file to configure the 'emperor' service and set project-specific 
  parameters. Note the log file location, which would come in handy when debugging errors.

  ```
  [uwsgi]
  chdir=/home/jfang/jfweb/mysite
  module=mysite.wsgi
  env=DJANGO_SETTINGS_MODULE=mysite.settings
  master=True
  processes=5
  wsgi-file=/home/jfang/jfweb/mysite/mysite/wsgi.py
  
  socket=/tmp/mysite.sock
  chown-socket=root:www-data
  chmod-socket=666
  vacuum=true
  
  max-requests=5000
  daemonize=/home/jfang/jfweb.log
  ```
  
  After above settings are all in place, Django can be started via uWSGI by running `sudo systemctl start uwsgi`.

* Ningx

    Given the project directory `jfweb` is located at `/home/jfang/`, add the following configurations to `/etc/nginx/sites-available/default`:
    
    ```
    upstream django {
        server unix:///tmp/mysite.sock;
    }
    
    server {
        listen 443 ssl default_server;
        listen [::]:443 ssl default_server;
        server_name traceproject.syr.edu;
    
        ssl_certificate        /etc/nginx/ssl/traceproject_syr_edu_cert.cer;
        ssl_certificate_key    /etc/nginx/ssl/traceproject.syr.edu.key;
    
        ssl on;
    
        location /app/demo {
            include         /etc/nginx/uwsgi_params;
            uwsgi_param    SCRIPT_NAME /app/domo;
            uwsgi_modifier1 30;
            uwsgi_pass    django;
        }
        
        location /static/assets {
            root /home/jfang/jfweb/mysite;
        }
    
        location /static/admin {
            root /home/jfang/jfweb/mysite;
        }
    }
    ```
    
    The above settings tell Ngnix to redirect all HTTP requests sent to `/app/demo` endpoint to the running uWSGI instance,
    which further passes the requests to Django. In our configuration, uWSGI is running at a UNIX socket instead of an
    HTTP port. This setup makes use of file socket's efficiency to minimize overhead, with an added benefit that no port
    collision would be possible with exsiting apps on the server. `/etc/nginx/uwsgi_params` is the standard uwsgi parameter 
    file without special setup. `uwsgi_param SCRIPT_NAME /app/domo; uwsgi_modifier1 30;` strips off the `/app/demo` part of 
    the request so that the remaining part of the url will be matched with definitions in `urls.py`. The last two `location` 
    directives simply tell Nginx to serve static contents, offloading Django.
    
    Remember to restart Nginx to make changes take effect: `sudo systemctl restart nginx`.


## Django Operations

Django operations are performed using `manage.py`. 

* `runserver`
   
   `python manage.py runserver` starts a development server that runs on localhost. Useful for local debugging.

* `makemigrations` and `migrate`

   When changes are made to `models.py`, these two operations needs to be done in the order shown to update the schema
   in SQLite (the same is true if MySQL is used).
   For example, after a new field is added to `minitrace/models.py`, then we need to run
   ```
   python manage.py makemigrations minitrace
   python manage.py migrate
   ```
   Finally Django can be restarted to make the changes take effect. In local mode, simply stop the current server and re-run
   `runserver` command. In production, restart uwsgi is effectively restarting Django: `sudo systemctl restart uwsgi`.

* `collectstatic`

   Before doing this step (`python manage.py collectstatic`), make sure that `STATICFILES_DIRS` in `settings.py` is the directory containing static files.
   There's no need to do it during local testing. This operation collects all static files from STATICFILES_DIRS and 
   puts them to STATIC_ROOT. Note that files in STATIC_ROOT will be overwritten by this operation. So make sure all changes
   to static contents are performed in STATICFILES_DIRS to avoid accidentally losing them.
   
## Notes on Javascript

All Javascript files are treated as static contents and served using Nginx, although some files do contain project-specific logic.

Of special interest is `/mysite/static/assets/js/survey1.js`. It utilizes SurveyJS library to present surveys to the user. 
This is where survey questions are defined. It also contains logic to measure total survey duration and duration for each question.
Upon survey completion, it compiles survey results along with measured time data in a single JSON and then sends it in an Ajax request 
to Django.  
   
   
#### References
[1] <https://www.digitalocean.com/community/tutorials/how-to-set-up-uwsgi-and-nginx-to-serve-python-apps-on-ubuntu-14-04>

[2] <https://www.digitalocean.com/community/tutorials/how-to-serve-django-applications-with-uwsgi-and-nginx-on-ubuntu-16-04>
