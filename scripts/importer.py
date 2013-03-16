import os
import sys
import csv

# apppend django project location
sys.path.append(os.path.join('webapp'))

from webapp.historicIncident.models import HistoricIncident

with open(os.path.join('data', 'datafile.csv'), 'rb') as csv_file:
    reader = csv.reader(csv_file, delimiter=',', quotechar='"')
    for row in reader:
        for item in row:
            obj = HistoricIncident()
            obj.

            # Logic for adding to database will go here
            print item 
            

