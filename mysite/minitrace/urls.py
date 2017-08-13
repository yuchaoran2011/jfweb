from django.conf.urls import url
from django.views.generic.base import TemplateView

urlpatterns = [
	url(r'^tank$', TemplateView.as_view(template_name='tank.html'), name="tank"),
	url(r'^unusualsuspects$', TemplateView.as_view(template_name='UnusualSuspects.html'), name="unusualsuspects"),
	url(r'^druginterdiction$', TemplateView.as_view(template_name='DrugInterdiction.html'), name="druginterdiction"),
	url(r'^iskalmiusnext$', TemplateView.as_view(template_name='IsKalmiusNext.html'), name="iskalmiusnext"),
	url(r'^whomurderedlinda$', TemplateView.as_view(template_name='WhoMurderedLinda.html'), name="whomurderedlinda"),
	url(r'^whichlovell$', TemplateView.as_view(template_name='WhichLovell.html'), name="whichlovell")
]
