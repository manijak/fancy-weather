var connectivity = require("connectivity");
var Observable = require("data/observable").Observable;
var ObservableArray = require( "data/observable-array").ObservableArray;
var appSettings = require("application-settings");
var http = require("http");
var ForecastModule = require("./util/forecast-icon");
var helper = require("./util/helper");
var moment = require("./util/moment-with-locales.min");
moment.locale(helper.getLocale());

var flickr_api_key = '5e3d8ea6a7f68e02102d9f7213c5a7d2';
var forecastio_api_key = "fdede8fda7b8a9b45d8d495233e4e0f2";
var LAST_USED_LOCATIONS_SETTING = "LAST_USED_LOCATIONS_LIST";

var flickr_photo_api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + flickr_api_key;
var flickr_search_api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickr_api_key;
var flickr_search_api_params = "&group_id=1463451@N25&sort=relevance&media=photos&in_gallery=all&per_page=50&page=1&format=json";

function fetchImage(viewModel) {
    var locationName = "";
    viewModel.set("imgLocationClass", "fade-out");
    //viewModel.set("imgWeatherClass", "fade-out");
    
    if(viewModel.currentLocation.country == "Canada" || viewModel.currentLocation.country == "United States")
        locationName = viewModel.currentLocation.city + " " + viewModel.currentLocation.state;
    else
        locationName = viewModel.currentLocation.city;

    console.log(locationName);
    
    http.getJSON(flickr_search_api_url + flickr_search_api_params + "&text=" + encodeURIComponent(locationName))
        .then(function (r) {
	        if(r.photos.photo.length > 0){
                var photoIndex = Math.floor((Math.random() * (r.photos.photo.length-1)));
                var photoItem = r.photos.photo[photoIndex];
                
                http.getJSON(flickr_photo_api_url + "&photo_id=" + photoItem.id + "&format=json")
                .then(function (response) {
                    var length = response.sizes.size.length;
                    var imgUrl = response.sizes.size[length-2].source;
                    //console.log("Choosen image: ", imgUrl);
                    viewModel.set("bgLocationImage", imgUrl);
                    viewModel.set("imgLocationClass", "fade-in");
                    viewModel.set("bgWeatherImage", "");
                });
            }else{
                viewModel.set("bgWeatherImage", "~/img/" + viewModel.weatherIcon + ".jpg");
                viewModel.set("imgWeatherClass", "fade-in");
                viewModel.set("bgLocationImage", "");
                console.log('No images found for: ' + locationName);
            }
	    }, function (e) {
	        console.log("ERROR:" + e);
            viewModel.set("bgWeatherImage", "~/img/" + viewModel.weatherIcon + ".jpg");
            viewModel.set("bgLocationImage", "");
            viewModel.set("imgWeatherClass", "fade-in");
	    });	
};

function fetchWeather(viewModel){
    var userUnit = appSettings.getString("userUnit", "si");
    console.log("model: " + userUnit);

    var lat = viewModel.currentLocation.lat;
    var lng = viewModel.currentLocation.lng;
    http.getJSON("https://api.forecast.io/forecast/" + forecastio_api_key + "/" + lat + "," + lng + "?units=" + userUnit + "&lang=" + helper.getLocale())
        .then(function (r){
            var currentWeather = r;
            var unit = currentWeather.flags.units;
            var timeZone = currentWeather.timezone;

            currentWeather.hourly.data.forEach(function(hourlyForecast) {
                hourlyForecast.time = helper.getTime(hourlyForecast.time, "LT", timeZone);
                hourlyForecast.temperature = Math.ceil(hourlyForecast.temperature) + "°";
                hourlyForecast.hourlyForecastIcon = ForecastModule.getForecastIcon(hourlyForecast.icon);
            }, this);

            currentWeather.daily.data.forEach(function(dailyForecast) {
                dailyForecast.weekday = moment.unix(dailyForecast.time).format('dddd');
                dailyForecast.time = helper.getTime(dailyForecast.time, "LT", timeZone);
                dailyForecast.hourlyForecastIcon = ForecastModule.getForecastIcon(dailyForecast.icon);
                dailyForecast.temperatureMin = Math.ceil(dailyForecast.temperatureMin)  + "°";
                dailyForecast.temperatureMax = Math.ceil(dailyForecast.temperatureMax) + "°";
                dailyForecast.sunriseTime = helper.getTime(dailyForecast.sunriseTime, "LT", timeZone);
                dailyForecast.sunsetTime = helper.getTime(dailyForecast.sunsetTime, "LT", timeZone);
            }, this);

            currentWeather.currently.humidity = Math.floor(currentWeather.currently.humidity * 100) + ' %';
            currentWeather.currently.temperature = Math.ceil(currentWeather.currently.temperature);
            currentWeather.currently.windSpeed = Math.ceil(currentWeather.currently.windSpeed) + " " + helper.getSpeedUnit(unit);
            viewModel.set("currentWeather", currentWeather);
            viewModel.set("weatherIcon", currentWeather.currently.icon);
            viewModel.set("forecastIcon", ForecastModule.getForecastIcon(currentWeather.currently.icon));
            viewModel.set("refreshing", false);
        });
}

function getLastUsed(){
    var listString = appSettings.getString(LAST_USED_LOCATIONS_SETTING, "[]");
    var list = JSON.parse(listString);
    var lastUsedLocationsObservableArray = new ObservableArray(list);
    return lastUsedLocationsObservableArray;
}
function setDefaultLocation(viewModel){
    var curItem;
    if(viewModel.lastUsedLocations.length > 0)
        curItem = viewModel.lastUsedLocations.getItem(0);
    else 
        curItem = {id:"", city : "New York", country: "USA", state: "NY", lat:"40.7127837", lng:"-74.0059413"}

    viewModel.set("currentLocation", curItem);
}

function createViewModel() {
    //appSettings.clear();
    var viewModel = new Observable();
    viewModel.bgLocationImage = "";
    viewModel.bgWeatherImage = "";
    viewModel.imgLocationClass = "fade-out";
    viewModel.imgWeatherClass = "fade-out";
    viewModel.weatherIcon = "clear-day";
    viewModel.showDrawer = false;
    viewModel.forecastIcon = ForecastModule.getForecastIcon("default");
    viewModel.currentLocation = helper.newLocation();
    viewModel.lastUsedLocations = getLastUsed();
    viewModel.searchResults = new ObservableArray([]);
    viewModel.searchText = "";

    // Search for location
    viewModel.searchLocation = function(){
        var that = this;
        http.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(that.searchText))
        .then(function(r) {
            that.searchResults.length = 0;
            r.results.forEach(function(location) {
                that.searchResults.push(location);
            }, that);
        });
    }

    // Tap on location from search list
    viewModel.selectLocation = function(args) {
        var locationItem = this.searchResults.getItem(args.index);
        var curItem = helper.newLocation();

        locationItem.address_components.forEach(function(addressComponent) {
            if(addressComponent.types.indexOf("locality") != -1)
                curItem.city = addressComponent.short_name;
        
            if(addressComponent.types.indexOf("administrative_area_level_1") != -1)
                curItem.state = addressComponent.long_name;
        
            if(addressComponent.types.indexOf("country") != -1)
                curItem.country = addressComponent.long_name;        
        }, this);

        curItem.id = locationItem.place_id;
        curItem.lat = locationItem.geometry.location.lat;
        curItem.lng = locationItem.geometry.location.lng;
        this.addToLastUsed(curItem);
        this.set("currentLocation", curItem);
        this.set("showDrawer", false);
        
        fetchWeather(this);
        fetchImage(this);
    }

    // Tap on loctaion from last used
    viewModel.selectLastUsedLocation = function(args) {
        var listItem = this.lastUsedLocations.getItem(args.index);
        this.set("currentLocation", listItem);
        
        this.set("showDrawer", false);
        fetchWeather(this);
        fetchImage(this);

        this.lastUsedLocations.unshift(listItem);
        this.lastUsedLocations.splice(args.index+1, 1);

        var stringList = JSON.stringify(this.lastUsedLocations._array);
        appSettings.setString(LAST_USED_LOCATIONS_SETTING, stringList);
    }

    // Add location to history-list
    viewModel.addToLastUsed = function(loctaionItem){
        for(var i = 0; i < this.lastUsedLocations.length; i++){
            if(this.lastUsedLocations._array[i].id === loctaionItem.id){
                console.log("Location found in list, no need to add: ", loctaionItem.city);
                return;
            }
        }

        if(this.lastUsedLocations.length === 10)
            this.lastUsedLocations.pop();
        
        this.lastUsedLocations.unshift(loctaionItem);

        var stringList = JSON.stringify(this.lastUsedLocations._array);
        appSettings.setString(LAST_USED_LOCATIONS_SETTING, stringList);
    }

    viewModel.refreshView = function(args){
        var connectionType = connectivity.getConnectionType();
        if(connectionType !== connectivity.connectionType.none){
            if(this.currentLocation.city === "No connection!")
                setDefaultLocation(this);

            fetchWeather(this);
            fetchImage(this);
        }
        else
            viewModel.set("refreshing", false);
    }


    var connectionType = connectivity.getConnectionType();
    switch (connectionType) {
        case connectivity.connectionType.none:
            viewModel.currentLocation.city = "No connection!";
            viewModel.currentLocation.country = "Please connect to the internet and refresh";
            viewModel.set("currentLocation", viewModel.currentLocation);
            viewModel.set("refreshing", false);
            break;
        default:
            setDefaultLocation(viewModel);
            fetchImage(viewModel);
            fetchWeather(viewModel);
            break;
    }
    return viewModel;
}

exports.createViewModel = createViewModel;