var countries = [];
var index = [];
var countryCards = [];
var regionData = [];
var searchBox = document.querySelector("#country-select");
var menu = document.querySelectorAll("div[aria-labelledby='dropdownMenuButton'] .dropdown-item");
var searchBy = document.querySelectorAll("div[aria-labelledby='dropdownSearchButton'] .dropdown-item");

getCountryContent();
swapStyleSheets();
// setTimeout(function() {
appendCurrencyData();
appendLanguageData();
// }, 5000);

window.onscroll = function () {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    document.getElementById("back-to-top").classList.remove("d-none");
  } else {
    document.getElementById("back-to-top").classList.add("d-none");
  }
}

document.getElementById("removeFilter").addEventListener("click", function () {
  if (document.querySelector("#dropdownMenuButton").textContent !== "Filter") {
    setupDisplay("error-message", "country-list");
    showAll();
    searchBox.value = "";
    document.querySelector("#dropdownMenuButton").textContent = "Filter";
  }
});

searchBox.addEventListener("keydown", function (event) {
  $("#country-select").tooltip({ trigger: "manual", title: "Special characters and empty search queries not allowed!" });
  if (searchBox.value === "" && event.keyCode === 13)
    $("#country-select").tooltip("show");
  else
    $("#country-select").tooltip("hide");
  if (event.keyCode === 13 && /^[a-zA-Z0-9\(\)\s]*$/.test(this.value) && searchBox.value !== "") {
    this.blur();
    if (document.querySelector("#dropdownSearchButton").textContent === "Country") {
      generalSearch("name", "");
    }
    else if (document.querySelector("#dropdownSearchButton").textContent === "Capital") {
      generalSearch("capital", "capital");
    }
    else if (document.querySelector("#dropdownSearchButton").textContent === "Calling Codes") {
      generalSearch("callingcode", "callingCodes");
    }
    else if (document.querySelector("#dropdownSearchButton").textContent === "Language") {
      generalSearch("lang", "languages");
    }
    else if (document.querySelector("#dropdownSearchButton").textContent === "Currency") {
      generalSearch("currency", "currencies");
    }
    else if (document.querySelector("#dropdownSearchButton").textContent === "Regional Bloc") {
      generalSearch("regionalbloc", "regionalBlocs")
    }
    window.scrollTo(0, 0);
  }
});

searchBox.addEventListener("input", function () {
  $("#country-select").tooltip({ trigger: "manual", title: "Special characters not allowed!" });
  if (searchBox.value === "" && document.querySelector("#dropdownMenuButton").textContent === "Filter") {
    setupDisplay("error-message", "country-list");
    showAll();
  }
  if (!(/^[a-zA-Z0-9\(\)\s]*$/.test(this.value)))
    $("#country-select").tooltip("show");
  else
    $("#country-select").tooltip("hide");
});

document.querySelector(".fa-times-circle").addEventListener("click", function (e) {
  $("#country-select").tooltip("hide");
  if (document.querySelector("#dropdownMenuButton").textContent === "Filter") {
    setupDisplay("error-message", "country-list")
    searchBox.value = "";
    showAll();
  }
});

for (var i = 0; i < menu.length; i++) {
  menu[i].addEventListener("click", getRegionContent);
}

for (var j = 1; j < searchBy.length; j++) {
  searchBy[j].addEventListener("click", function () {
    document.querySelector("#dropdownSearchButton").textContent = this.textContent;
    document.getElementById("country-select").setAttribute("placeholder", "Search by " + document.querySelector("#dropdownSearchButton").textContent);
  });
}

function swapStyleSheets() {
  document.querySelectorAll(".theme")[1].addEventListener("click", swap);
  document.querySelectorAll(".theme")[3].addEventListener("click", swap);
}

function swap() {
  var currentSS = document.getElementById("theme-change");
  if (currentSS.getAttribute("href") === "dark-theme.css") {
    currentSS.setAttribute("href", "light-theme.css");
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#F2F2F2");
    document.querySelector('meta[name="msapplication-navbutton-color"]').setAttribute("content", "#F2F2F2");
  }
  else {
    currentSS.setAttribute("href", "dark-theme.css");
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "hsl(207, 26%, 17%)");
    document.querySelector('meta[name="msapplication-navbutton-color"]').setAttribute("content", "hsl(207, 26%, 17%)");
  }
}

function getRegionContent() {
  document.getElementById("spinner").classList.remove("d-none");
  searchBox.value = "";
  var region = this.textContent;
  var searchByRegionUrl = "https://restcountries.eu/rest/v2/region/";
  document.querySelector("#dropdownMenuButton").textContent = this.textContent;
  searchByRegionUrl = searchByRegionUrl + this.textContent + "?fields=name;";
  var regionRequest = new XMLHttpRequest;
  regionRequest.open('GET', searchByRegionUrl, true);

  regionRequest.onload = function () {
    document.getElementById("spinner").classList.add("d-none");
    if (regionRequest.status >= 200 && regionRequest.status < 400) {
      regionData = JSON.parse(regionRequest.responseText);
      setupDisplay("error-message", "country-list");
      hideAll();
      for (var i = 0; i < regionData.length; i++) {
        document.getElementById(regionData[i].name).classList.remove("d-none");
      }
      searchBox.addEventListener("input", function () {
        if (this.value === "" && document.querySelector("#dropdownMenuButton").textContent === region) {
          for (var j = 0; j < regionData.length; j++) {
            document.getElementById(regionData[j].name).classList.remove("d-none");
          }
        }
      });
      document.querySelector(".fa-times-circle").addEventListener("click", function () {
        if (document.querySelector("#dropdownMenuButton").textContent === region) {
          searchBox.value = "";
          for (var j = 0; j < regionData.length; j++) {
            document.getElementById(regionData[j].name).classList.remove("d-none");
          }
        }
      });
    } else {
      errorDiv.innerHTML = "<p>" + "Error Code: <strong>" + searchRequest.status + "</strong> - Search Query Not Found" + "</p>";
    }
  }

  regionRequest.onerror = function () {
    document.getElementById("error-message").innerHTML = "<p>" + "There was a connection error of some sort. Please ensure you are connected to the internet." + "</p>";
  }

  regionRequest.send();
}


function setupDisplay(div1, div2) { // setupDisplay(hide, show)
  let hideDiv = document.getElementById(div1);
  let showDiv = document.getElementById(div2);
  if (hideDiv !== "") {
    hideDiv.classList.add("d-none");
  }
  if (showDiv !== "") {
    showDiv.classList.remove("d-none");
  }
}

function getCountryContent() {
  document.getElementById("spinner").classList.remove("d-none");
  var getUrl = "https://restcountries.eu/rest/v2/all";
  var request = new XMLHttpRequest;
  request.open('GET', getUrl, true);

  request.onload = function () {
    document.getElementById("spinner").classList.add("d-none");
    if (request.status >= 200 && request.status < 400) {
      countries = JSON.parse(request.responseText);
      initializeIndices(countries);
      displayCountryContent(countries);

    } else {
      errorDiv.innerHTML = "<p>" + "Error Code: <strong>" + searchRequest.status + "</strong> - Search Query Not Found" + "</p>";
    }
  }

  request.onerror = function () {
    document.getElementById("error-message").innerHTML = "<p>" + "There was a connection error of some sort. Please make sure you are connected to the internet and try again." + "</p>";
  }

  request.send();
}

function appendCurrencyData() {
  var json = $.getJSON({
    'url': "currency-codes.json",
    'async': false
  });
  json = JSON.parse(json.responseText);
  for (var i = 0; i < json.length; i++) {
    let currencyHtml = "<tr><td>" + json[i].Currency + "</td><td>" + json[i].Alphabetic_Code + "</td></tr>";
    $('#currencyCodes').append(currencyHtml);
  }
}

function appendLanguageData() {
  var json = $.getJSON({
    'url': "language-codes_json.json",
    'async': false
  });
  json = JSON.parse(json.responseText);
  for (var i = 0; i < json.length; i++) {
    let languageHtml = "<tr><td>" + json[i].English + "</td><td>" + json[i].alpha2 + "</td></tr>";
    $('#languageCodes').append(languageHtml);
  }
}

function generalSearch(urlCode, jsonKey, json) {
  document.getElementById("spinner").classList.remove("d-none");
  var url = "https://restcountries.eu/rest/v2/" + urlCode + "/";
  var string = searchBox.value;
  if (string !== "") {
    url = url + string + "?fields=name;" + jsonKey + ";region;";
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
      document.getElementById("spinner").classList.add("d-none");
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        setupDisplay("error-message", "country-list");
        hideAll();
        showSearchResults(data);
      } else {
        setupDisplay("country-list", "error-message");
        let errorDiv = document.getElementById("error-message");
        errorDiv.innerHTML = "<p>" + "Error Code: <strong>" + request.status + "</strong> - Search Query Not Found" + "</p>";
        textBox();
      }
    }

    request.onerror = function () {
      setupDisplay("country-list", "error-message");
      setupDisplay("spinner", "error-message");
      document.getElementById("error-message").innerHTML = "<p>" + "There was a connection error of some sort. Please ensure you are connected to the internet." + "</p>";
      textBox();
    }

    request.send();
  } else if (string === "") {
    document.getElementById("spinner").classList.add("d-none");
  }
}

function showSearchResults(data) {
  var counter = 0;
  let reg = document.querySelector("#dropdownMenuButton").textContent;
  for (var j = 0; j < data.length; j++) {
    if (data[j].region === reg) {
      setupDisplay("error-message", "country-list");
      document.getElementById(data[j].name).classList.remove("d-none");
    } else if (reg === "Filter") {
      document.getElementById(data[j].name).classList.remove("d-none");
    }
    else {
      counter++;
    }
  }
  if (counter === data.length) {
    setupDisplay("country-list", "error-message");
    document.getElementById("error-message").innerHTML = "<p>Search Query not found in " + document.querySelector("#dropdownMenuButton").textContent + "</p>";
    textBox();
  }
}

function textBox() {
  searchBox.addEventListener("input", function () {
    if (this.value === "") {
      setupDisplay("error-message", "country-list");
    }
  });
  document.querySelector("#cross-icon").addEventListener("click", function () {
    searchBox.value = "";
    setupDisplay("error-message", "country-list");
  });
}

function displayCountryContent(countries) {
  var ind, population;
  for (var i = 0; i < countries.length; i++) {
    ind = index[i];
    population = countries[ind].population;
    if (population / 1000000 >= 0.1 && population / 1000000 < 1000) {
      population = (population / 1000000).toFixed(2) + " million";
    } else if (population / 1000000000 >= 0.1 && population / 1000000000 < 1000) {
      population = (population / 1000000000).toFixed(2) + " billion";
    } else {
      population = population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    if (countries[ind].capital === "") {
      countries[ind].capital = "N/A";
    }
    if (countries[ind].population === "") {
      countries[ind].population = "N/A";
    }
    if (countries[ind].region === "") {
      countries[ind].region = "N/A";
    }
    let countryHtml = '<div class="card" id="' + countries[ind].name + '"><img src="' + countries[ind].flag + '" class="card-img-top" alt="' + 'Flag of ' + countries[ind].name + '"><div class="card-body"><h5 class="card-title">' + countries[ind].name + '</h5><ul class="pl-0"><li><span class="country-info">Population:</span> ' + population + '</li><li><span class="country-info">Region:</span> ' + countries[ind].region + '</li><li><span class="country-info">Capital:</span> ' + countries[ind].capital + '</li></ul></div></div>';
    countryCards.push(countries[ind].name);
    $("#country-list").append(countryHtml);
    document.getElementById(countries[ind].name).addEventListener("click", getDetails);
  }
}

function getDetails() {
  var currency = "";
  var languages = "";
  var domain = "";
  var allN = "";
  var neighbour;
  var clickedCountry = this.getAttribute("id");
  var borderCountries;
  var coordinates = "";
  var lat, lng;
  var time = "";
  var codes = "";
  document.getElementById("back").addEventListener("click", function () {
    $("#extra").slideUp("400");
    document.body.classList.remove("no-scroll");
  });
  $("#extra").slideDown("4000");
  document.body.classList.add("no-scroll");
  $("#extra")[0].scrollTo(0, 0);
  document.querySelector("h5.country-title").textContent = clickedCountry;
  for (var i = 0; i < countries.length; i++) {
    if (countries[i].name === clickedCountry) {
      var area = countries[i].area;
      countries[i].population = (countries[i].population).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if (area !== null) {
        area = area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.querySelector("#area").innerHTML = '<span class="country-info">Area: </span>' + area + " km<sup>2</sup>";
      }
      else {
        document.querySelector("#area").innerHTML = '<span class="country-info">Area: </span>N/A';
      }
      document.querySelector("#flag").setAttribute("src", countries[i].flag);
      document.querySelector("#natName").innerHTML = '<span class="country-info">Native Name: </span>' + countries[i].nativeName;
      document.querySelector("#pop").innerHTML = '<span class="country-info">Population: </span>' + countries[i].population;
      document.querySelector("#region").innerHTML = '<span class="country-info">Region: </span>' + countries[i].region;
      if (countries[i].subregion !== "")
        document.querySelector("#subRegion").innerHTML = '<span class="country-info">Sub Region: </span>' + countries[i].subregion;
      else
        document.querySelector("#subRegion").innerHTML = '<span class="country-info">Sub Region: </span>N/A';
      document.querySelector("#capital").innerHTML = '<span class="country-info">Capital: </span>' + countries[i].capital;
      for (var j = 0; j < countries[i].currencies.length; j++) {
        currency = currency + countries[i].currencies[j].name;
        if (j !== countries[i].currencies.length - 1) {
          currency = currency + ", ";
        }
      }
      for (var j = 0; j < countries[i].topLevelDomain.length; j++) {
        domain = domain + countries[i].topLevelDomain[j];
        if (j !== countries[i].topLevelDomain.length - 1) {
          domain = domain + ", ";
        }
      }
      for (var j = 0; j < countries[i].languages.length; j++) {
        languages = languages + countries[i].languages[j].name;
        if (j !== countries[i].languages.length - 1) {
          languages = languages + ", ";
        }
      }
      for (var j = 0; j < countries[i].callingCodes.length; j++) {
        codes = codes + countries[i].callingCodes[j];
        if (j !== countries[i].callingCodes.length - 1) {
          codes = codes + ", ";
        }
      }
      for (var j = 0; j < countries[i].borders.length; j++) {
        for (var k = 0; k < countries.length; k++) {
          if (countries[k].alpha3Code === countries[i].borders[j]) {
            neighbour = countries[k].name;
          }
        }
        allN = allN + '<button type="button" class="btn btn-sm country-btn mb-2 mr-2">' + neighbour + '</button>';
      }

      if (countries[i].latlng[0] >= 0)
        lat = (countries[i].latlng[0]).toFixed(2) + "° N";
      else
        lat = (-countries[i].latlng[0]).toFixed(2) + "° S";

      if (countries[i].latlng[1] >= 0)
        lng = (countries[i].latlng[1]).toFixed(2) + "° E";
      else
        lng = (-countries[i].latlng[1]).toFixed(2) + "° W";
      coordinates = "<span>" + lat + "</span>" + ", " + "<span>" + lng + "</span>";
      document.querySelector("#coord").innerHTML = '<span class="country-info">Coordinates: </span>' + coordinates;
      document.querySelector("#calling-codes").innerHTML = '<span class="country-info">Calling Codes: </span>' + codes;

      for (var j = 0; j < countries[i].timezones.length; j++) {
        if (j === countries[i].timezones.length - 1)
          time = time + countries[i].timezones[j];
        else
          time = time + countries[i].timezones[j] + ", ";
      }
      document.querySelector("#timezone").innerHTML = '<span class="country-info">Timezones: </span>' + time;

      if (domain === "")
        document.querySelector("#domain").innerHTML = '<span class="country-info">Top Level Domain: </span>N/A';
      else
        document.querySelector("#domain").innerHTML = '<span class="country-info">Top Level Domain: </span>' + domain;

      if (currency === "")
        document.querySelector("#currency").innerHTML = '<span class="country-info">Currencies: </span>N/A';
      else
        document.querySelector("#currency").innerHTML = '<span class="country-info">Currencies: </span>' + currency;

      if (language === "")
        document.querySelector("#language").innerHTML = '<span class="country-info">Languages: </span>N/A';
      else
        document.querySelector("#language").innerHTML = '<span class="country-info">Languages: </span>' + languages;

      if (allN === "")
        document.querySelector("#neighbour").innerHTML = '<span class="country-info mr-2">Border Countries: Nil</span>';
      else
        document.querySelector("#neighbour").innerHTML = '<span class="country-info mr-2">Border Countries: </span>' + allN;
    }
  }
  borderCountries = document.querySelectorAll("button.country-btn");
  for (var i = 0; i < borderCountries.length; i++) {
    borderCountries[i].addEventListener("click", function () {
      $("#extra").slideUp("4000");
      document.body.classList.remove("no-scroll");
      searchBox.value = this.textContent;
      window.scrollTo(0, 0);
      document.getElementById("dropdownSearchButton").textContent = "Country";
      generalSearch("name", "");
    });
  }
}

function hideAll() {
  for (var i = 0; i < countryCards.length; i++) {
    document.getElementById(countryCards[i]).classList.add("d-none");
  }
}

function showAll() {
  for (var i = 0; i < countryCards.length; i++) {
    document.getElementById(countryCards[i]).classList.remove("d-none");
  }
}

function initializeIndices(countries) {
  for (var i = 0; i < countries.length; i++) {
    index[i] = i;
  }
  shuffle();
}

function shuffle() {
  var j, x, i;
  for (i = index.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = index[i];
    index[i] = index[j];
    index[j] = x;
  }
}
