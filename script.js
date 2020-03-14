// Define the URL's
var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
var uviQueryURL = "https://api.openweathermap.org/data/2.5/uvi?";

// Set up the API key
var APIkey = "b6287be4ebab18736c328d82d49a11bb";

// load local storage object for recent searched cities
var recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

// Define variables
function renderRecentCities() {

    // Clear the List Items
    $("#recentCities").empty();

    // Scan the array
    recentCities.forEach(element => {
        // Create a liste item 
        var aListItem = $("<li>");

        // Create a button
        var aButton = $("<button>");

        // Add Bulma classes to button to make it look good!
        aButton.addClass("button is-outlined is-fullwidth");

        // Add an attribute we can later interogate
        aButton.attr("data-city", element);

        // Add text of City Name
        aButton.text(element);

        // Add an On click event to the button
        aButton.on("click", function () {
            renderWeather($(this).attr("data-city"));
        });

        // Append to the list item
        aListItem.append(aButton);

        // Append list item to list
        $("#recentCities").append(aListItem);
    });
}


function renderWeather(city) {

    // Call weatherQueryURL
    $.ajax({
            url: weatherQueryURL + city + "&appid=" + APIkey + "&units=metric",
            method: "GET"

        }).then(function (response) {
            console.log("Current");
            console.log(response);
            var coordinates = response.coord;
            // Call uviQueryURL
            $.ajax({
                    url: uviQueryURL + city + "&appid=" + APIkey + "&units=metric" + "&lat=" + coordinates.lat + "&lon=" + coordinates.lon,
                    method: "GET"

                }).then(function (response) {
                    console.log("UVI ");
                    console.log(response);
                })
                .catch(function (error) {
                    console.log("Got error");
                    console.log(error);
                });
        })
        .catch(function (error) {

        });

    // Call forecastQueryURL
    $.ajax({
            url: forecastQueryURL + city + "&appid=" + APIkey + "&units=metric",
            method: "GET"

        }).then(function (response) {
            console.log("5 day");
            console.log(response);
        })
        .catch(function (error) {

        });
}

// Set up search of click event on search box
$("#searchButton").on("click", function () {

    // Call the API's and get the data
    let city = $("#citySearch").val();
    $.ajax({
            // Query the Weather URL, check if city is a valid city
            url: weatherQueryURL + city + "&appid=" + APIkey + "&units=metric",
            method: "GET"
        })
        .then(function (response) {
            // Push city onto arry of recentCities
            recentCities.push(city);

            // Render list of buttons
            renderRecentCities();

            // Render Weather data
            renderWeather(city);

            console.log(response);
        })
        .catch(function (error) {
            if (error.status === 404) {
                // City name forms part of URL, therefore alert user if they entered invalid city name
                // Because this is a URL parameter, an invalid city name will generate a 404 error (Resource not found)
                alert("That city was not found, please check spelling and try again");
            }
            // Write error object to log
            console.log(error);
        });
});