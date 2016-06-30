var application = require("application");
var platform = require("platform");

var deviceScreenHeight = platform.screen.mainScreen.heightPixels;
var deviceScreenWidth = platform.screen.mainScreen.widthPixels;
console.log(deviceScreenWidth);

if(deviceScreenWidth <= 650 || deviceScreenHeight <= 970){
    application.cssFile = "app.small.css";
}

application.start({ moduleName: "main-page" });
