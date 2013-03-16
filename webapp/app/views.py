from historicIncidents.models import HistoricIncident
import csv
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse

def home(request):
    return render_to_response('home/index.html', {}, context_instance=RequestContext(request))


def importer(request):
    import datetime

    file = '/home/matt/development/envhack/data/EP_Incidents_Nirs2.csv'
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
