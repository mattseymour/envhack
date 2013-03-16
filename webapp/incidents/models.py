from django.db import models

# Create your models here.

class Report(models.Model):
    REPORT_TYPES = (('DEB', 'Rubbish'), ('POL', 'Pollution'), ('OBS', 'Obstruction'))
    DANGER_TYPES = (('H', 'High'), ('M', 'Medium'), ('L', 'Low'), ('N', 'None'))
    reporter_name = models.CharField(max_length=50)
    reporter_email = models.EmailField(max_length=100)
    submission_date = models.DateTimeField(auto_now_add=True)
    report_type = models.CharField(max_length=3, choices=REPORT_TYPES)
    danger_wildlife = models.CharField(2, choices=DANGER_TYPES)
    danger_person = models.CharField(2, choices=DANGER_TYPES)
    danger_boat = models.CharField(2, choices=DANGER_TYPES)
    report_northing = models.IntegerField()
    report_easting = models.IntegerField()
    photo = models.ImageField(upload_to=os.path.join('media'))

class ReportVote(models.Model):
    report = models.ForeignKey('Report')
    voter_name = models.CharField(max_length=50)
    voter_email = models.EmailField(max_length=100)
    submission_date = models.DateTimeField(auto_now_add=True)

