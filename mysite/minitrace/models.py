# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class SurveyResults(models.Model):
	mturk_id = models.CharField(max_length=14)
	results = models.TextField()
