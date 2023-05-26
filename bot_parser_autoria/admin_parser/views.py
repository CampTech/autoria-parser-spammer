from django.shortcuts import render
from django.http import HttpResponse
import requests
import json
from .models import Filter, Category


def send_link_page_to_pasrser(pages):
    url = 'http://localhost:3000/data'
    data = json.dumps(pages)
    headers = {'Content-Type': 'application/json'}
    print('123')
    response = requests.post(url, data=data, headers=headers)
    if response.status_code == 200:
        print('Данные успешно отправлены на Node.js сервер')
    else:
        print('Ошибка при отправке данных на Node.js сервер')
        print('Текст ошибки:', response.text)


def get_marks(request):


    api_key = "rDVqLHZTvd3zkmb0mnl3LquSjkO21D4RJMrpWa6q"
    category_id = "1"
    url = "https://developers.ria.com/auto/search"
    info_url = "https://developers.ria.com/auto/info"
    page = 0

    response = requests.get(url, params={"api_key": api_key, "category_id": category_id, "page": page})

    car_pages = []

    if response.status_code == 200:
        res = response.json()
        for id in res['result']['search_result']['ids']:
            car_info = requests.get(info_url, params={"api_key": api_key, "auto_id": id})
            if car_info.status_code == 200:
                car_info = car_info.json()
                print(car_info)
                car_pages.append(car_info['linkToView'])

        send_link_page_to_pasrser(car_pages)

    return HttpResponse("GET-запрос выполнен успешно")
