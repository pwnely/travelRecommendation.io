// part 6
async function getData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// part 7
async function searchByKeyword() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const data = await getData();
    
    const filteredResults = {
        countries: [],
        temples: [],
        beaches: []
    };

    data.countries.forEach(country => {
        let countryMatch = false;
        if (country.name.toLowerCase().includes(keyword)) {
            countryMatch = true;
            filteredResults.countries.push(country);
        }
        country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(keyword)) {
                if (!countryMatch) {
                    filteredResults.countries.push(country);
                    countryMatch = true;
                }
                filteredResults.countries[filteredResults.countries.length - 1].cities = 
                    filteredResults.countries[filteredResults.countries.length - 1].cities.filter(c => c.name.toLowerCase().includes(keyword));
            }
        });
    });

    filteredResults.temples = data.temples.filter(temple => temple.name.toLowerCase().includes(keyword));
    filteredResults.beaches = data.beaches.filter(beach => beach.name.toLowerCase().includes(keyword));

    displayResults(filteredResults);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const createCard = (item) => `
        <div class="card">
            <img src="${item.imageUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        </div>
    `;

    results.countries.forEach(country => {
        country.cities.forEach(city => {
            resultsDiv.innerHTML += createCard(city);
        });
    });

    results.temples.forEach(temple => {
        resultsDiv.innerHTML += createCard(temple);
    });

    results.beaches.forEach(beach => {
        resultsDiv.innerHTML += createCard(beach);
    });
}

// part 8
async function getRecommendations() {
    const data = await getData();
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    
    const recommendations = {
        countries: [],
        temples: [],
        beaches: []
    };

    if (keyword.includes('beach')) {
        recommendations.beaches = data.beaches;
    } else if (keyword.includes('temple')) {
        recommendations.temples = data.temples;
    } else if (keyword.includes('country')) {
        recommendations.countries = data.countries;
    }

    displayResults(recommendations);
}

// part 9
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('results').innerHTML = '';
}