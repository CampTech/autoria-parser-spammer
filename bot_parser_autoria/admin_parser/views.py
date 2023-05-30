from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import json
from .models import Filter, Category, Phones, Clients
from .forms import FilterForm


def send_link_page_to_pasrser(category_name, pages=False):
    url = 'http://localhost:3000/data'
    data = json.dumps({
        'pages': pages,
        'category': category_name
    })
    headers = {'Content-Type': 'application/json'}
    print('123')
    response = requests.post(url, data=data, headers=headers)
    if response.status_code == 200:
        print('Данные успешно отправлены на Node.js сервер')
    else:
        print('Ошибка при отправке данных на Node.js сервер')
        print('Текст ошибки:', response.text)


def get_marks(categories, request, category_name):
    # api_key = "rDVqLHZTvd3zkmb0mnl3LquSjkO21D4RJMrpWa6q"
    api_key = "VLhy1HZ0olZ6Vi2rwiIk6yBSax2n6vwTw1ebwpGa"
    url = "https://developers.ria.com/auto/search"
    info_url = "https://developers.ria.com/auto/info"
    params = {}

    for category in categories:
        params[f'{category.name_filter}'] = str(category)

    pages = range(0, 100)

    for page in pages:
        response = requests.get(url, params={"api_key": api_key, **params, "page": page})

        if response.status_code == 200:
            car_pages = []
            res = response.json()
            print(page)
            print(res)
            print('__________________')
            # for id in res['result']['search_result']['ids']:
            #     car_info = requests.get(info_url, params={"api_key": api_key, "auto_id": id})
            #     if car_info.status_code == 200:
            #         car_info = car_info.json()
            #         car_pages.append(car_info['linkToView'])
            #
            # send_link_page_to_pasrser(category_name, car_pages)

@csrf_exempt
def main_page(request):
    if request.method == 'POST':
        data = request.body
        print(json.loads(request.body))
        url = 'http://localhost:3000/'
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, data=data, headers=headers)
        if response.status_code == 200:
            print('Данные успешно отправлены на Node.js сервер')
        return JsonResponse({'success': ':)'}, status=200)
    return render(request, 'filter.html')

def start(request):
    if request.method == 'POST':
        form = FilterForm(request.POST)
        if form.is_valid():
            selected_filter = form.cleaned_data['filter']
            categories = selected_filter.category.all()
            get_marks(categories, request, selected_filter.name)
    else:
        form = FilterForm()

    return render(request, 'start.html', {'form': form})


@csrf_exempt
def get_phones(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        for item in data:
            if item != 'NULL' and item:
                print(item)
                Clients.objects.create(phone=item, massage_interested='f')
                Phones.objects.create(phone=item)
    return JsonResponse({'success': ':)'}, status=200)



def phone_list(request):
    phones = Phones.objects.values('phone')
    context = {'phones': phones}
    return render(request, 'phone_list.html', context)
