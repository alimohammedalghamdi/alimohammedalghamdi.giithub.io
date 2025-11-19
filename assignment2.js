const countryInput = document.getElementById("countryInput");
const getCountryBtn = document.getElementById("getCountryBtn");
const clearCountryBtn = document.getElementById("clearCountryBtn");
const countryResult = document.getElementById("countryResult");
const errorMsg = document.getElementById("errorMsg");

countryInput.addEventListener("keyup", () => {
    errorMsg.textContent = ""; // clear error while typing
});

getCountryBtn.addEventListener("click", () => {
    const countryName = countryInput.value.trim();

    if (countryName === "") {
        errorMsg.textContent = "Please enter a country name.";
        countryResult.innerHTML = "";
        return;
    }

    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Country not found");
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                errorMsg.textContent = "Could not find data for this country.";
                countryResult.innerHTML = "";
                return;
            }

            errorMsg.textContent = "";

            const country = data[0];

            const name = country.name?.common || "Unknown";
            const official = country.name?.official || "N/A";
            const capital = country.capital ? country.capital[0] : "N/A";
            const region = country.region || "N/A";
            const population = country.population?.toLocaleString() || "N/A";
            const area = country.area ? country.area.toLocaleString() + " km²" : "N/A";
            const flagUrl = country.flags?.png || country.flags?.svg || "";

            const box = document.createElement("div");
            box.className = "country-box";

            box.innerHTML = `
                ${flagUrl ? `<img src="${flagUrl}" alt="Flag of ${name}">` : ""}
                <p><strong>Country:</strong> ${name}</p>
                <p><strong>Official Name:</strong> ${official}</p>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Region:</strong> ${region}</p>
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Area:</strong> ${area}</p>
            `;

            countryResult.innerHTML = "";
            countryResult.appendChild(box);
        })
        .catch(error => {
            console.error(error);
            errorMsg.textContent = "Error fetching country data. Please check the name and try again.";
            countryResult.innerHTML = "";
        });
});

clearCountryBtn.addEventListener("click", () => {
    countryResult.innerHTML = "";
    errorMsg.textContent = "Country data cleared.";
});
