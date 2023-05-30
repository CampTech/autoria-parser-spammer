from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Category)
# admin.site.register(Filter)
admin.site.register(Procesing)
# admin.site.register(Manager)
@admin.register(Clients)
class Clients(admin.ModelAdmin):
    list_display = ("phone", "have_telegram")
    # search_fields = ("manager",)

