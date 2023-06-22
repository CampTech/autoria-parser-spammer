let data = {
    'search': [],
    'radio': [],
    'select': []
};

document.querySelectorAll('input[type="radio"]').forEach(el => {
    const label = el.nextSibling;
    if (label.innerText === 'Приватна особа') {
        el.checked = true;
    }

    // el.addEventListener('click', (evt) => {
    //     document.querySelectorAll('input[type="radio"]').forEach(element => {
    //         element.checked = false;
    //     });
    //     el.checked;
    // });
});
const checkboxes = document.querySelectorAll('#countpage-10, #countpage-20, #countpage-30, #countpage-50, #countpage-100');
checkboxes.forEach(el => {
    el.addEventListener('click', (evt)=> {
        checkboxes.forEach(e => {
            e.checked = false;
            e.removeAttribute('checked');
        })
        evt.target.checked = true;
        evt.target.setAttribute('checked', 'checked');
    })
})

function enumElements(el) {
    let attributes = el.attributes;
    const attributeTexts = [];
    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];
        const attributeName = attribute.name;
        const attributeValue = attribute.value;

        const attributeText = attributeName + '="' + attributeValue + '"';
        attributeTexts.push(attributeText);
    }
    return '[' + attributeTexts.join('][') + ']';
}

let auth = true;
    fetch('/config.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.auth === false) {
                // auth = false;
                const alert_wrapper = document.querySelector('.alerts');
                alert_wrapper.insertAdjacentHTML(
                    "afterbegin",
                    `<div class="alert alert-warning">
                        <button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close">
                            <i class="tim-icons icon-simple-remove"></i>
                        </button>
                        <span>
                            <b> Bot </b> is not auth.
                        </span>
                    </div>
                `);
                setTimeout(function() {
                    window.location.href = '/config';
                  }, 5000);
            } else {
                auth = true;
            }
        });

        console.log(auth);

    if (auth === false) {
        const alert_wrapper = document.querySelector('.alerts');
            alert_wrapper.insertAdjacentHTML(
                "afterbegin",
                `<div class="alert alert-warning">
                    <button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close">
                        <i class="tim-icons icon-simple-remove"></i>
                    </button>
                    <span>
                        <b> Bot </b> is not auth.
                    </span>
                </div>
            `);
    }

document.querySelector('.button.small').addEventListener('click', (btn_evt) => {

    document.querySelectorAll('input').forEach(el => {
        if (el.getAttribute('type') === 'search' && el.value !== '') {
            const allAttributesText = 'input' + enumElements(el);
            const label = 'label' + enumElements(el.nextElementSibling);
            const obj = {
                'value': el.value,
                'element': allAttributesText,
                'label': label
            };
            data.search.push(obj);
        }

        if (el.getAttribute('type') === 'radio') {
            if (el.checked) {
                const idAttribute = '#' + el.getAttribute('id');
                const label = 'label' + enumElements(el.nextElementSibling);
                const obj = {
                    'value': el.value,
                    'element': idAttribute,
                    'label': label
                };
                data.radio.push(obj);
            }
        }
    })
    document.querySelectorAll('select').forEach(el => {
        if (el.value > 0) {
            const allAttributesText = 'select' + enumElements(el);
            const obj = {
                'value': el.value,
                'element': allAttributesText
            };
            data.select.push(obj);
        }
    });
    const json = JSON.stringify(data);

    fetch('/processing/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    })
        .then(response => response.json())
        .then(data => {
            const alert_wrapper = document.querySelector('.alerts');
            alert_wrapper.insertAdjacentHTML(
                "afterbegin",
                `<div class="alert alert-success">
                    <button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close">
                        <i class="tim-icons icon-simple-remove"></i>
                    </button>
                    <span>
                        <b> Parsing </b>added to processing
                    </span>
                </div>
            `);
        })
        .catch(error => {
            const alert_wrapper = document.querySelector('.alerts');
            alert_wrapper.insertAdjacentHTML(
                "afterbegin",
                `<div class="alert alert-danger">
                    <button type="button" aria-hidden="true" class="close" data-dismiss="alert" aria-label="Close">
                        <i class="tim-icons icon-simple-remove"></i>
                    </button>
                    <span>
                        <b> Parsing </b> don't added to processing, Error: ${error}
                    </span>
                </div>
            `);
        });

    data = {
        'search': [],
        'radio': [],
        'select': []
    };
});

const input = document.querySelector('input#autocompleteInput-brand-0');
const list = input.parentElement.querySelector('ul');
input.addEventListener('click', () => {
    list.style.display = 'block';

    document.addEventListener('click', function (event) {
        if (!event.target.closest('input#autocompleteInput-brand-0, ul')) {
            list.style.display = 'none';
        }
    });
});

const search_elements = list.querySelectorAll('a');

input.addEventListener('input', () => {
    const searchValue = input.value.toLowerCase();
    for (let i = 0; i < search_elements.length; i++) {
        const item = search_elements[i];
        const text = item.textContent.toLowerCase();
        if (text.includes(searchValue)) {
            item.parentElement.style.display = 'block';
        } else {
            item.parentElement.style.display = 'none';
        }
    }
});

list.querySelectorAll('li').forEach((el) => {
    el.addEventListener('click', () => {
        input.value = el.querySelector('a').innerText;
        list.style.display = 'none';
    });
});

