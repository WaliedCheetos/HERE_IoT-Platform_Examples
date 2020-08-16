import { $, $$, to24HourFormat, formatRangeLabel, toDateInputFormat, logLevels, log } from './helpers.js';
//import { center, hereCredentials } from './config.js';
import { HEREInitials } from './config.js';
import { requestIsolineShape, requestRouteInfo } from './HERE.js';
import HourFilter from './HourFilter.js';
import MapRotation from './MapRotation.js';
import Search from './Search.js';
import { getCongestionFactors, getCongestionFactorsByLinkIds, toggleDataSeries } from './TrafficAnalytics.js';

import  PDEManager  from './HERE_PDEManager.js';
import { trafficIcons, trafficImages, trafficSigns } from './TrafficIcons.js';
import { startStopRouteSimulation } from './RouteSimulator.js';




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
$$('.isoline-controls').forEach(c => c.onchange = () => {
    group.removeAll();
    calculateIsoline();
    calculateRoute();
    make_QRCode();
});

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
        //const style = new H.map.Style('../resources/night.yaml');
        const style = new H.map.Style('https://heremaps.github.io/maps-api-for-javascript-examples/change-style-at-load/data/dark.yaml',
            'https://js.api.here.com/v3/3.1/styles/omv/');
        provider.setStyle(style);
    }
}

document.getElementById('simulateRouteButton').addEventListener("click", function () {
    try {
        log('simulateRouteButton click event has started.', logLevels.INFO);
        startStopRouteSimulation();
    } catch (e) {
        log(e, logLevels.ERROR);
    }finally {
        log('simulateRouteButton click event has ended.', logLevels.INFO);
    }
});


/* ...
 * Initialize the platform and map
 * ...
 */

// Initialize HERE Map
//const platform = new H.service.Platform({ apikey: hereCredentials.apikey });
const platform = new H.service.Platform({ apikey: HEREInitials.Credentials.APIKey });
const defaultLayers = platform.createDefaultLayers();
//const map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
//    center,
//    zoom: 12,
//    pixelRatio: window.devicePixelRatio || 1
//});

const map = new H.Map(
    document.getElementById('map'),
    defaultLayers.vector.normal.map, {
    center: HEREInitials.Center,
    zoom: HEREInitials.Zoom,
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

const provider = map.getBaseLayer().getProvider();

//Initialize router and geocoder
const router = platform.getRoutingService();
const geocoder = platform.getGeocodingService();

window.addEventListener('resize', () => map.getViewPort().resize());






/* ...
 * Add a draggable marker
 * ...
 */
let group = new H.map.Group();
let polygon;
let routeLine;
// object with all route points
let currentRouteStrip;
let routeShape;
let routeStartPointMarker;
let routeEndPointMarker;
const tempMarker = new H.map.Marker(HEREInitials.Center);
const marker = new H.map.Marker(HEREInitials.Center, { volatility: true, icon: HEREInitials.Markers.Icons.DefaultIcon });
marker.draggable = true;
map.addObject(marker);


// Helper to set correct state to route simulation button
function checkRouteSimulationButtonEnabledState() {
    if (routeShape.length == 0) {
        document.getElementById("simulateRouteButton").disabled = true;
    }
    else {
        document.getElementById("simulateRouteButton").disabled = false;
    }
}

// Add event listeners for marker movement
map.addEventListener('dragstart', evt => {
    if (evt.target instanceof H.map.Marker) behavior.disable();
}, false);
map.addEventListener('dragend', evt => {
    if (evt.target instanceof H.map.Marker) {
        behavior.enable();
        group.removeAll();
        calculateIsoline();
        calculateRoute();
        make_QRCode();
    }
}, false);
map.addEventListener('drag', evt => {
    const pointer = evt.currentPointer;
    if (evt.target instanceof H.map.Marker) {
        evt.target.setGeometry(map.screenToGeo(pointer.viewportX, pointer.viewportY));
    }
}, false);

/* ...
 * handle map & marker
 * ...
 */

//Initialize the HourFilter
const hourFilter = new HourFilter();

//We'll want to add the word async before the function to take advantage of the ES6 async/await functionality.
async function calculateIsoline() {
    log('calculateIsoline has started.', logLevels.INFO);

    //Configure the options object
    const options = {
        mode: $('#car').checked ? 'car' : $('#pedestrian').checked ? 'pedestrian' : 'truck',
        range: $('#range').value,
        rangeType: $('#distance').checked ? 'distance' : 'time',
        center: marker.getGeometry(),
        date: $('#date-value').value === '' ? toDateInputFormat(new Date()) : $('#date-value').value,
        time: to24HourFormat($('#hour-slider').value)
    }

    //Limit max ranges
    if (options.rangeType === 'distance') {
        if (options.range > HEREInitials.Isoline.MaxRange.distance) {
            options.range = HEREInitials.Isoline.MaxRange.distance
        }
        $('#range').max = HEREInitials.Isoline.MaxRange.distance;
    } else if (options.rangeType == 'time') {
        if (options.range > HEREInitials.Isoline.MaxRange.time) {
            options.range = HEREInitials.Isoline.MaxRange.time
        }
        $('#range').max = HEREInitials.Isoline.MaxRange.time;
    }

    //Format label
    $('#slider-val').innerText = formatRangeLabel(options.range, options.rangeType);

    //Center map to isoline
    map.setCenter(options.center, true);


    //So far, we've written the logic to calculate an isoline. 
    //The next step is to add it to the map.To do this, we'll want to

    //- initialize an empty LineString to hold our isoline response data.
    //- add the isoline response data to the linestring.
    //- create a polygon object from the isoline response(and remove the existing polygon).
    //- add the polygon to the map.


    const linestring = new H.geo.LineString();

    const isolineShape = await requestIsolineShape(options);
    isolineShape.forEach(p => linestring.pushLatLngAlt.apply(linestring, p));

    //if (polygon !== undefined) {
    //    map.removeObject(polygon);
    //}


    /*
    polygon = new H.map.Polygon(linestring, {
        style: HEREInitials.Isoline.Style
    });

    //map.addObject(polygon);
    group.addObject(polygon);
    */

    log('calculateIsoline has ended.', logLevels.INFO);

    //getCongestionFactorsByLinkIds('1046653493,117941152,972169167,1035082656,1035082655,1194383356', HEREInitials.TrafficCongestionTimePatterns.PerDay, 1);
    //getCongestionFactorsByLinkIds('1046653493,117941152,972169167,1035082656,1035082655,1194383356', HEREInitials.TrafficCongestionTimePatterns.PerHour, 1);

    getCongestionFactors();
    

/* ...
* Create the bar chart
* ...
*/

    //Enable bar graph for car and time options
    if (options.mode === 'car' && options.rangeType === 'time') {
        const promises = [];
        for (let i = 0; i < 24; i++) {
            options.time = to24HourFormat(i);
            promises.push(requestIsolineShape(options))
        }
        const polygons = await Promise.all(promises);
        const areas = polygons.map(x => turf.area(turf.polygon([x])));
        hourFilter.setData(areas);
    } else {
        hourFilter.hideData();
    }
}


//We'll want to add the word async before the function to take advantage of the ES6 async/await functionality.
async function calculateRoute() {

    try {
        log('calculateRoute has started.', logLevels.INFO);


        //Configure the options object
        const options = {
            mode: $('#car').checked ? 'car' : $('#pedestrian').checked ? 'pedestrian' : 'truck',
            waypoint0: marker.getGeometry(),
            waypoint1: tempMarker.getGeometry(),
            waypoint2: marker.getGeometry(),
            date: $('#date-value').value === '' ? toDateInputFormat(new Date()) : $('#date-value').value,
            time: to24HourFormat($('#hour-slider').value),
            // To retrieve the shape of the route we choose the route
            // representation mode 'display'
            representation: 'display',
            routeAttributes: 'summaryByCountry,summary,shape,boundingBox,legs,notes',
            legAttributes: 'links',
            linkAttributes: 'shape,nextLink,functionalClass'
        }

        //Center map to the route
        //map.setCenter(options.center, true);


        //So far, we've written the logic to calculate a route. 
        //The next step is to add it to the map.To do this, we'll want to

        //- initialize an empty LineString to hold our route response data.
        //- add the route response data to the linestring.
        //- create a couple of markers for the start, and end of the route object from the route response(and remove the existing route, and markers).
        //- add the polyline, and markers to the map.

        const routeInfo = await requestRouteInfo(options);


        //if (routeShape !== undefined)
        //    map.removeObject(routeShape);

        //if (routeStartPointMarker !== undefined)
        //    map.removeObject(routeStartPointMarker);

        //if (routeEndPointMarker !== undefined)
        //    map.removeObject(routeEndPointMarker);

        const routeStartPoint = routeInfo.waypoint[0].mappedPosition;
        const routeEndPoint = routeInfo.waypoint[1].mappedPosition;


        routeShape = routeInfo.shape;
        //to make sure old results are wiped out
        routeLine = new H.geo.LineString();
        currentRouteStrip = new H.geo.LineString();


        for (var m = 0; m < routeInfo.leg[0].link.length; m++) {
            var strip = new H.geo.LineString(),
                shape = routeInfo.leg[0].link[m].shape,
                i,
                l = shape.length;

            for (i = 0; i < l; i++) {
                strip.pushLatLngAlt.apply(strip, shape[i].split(',').map(function (item) { return parseFloat(item); }));
                currentRouteStrip.pushLatLngAlt.apply(currentRouteStrip, shape[i].split(',').map(function (item) { return parseFloat(item); }));
            }
        }



        // Push all the points in the shape into the linestring:
        routeShape.forEach(function (point) {
            var parts = point.split(',');
            routeLine.pushLatLngAlt(parts[0], parts[1]);
        });

        //routeShape.forEach(p => linestring.pushLatLngAlt(p.split(',')[0], p.split(',')[1]));

        routeShape = new H.map.Polyline(routeLine, {
            style: HEREInitials.Route.Styles.ClassicRouting
        });

        // Create a marker for the start point:
        routeStartPointMarker = new H.map.Marker({
            lat: routeStartPoint.latitude,
            lng: routeStartPoint.longitude
        }, {
            icon: HEREInitials.Markers.Icons.StartIcon
        });

        // Create a marker for the end point:
        routeEndPointMarker = new H.map.Marker({
            lat: routeEndPoint.latitude,
            lng: routeEndPoint.longitude
        }, {
                icon: HEREInitials.Markers.Icons.DestinationIcon
        });

        //map.addObjects([routeShape, routeStartPointMarker, routeEndPointMarker]);
        group.addObjects([routeShape, routeStartPointMarker, routeEndPointMarker]);

        // Set the map's viewport to make the whole route visible:

        map.getViewModel().setLookAtData({
            tilt: 0
        }, true);

        map.getViewModel().setLookAtData({
            bounds: routeShape.getBoundingBox(),
            tilt: HEREInitials.Tilt
        }, true);


//PDE 
        var links = [];
        for (var i = 0; i < routeInfo.leg.length; i++)
            links = links.concat(routeInfo.leg[i].link);

        pdeManager.setLinks(links);
        pdeManager.setBoundingBoxContainer(group);
        pdeManager.setOnTileLoadingFinished(pdeManagerFinished);
        pdeManager.start();


        checkRouteSimulationButtonEnabledState();

    } catch (e) {
        log(e, logLevels.ERROR);
    }

    finally {
        log('calculate Route has ended.', logLevels.INFO);
    }
}



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


function make_QRCode() {
    try {
        log('QR Code making has started', logLevels.INFO);
        //var elText = document.getElementById("text");
        var elText = HEREInitials.QRCodeInitials.HERE_WeGo_BaseURL.replace('{lat}', HEREInitials.Center.lat).replace('{lng}', HEREInitials.Center.lng);

        if (!elText) {
            alert("QRCode is missing a URL");
            //elText.focus();
            return;
        }
        //qrcode.makeCode(elText.value);
        qrcode.makeCode(elText);
    } catch (e) {
        log(e, logLevels.ERROR);
    }
    finally {
        log('QR Code making has ended', logLevels.INFO);
    }
}

new Search(HEREInitials.Geocoding.InitialAddress);

//QR Code Init
var qrcode = new QRCode(document.getElementById("qrcode"), {
	width : 100,
	height : 100
});


//init PDE magic
var pdeLayers = new Object();
pdeLayers[HEREInitials.PDELayers.TrafficSigns] = {
    callback: pdeResponse
};

var signs = {};

var pdeManager = new PDEManager(HEREInitials.Credentials.AppID, HEREInitials.Credentials.AppCode, pdeLayers),
    currentBubble,
    numLinksMatched = 0;//, bLongClickUseForStartPoint = true, routeLinksMap;

function pdeManagerFinished(finishedRequests) {
    try {
        log('pdeManagerFinished has started.', logLevels.INFO);
        

//feedbackTxt.innerHTML = "Done. Requested " + finishedRequests + " PDE tiles for " + numLinksMatched + " route links. ";
        log('Done. Requested ' + finishedRequests + ' PDE tiles for ' + numLinksMatched + ' route links.', logLevels.INFO);


    

    var resultHTML = '<table class="pde_table" cellpadding="2" cellspacing="0" border="1" width="90%">' + '<thead>' + '<tr>' + '<th width="80%">Sign</th>' + '<th width="20%">#</th>' + '</tr>' + '</thead>' + '<tbody id="maps_table_body">';

    for (var sign in signs) {
        resultHTML += "<tr>" + "<td>" + sign + "</td>" + "<td>" + signs[sign] + "</td>" + "</tr>";
    }

    resultHTML += "</tbody>" + "</table>";

    //document.getElementById("resultArea").innerHTML = resultHTML;
    //document.getElementById("resultArea").style.display = "block";

        log(resultHTML, logLevels.INFO);

    //map.addObject(group);
        //map.setViewBounds(group.getBounds());
    } catch (e) {
        log(e, logLevels.ERROR);
    }

    finally {
        log('pdeManagerFinished has ended.', logLevels.INFO);
    }
}

function pdeResponse(respJsonObj) {
    try {

        log('pdeResponse has started.', logLevels.INFO);

        //group.removeAll();

        if (respJsonObj.error != undefined) {
            //feedbackTxt.innerHTML = respJsonObj.error;
            log(respJsonObj.error, logLevels.ERROR);
            return;
        }
        if (respJsonObj.responseCode != undefined) {
            alert(respJsonObj.message);
            //feedbackTxt.innerHTML = respJsonObj.message;
            log(respJsonObj.message, logLevels.INFO);
            return;
        }

        //feedbackTxt.innerHTML = "Received Attributes info for " + respJsonObj.Rows.length + " (splitted) links";
        log('Received Attributes info for ' + respJsonObj.Rows.length + ' (splitted) links', logLevels.INFO);
        for (var r = 0; r < respJsonObj.Rows.length; r++) {
            var conditionType = respJsonObj.Rows[r].CONDITION_TYPE;
            var signType = respJsonObj.Rows[r].TRAFFIC_SIGN_TYPE == null ? "0" : respJsonObj.Rows[r].TRAFFIC_SIGN_TYPE;
            var linkIds = respJsonObj.Rows[r].LINK_IDS.split(',');
            // variable speed signs have 2 links, all others just one link
            var linkId = parseInt(linkIds[0]);
            var routeLink = pdeManager.getRouteLinks()[linkId];

            // the link, including direction (+/-), must be on the route
            if (routeLink == null) {
                continue;
            }
            if (conditionType == 11) // the variable speed sign condition applies only, if both links are on the route, and in the correct direction
            {
                var linkId2 = parseInt(linkIds[1]);
                var routeLink2 = pdeManager.getRouteLinks()[linkId2];
                if (routeLink2 == null) {
                    continue;
                }
            }

            //var strip = new H.geo.Strip(), shape = routeLink.shape, i, l = shape.length;            
            //for (i = 0; i < l; i++) {
            //    strip.pushLatLngAlt.apply(strip, shape[i].split(','));
            //}

            const linestring = new H.geo.LineString(), routeShape = routeLink.shape;

            // Push all the points in the shape into the linestring:
            routeShape.forEach(function (point) {
                var parts = point.split(',');
                linestring.pushLatLngAlt(parts[0], parts[1]);
            });



            if (conditionType == "17") {
                while (signType.length < 3)
                    signType = "0" + signType;
            }
            var trafficSignIdentifier = conditionType + "_" + signType;
            var trafficSign = trafficSigns[trafficSignIdentifier];
            var color = "rgba(255, 10, 50, 0.7)";

            if (signs[trafficSign] != undefined)
                signs[trafficSign]++;
            else
                signs[trafficSign] = 1;

            // For No overtaking don't show icon, instead add polyline 
            if (conditionType == "19") {
                /*
                color = "rgba(255, 0, 0, 1)";
                polyline = new H.map.Polyline(linestring, {
                    style: {
                        lineWidth: 5,
                        strokeColor: color,
                        lineJoin: "round"
                    }
                });
                */

                polyline = new H.map.Polyline(linestring, {
                    style: HEREInitials.Route.Styles.NoOverTakeRoutes
                });

                polyline.$CONDITION_ID = respJsonObj.Rows[r].CONDITION_ID;
                polyline.$TRAFFIC_SIGN = trafficSign;

                polyline.addEventListener("pointerdown", function (e) {
                    if (currentBubble)
                        ui.removeBubble(currentBubble);
                    var html = '<div>' + '<p style="font-family:Arial,sans-serif; font-size:12px;">Condition ID: ' + e.target.$CONDITION_ID + '</p>' + '<p style="font-family:Arial,sans-serif; font-size:12px;">Sign Type: ' + e.target.$TRAFFIC_SIGN + '</p>' + '</div>';

                    var pos = map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);

                    currentBubble = new H.ui.InfoBubble(pos, {
                        content: html
                    });
                    ui.addBubble(currentBubble);
                });

                group.addObject(polyline);
            } else {

                // Note: The router returns the geometry points of a link in route driving direction. He doesn't start with the reference node coordinate.
                // If linkID > 0: Driving from ref node. Sign is posted at the non-ref node of the link. Last coordinate returned from router.
                // If linkID < 0: Driving to   ref node. Sign is posted at the     ref node of the link. Last coordinate returned from router.

                //var stripArr = strip.getLatLngAltArray();
                var stripArr = linestring.getLatLngAltArray();
                var point = new H.geo.Point(stripArr[stripArr.length - 3], stripArr[stripArr.length - 2]);

                var signMarker;

                if (trafficIcons[trafficSignIdentifier + "_eu"]) {
                    signMarker = new H.map.Marker(point, {
                        icon: trafficIcons[trafficSignIdentifier + "_eu"]
                    });
                } else {
                    signMarker = new H.map.Marker(point, {
                        icon: trafficIcons["11_000_eu"]
                    });
                }
                // Traffic sign description available in PDE documentation

                signMarker.$CONDITION_ID = respJsonObj.Rows[r].CONDITION_ID;
                signMarker.$TRAFFIC_SIGN = trafficSign;
                signMarker.addEventListener("pointerdown", function (e) {
                    if (currentBubble)
                        ui.removeBubble(currentBubble);
                    var html = '<div>' + '<p style="font-family:Arial,sans-serif; font-size:12px;">Condition ID: ' + e.target.$CONDITION_ID + '</p>' + '<p style="font-family:Arial,sans-serif; font-size:12px;">Sign Type: ' + e.target.$TRAFFIC_SIGN + '</p>' + '</div>';

                    var pos = map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);

                    currentBubble = new H.ui.InfoBubble(pos, {
                        content: html
                    });
                    ui.addBubble(currentBubble);
                });
                group.addObject(signMarker);
            }
            numLinksMatched++;
        }

        map.addObject(group);
    } catch (e) {
        log(e, logLevels.ERROR);
    }

    finally {
        log('pdeResponse has ended.', logLevels.INFO);
    }
}


export { map, router, geocoder, calculateIsoline, calculateRoute, routeLine, currentRouteStrip, marker, make_QRCode, group, qrcode, /*router, geocoder */ }
