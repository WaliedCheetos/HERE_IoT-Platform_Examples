//var PDE_ENDPOINT = document.getElementById('endpoint').value;

var drivingSidesByIsoCountryCode = {};

var weekday = new Date().getDay();
var pattern_time = Math.trunc(new Date().getHours() * 4 + new Date().getMinutes() / 15);
var trafficPatternHashMap;
var currentLayers = [];


//function getSpeed(fc, mode, data) { // 0 = free flow speed, 1 = from ref speed, 2 = to ref speed
//    var trafficLayer = 'TRAFFIC_PATTERN_FC' + fc;
//    var trafficData = data[trafficLayer];
//    if (!trafficData || !trafficPatternHashMap) return null; // at startup it takes a moment to load the pattern content
//    if (mode == 0) { // Free flow = Average across the weekdays of the maximum speed of each day. Customers do it differetnly, this is just one possibility.
//        var weekdayList = trafficData.F_WEEKDAY ? trafficData.F_WEEKDAY : trafficData.T_WEEKDAY; // take ony for the free flow computation
//        var freeFlowSpeed = 0;
//        for (var w = 0; weekdayList && w < 7; w++) {
//            var pattern = weekdayList.split(',')[w];
//            var maxSpeedOfDay = 0;
//            for (var d = 0; pattern && d < 96; d++) {
//                if (trafficPatternHashMap[pattern][d] > maxSpeedOfDay) maxSpeedOfDay = trafficPatternHashMap[pattern][d];
//            }
//            freeFlowSpeed += maxSpeedOfDay / 7;
//        }
//        return Math.trunc(freeFlowSpeed);
//    }
//    var weekdayList = mode == 1 ? trafficData.F_WEEKDAY : trafficData.T_WEEKDAY;
//    var pattern = weekdayList ? weekdayList.split(',')[weekday] : null;
//    return pattern ? trafficPatternHashMap[pattern][pattern_time] : null;
//}

//function requestTrafficPattern() {
//    currentLayers.forEach(function (l) {
//        map.removeLayer(l);
//    });
//    for (var fc = 1; fc <= 5; fc++) {
//        var layer = new H.map.layer.ObjectLayer(createPdeObjectProvider(map, {
//            min: 11 + fc,
//            layer: 'ROAD_GEOM_FC' + fc,
//            dataLayers: [{ layer: 'TRAFFIC_PATTERN_FC' + fc }, { layer: 'LINK_ATTRIBUTE_FC' + fc, cols: ['LINK_ID', 'ISO_COUNTRY_CODE', 'TRAVEL_DIRECTION'] }],
//            level: 8 + fc,
//            postProcess: splitMultiDigitized.bind(null, fc),
//            tap: showBubble.bind(null, fc),
//            polylineStyle: trafficBasedStyle.bind(null, fc)
//        }));
//        map.addLayer(layer);
//        currentLayers.push(layer);
//    }
//}

//document.getElementById("_div_TrafficWeekDays").onchange = function (sel) {
//    weekday = parseInt(sel.srcElement.value);
//    requestTrafficPattern();
//};

// time slider initialization
var slider = document.createElement('input');
slider.setAttribute('type', 'range');
slider.setAttribute('orient', 'horizontal');
slider.min = 0;
slider.max = 240;
slider.style.width = "240px";
slider.style.cursor = "pointer";
document.getElementById('_div_TrafficWeekDaysHours').appendChild(slider);
slider.onchange = function () { updateSliderText(slider.value, true) };
slider.onmousemove = function () { updateSliderText(slider.value, false) };
slider.value = 240 * pattern_time / 96;
patternTimeText.innerHTML = "Time: " + new Date().getHours() + ":" + Math.floor(new Date().getMinutes() / 15) * 15 + ". <b><font color=red>Loading Traffic Pattern curves...</font></b>";
document.getElementById("_div_TrafficWeekDays").value = weekday;

function updateSliderText(pos, refreshDisplay) {
    t = (Math.ceil(pos / 240 * 96) / 4);
    hour = Math.floor(t);
    h = t.toFixed(2);
    minutes = (h % 1) * 60;
    pattern_time = Math.ceil(pos / 240 * 96);
    if (pattern_time >= 96) pattern_time = 95;
    if (hour < 10) hour = "0" + hour; // add leading zero to minutes string
    if (minutes === 0) minutes = "00"; // format minutes from 0 to 00
    patternTimeText.innerHTML = "Time: " + hour + ":" + minutes;
    if (refreshDisplay) {
        requestTrafficPattern();
    }
}
