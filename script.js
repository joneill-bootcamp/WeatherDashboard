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

        // Append to the list item
        aListItem.append(aButton);

        // Append list item to list
        $("#recentCities").append(aListItem);
    });
}

// Set up search of click event on search box

$("#searchButton").on("click", function () {

    // Call the API's and get the data
    let city = $("#citySearch").val();
    $.ajax({
            url: weatherQueryURL + city + "&appid=" + APIkey + "&units=metric",
            method: "GET"
        })
        .then(function (response) {
            // Push city onto arry of recentCities
            recentCities.push(city);

            // Render list of buttons
            renderRecentCities();

            console.log(response);
        })
        .catch(function (error) {
            alert("got an error!");
        });
});