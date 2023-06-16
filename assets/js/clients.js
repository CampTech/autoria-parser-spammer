console.log('21212');

fetch('/numbers.json')
    .then(response => response.json())
    .then(numbersArray => {
        const clientWrapper = document.querySelector('tbody');
        numbersArray.forEach(number => {
            const row = `<tr style="cursor: pointer" class="client"><td>${number}</td><td>  </td><td class="text-center">No</td></tr>`;
            clientWrapper.insertAdjacentHTML('beforebegin', row);
            console.log(number);
        });
    })
    .catch(error => {
        console.error('Ошибка при загрузке файла JSON:', error);
    });