//declare constiables for button click/submit event
let thisSearch = '';
const liEl = $("<li>");
const currentTime = moment().hour();
const now = moment().format('dddd, MM/DD/YY');

const storedCities = JSON.parse(localStorage.getItem("saved-cities")) || [];

let currentCity;

//do not show the clear button on page load if there is no previous search history
clearBtn();

//populate the search history column
for (let i = 0; i < storedCities.length; i++) {
    const liEl = $("<li>");
    $(liEl).text(storedCities[i])
    $(liEl).addClass("list-group-item btn btn-dark list-font")
    $(".list-group").prepend(liEl);
}


//TODO: Display the last city searched and its current weather on load
//TODO: Limit the previous history to 10 cities
//TODO: Bug Fix -- Clear button doesn't load on first search, but does on second search
//TODO: Edge cases, such as searching gibberish or multiple cities with the same name
//TODO: Specific advanced searches (city, state, country)
//TODO: Bonus Stuff - to complete eventually
//Set keypress - key 13 (enter) to do the same thing as click
//Button to toggle between metric and imperial
//Toggle functionality to hide and expand search history
//Air Pollution with color scale - seperate API
//Add a doppler from the area you are searching - separate API
$("#button-search").on("click", function () {
    //if input is blank, return without doing anything
    if ($("#input-flavor").val() === '') {
        return;
    }

    $(".future-forecast").empty();

    //save input text and convert to first letter capitalized
    //city
    thisSearch = $("#input-flavor").val();

    //check to see if a city was added to the search history, if yes show the button, if no button remains hidden
    clearBtn();

    //clear input field
    $("#input-flavor").val('')

    //call function below here and accept the response.name return from the function
    currentWeather(thisSearch);
});


$(".list-group").on("click", "li", function () {
    const whichCity = $(this).text();

    //clear future cards
    $(".future-forecast").empty();

    //call weather function
    currentWeather(whichCity);
});

function currentWeather(city) {
    //call weather API to pull up weather info from openweather API
    const queryURLCityCall = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=677d25f5725630dee0d3fb96edd1516f`

    //ajax call utilizing current weather API to extract lat/long data
    //save lat/long into const coords
    //feed coords into One Call to get current/future forecast
    $.ajax({
        url: queryURLCityCall,
        method: "GET"
    }).then(function (response) {
        currentCity = response.name;
        const lat = response.coord.lat;
        const long = response.coord.lon;

        //query url for the one call open weather api
        const queryURLOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=miutely,hourly,alerts&units=imperial&appid=677d25f5725630dee0d3fb96edd1516f`;

        if (!storedCities.includes(city)) {
            //prepends the latest search to the search history as a list item
            const liElToo = $("<li>");
            $(liElToo).text(response.name)
            $(liElToo).addClass("list-group-item btn btn-dark list-font")
            $(".list-group").prepend(liElToo);
    
            storedCities.push(response.name);
            localStorage.setItem("saved-cities", JSON.stringify(storedCities));
        }

        //ajax call taking coords from previous call and feeding them into the onecall functionality of the weather API to extract all necessary data
        $.ajax({
            url: queryURLOneCall,
            method: "GET"
        }).then(function (responseToo) {
            //declare constiables for current data
            const icon = responseToo.current.weather[0].icon;
            const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`
            const temp = responseToo.current.temp;
            const humidity = responseToo.current.humidity;
            const windSpd = responseToo.current.wind_speed;
            const uvInd = responseToo.daily[0].uvi;
            const iconImage = $("<img>");
            iconImage.attr('src', iconURL)

            $("#city-name").text(currentCity + ' -- ' + now)
            $("#city-name").append(iconImage);
            $("#p-temp").text(`Temperature: ${temp} \u00b0F`);
            $("#p-humid").text(`Humidity: ${humidity}% humidity`);
            $("#p-wind-speed").text(`Wind Speed: ${windSpd} mph`);

            //Set up style for UV index and change the background color of the container based on value
            $("#p-UV").html(`UV Index: <span id="uvWrapper">${uvInd}</span>`);

            if (uvInd > 6) {
                $("#uvWrapper").css("background-color", "FF4848")
            } else if (3 < uvInd && uvInd <= 6) {
                $("#uvWrapper").css("background-color", "#FFFF66")
            } else {
                $("#uvWrapper").css("background-color", "#ADFF2F")
            }

            //display header for the future forecast cards
            $("h5").text('5-Day Forecast: ');

            //generate future weather cards
            for (let i = 0; i < 5; i++) {
                futureWeather(i, responseToo);
            };
        })
    })
    // return cityName;
}

function futureWeather(day, responseToo) {
    //declare consts for future data
    const futureIcon = responseToo.daily[day].weather[0].icon;
    const futureIconURL = `https://openweathermap.org/img/wn/${futureIcon}@2x.png`;
    const futureTempMax = responseToo.daily[day].temp.max;
    const futureTempMin = responseToo.daily[day].temp.min;
    const futureHumidity = responseToo.daily[day].humidity;
    const futureIconImage = $("<img>");
    futureIconImage.attr('src', futureIconURL)

    //declare const for tomorrow's date
    const tomorrow = moment().add(day+1, 'days').format('MM/DD/YY');

    //declare const for adding the cards for future weather info
    const futureDiv = $("<div>");

    if (currentTime >= 6 && currentTime <= 18) {
        futureDiv.addClass('future-flavor-light col-md-2');
    } else {
        futureDiv.addClass('future-flavor-dark col-md-2');
    }

    //set the date to the future cards
    const futureDate = $("<h5>");
    futureDate.text(tomorrow);

    //put the date on the card
    futureDiv.append(futureDate);

    //put the icon on the card
    futureDiv.append(futureIconImage);

    //put max and min temp on the card
    const tempBlockHigh = $("<p>")
    tempBlockHigh.text(`High: ${futureTempMax}`);
    futureDiv.append(tempBlockHigh);

    const tempBlockLow = $("<p>")
    tempBlockLow.text(`Low: ${futureTempMin}`);
    futureDiv.append(tempBlockLow);

    //put humidity on the card
    const humidityBlock = $("<p>");
    humidityBlock.text(`Humidity: ${futureHumidity}%`);
    futureDiv.append(humidityBlock);

    //put the card on the correct place on the page
    $(".future-forecast").append(futureDiv);
}

//create clear button to wipe out search history
const buttonEl = $("<button>");
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