//import { $, $$ } from './helpers.js';
import { HEREInitials } from './config.js';
import { logLevels, writeLog } from './logger.js';
import { AddressPoints_01 } from './50k_AddressPoints_01.js';
import { AddressPoints_02 } from './50k_AddressPoints_02.js';
import { MapRotation } from './MapRotation.js';

//Height calculations
const height = document.querySelector('#content-group-2').clientHeight || document.querySelector('#content-group-2').offsetHeight;
document.querySelector('.content').style.height = height + 'px';

//Add event listeners
document.querySelectorAll('.view-controls').forEach(c => c.onchange = () => calculateView());

/* ...
 * Enable the UI controls
 * ...
 */
//Tab control for sidebar
const tabs = document.querySelectorAll('.tab');
tabs.forEach(t => t.onclick = tabify)
function tabify(evt) {
    tabs.forEach(t => t.classList.remove('tab-active'));
    if (evt.target.id === 'tab-1') {
        document.querySelector('.tab-bar').style.transform = 'translateX(0)';
        evt.target.classList.add('tab-active');
        document.querySelector('#content-group-1').style.transform = 'translateX(0)';
        document.querySelector('#content-group-2').style.transform = 'translateX(100%)';
    } else {
        document.querySelector('.tab-bar').style.transform = 'translateX(100%)';
        evt.target.classList.add('tab-active');
        document.querySelector('#content-group-1').style.transform = 'translateX(-100%)';
        document.querySelector('#content-group-2').style.transform = 'translateX(0)';
    }
}

/* ...
 * Switch between map themes
 * ...
 */

//Theme control
const themeTiles = document.querySelectorAll('.theme-tile');
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


// Initialize HERE Map
const platform = new H.service.Platform({ apikey: HEREInitials.Credentials.APIKey });
const defaultLayers = platform.createDefaultLayers();

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

// this will used to set new styles whenever requested 
// ==> refer to tabifyThemes method
const provider = map.getBaseLayer().getProvider();


//init Mapillary
var mly = new Mapillary.Viewer(
    'mly',
    'QjI1NnU0aG5FZFZISE56U3R5aWN4Zzo3NTM1MjI5MmRjODZlMzc0',
    'u0P76tytQBWjrc0alKvR2g');
//    null);
//'zarcRdNFZwg3FkXNcsFeGw');

var mlyMarker;

mly.on(Mapillary.Viewer.nodechanged, function (node) {
    var latLng = { lat: node.latLon.lat, lng: node.latLon.lon };

    if (!mlyMarker) {
        mlyMarker = new H.map.Marker(latLng);
        map.addObject(mlyMarker);
    } else {
        //mlyMarker.setPosition(latLng);
        mlyMarker.setGeometry(latLng);
    }
    map.setCenter(latLng);
});




//#region Enable automatic map rotation
/* ...
* Enable automatic map rotation
* ...
*/

const rotation = new MapRotation(map);

function calculateView() {
    const options = {
        theme: document.querySelector('#day').checked ? 'day' : 'night',
        static: document.querySelector('#static').checked
    }
    if (options.static) {
        rotation.stop();
    } else {
        rotation.start();
    }
}
//#endregion


//#region marker clustering ==================================================================================================================================
/*
function updateProgressBar(processed, total, elapsed, layersArray) {
    if (elapsed > 1000) {
        //// if it takes more than a second to load, display the progress bar:
        //progress.style.display = 'block';
        //progressBar.style.width = Math.round(processed / total * 100) + '%';
    }

    if (processed === total) {
        //// all markers processed - hide the progress bar:
        //progress.style.display = 'none';
    }
}

var markerClusterGroup = L.markerClusterGroup({ chunkedLoading: true, chunkProgress: updateProgressBar });

var markerList = [];

//console.log('start creating markers: ' + window.performance.now());

for (var i = 0; i < AddressPoints_01.length; i++) {
    var a = AddressPoints_01[i];
    var title = a[2];
    var marker = L.marker(L.latLng(a[0], a[1]), {
        title: title,
        contextmenu: true,
        contextmenuItems: [{
            text: 'Do magic',
            callback: noImplementation,
            index: 0
        }, {
            separator: true,
            index: 1
        }]
    });
    marker.bindPopup(title);
    markerList.push(marker);
}
for (var i = 0; i < AddressPoints_02.length; i++) {
    var a = AddressPoints_02[i];
    var title = a[2];
    var marker = L.marker(L.latLng(a[0], a[1]), { title: title });
    marker.bindPopup(title);
    markerList.push(marker);
}

//console.log('start clustering: ' + window.performance.now());

markerClusterGroup.addLayers(markerList);

*/

//#endregion ==================================================================================================================================





$("#full").autocomplete({
    source: fullAC,
    minLength: 2,
    select: function (event, ui) {
        //console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);
        //map.flyTo(ui.item.position, 17);

        map.setCenter({ lat: ui.item.position[0], lng: ui.item.position[1] })
        map.setZoom(17);

        map.getViewModel().setLookAtData({
            //bounds: ui.item.position,
            tilt: HEREInitials.Tilt
        }, true);
    }
});


// Combination of both Address and Place autocomplete
function fullAC(query, callback) {

    let p1 = $.getJSON("https://places.ls.hereapi.com/places/v1/autosuggest?at=" + map.getCenter().lat + ',' + map.getCenter().lng + "&q=" + query.term + "&apikey=" + HEREInitials.Credentials.APIKey);
    let p2 = $.getJSON("https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?prox=" + map.getCenter().lat + ',' + map.getCenter().lng + "&query=" + query.term + "&apikey=" + HEREInitials.Credentials.APIKey);

    $.when(p1, p2).done(function (data1, data2) {

        //data1 is from Places autosuggest
        var places = data1[0].results.filter(place => place.vicinity);
        places = places.map(place => {
            return {
                title: place.title,
                value: place.title + ',' + place.vicinity.replace(/<br\/>/g, ", ") + '(' + place.category + ')',
                distance: place.distance,
                id: place.id,
                //id: place.position.toString(),
                position: place.position
            };
        });

        // data2 is from address autocomplete
        var addresses = data2[0].suggestions;
        addresses = addresses.map(addr => {
            return {
                title: addr.label,
                value: addr.label + ' (address)',
                distance: addr.distance,
                id: addr.locationId,
                //position: addr.
            };
        });

        //// lets merge the two arrays into the first
        //$.merge(places, addresses);

        //// let's sort by distance
        //places.sort(function (p1, p2) { return p1.distance - p2.distance });

        // limit display to 10 results
        return callback(places.slice(0, 10));
    })

}