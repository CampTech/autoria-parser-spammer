fetch('/clients.json')
    .then(response => response.json())
    .then(clients => {
        const clientWrapper = document.querySelector('tbody');
        clients.forEach(client => {
            const row = `<tr style="cursor: pointer" class="client"><td>${client.filterId}</td><td>+38${client.number}</td><td>Name</td><td class="text-center">${client.interested}</td></tr>`;
            clientWrapper.insertAdjacentHTML('beforebegin', row);
        });
    })