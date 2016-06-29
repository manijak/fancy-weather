var platform = require("platform");
var appSettings = require("application-settings");
var moment = require('../util/moment-timezone-with-data');

exports.getLocale = function(){
    var lang = platform.device.language;
    
    if(lang.length > 2){
        var list = lang.split('-');
        lang = list[0];
    }
    
    console.log("Language: " + lang);
    return lang;
}
exports.getRegion = function(){
    var region = platform.device.region;
    console.log("Region: " + region);
    return region;
}

exports.newLocation = function(){
    return { id:"", city:"", country:"", state:"", lat:"", lng:"" };
}

exports.getTime = function(unixTime, timeFormat, timeZone){
    var timeSettings = appSettings.getNumber("userTimeFormat", 24);

    switch (timeSettings) {
        case 24:
            var time = moment.unix(unixTime).tz(timeZone).locale('nb').format(timeFormat);            
            return time;
        case 12:
            var time = moment.unix(unixTime).tz(timeZone).locale('en').format(timeFormat);            
            return time;
        default:
            var time = moment.unix(unixTime).tz(timeZone).locale('nb').format(timeFormat);            
            return time;
    }
}
exports.getDate = function(unixTime){
    var date = new Date(unixTime * 1000);
    return date;
}

exports.getSpeedUnit = function(unitType){
    switch (unitType) {
        case "si":
            return "m/s";
        case "ca":
            return "km/h";
        case "us":
            return "mph";
        default:
            return "m/s";
    }
}

exports.getWeatherCode = function(conditionName){
    switch (conditionName) {
        case "clear-day":
            return "\uf00d";
        case "clear-night":
            return "\uf02e";
        case "rain":
            return "\uf019";
        case "snow":
            return "\uf01b";
        case "sleet":
            return "\uf0b5";
        case "wind":
            return "\uf050";
        case "fog":
            return "\uf014";
        case "cloudy":
            return "\uf013";
        case "partly-cloudy-day":
            return "\uf002";
        case "partly-cloudy-night":
            return "\uf031";
        case "hail":
            return "\uf015";
        case "thunderstorm":
            return "\uf01e";
        case "tornado":
            return "\uf00d";
        default:
            return "\uf07b";
    }
}