var ViewModel = require("./main-view-model");
var frameModule = require("ui/frame");
var statusBar = require("nativescript-status-bar");
var page, sideDrawer, searchBar;

exports.loaded = function(args){
    page = args.object;
    page.bindingContext = ViewModel.createViewModel();
    
    statusBar.hide();
    sideDrawer = page.getViewById("sideDrawer");
    searchBar = page.getViewById("searchBar");

    if (frameModule.topmost().ios) {
        searchBar.ios.barStyle = UIBarStyle.Black;
        searchBar.ios.translucent = true;
        searchBar.ios.searchBarStyle = UISearchBarStyle.Minimal;

        sideDrawer.ios.defaultSideDrawer.style.shadowMode = TKSideDrawerShadowMode.TKSideDrawerShadowModeSideDrawer;
        sideDrawer.ios.defaultSideDrawer.style.blurEffect = UIBlurEffectStyle.Dark;
        sideDrawer.ios.defaultSideDrawer.style.blurType = TKSideDrawerBlurType.TKSideDrawerBlurTypeDynamic;
    }
    else {
        var parent = page.getViewById('searchLayout');
        if (parent.android) {
            parent.android.setFocusableInTouchMode(true);
            parent.android.setFocusable(true);
            searchBar.android.clearFocus();
        }
    }
};

var isOpen = false;
exports.showDetails = function(args){
    var detailsWidget = page.getViewById("detailsWidget");
    if(detailsWidget.className === "fade-slide-in")
        detailsWidget.className = "fade-slide-out";
    else
        detailsWidget.className = "fade-slide-in";

    console.log(detailsWidget.className);
    /*if(isOpen){
        isOpen = false;
        detailsWidget.animate({
            translate: { x: 0, y: 250},
            opacity: 0,
            duration: 1000
        });
    }else{
        isOpen=true;
        detailsWidget.animate({
            translate: { x: 0, y: 0},
            opacity: 1,
            duration: 1000
        });
    }*/
}


exports.toggleDrawer = function(args) {
    sideDrawer.toggleDrawerState();
};

exports.showSettings = function(args) {
    var topmost = frameModule.topmost();
    
     if (frameModule.topmost().ios) {
        var navigationEntry = {
            moduleName: "info-page",
            animated:true,
            transition: {
                name: "fade",
                duration: 600
            }
        };
        topmost.navigate(navigationEntry);
     }
     else{
         var navigationEntry = {
            moduleName: "info-page",
            animated:false
        };
        topmost.navigate(navigationEntry);
     }
};

exports.onItemLoading = function(args) {
    if (frameModule.topmost().ios) {
        var cell = args.ios;
        cell.selectionStyle = UITableViewCellSelectionStyle.UITableViewCellSelectionStyleNone;
        cell.backgroundColor = UIColor.clearColor();
    }
}