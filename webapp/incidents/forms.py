from incidents.models import Report
from django.forms import ModelForm

class ReportForm(ModelForm):
    class Meta:
        model = Report
        exclude = ('submission_date',)

