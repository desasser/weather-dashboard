//TODO: Provide form for users to input data
    //TODO: Input for city inside of form
    //TODO: Search button functionality as well with magnifying glass image

//TODO: Fetch current and future conditions for city
    //TODO: BONUS: Button to toggle between metric and imperial
//TODO: Current city results should present

        //TODO: Coloration for if conditions are favorable (green), moderate (yellow), or severe (red)
    //TODO: BONUS: Air Pollution with color scale

//TODO: Future weather results should present
    //TODO: Five day forecast with
        //TODO: Date
        //TODO: Icon for weather (FA/weather api)
        //TODO: Temp
        //TODO: Humidity

//TODO: Add city to search history and store for later searching
    //TODO: BONUS: Toggle functionality to hide and expand search history

    //declare variables for button click/submit event
    var thisSearch = '';
    //TODO: Bring thas back
    // var searchHistArr = JSON.parse(localStorage.getItem("history")) || [];
    var liEl = $("<li>");

    var now = moment().format('dddd, MMMM Do YYYY');

    //TODO: How do I get this to work on both the button and the input at the same time?
        //Option 1 - make guts a function and call the function with two .on commands
        //Option 2 - direct everything within the form to the same thing if XX happens
        //Option 3 - Write the same code twice with two trigger commands
    //TODO: If I use a form, the button ends up on the second line
        //$("form").on("submit", function(event)

    $("#button-search").on("click", function(event) {
        //prevent refresh on submit
        event.preventDefault();

        //if input is blank, return without doing anything
        if ($("#input-flavor").val() === '') {
            return;
        }
        
        //save input text
        thisSearch = $("#input-flavor").val();
        

        //append to page in .list-group
        var liEl = $("<li>");
        $(liEl).text(thisSearch)
        $(liEl).addClass("list-group-item")
        $(".list-group").append(liEl);
        
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
        }).then(function(response) {
            // console.log(response);

            var lat = response.coord.lat;
            var long = response.coord.lon;
            // console.log(lat,long);

            var queryURLOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=miutely,hourly,alerts&appid=677d25f5725630dee0d3fb96edd1516f`;
            // console.log(queryURLOneCall);

            //ajax call taking coords from previous call and feeding them into the onecall functionality of the weather API to extract all necessary data
            $.ajax({
                url: queryURLOneCall,
                method: "GET"
            }).then(function(responseToo){
                console.log(responseToo)

                //TODO: City Name
                $("#other-space").append(thisSearch);
                console.log(thisSearch);
                //TODO: Date
                $("#other-space").append(now);
                console.log(now);
                //TODO: Icon for weather conditions (font-awesome or weatherapi?)
                var icon = responseToo.current.weather[0].icon;
                var iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`
                $("#other-space").append(iconURL);
                console.log(icon);
                //TODO: Temp
                //TODO: Humidity
                //TODO: Wind speed
                //TODO: UV Index
                                
            })

        })

    })

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
//TODO: When opening site, should display last searched city forecast

//TODO: BONUS BONUS: Add a dopler from the area you are searching

