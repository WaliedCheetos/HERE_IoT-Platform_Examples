import { $, $$, to24HourFormat, formatRangeLabel, toDateInputFormat, loadingFadeIn, loadingFadeOut, getRandomColor } from './helpers.js';
import HourFilter from './HourFilter.js';
import { HEREInitials, AramexInitials } from './config.js';
import { logLevels, writeLog } from './logger.js';
import MapRotation from './MapRotation.js';
import { getCurrentLocation } from './positioning.js';
import { displayStemInOutBounds, calculateStemInOutBounds, setupOnMapTab } from './stemOperations.js'
import { requestRouteInfo, requestReverseGeocodeInfo } from './HERE.js';


//import Search from './Search.js';
//import { getCongestionFactors, getCongestionFactorsByLinkIds, toggleDataSeries} from './TrafficAnalytics.js'


//Height calculations
const height = $('#content-group-1').clientHeight || $('#content-group-1').offsetHeight;
$('.content').style.height = height + 'px';

/* ...
 * Manage initial state and add event listeners
 * ...
 */

//Manage initial state
$('#slider-val').innerText = formatRangeLabel($('#range').value, 'time');
$('#date-value').value = toDateInputFormat(new Date());



//Add event listeners
$$('.isoline-controls').forEach(c => c.onchange = () => calculateStemInOutBounds());
$$('.view-controls').forEach(c => c.onchange = () => calculateView());


/* ...
 * Enable the UI controls
 * ...
 */
//Tab control for sidebar
const tabs = $$('.tab');
tabs.forEach(t => t.onclick = tabify)
function tabify(evt) {
    tabs.forEach(t => t.classList.remove('tab-active'));
    if (evt.target.id === 'tab-1') {
        $('.tab-bar').style.transform = 'translateX(0)';
        evt.target.classList.add('tab-active');
        $('#content-group-1').style.transform = 'translateX(0)';
        $('#content-group-2').style.transform = 'translateX(100%)';
    } else {
        $('.tab-bar').style.transform = 'translateX(100%)';
        evt.target.classList.add('tab-active');
        $('#content-group-1').style.transform = 'translateX(-100%)';
        $('#content-group-2').style.transform = 'translateX(0)';
    }
}

/* ...
 * Switch between map themes
 * ...
 */

//Theme control
const themeTiles = $$('.theme-tile');
themeTiles.forEach(t => t.onclick = tabifyThemes);
function tabifyThemes(evt) {
    themeTiles.forEach(t => t.classList.remove('theme-tile-active'));
    evt.target.classList.add('theme-tile-active');
    if (evt.target.id === 'day') {
        const style = new H.map.Style('https://js.api.here.com/v3/3.1/styles/omv/normal.day.yaml')
        provider.setStyle(style);
    } else {
        //const style = new H.map.Style('../../resources/night.yaml');
        const style = new H.map.Style('https://heremaps.github.io/maps-api-for-javascript-examples/change-style-at-load/data/dark.yaml',
            'https://js.api.here.com/v3/3.1/styles/omv/');
        provider.setStyle(style);
    }
}

/* ...
 * Initialize the platform and map
 * ...
 */

// Initialize HERE Map
const platform = new H.service.Platform({ apikey: HEREInitials.Credentials.APIKey });
const defaultLayers = platform.createDefaultLayers();

const map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
    //center: HEREInitials.Center,
    //zoom: HEREInitials.Zoom,
    pixelRatio: window.devicePixelRatio || 1
});

const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

var mapSettings = ui.getControl('mapsettings');
var zoom = ui.getControl('zoom');
var scalebar = ui.getControl('scalebar');

mapSettings.setAlignment('bottom-right');
zoom.setAlignment('bottom-right');
scalebar.setAlignment('bottom-right');

// this will used to set new styles whenever requested 
// ==> refer to tabifyThemes method
const provider = map.getBaseLayer().getProvider();

//Initialize router and geocoder
const router = platform.getRoutingService();
// Get an instance of the search  service:
var searchService = platform.getSearchService(); 
//const geocoder = platform.getGeocodingService();

var markersGroup = new H.map.Group();
var routesMarkersGroup = new H.map.Group();

map.addObject(routesMarkersGroup);

window.addEventListener('resize', () => map.getViewPort().resize());

setupOnMapTab(map);

// add 'tap' event listener, that opens info bubble, to the group
markersGroup.addEventListener('tap', function (evt) {
    if (bubble != null && bubble.State == 'OPEN')
        bubble.close();

    // event target is the marker itself, group is a parent event target
    // for all objects that it contains
    var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        // read custom data
        content: evt.target.getData()
    });

    //remove infobubbles
    ui.getBubbles().forEach(bub => ui.removeBubble(bub));

    // show info bubble
    ui.addBubble(bubble);

}, false);

//getCurrentLocation();

displayStemInOutBounds();

//We'll want to add the word async before the function to take advantage of the ES6 async/await functionality.
async function calculateRoute(startLocation, destinationLocation) {

    try {
        writeLog(logLevels.info , 'calculateRoute has started.', '');


        //Configure the options object
        const options = {
            mode: $('#car').checked ? 'car' : $('#pedestrian').checked ? 'pedestrian' : 'truck',
            vehicletype: $('#gasoline').checked ? 'gasoline,5.5' : $('#diesel').checked ? 'diesel,5.5' : 'electric',
            traffic: $('#traffic_enabled').checked ? 'enabled' : 'disabled',
            waypoint0: $('#OutboundStem').checked ? startLocation : destinationLocation,
            waypoint1: $('#OutboundStem').checked ? destinationLocation : startLocation,
            date: $('#date-value').value === '' ? toDateInputFormat(new Date()) : $('#date-value').value,
            time: to24HourFormat($('#hour-slider').value),
            routeattributes: 'none,sm,sh,wp'

            //// To retrieve the shape of the route we choose the route
            //// representation mode 'display'
            //representation: 'display',
            //routeAttributes: 'summaryByCountry,summary,shape,boundingBox,legs,notes',
            //legAttributes: 'links',
            //linkAttributes: 'shape,nextLink,functionalClass'
        }


        //So far, we've written the logic to calculate a route. 
        //The next step is to add it to the map.To do this, we'll want to

        //- initialize an empty LineString to hold our route response data.
        //- add the route response data to the linestring.
        //- create a couple of markers for the start, and end of the route object from the route response(and remove the existing route, and markers).
        //- add the polyline, and markers to the map.

        const routesInfo = await requestRouteInfo(options);

        // Log raw times.
        writeLog(logLevels.info, "Base time: " + routesInfo.route[0].summary.baseTime, '');
        writeLog(logLevels.info, "Traffic time: " + routesInfo.route[0].summary.trafficTime, '');

        var randomColorStyle = {
            lineWidth: 7,
            strokeColor: getRandomColor()
        };
        //addRoute2RoutesMarkerGroup(routesInfo.route[0], HEREInitials.Route.Styles.ClassicRouting);
        addRoute2RoutesMarkerGroup(routesInfo.route[0], randomColorStyle);
        return routesInfo.route[0];
    } catch (e) {
        writeLog(logLevels.exception, e.stack, '');
    }
    finally {
        writeLog(logLevels.info, 'calculateRoute has ended.', '');
    }
}

function addRoute2RoutesMarkerGroup(route, routeStyle) {
    try {
        writeLog(logLevels.info, 'addRoutetoMap has started', '');

        var strip = new H.geo.LineString(),
            routeShape = route.shape,
            polyline,
            startMarker,
            destMarker;

        routeShape.forEach(function (point) {
            var parts = point.split(',');
            strip.pushLatLngAlt(parts[0], parts[1]);
        });

        polyline = new H.map.Polyline(strip, {
            //style: HEREInitials.Route.Styles.ClassicRouting
            style: routeStyle
        });

        routesMarkersGroup.addObject(polyline);

            //setTimeout(() => {
            //        map.getViewModel().setLookAtData({
            //            tilt: 0
            //        });
            //}, 300);


            //setTimeout(() => {
            //        map.getViewModel().setLookAtData({
            //            bounds: routesMarkersGroup.getBoundingBox(),
            //            tilt: HEREInitials.Tilt
            //        });
            //}, 300);


        ////get geo bounding box for the group and set it to the map
        //map.getViewModel().setLookAtData({
        //    tilt: 0
        //}, true);



        //setTimeout(() => {
        //    map.getViewModel().setLookAtData({
        //        bounds: routesMarkersGroup.getBoundingBox(),
        //        tilt: HEREInitials.Tilt
        //    });
        //}, 300);


        //get geo bounding box for the group and set it to the map
        map.getViewModel().setLookAtData({
            bounds: routesMarkersGroup.getBoundingBox(),
            tilt: HEREInitials.Tilt
        }, true);

        //var svgMarkup = '<svg  width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
        //    '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="22" />' +
        //    '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
        //    'text-anchor="middle" fill="${STROKE}" >${text}</text></svg>';

        //var startIcon = new H.map.Icon(svgMarkup.replace('${FILL}', 'green').replace('${STROKE}', 'white').replace('${text}', 'S'));
        //startMarker = new H.map.Marker({ lat: route.waypoint[0].originalPosition.latitude, lng: route.waypoint[0].originalPosition.longitude }, {
        //    icon: startIcon,
        //    zIndex: zIndex++
        //});

        //map.addObject(startMarker);

        //var destIcon = new H.map.Icon(svgMarkup.replace('${FILL}', 'blue').replace('${STROKE}', 'white').replace('${text}', 'D'));
        //destMarker = new H.map.Marker({ lat: route.waypoint[1].originalPosition.latitude, lng: route.waypoint[1].originalPosition.longitude }, {
        //    icon: destIcon,
        //    zIndex: zIndex++
        //});

        //map.addObject(destMarker);


    } catch (e) {
        writeLog(logLevels.exception, e.stack, '');
    }
    finally {
        writeLog(logLevels.info, 'addRoutetoMap has ended', '');
    }
}


//We'll want to add the word async before the function to take advantage of the ES6 async/await functionality.
async function calculateReverseGeocode(coordinates) {

    try {
        writeLog(logLevels.info, 'calculateReverseGeocode has started.', '');


        //Configure the options object
        const options = {
            at: coordinates,
            language: $('#english_language').checked ? 'en-US' : 'ar-AE'
        }
        const reverseGeocodeInfo = await requestReverseGeocodeInfo(options);

        // Log raw times.
        writeLog(logLevels.info, "geocode position: " + reverseGeocodeInfo[0].position, '');
        writeLog(logLevels.info, "geocode address: " + reverseGeocodeInfo[0].address.label, '');
        return reverseGeocodeInfo[0];
    } catch (e) {
        writeLog(logLevels.exception, e.stack, '');
    }
    finally {
        writeLog(logLevels.info, 'calculateReverseGeocode has ended.', '');
    }
}

//Initialize the HourFilter
const hourFilter = new HourFilter();


/* ...
 * Add a draggable marker
 * ...
 */
/*
let polygon;
const marker = new H.map.Marker(HEREInitials.Center, { volatility: true });
marker.draggable = true;
map.addObject(marker);

// Add event listeners for marker movement
map.addEventListener('dragstart', evt => {
    if (evt.target instanceof H.map.Marker)
        behavior.disable();
}, false);
map.addEventListener('dragend', evt => {
    if (evt.target instanceof H.map.Marker) {
        behavior.enable();
        calculateIsoline();
    }
}, false);
map.addEventListener('drag', evt => {
    const pointer = evt.currentPointer;
    if (evt.target instanceof H.map.Marker) {
        evt.target.setGeometry(map.screenToGeo(pointer.viewportX, pointer.viewportY));
    }
}, false);
*/

/* ...
 * handle map & marker
 * ...
 */






//We'll want to add the word async before the function to take advantage of the ES6 async/await functionality.


//async function calculateIsoline() {
//    log('calculateIsoline has started.', logLevels.INFO);

//    //Configure the options object
//    const options = {
//        mode: $('#car').checked ? 'car' : $('#pedestrian').checked ? 'pedestrian' : 'truck',
//        range: $('#range').value,
//        rangeType: $('#distance').checked ? 'distance' : 'time',
//        center: marker.getGeometry(),
//        date: $('#date-value').value === '' ? toDateInputFormat(new Date()) : $('#date-value').value,
//        time: to24HourFormat($('#hour-slider').value)
//    }

//    //Limit max ranges
//    if (options.rangeType === 'distance') {
//        if (options.range > HEREInitials.Isoline.MaxRange.distance) {
//            options.range = HEREInitials.Isoline.MaxRange.distance
//        }
//        $('#range').max = HEREInitials.Isoline.MaxRange.distance;
//    } else if (options.rangeType == 'time') {
//        if (options.range > HEREInitials.Isoline.MaxRange.time) {
//            options.range = HEREInitials.Isoline.MaxRange.time
//        }
//        $('#range').max = HEREInitials.Isoline.MaxRange.time;
//    }

//    //Format label
//    $('#slider-val').innerText = formatRangeLabel(options.range, options.rangeType);

//    //Center map to isoline
//    map.setCenter(options.center, true);


//    //So far, we've written the logic to calculate an isoline. 
//    //The next step is to add it to the map.To do this, we'll want to

//    //- initialize an empty LineString to hold our isoline response data.
//    //- add the isoline response data to the linestring.
//    //- create a polygon object from the isoline response(and remove the existing polygon).
//    //- add the polygon to the map.


//    const linestring = new H.geo.LineString();

//    const isolineShape = await requestIsolineShape(options);
//    isolineShape.forEach(p => linestring.pushLatLngAlt.apply(linestring, p));

//    if (polygon !== undefined) {
//        map.removeObject(polygon);
//    }

//    polygon = new H.map.Polygon(linestring, {
//        style: HEREInitials.Isoline.Style
//    });
//    map.addObject(polygon);

//    log('calculateIsoline has ended.', logLevels.INFO);

//    //getCongestionFactorsByLinkIds('1046653493,117941152,972169167,1035082656,1035082655,1194383356', HEREInitials.TrafficCongestionTimePatterns.PerDay, 1);
//    //getCongestionFactorsByLinkIds('1046653493,117941152,972169167,1035082656,1035082655,1194383356', HEREInitials.TrafficCongestionTimePatterns.PerHour, 1);

//    getCongestionFactors();
    

///* ...
//* Create the bar chart
//* ...
//*/

//    //Enable bar graph for car and time options
//    if (options.mode === 'car' && options.rangeType === 'time') {
//        const promises = [];
//        for (let i = 0; i < 24; i++) {
//            options.time = to24HourFormat(i);
//            promises.push(requestIsolineShape(options))
//        }
//        const polygons = await Promise.all(promises);
//        const areas = polygons.map(x => turf.area(turf.polygon([x])));
//        hourFilter.setData(areas);
//    } else {
//        hourFilter.hideData();
//    }
//}

/* ...
* Enable automatic map rotation
* ...
*/

const rotation = new MapRotation(map);

function calculateView() {
    const options = {
        theme: $('#day').checked ? 'day' : 'night',
        static: $('#static').checked
    }
    if (options.static) {
        rotation.stop();
    } else {
        rotation.start();
    }
}


//new Search(HEREInitials.Geocoding.InitialAddress);


$('#stem_Inbound').onclick = function () {
    calculateStemInOutBounds();
}




export { map, router, searchService, calculateStemInOutBounds, markersGroup, routesMarkersGroup, calculateRoute }
