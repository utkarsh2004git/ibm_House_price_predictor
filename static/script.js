const statesAndCities = {};

fetch('/get_locations')
    .then(response => response.json())
    .then(data => {
        Object.assign(statesAndCities, data);
        const stateSelect = document.getElementById('state');
        for (const state in statesAndCities) {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        }
    });

function updateCities() {
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');
    citySelect.disabled = false;
    citySelect.innerHTML = '<option value="" disabled selected>Select a city</option>';

    const selectedState = stateSelect.value;
    const cities = statesAndCities[selectedState];

    for (const city of cities) {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    }
}

function enableBHKType() {
    const bhkTypeSelect = document.getElementById('bhkType');
    bhkTypeSelect.disabled = false;
}

function predictPrice() {
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const bhkType = document.getElementById('bhkType').value;

    if (!state || !city || !bhkType) {
        alert('Please select state, city and BHK type.');
        return;
    }

    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ state, city, bhkType })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').textContent = `Predicted House Price: ₹${data.price}, Quality: ${data.quality}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
