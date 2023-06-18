fetch('/clients.json')
    .then(response => response.json())
    .then(clients => {
        const clientWrapper = document.querySelector('tbody');
        clients.forEach(client => {
            client.clients.forEach(el => {
                const row = `<tr style="cursor: pointer" class="client"><td><a href='/client/${el.id}'>${el.id}</a></td><td><a href='/client/${el.id}'>${el.name}</a></td><td> <a href='/client/${el.id}'>+38${el.number}</a> </td><td><a href='/client/${el.id}'>${el.car}</a></td><td class="text-center"><a href='/client/${el.id}'>${el.interested}</a></td></tr>`;
                clientWrapper.insertAdjacentHTML('beforebegin', row);
            });
        });
    })