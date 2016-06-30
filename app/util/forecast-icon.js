exports.getForecastIcon = function(conditionCode){
    var forecastIcon = { iconCode1 : "", iconCode2 : "", iconCode3 : "", iconClass1 : "", iconClass2 : "", iconClass3 : "" }

    switch (conditionCode) {
        case "clear-day":
            forecastIcon.iconCode1 = "\uf113";
            forecastIcon.iconClass1 = "sun";
            return forecastIcon;
        case "clear-night":
            forecastIcon.iconCode1 = "\uf10d";
            forecastIcon.iconClass1 = "moon";
            return forecastIcon;
        case "rain":
            forecastIcon.iconCode1 = "\uf105";
            forecastIcon.iconCode2 = "\uf10a";
            forecastIcon.iconClass1 = "cloud";
            forecastIcon.iconClass2 = "rain";
            return forecastIcon;
        case "snow":
            forecastIcon.iconCode1 = "\uf105";
            forecastIcon.iconCode2 = "\uf10b";
            forecastIcon.iconClass1 = "cloud";
            forecastIcon.iconClass2 = "snow";
            return forecastIcon;
        case "sleet":
            forecastIcon.iconCode1 = "\uf105";
            forecastIcon.iconCode2 = "\uf10c";
            forecastIcon.iconClass1 = "cloud";
            forecastIcon.iconClass2 = "snow";
            return forecastIcon;
        case "wind":
            forecastIcon.iconCode1 = "\uf105";
            forecastIcon.iconCode2 = "\uf115";
            forecastIcon.iconClass1 = "cloud";
            forecastIcon.iconClass2 = "cloud";
            return forecastIcon;
        case "fog":
            forecastIcon.iconCode1 = "\uf108";
            forecastIcon.iconClass1 = "cloud";
            return forecastIcon;
        case "cloudy":
            forecastIcon.iconCode1 = "\uf106";
            forecastIcon.iconClass1 = "cloud";
            return forecastIcon;
        case "partly-cloudy-day":
            forecastIcon.iconCode1 = "\uf101";
            forecastIcon.iconCode2 = "\uf106";
            forecastIcon.iconClass1 = "sun";
            forecastIcon.iconClass2 = "cloud";
            return forecastIcon;
        case "partly-cloudy-night":
            forecastIcon.iconCode1 = "\uf100";
            forecastIcon.iconCode2 = "\uf106";
            forecastIcon.iconClass1 = "moon";
            forecastIcon.iconClass2 = "cloud";
            return forecastIcon;
        case "hail":
            forecastIcon.iconCode1 = "\uf105";
            forecastIcon.iconCode2 = "\uf10f";
            forecastIcon.iconClass1 = "cloud";
            forecastIcon.iconClass2 = "cloud";
            return forecastIcon;
        case "thunderstorm":
            forecastIcon.iconCode1 = "\uf105";
            forecastIcon.iconCode2 = "\uf114";
            forecastIcon.iconClass1 = "cloud";
            forecastIcon.iconClass2 = "thunder";
            return forecastIcon;
        case "tornado":
            forecastIcon.iconCode1 = "\uf105";
            forecastIcon.iconCode2 = "\uf114";
            forecastIcon.iconClass1 = "cloud";
            forecastIcon.iconClass2 = "thunder";
            return forecastIcon;
        default:
            forecastIcon.iconCode1 = "\uf108";
            forecastIcon.iconClass1 = "cloud";
            return forecastIcon;
    }
}