# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt

from minitrace.models import *

from django.shortcuts import render

# Create your views here.
@csrf_exempt
def survey_results_controller(request):
	if request.method == 'GET':
		print 'wtf'
		return HttpResponse()
	elif request.method == 'POST':
		print request.body
		SurveyResults.objects.create(results=request.body)
		return HttpResponse()
