$(document).ready(function() {
    (function() {
        var button = document.getElementById("unit");
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
        var ctyName = "";
        var updatedWeather = false;
        var api = "http://api.openweathermap.org/data/2.5/forecast?";
        var id = "&APPID=936e860c72edb8cb527707e7d59da1ea";
        var cnt = "&cnt=4";

        var options = {

            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"

        };

        var background = {
            "01d": "http://www.photos-public-domain.com/wp-content/uploads/2011/02/bright-sun-in-blue-sky.jpg",
            "02d": "http://canitbesaturdaynow.com/images/fpics/1679/033120bd5d2cfd5c05653a107622e41d.jpg",
            "03d": "http://img15.deviantart.net/c199/i/2011/304/e/4/scattered_clouds___stock_by_thy_darkest_hour-d4em598.jpg",
            "04d": "http://bovitz.com/bovitz.com/photo/traditional/jpgphotos/2006/2006-07/Broken-clouds.jpg",
            "09d": "http://4.bp.blogspot.com/-AAS54vTj-V0/TgPob6pfJ0I/AAAAAAAAAYw/_iLZ1qAsEf0/s1600/Rain+falling.jpg",
            "10d": "http://4.bp.blogspot.com/-AAS54vTj-V0/TgPob6pfJ0I/AAAAAAAAAYw/_iLZ1qAsEf0/s1600/Rain+falling.jpg",
            "11d": "http://www.bahrainweather.gov.bh/documents/10716/11884/ThunderStorm.PNG/c3c8cfe8-7def-4b45-8b6d-184c68c7e76f?t=1407405076000",
            "13d": "http://www.vancitybuzz.com/wp-content/uploads/2015/12/shutterstock_315123593-984x500.jpg",
            "50d": "https://tripswithtots.files.wordpress.com/2012/06/d-walking-into-the-mist.jpg",
            "01n": "http://static.wolfire.com/legacy/PhoenixNight.jpg",
            "02n": "https://earthoceanskyredux.files.wordpress.com/2013/06/er1.jpg",
            "03n": "https://trentsthoughts.files.wordpress.com/2011/05/night_sky.jpg",
            "04n": "http://3.bp.blogspot.com/-oHQAaVLuOI4/UfEtlvesXZI/AAAAAAAAWbU/YRKlIbUdNh8/s1600/1+moon.JPG",
            "09n": "https://i.ytimg.com/vi/q76bMs-NwRk/maxresdefault.jpg",
            "10n": "https://i.ytimg.com/vi/q76bMs-NwRk/maxresdefault.jpg",
            "11n": "http://www.bahrainweather.gov.bh/documents/10716/11884/ThunderStorm.PNG/c3c8cfe8-7def-4b45-8b6d-184c68c7e76f?t=1407405076000",
            "13n": "http://api.ning.com/files/kV4MbYiv7oT8dnYIHa3udW295K9IWghHEnroWtZ-lq4QOBdnGX4uFQIUC6oOeDX*oHFTjEuj3wlJRhHpW722NqH8O0Uq4aWN/1082060622.jpeg",
            "50n": "http://img.mota.ru/upload/wallpapers/source/2014/08/07/16/02/41019/028.jpg"
        };


        /*
            Description:
            The toLocaleTimeString() method returns a string with a language sensitive representation of the time portion of this date. The new locales and options arguments let applications specify the language whose formatting conventions should be used and customize the behavior of the function. In older implementations, which ignore the locales and options arguments, the locale used and the form of the string returned are entirely implementation dependent.

            Syntax:
            dateObj.toLocaleTimeString([locales [, options]])
        */

        $(".cur-date").html(new Date().toLocaleTimeString('en-us', options));


    /*
     This function is to find the Location of the user
     */
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
                    console.log("Exception caught in Location by IP : " + e);
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



 /*
     This function is to retrieve the weather information of the given location
     */
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
            weatherPicture(weatherObj.weather[0].icon); // set appropriate background picture to local weather conditions.
            displayRefresh();

        }

       
       /*This function is to populate the html based on the weather Info */
        function displayRefresh(argument) {

            $("#city").html(cityName);
            if (updatedWeather) {
                $("#country").html(countryName);
            } else {
                $("#country").html(regionName + " , " + countryName);
            }

            $("#temperature").html(temperature);
            $("#degreeSymbol").html("&deg;" + tempSymbol);
            $("#conditions").html(currentWeather);
            $("#winds").html("Winds " + windDirection + " " + windSpeed + " " + windSymbol);
            $("#pressure").html("Barometric Pressure: " + pressure + " " + pressureSymbol);
            $("#humidity").html("Humidity: " + humidity + "%");
            $("#sunrise").html("Sunrise at " + sunrise);
            $("#sunset").html("Sunset at " + sunset);

        }

       

/* This function will be triggered once unit button is clicked */

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

            if (degree >= 11.25 && degree <= 33.75) {
                return "NNE";
            } else if (degree >= 33.75 || degree <= 56.25) {
                return "ENE";
            } else if (degree >= 56.25 || degree <= 78.75) {
                return "E";
            } else if (degree >= 78.75 || degree <= 101.25) {
                return "ESE";
            } else if (degree >= 101.25 || degree <= 123.75) {
                return "SE";
            } else if (degree >= 123.75 && degree <= 146.25) {
                return "SSE";
            } else if (degree >= 146.25 && degree <= 168.75) {
                return "S";
            } else if (degree >= 168.75 && degree <= 191.25) {
                return "SSW";
            } else if (degree >= 191.25 && degree <= 213.75) {
                return "SW";
            } else if (degree >= 213.75 && degree <= 236.25) {
                return "W";
            } else if (degree >= 236.25 && degree <= 258.75) {
                return "W";
            } else if (degree >= 258.75 && degree <= 281.25) {
                return "WNW";
            } else if (degree >= 281.25 && degree <= 303.75) {
                return "NW";
            } else if (degree >= 303.75 && degree <= 326.25) {
                return "NNW";
            } else if (degree >= 326.25 && degree <= 348.75) {
                return "NNW";
            } else if (degree >= 11.25 && degree <= 360) {
                return "N";
            }
        }




        /* function weatherPicture() sets the background picture to match the current local weather conditions. */
        function weatherPicture(icon) {

            $("body").css('background-image', 'url(' + background[icon] + ')');

        }


    /*Onclick event for the unit button */
        $("#unit").click(toggleUnits);
           

    /*Onclick event for the submit button */
        $("#submitCity").click(getCityWeather);

  /*To get weather information of the searched city */
        function getCityWeather() {
            console.log("updated city is :" + $("#inputCity").val());
            ctyName = "q=" + $("input").val() + ",";
            getUpdatedWeather();

        }



        function getUpdatedWeather() {

            jQuery.ajax({
                url: api + ctyName + id + cnt,
                dataType: 'json',

                success: function(data, textStatus, xhr) {
                    //called when successful
                    console.log('AJAX Success :' + JSON.stringify(data) + ' text Ststus is :' + textStatus + 'xhr is :' + xhr);
                    if (data.cod === '404') {
                          $('.unableToLocate').css('display','inline');
                          $('.weatherDetailsContainer').css('display','none');
                        $(".unableToLocate").html("Unable to Locate");
                    } else {
                        $('.unableToLocate').css('display','none');
                         $('.weatherDetailsContainer').css('display','inline');
                        latitude = Number(data.city.coord.lat);
                        longitude = Number(data.city.coord.lon);
                        countryName = data.city.country;
                        cityName = data.city.name;
                        updatedWeather = true;
                        setCountryUnits();
                        getWeatherData();
                    }

                },
                error: function(xhr, textStatus, errorThrown) {
                    //called when there is an error
                    console.log("Exception message is " + errorThrown);
                    console.log("URL is " + url);
                    $(".weatherDetailsContainer").html("Unable to Locate");
                },

               /* beforeSend: function() {
                    $("#loc").html("loading...");
                }*/
            });


        }

        locationByIP();
    })();
});
