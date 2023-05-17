from django.db import models
from datetime import datetime


class Category(models.Model):
    name_filter = models.CharField(max_length=70)
    # code_filter = models.CharField(max_length=1000)
    name = models.CharField(max_length=255)
    def __str__(self):
        return str(self.name)

class Filter(models.Model):
    name = models.CharField(max_length=100)
    category = models.ManyToManyField('Category')
    max_value_parsing = models.IntegerField()
    date_add = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return str(self.name)


class Procesing(models.Model):
    id_filter = models.ForeignKey('Filter', null=False, on_delete=models.CASCADE)#помыняти он делыт каскад
    complate = models.BooleanField(default=False)
    count_nice_parse = models.IntegerField()
    date_start = models.DateTimeField(auto_now_add=True, blank=True)
    date_finish = models.DateTimeField(null=False)
    def __str__(self):
        return str(self.id_filter) + str(int(self.complate))

class Manager(models.Model):
    name = models.CharField(max_length=16)

    def __str__(self):
        return str(self.name)

class Clients(models.Model):
    filter_data = models.ForeignKey('Filter', null=False, on_delete=models.CASCADE)
    phone = models.CharField(max_length=16)
    have_telegram = models.BooleanField(default=False)
    have_viber = models.BooleanField(default=False)
    have_whatsApp = models.BooleanField(default=False)
    interested = models.BooleanField(default=False)
    massage_interested = models.TextField()
    date_add = models.DateTimeField(auto_now_add=True, blank=True)
    manager = models.ForeignKey('Manager', on_delete=models.CASCADE, null=False)
    nice_client = models.BooleanField(default=False)
    complate = models.BooleanField(default=False)

    def __str__(self):
        return str(self.filter_data) + str(self.date_add)
