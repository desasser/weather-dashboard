//TODO: Fetch current and future conditions for city

//TODO: Future weather results should present
//TODO: Five day forecast with
//TODO: Date
//TODO: Icon for weather (FA/weather api)
//TODO: Temp
//TODO: Humidity

//declare variables for button click/submit event
var thisSearch = '';
//TODO: Bring this back
// var searchHistArr = JSON.parse(localStorage.getItem("history")) || [];
var liEl = $("<li>");

var currentTime = moment().format('HH');
var now = moment().format('dddd, MM/DD/YY');


//TODO: Bonus Stuff
//How do I get this to work on both the button and the input at the same time?
//Option 1 - make guts a function and call the function with two .on commands
//Option 2 - direct everything within the form to the same thing if XX happens
//Option 3 - Write the same code twice with two trigger commands
//If I use a form, the button ends up on the second line
//$("form").on("submit", function(event)
//How to set dark/light mode?
//I'd like to have the card background dark with white text at night
//and light with dark text during the day (based on if statement)
//Button to toggle between metric and imperial
//Toggle functionality to hide and expand search history
//Air Pollution with color scale
//Add a doppler from the area you are searching
$("#button-search").on("click", function (event) {
    //prevent refresh on submit
    event.preventDefault();

    //if input is blank, return without doing anything
    if ($("#input-flavor").val() === '') {
        return;
    }

    $(".future-forecast").empty();

    //save input text and convert to first letter capitalized
    thisSearch = $("#input-flavor").val();
    thisSearch = thisSearch.toLowerCase();

    //snippet found from stackexchange
    thisSearch = thisSearch.charAt(0).toUpperCase() + thisSearch.slice(1);

    //prepends the latest search to the search history as a list item
    var liEl = $("<li>");
    $(liEl).text(thisSearch)
    $(liEl).addClass("list-group-item")
    $(".list-group").prepend(liEl);

    //TODO: Bring thas back
    //push latest search into array
    // searchHistArr.push(thisSearch);
    // console.log(searchHistArr);
    //TODO: Bring thas back
    // localStorage.setItem("history", JSON.stringify(searchHistArr));

    //clear input field
    $("#input-flavor").val('')

    //call weather API to pull up weather info from openweather API
    //TODO: Can add back in alerts if needed
    var queryURLCityCall = `https://api.openweathermap.org/data/2.5/weather?q=${thisSearch}&appid=677d25f5725630dee0d3fb96edd1516f`
    // console.log(queryURLCityCall);

    //ajax call utilizing current weather API to extract lat/long data
    //save lat/long into var coords
    //feed coords into One Call to get current/future forecast
    $.ajax({
        url: queryURLCityCall,
        method: "GET"
    }).then(function (response) {
        // console.log(response);

        var lat = response.coord.lat;
        var long = response.coord.lon;
        // console.log(lat,long);

        var queryURLOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=miutely,hourly,alerts&units=imperial&appid=677d25f5725630dee0d3fb96edd1516f`;
        // console.log(queryURLOneCall);

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
            var windDir = responseToo.current.wind_deg;
            var uvInd = responseToo.current.uvi;
            var iconImage = $("<img>");
            iconImage.attr('src', iconURL)

            $("#city-name").text(thisSearch + ' -- ' + now)
            $("#city-name").append(iconImage);
            $("#p-temp").text(`Temperature: ${temp} \u00b0F`);
            $("#p-humid").text(`Humidity: ${humidity}% humidity`);
            $("#p-wind-speed").text(`Wind Speed: ${windSpd} mph`);
            //TODO: convert wind direction into North, South, East, West

            //Set up style for UV index and change the background color of the container based on value
            //TODO: The background won't adjust its size
            var uvIndSpan = $("<span>");
            var uvDiv = $("<div>");
            uvIndSpan.text(uvInd);
            uvDiv.addClass('uv-style');
            $("#uv-score").text("UV Index: ");
            if (uvInd > 6) {
                uvDiv.css("background-color", "FF4848")
            } else if (3 < uvInd >= 6) {
                uvDiv.css("background-color", "#FFFF66")
            } else {
                uvDiv.css("background-color", "#ADFF2F")
            }
            uvDiv.append(uvIndSpan);
            $("#uv-score").append(uvDiv);
            console.log(responseToo);
            for (i = 0; i < 5; i++) {
                futureWeather(i, responseToo);
            };
        })

    })

})

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
    var tomorrow = moment().add(day,'days').format('MM/DD/YY');
    console.log(tomorrow);

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

    //When opening site, should display last searched city forecast
    //TODO: Clear results button
    // remove the clear button when the button is clicked again
    // $(".clear-button-wrapper").empty();
    // var buttonEl = $("<button>");
    // $(buttonEl).addClass("btn btn-info");;
    // $(buttonEl).text("Clear");
    // $(".search-history").append(buttonEl);

        //On refresh/load get previous searches from local storage
        //Display them onto page in .search-history
        //TODO: Bring thas back
        // for (var i = 0; i < searchHistArr.length; i++) {
        //     var liElToo = $("<li>");
        //     $(liElToo).text(searchHistArr[i]);
        //     $(liElToo).addClass("list-group-item")
        //     $(".list-group").append(liElToo);
        // }

//TODO: Add click functionality to search history to view conditions again



