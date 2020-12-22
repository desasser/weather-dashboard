//declare variables for button click/submit event
var thisSearch = '';
var liEl = $("<li>");
var currentTime = moment().format('HH');
var now = moment().format('dddd, MM/DD/YY');

var storedCities = JSON.parse(localStorage.getItem("saved-cities")) || [];

var currentCity = '';

//do not show the clear button on page load if there is no previous search history
clearBtn();

//populate the search history column
for (var i = 0; i < storedCities.length; i++) {
    var liEl = $("<li>");
    var buttonEl = $("<button>");

    $(buttonEl).text(storedCities[i])
    $(liEl).addClass("list-group-item")
    $(liEl).append(buttonEl);
    $(".list-group").prepend(liEl);
}

//TODO: Bonus Stuff
//Set keypress - key 13 (enter) to do the same thing as click
//How to set dark/light mode?
//I'd like to have the card background dark with white text at night
//and light with dark text during the day (based on if statement)
//Button to toggle between metric and imperial
//Toggle functionality to hide and expand search history
//Air Pollution with color scale
//Add a doppler from the area you are searching
$("#button-search").on("click", function () {
    //prevent refresh on submit
    // event.preventDefault();

    //if input is blank, return without doing anything
    if ($("#input-flavor").val() === '') {
        return;
    }

    $(".future-forecast").empty();

    //save input text and convert to first letter capitalized
    //city
    thisSearch = $("#input-flavor").val();
    thisSearch = thisSearch.toLowerCase();

    //snippet found from stack overflow
    //TODO: reference name stored in response instead
    //TODO: use return from function
    thisSearch = thisSearch.charAt(0).toUpperCase() + thisSearch.slice(1);

    if (!storedCities.includes(thisSearch)) {
        //prepends the latest search to the search history as a list item
        var liElToo = $("<li>");
        $(liElToo).text(thisSearch)
        $(liElToo).addClass("list-group-item")
        $(".list-group").prepend(liElToo);

        storedCities.push(thisSearch);
        localStorage.setItem("saved-cities", JSON.stringify(storedCities));
    }

    //check to see if a city was added to the search history, if yes show the button, if no button remains hidden
    clearBtn();

    //clear input field
    $("#input-flavor").val('')

    //call function below here and accept the response.name return from the function
    currentCity = currentWeather(thisSearch);

    console.log(currentCity);
});


$(".list-group").on("click", "li", function () {
    var whichCity = $(this).text();

    //clear future cards
    $(".future-forecast").empty();

    //call weather function
    currentWeather(whichCity);
});

function currentWeather(city) {
    //call weather API to pull up weather info from openweather API
    //TODO: Add toggle for city search, city and state search, city, state, and country search
    var queryURLCityCall = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=677d25f5725630dee0d3fb96edd1516f`

    //declare variable cityName to store name data from API response
    var cityName = '';

    //ajax call utilizing current weather API to extract lat/long data
    //save lat/long into var coords
    //feed coords into One Call to get current/future forecast
    $.ajax({
        url: queryURLCityCall,
        method: "GET"
    }).then(function (response) {
        cityName = response.name;
        console.log(cityName);
        var lat = response.coord.lat;
        var long = response.coord.lon;

        //query url for the one call open weather api
        var queryURLOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=miutely,hourly,alerts&units=imperial&appid=677d25f5725630dee0d3fb96edd1516f`;

        //ajax call taking coords from previous call and feeding them into the onecall functionality of the weather API to extract all necessary data
        $.ajax({
            url: queryURLOneCall,
            method: "GET"
        }).then(function (responseToo) {
            //declare variables for current data
            var icon = responseToo.current.weather[0].icon;
            var iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`
            var temp = responseToo.current.temp;
            var humidity = responseToo.current.humidity;
            var windSpd = responseToo.current.wind_speed;
            //TODO: var windDir = responseToo.current.wind_deg;
            var uvInd = responseToo.daily[0].uvi;
            var iconImage = $("<img>");
            iconImage.attr('src', iconURL)

            $("#city-name").text(city + ' -- ' + now)
            $("#city-name").append(iconImage);
            $("#p-temp").text(`Temperature: ${temp} \u00b0F`);
            $("#p-humid").text(`Humidity: ${humidity}% humidity`);
            $("#p-wind-speed").text(`Wind Speed: ${windSpd} mph`);
            //TODO: convert wind direction into North, South, East, West

            //Set up style for UV index and change the background color of the container based on value
            //TODO: change this from a button
            //TODO: call is maybe not accurate?
            $("#p-UV").html(`UV Index: <button id="uvWrapper">${uvInd}</button>`);
            if (uvInd > 6) {
                $("#uvWrapper").css("background-color", "FF4848")
            } else if (3 < uvInd >= 6) {
                $("#uvWrapper").css("background-color", "#FFFF66")
            } else {
                $("#uvWrapper").css("background-color", "#ADFF2F")
            }

            //generate future weather cards
            for (i = 0; i < 5; i++) {
                futureWeather(i, responseToo);
            };
        })
        return cityName;
    })
    

}

function futureWeather(day, responseToo) {
    //declare vars for future data
    var futureIcon = responseToo.daily[day].weather[0].icon;
    var futureIconURL = `http://openweathermap.org/img/wn/${futureIcon}@2x.png`;
    var futureTempMax = responseToo.daily[day].temp.max;
    var futureTempMin = responseToo.daily[day].temp.min;
    var futureHumidity = responseToo.daily[day].humidity;
    var futureIconImage = $("<img>");
    futureIconImage.attr('src', futureIconURL)

    //declare var for tomorrow's date
    var tomorrow = moment().add(day, 'days').format('MM/DD/YY');

    //declare var for adding the cards for future weather info
    var futureDiv = $("<div>");
    futureDiv.addClass('future-flavor col-md-2');

    //set the date to the future cards
    var futureDate = $("<h5>");
    futureDate.text(tomorrow);

    //put the date on the card
    futureDiv.append(futureDate);

    //put the icon on the card
    futureDiv.append(futureIconImage);

    //put max and min temp on the card
    var tempBlockHigh = $("<p>")
    tempBlockHigh.text(`High: ${futureTempMax}`);
    futureDiv.append(tempBlockHigh);

    var tempBlockLow = $("<p>")
    tempBlockLow.text(`Low: ${futureTempMin}`);
    futureDiv.append(tempBlockLow);

    //put humidity on the card
    var humidityBlock = $("<p>");
    humidityBlock.text(`Humidity: ${futureHumidity}%`);
    futureDiv.append(humidityBlock);

    //put the card on the correct place on the page
    $(".future-forecast").append(futureDiv);
}

//create clear button to wipe out search history
var buttonEl = $("<button>");
//TODO: cant get this stupid button to shift right
$(buttonEl).addClass("btn btn-info d-flex align-items-end clearMe");
$(buttonEl).text("Clear");
$(".clear-button").append(buttonEl);

//Checks to see if the clear button should be hidden or visible
function clearBtn() {
    if (storedCities.length == 0) {
        $(".clear-button").css('visibility', 'hidden');
    } else {
        $(".clear-button").css('visibility', 'visible');
    }
}

$(".clearMe").on("click", function () {
    localStorage.clear();
    $(".list-group").empty();
    storedCities = [];

    //Once the clear button is clicked, this button should be hidden
    clearBtn();
});

