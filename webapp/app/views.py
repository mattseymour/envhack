from historicIncidents.models import HistoricIncident
from incidents.models import Report
import csv
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.http import HttpResponse, Http404
from incidents.forms import ReportForm
import json

class GeoJson:
    pass

def thanks(request):
    return render_to_response('home/thanks.html', {}, context_instance=RequestContext(request))

def home(request):
    return render_to_response('home/index.html', {}, context_instance=RequestContext(request))

def view(request):
    return render_to_response('home/map.html', {}, context_instance=RequestContext(request))

def submission(request):
    report_form = ReportForm()
    if request.method == 'POST':
        report_form = ReportForm(request.POST, request.FILES)
        if report_form.is_valid():
            obj = report_form.save()
            return redirect('/thanks/')

    return render_to_response('home/submission.html', 
                        { 'form':report_form }, 
                        context_instance=RequestContext(request))

def random(request):
    resultset = HistoricIncident.objects.all()[:1]

    _list = list()
    for i in resultset:
        try:
            obj = GeoJson()
            obj.type = 'Feature'
            obj.geometry = { 'type':'Point', 'coordinates':[int(i.x_conf), int(i.y_conf)], 'properties':{'NOT_ID', int(i.not_id)}}
            _list.append(obj)
        except Exception as e:
            print e
    _resultset = {
                    'type':'Feature',
                    'features':_list    
    }
    _json = json.dumps(_resultset)
    return HttpResponse(_json)

def data(request):
    _list = Report.objects.all()[:100]
    _l = []
    for i in _list:
         j = {'description':i.description,'report_type':i.report_type, 'y':i.report_northing, 'x':i.report_easting}
         _l.append(j)
    return HttpResponse(json.dumps(_l), mimetype='application/json')

def importer(request):
    import datetime

 #   file = '/home/matt/development/envhack/data/EP_Incidents_Nirs2.csv'
    with open(file, 'rb') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for item  in reader:
            try:
                try:
                    obj = HistoricIncident()
                    obj.not_id = item[0]
                    obj.not_date =item[1] 
                    obj.region_wm = item[2]
                    obj.area_wm = item[3]
                    obj.country = item[4]
                    obj.unitary = item[5]
                    obj.district = item[6]
                    obj.ngr_conf = item[7]
                    obj.x_conf = item[8]
                    obj.y_conf = item[9]
                    obj.ep_inc = item[10]
                    obj.eil_air = item[11]
                    obj.eil_land = item[12]
                    obj.eil_water = item[13]
                    obj.save()
                except Exception as e:
                    print e
            except: 
                pass
    return HttpResponse('')
# Create your views here.
