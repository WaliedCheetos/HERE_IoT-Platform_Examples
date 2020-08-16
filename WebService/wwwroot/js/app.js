import { $, $$, to24HourFormat, formatRangeLabel, toDateInputFormat, logLevels, log } from './helpers.js';
//import { center, hereCredentials } from './config.js';
import { HEREInitials } from './config.js';
import { requestIsolineShape } from './HERE.js';
import HourFilter from './HourFilter.js';
import MapRotation from './MapRotation.js';
import Search from './Search.js';
import { getCongestionFactors, getCongestionFactorsByLinkIds, toggleDataSeries} from './TrafficAnalytics.js'


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
$$('.isoline-controls').forEach(c => c.onchange = () => calculateIsoline());
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
        const style = new H.map.Style('../resources/night.yaml');
        //const style = new H.map.Style('https://heremaps.github.io/maps-api-for-javascript-examples/change-style-at-load/data/dark.yaml',
        //    'https://js.api.here.com/v3/3.1/styles/omv/');
        provider.setStyle(style);
    }
}

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

const map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
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

export { router, geocoder }




/* ...
 * Add a draggable marker
 * ...
 */

let polygon;
const marker = new H.map.Marker(HEREInitials.Center, { volatility: true });
marker.draggable = true;
map.addObject(marker);

// Add event listeners for marker movement
map.addEventListener('dragstart', evt => {
    if (evt.target instanceof H.map.Marker) behavior.disable();
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

    if (polygon !== undefined) {
        map.removeObject(polygon);
    }

    polygon = new H.map.Polygon(linestring, {
        style: HEREInitials.Isoline.Style
    });
    map.addObject(polygon);

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


new Search(HEREInitials.Geocoding.InitialAddress);

export { calculateIsoline, marker, /*router, geocoder */}
