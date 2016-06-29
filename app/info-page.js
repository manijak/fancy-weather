var appSettings = require("application-settings");
var frameModule = require("ui/frame");
var UNIT_SETTING = "userUnit";
var TIME_SETTING = "userTimeFormat";
var indicator,spinner;

exports.navigatingTo = function(args){
    var page = args.object;
    var unitBar = page.getViewById("unitBar");
    var timeBar = page.getViewById("timeBar");
    indicator = args.object.getViewById("indicator");
    spinner = args.object.getViewById("spinner");
    
    var userUnit = appSettings.getString(UNIT_SETTING);
    var timeFormat = appSettings.getNumber(TIME_SETTING);
    console.log(userUnit);
    console.log(timeFormat);

    switch (userUnit) {
        case "si":
            unitBar.selectedIndex = 0;
            break;
        case "us":
            unitBar.selectedIndex = 1;
            break;
        default:
            unitBar.selectedIndex = 0;
            break;
    }

    switch (timeFormat) {
        case 24:
            timeBar.selectedIndex = 0;
            break;
        case 12:
            timeBar.selectedIndex = 1;
            break;
        default:
            timeBar.selectedIndex = 0;
            break;
    }
}

exports.tapBack = function(args){
    indicator.busy = true;
    spinner.animate({ opacity: 1, duration:500 });
    
    var topmost = frameModule.topmost();
    topmost.goBack();
}

exports.unitSelected = function(args){
    console.log("unitSelected called");
    var index = args.newIndex;

    if(index === 0){
        // Metric
        appSettings.setString(UNIT_SETTING, "si");
    }
    else{
        // Imperial
        appSettings.setString(UNIT_SETTING, "us");
    }
}
exports.timeFormatSelected = function(args){
    console.log("timeFormatSelected called");
    var index = args.newIndex;

    if(index === 0){
        // 24-hour
        appSettings.setNumber(TIME_SETTING, 24);
    }
    else{
        // 12-hour
        appSettings.setNumber(TIME_SETTING, 12);
    }
}

