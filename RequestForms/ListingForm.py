from django import forms


class ListingForm(forms.Form):
    search = forms.CharField(required=False)
    sortColumn = forms.CharField(required=False)
    sortType = forms.CharField(required=False)
    pageLimit = forms.IntegerField()
    pageOffset = forms.IntegerField()
