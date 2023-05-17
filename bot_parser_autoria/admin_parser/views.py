from django.shortcuts import render
from django.http import HttpResponse
import requests
from .models import Filter, Category


def get_marks(request):
    categories = Category.objects.filter(filter__isnull=False).distinct()
    # filters = Filter.objects.distinct()
    # filters_name = [filter.category for filter in filters]
    # print(filters_name)
    # category_names = [category.name_filter for category in categories]
    brand_names = [category.name for category in categories]

    # Вывести значения category_names


    api_key = "rDVqLHZTvd3zkmb0mnl3LquSjkO21D4RJMrpWa6q"
    category_id = "1"
    url = "https://developers.ria.com/auto/search"

    # response = requests.get(url, params={"api_key": api_key, "category_id": category_id})

    # if response.status_code == 200:
    #
    #     res = response.json()

        # print(res['result']['search_result']['ids'])

        # info_url = "https://developers.ria.com/auto/info"
        # print(res['result']['search_result']['ids'])
        # for id in res['result']['search_result']['ids']:
        #     print(res['result']['search_result']['ids'])
        #     print(id)
            # car_info = requests.get(info_url, params={"api_key": api_key, "auto_id": id})
            # car_info = car_info.json()
            # print(car_info)

            # print(car_info['linkToView'])


        # marks = response.json()
        # mark_values = []
        #
        # for brand_name in brand_names:
        #     print(brand_name)
        #     for mark in marks:
        #         if brand_name.lower() == mark['name'].lower():
        #             mark_values.append(mark['value'])

        # for mark_value in mark_values:



    return HttpResponse("GET-запрос выполнен успешно")
