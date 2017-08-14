# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt

import json

from minitrace.models import *

from django.shortcuts import render


def convert(input):
	if isinstance(input, dict):
		return {convert(key): convert(value) for key, value in input.iteritems()}
	elif isinstance(input, list):
		return [convert(element) for element in input]
	elif isinstance(input, unicode):
		return input.encode('utf-8')
	else:
		return input


# Create your views here.
@csrf_exempt
def survey_results_controller(request):
	if request.method == 'GET':
		print 'wtf'
		return HttpResponse()
	elif request.method == 'POST':
		print request.body
		json_results = json.loads(request.body, object_hook=convert)
		results = json_results['results']
		duration = json_results['duration']
		references = json_results['references']
		print results
		print duration
		print references
		SurveyResults.objects.create(results=results, duration=duration, references=references)
		return HttpResponse()
