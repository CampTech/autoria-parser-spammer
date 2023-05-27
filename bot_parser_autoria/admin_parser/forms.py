from django import forms
from .models import Filter

class FilterForm(forms.Form):
    filter = forms.ModelChoiceField(queryset=Filter.objects.all(), empty_label=None)