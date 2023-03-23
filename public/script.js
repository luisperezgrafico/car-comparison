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


const showDataButton = document.getElementById("show-data");
showDataButton.addEventListener("click", async () => {
  const selectedMake = makeSelect.value;
  const selectedModel = modelSelect.value;
  const selectedYear = yearSelect.value;
  const selectedTrim = trimSelect.value;

  if (selectedMake && selectedModel && selectedYear && selectedTrim) {
    try {
      const response = await fetch(
        `/api/carquery?cmd=getModel&make=${selectedMake}&model=${selectedModel}&year=${selectedYear}&trim_id=${selectedTrim}`
      );
      const data = await response.json();
      displayCarData(data);
    } catch (error) {
      console.error("Failed to fetch car data:", error);
    }
  } else {
    alert("Please select all options before showing data.");
  }
});
async function fetchCarData(make, model, year, trimId) {
  const response = await fetch(
    `/api/carquery?cmd=getModel&make=${make}&model=${model}&year=${year}&model_trim=${trimId}`
  );
  const data = await response.json();
  return data;
}

function displayCarData(data) {
  const carDataContainer = document.getElementById("car-data");
  carDataContainer.innerHTML = "";

  if (data && data.model) {
        const carDataHtml = `
      <h2>Car Data</h2>
      <p><strong>Make:</strong> ${data.model.make_display}</p>
      <p><strong>Model:</strong> ${data.model.model_name}</p>
      <p><strong>Year:</strong> ${data.model.model_year}</p>
      <p><strong>Trim:</strong> ${data.model.model_trim}</p>
      <p><strong>Body Style:</strong> ${data.model.model_body}</p>
      <p><strong>Engine Position:</strong> ${data.model.model_engine_position}</p>
      <p><strong>Engine Type:</strong> ${data.model.model_engine_type}</p>
      <p><strong>Engine Capacity (cc):</strong> ${data.model.model_engine_cc}</p>
      <p><strong>Power (hp):</strong> ${data.model.model_engine_power_hp}</p>
      <p><strong>Transmission:</strong> ${data.model.model_transmission_type}</p>
      <p><strong>Drive:</strong> ${data.model.model_drive}</p>
      <p><strong>Fuel Type:</strong> ${data.model.model_fuel_type}</p>
    `;

    carDataContainer.innerHTML = carDataHtml;
  } else {
    carDataContainer.innerHTML = "<p>No data available for the selected car.</p>";
  }
}




initialize();

       
