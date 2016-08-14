
$( document ).ready(function() {
(function() {
    var button = document.getElementById("unit");
    var backgroundPicture = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/clear.jpg"; // set default background picture.
    var cityName = "";
    var regionName = "";
    var countryName = "";
    var latitude = "";
    var longitude = "";
    var countryUnits = "metric"; // set default measurement system to metric.
    var temperature = "";
    var windSpeed = "";
    var windDirection = "";
    var humidity = "";
    var pressure = "";
    var pressureSymbol = "kPa"; // set default pressure units.
    var sunrise = "";
    var sunset = "";
    var currentWeather = "";
    var tempSymbol = "C"; // set default temperature units.
    var windSymbol = 'km/h'; // set default wind speed units.
    var iconURL = "";


    function locationByIP() {

     $.getJSON('http://ipinfo.io/json', null, function(json, textStatus) {

         var locationObj = JSON.stringify(json);

         console.log("Ajax response is :" + locationObj);

         console.log("textStatus :" + textStatus);

         try {
             cityName = json.city;
             console.log('city is' + locationObj);
             console.log('city is' + json.city);
             regionName = json.region;
             countryName = json.country;
             var coordinates = json.loc.split(",");
             latitude = Number(coordinates[0]);
             longitude = Number(coordinates[1]);
             setCountryUnits();
             getWeatherData();
         } catch (e) {
             // statements
             console.log(e);
         }
     });

 }


    /* function setCountryUnits() determines if user's country uses imperial or metric units of measure. */
    function setCountryUnits() {
        // body...  
        if (countryName === "US" || countryName === "LY") { // in year 2016 only USA and Libya not metric.

            countryUnits = "imperial";

        }
    }



function getWeatherData() {

    var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + // build query url.
        longitude + '&APPID=936e860c72edb8cb527707e7d59da1ea' +
        '&units=' + countryUnits + '&preventCache=' + new Date(); // build query url

    $.getJSON(url, null, function(json, textStatus) {

        console.log("weather info " + JSON.stringify(json) + "response Satus is " + textStatus);
        processresponse(json);

    });
}





 /* function processResponse() receives local weather data and updates weather data variables. */
function processresponse(weatherObj) {
    // body...  
    temperature = weatherObj.main.temp;
    if (countryUnits === "metric") {
        windSpeed = Math.round(weatherObj.wind.speed * 18 / 5); // convert meter/sec to km/hour. (metric)
        pressure = Math.round(weatherObj.main.pressure) / 10; // convert to kPa from hPa. (metric)
    } else {
        windSpeed = Math.round(weatherObj.wind.speed);
        pressure = Math.round(weatherObj.main.pressure);
    }

    windDirection = degreeToCardinal(weatherObj.wind.deg);
    currentWeather = weatherObj.weather[0].description;
    humidity = weatherObj.main.humidity;
    var sunriseDateObj = unixTimeToLocal(weatherObj.sys.sunrise);
    sunrise = sunriseDateObj.toLocaleTimeString();
    var sunsetDateObj = unixTimeToLocal(weatherObj.sys.sunset);
    sunset = sunsetDateObj.toLocaleTimeString();
    iconURL = 'http://openweathermap.org/img/w/' + weatherObj.weather[0].icon + '.png';
    weatherPicture(); // set appropriate background picture to local weather conditions.
    displayRefresh();

}

function displayRefresh(argument) {
 
    $("#city").html(cityName);
    $("#country").html(regionName + " , " + countryName);
    $("#temperature").html(temperature);
    $("#degreeSymbol").html("&deg;" + tempSymbol);
    $("#conditions").html(currentWeather);
    $("#winds").html("Winds " + windDirection + " " + windSpeed + " " + windSymbol);
    $("#pressure").html("Barometric Pressure: " + pressure + " " + pressureSymbol);
    $("#humidity").html("Humidity: " + humidity + "%");
    $("#sunrise").html("Sunrise at " + sunrise);
    $("#sunset").html("Sunset at " + sunset);

    /*   var newElement = document.createElement('img'); // new DOM element for weather icon.
       newElement.src = iconURL;
       newElement.setAttribute("id", "icons");
       document.getElementById("icon").appendChild(newElement);*/
    /* var image = backgroundPicture;
     var referenceMainWrapper = document.getElementById("main-wrapper");
     referenceMainWrapper.style.backgroundImage = 'url(' + image + ')';
     referenceMainWrapper.style.backgroundSize = "100% auto";*/
}


 function toggleUnits() {
    if (countryUnits === 'metric') { // check if currently set to imperial or metric.
            tempSymbol = 'F';
            windSymbol = 'miles/hour';
            countryUnits = 'imperial';
            pressureSymbol = 'mb';
            button.innerHTML = 'Use Metric Units';
            temperature = Math.round((temperature * 9 / 5) + 32); // convert temperature to 'fahrenheit'.
            $("#temperature").html(temperature);
            $("#degreeSymbol").html(" &deg;" + tempSymbol);
            windSpeed = Math.round(windSpeed / 1.609344); // convert wind speed to 'miles/hr'.
            $("#winds").html("Winds " + windDirection + " " + windSpeed + " " + windSymbol);
            pressure = pressure * 10; // convert pressure to 'mb'.
            $("#pressure").html("Barometric Pressure: " + pressure + " " + pressureSymbol);
      } else {
            tempSymbol = 'C';
            countryUnits = 'metric';
            windSymbol = 'km/hour';
            pressureSymbol = 'kPa';
            button.innerHTML = 'Use Imperial Units';
            temperature = Math.round((temperature - 32) * 5 / 9); // convert temperature to 'celsius'.
             $("#temperature").html(temperature);
            $("#degreeSymbol").html(" &deg;" + tempSymbol);
            windSpeed = Math.round(windSpeed * 1.609344); // convert wind speed to 'Km/h'.
             $("#winds").html("Winds " + windDirection + " " + windSpeed + " " + windSymbol);
            pressure = pressure / 10; // convert pressure to'KPa'.
            $("#pressure").html("Barometric Pressure: " + pressure + " " + pressureSymbol);
        }
    }

        /* function unixTimeToLocal() is passed a date set in unix time, and returns a Date object in the user's
     * local time. */
    function unixTimeToLocal(unix) {
        var local = new Date(0);
        local.setUTCSeconds(unix);
        return local;
    }

  /* function degreeToCardinal() is passed a direction in degrees, and returns a cardinal direction. */
    function degreeToCardinal(degree) {
       
         if (degree >= 11.25 && degree<=33.75) {
            return "NNE";
        } else if (degree >= 33.75 || degree <= 56.25) {
            return "ENE";
        } else if (degree >= 56.25  || degree <= 78.75) {
            return "E";
        } else if (degree >= 78.75 || degree <=  101.25) {
            return "ESE";
        } else if (degree >= 101.25 || degree <= 123.75) {
            return "SE";
        } else if (degree >= 123.75  && degree <= 146.25) {
            return "SSE";
        } else if (degree >= 146.25  && degree <=  168.75) {
            return "S";
        }  else if (degree >= 168.75  && degree <=  191.25) {
            return "SSW";
        }  else if (degree >= 191.25  && degree <= 213.75) {
            return "SW";
        } else if (degree >= 213.75   && degree <=  236.25) {
            return "W";
        } else if (degree >= 236.25   && degree <=  258.75) {
            return "W";
        } else if (degree >= 258.75  && degree <=  281.25) {
            return "WNW";
        } else if (degree >= 281.25  && degree <=  303.75) {
            return "NW";
        }else if (degree >= 303.75   && degree <=  326.25) {
            return "NNW";
        } else if (degree >= 326.25  && degree <=  348.75) {
            return "NNW";
        }else if (degree >= 11.25 && degree <= 360 ){
            return "N";
        }
    }





 /* function weatherPicture() sets the background picture to match the current local weather conditions. */
    function weatherPicture() {
        switch (true) {
            case /\bclear\b/i.test(currentWeather): // match uses regular expression.
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/clear.jpg';
                break;
            case /\bovercast\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/overcast.jpg';
                break;
            case /\bclouds\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/mostly_cloudy.jpg';
                break;
            case /\brain\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/rainy.jpg';
                break;
            case /\bdrizzle\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/rainy.jpg';
                break;
            case /\bthunderstorm\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/thunderstorm.jpg';
                break;
            case /\bsnow\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/snow.jpg';
                break;
            case /\bmist\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/mist.jpg';
                break;
            case /\bfog\b/i.test(currentWeather):
                backgroundPicture = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/368633/mist.jpg';
                break;
        }
    }

$("#unit").click(function() {
    /* Act on the event */
     toggleUnits();
});

     locationByIP();
})();
});