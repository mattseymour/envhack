import os
import sys
import csv


print os.getcwd()
# apppend django project location
sys.path.append(os.path.join(os.getcwd(), 'webapp', 'webapp'))
print sys.path
from webapp.historicIncidents.models import HistoricIncident

with open(os.path.join('data', 'EP_Incidents_Nirs2.csv'), 'rb') as csv_file:
    reader = csv.reader(csv_file, delimiter=',', quotechar='"')
    for row in reader:
        for item in row:
	    try:
        	obj = HistoricIncident()
        	obj.not_id = item[0]
		obj.not_date = item[1]
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
		
	    except:
		print row

            # Logic for adding to database will go here
            print item 
            

