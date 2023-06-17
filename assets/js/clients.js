fetch('/clients.json')
    .then(response => response.json())
    .then(clients => {
        const clientWrapper = document.querySelector('tbody');
        clients.forEach(client => {
            client.clients.forEach(el => {
                const row = `<tr style="cursor: pointer" class="client"><td>${el.name}</td><td>+38${el.number}</td><td>${el.car}</td><td class="text-center">${el.interested}</td></tr>`;
                clientWrapper.insertAdjacentHTML('beforebegin', row);
            });
        });
    })