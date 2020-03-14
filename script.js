// Define the URL's
var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
var uviQueryURL = "https://api.openweathermap.org/data/2.5/uvi?";

// Set up the API key
var APIkey = "b6287be4ebab18736c328d82d49a11bb"; // My API key 

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

            // For the UVI Query, we need Longtitude and Latitude, nest AJAX call as information is only for a valid city and he coordinates
            // are therefore contained only in the response object
            var coordinates = response.coord;

            // Display primary weather data
            $("#cityName").text(response.name + ", " + response.sys.country);
            $("#icon").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
            $("#temperature").text("Temperature: " + response.main.temp.toFixed(0) + " c");
            $("#humidity").text("Humidity:    " + response.main.humidity + " %");
            $("#wind").text("Wind Speed:  " + response.wind.speed + " m/sec");

            // Call uviQueryURL
            $.ajax({
                    url: uviQueryURL + city + "&appid=" + APIkey + "&units=metric" + "&lat=" + coordinates.lat + "&lon=" + coordinates.lon,
                    method: "GET"

                }).then(function (response) {
                    console.log("UVI ");
                    console.log(response);
                    // Set the UV Display colour depending on rating
                    // Sourced from https://www.skincancercentres.com.au/blog/what-is-the-uv-index-and-what-does-it-mean
                    var uvIndex = response.value;
                    var colour = "";
                    var narrative = "";
                    switch (true) {
                        case uvIndex <= 2:
                            colour = "green";
                            narrative = "No Protection required"
                            break;
                        case uvIndex >= 3 && uvIndex <= 5:
                            colour = "yellow";
                            narrative = "Protection Required";
                            break;
                        case uvIndex >= 6 && uvIndex <= 7:
                            colour = " orange";
                            narrative = "Protection Required";
                            break;
                        case uvIndex >= 8 && uvIndex <= 10:
                            colour = "red";
                            narrative = "Extra Protection Required";
                            break;
                        case uvIndex >= 11:
                            colour = "violet";
                            narrative = "Extra Protection Required";
                            break;
                    }
                    $("#uvIndex").text(" " + uvIndex + ", " + narrative);
                    $("#uvIndex").css("background-color", colour);
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
            // Push city onto arry of recentCities, but ONLY if the city is not already in the list!
            if (!recentCities.includes(city)) {
                recentCities.push(city);
            }

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