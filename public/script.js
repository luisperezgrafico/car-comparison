const makeSelect = document.getElementById('make');
const modelSelect = document.getElementById('model');
const yearSelect = document.getElementById('year');
const trimSelect = document.getElementById('trim');

async function fetchMakes() {
    try {
        const response = await fetch('/api/getMakes');
        const data = await response.json();
        return data.makes;
    } catch (error) {
        console.error('Error fetching makes:', error);
    }
}

async function fetchModels(make) {
    try {
        const response = await fetch(`/api/getModels?make=${make}`);
        const data = await response.json();
        return data.models;
    } catch (error) {
        console.error('Error fetching models:', error);
    }
}

async function fetchYears(make, model) {
    try {
        const response = await fetch(`/api/getYears?make=${make}&model=${model}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching years:', error);
    }
}

async function fetchTrims(make, model, year) {
    try {
        const response = await fetch(`/api/getTrims?make=${make}&model=${model}&year=${year}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching trims:', error);
    }
}

function populateSelect(select, options, valueKey, textKey) {
    select.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = valueKey ? option[valueKey] : option;
        optionElement.textContent = textKey ? option[textKey] : option;
        select.appendChild(optionElement);
    });
}

async function initialize() {
    const makes = await fetchMakes();
    populateSelect(makeSelect, makes, 'make_id', 'make_display');

    makeSelect.addEventListener('change', async () => {
        const make = makeSelect.value;
        const models = await fetchModels(make);

                populateSelect(modelSelect, models, 'model_name', 'model_name');
        modelSelect.dispatchEvent(new Event('change'));
    });

    modelSelect.addEventListener('change', async () => {
        const make = makeSelect.value;
        const model = modelSelect.value;
        const years = await fetchYears(make, model);
        populateSelect(yearSelect, years);
        yearSelect.dispatchEvent(new Event('change'));
    });

    yearSelect.addEventListener('change', async () => {
        const make = makeSelect.value;
        const model = modelSelect.value;
        const year = yearSelect.value;
        const trims = await fetchTrims(make, model, year);
        populateSelect(trimSelect, trims, 'model_trim', 'model_trim');
    });

    makeSelect.dispatchEvent(new Event('change'));
}

initialize();

       
