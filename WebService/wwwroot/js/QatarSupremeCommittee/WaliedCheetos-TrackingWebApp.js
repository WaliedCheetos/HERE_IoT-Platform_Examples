import { HEREInitials, firebaseInitials, firebaseDBsRef } from './config.js';
import { logLevels, writeLog } from './logger.js';

//Height calculations
const height = document.querySelector('#content-group-1').clientHeight || document.querySelector('#content-group-1').offsetHeight;
document.querySelector('.content').style.height = height + 'px';

//#region init leaflet map

const mapLeaflet = L.map('map_left', {

    center: [HEREInitials.Center.lat, HEREInitials.Center.lng],
    zoom: 11,
    layers: [L.tileLayer(HEREInitials.MapTileURLSuffix + `/${HEREInitials.MapTileStyle_Default}/{z}/{x}/{y}/512/png8?apiKey=${HEREInitials.Credentials.APIKey}&ppi=320`)]
});

mapLeaflet.zoomControl.setPosition('topright');

//init, and add attributions to the map
mapLeaflet.attributionControl.addAttribution(HEREInitials.Center.text);
//map.attributionControl.addAttribution(HEREInitials.Attribution);

var trackerMarker_Leaflet;
// Creating MapkeyIcon object
var mki = L.icon.mapkey({
    icon: "car", color: '#725139', background: '#f2c357', size: 30
});

//#endregion

//#region init HERE Maps

// Initialize HERE Map
const platform = new H.service.Platform({ apikey: HEREInitials.Credentials.APIKey });
const defaultLayers = platform.createDefaultLayers();

const mapHERE = new H.Map(document.getElementById('map_right'), defaultLayers.vector.normal.map, {
    center: HEREInitials.Center,
    zoom: HEREInitials.Zoom,
    tilt: HEREInitials.Tilt,
    pixelRatio: window.devicePixelRatio || 1
});

const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapHERE));
// Create the default UI components
var ui = H.ui.UI.createDefault(mapHERE, defaultLayers);

var mapSettings = ui.getControl('mapsettings');
var zoom = ui.getControl('zoom');
var scalebar = ui.getControl('scalebar');

mapSettings.setAlignment('bottom-right');
zoom.setAlignment('bottom-right');
scalebar.setAlignment('bottom-right');

var trackerMarker_HERE;


//#endregion

//#region firebase

// Initialize Firebase
firebase.initializeApp(firebaseInitials);
firebase.analytics();

// Get a reference to the database service
var database = firebase.database();


//var trackerId = '123';
//var realtimeAttribute = 'time';
//var realtimeAttributeRef = firebase.database().ref('WaliedCheetos-TrackingApp' + '/' + trackerId + '/' + realtimeAttribute);

//var realtimeAttributeRef = firebase.database().ref(firebaseDBsRef.WaliedCheetos_TrackingApp.name + '/' + firebaseDBsRef.WaliedCheetos_TrackingApp.trackerId + '/' + firebaseDBsRef.WaliedCheetos_TrackingApp.realtimeAttribute);
var realtimeAttributeRef = firebase.database().ref(firebaseDBsRef.WaliedCheetos_TrackingApp.name + '/' + firebaseDBsRef.WaliedCheetos_TrackingApp.trackerId);

realtimeAttributeRef.on('value', function (snapshot) {
    //do ur magic
    console.log('Hollla');

    if (!trackerMarker_Leaflet) {
        trackerMarker_Leaflet = L.marker([snapshot.val().latitude, snapshot.val().longitude], { icon: mki, title: snapshot.key });
        trackerMarker_Leaflet.bindPopup("WaliedCheetos-Tracking ID: " + snapshot.key).openPopup();
        trackerMarker_Leaflet.addTo(mapLeaflet);
    } else {
        trackerMarker_Leaflet.setLatLng([snapshot.val().latitude, snapshot.val().longitude], { icon: mki, title: snapshot.key });
        trackerMarker_Leaflet.bindPopup("WaliedCheetos-Tracking ID: " + snapshot.key).openPopup();
        trackerMarker_Leaflet.addTo(mapLeaflet);
    }
    //map.flyTo(latLon, 17);
    mapLeaflet.setView([snapshot.val().latitude, snapshot.val().longitude], 16);


    if (!trackerMarker_HERE) {
        trackerMarker_HERE = new H.map.Marker({ lat: snapshot.val().latitude, lng: snapshot.val().longitude });
        mapHERE.addObject(trackerMarker_HERE);
    } else {
        trackerMarker_HERE.setGeometry({ lat: snapshot.val().latitude, lng: snapshot.val().longitude });
    }
    mapHERE.getViewModel().setLookAtData({
        position: { lat: snapshot.val().latitude, lng: snapshot.val().longitude },
        zoom: HEREInitials.Zoom,
        heading: HEREInitials.Heading,
        tilt: HEREInitials.Tilt
    }, true);

    //mapHERE.setCenter({ lat: snapshot.val().latitude, lng: snapshot.val().longitude });


});

//#endregion


//#region places, and geocoding search

$("#full").autocomplete({
    source: fullAC,
    minLength: 2,
    select: function (event, ui) {
        //console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);
        mapLeaflet.flyTo(ui.item.position, HEREInitials.Zoom);


        mapHERE.getViewModel().setLookAtData({
            position: { lat: ui.item.position[0], lng: ui.item.position[1] },
            zoom: HEREInitials.Zoom,
            heading: HEREInitials.Heading,
            tilt: HEREInitials.Tilt
        }, true);



        if (!trackerMarker_Leaflet) {
            trackerMarker_Leaflet = L.marker([ui.item.position[0], ui.item.position[1]], { icon: mki, title: ui.item.value });
            trackerMarker_Leaflet.bindPopup(ui.item.value).openPopup();
            trackerMarker_Leaflet.addTo(mapLeaflet);
        } else {
            trackerMarker_Leaflet.setLatLng([ui.item.position[0], ui.item.position[1]], { icon: mki, title: ui.item.value });
            trackerMarker_Leaflet.bindPopup(ui.item.value).openPopup();
            trackerMarker_Leaflet.addTo(mapLeaflet);
        }
        mapLeaflet.flyTo(ui.item.position, HEREInitials.Zoom);


        if (!trackerMarker_HERE) {
            trackerMarker_HERE = new H.map.Marker({ lat: ui.item.position[0], lng: ui.item.position[1] });
            mapHERE.addObject(trackerMarker_HERE);
        } else {
            trackerMarker_HERE.setGeometry({ lat: ui.item.position[0], lng: ui.item.position[1] });
        }
        mapHERE.getViewModel().setLookAtData({
            position: { lat: ui.item.position[0], lng: ui.item.position[1] },
            zoom: HEREInitials.Zoom,
            heading: HEREInitials.Heading,
            tilt: HEREInitials.Tilt
        }, true);

    }
});


// Combination of both Address and Place autocomplete
function fullAC(query, callback) {

    let p1 = $.getJSON("https://places.ls.hereapi.com/places/v1/autosuggest?at=" + mapLeaflet.getCenter().lat + ',' + mapLeaflet.getCenter().lng + "&q=" + query.term + "&apikey=" + HEREInitials.Credentials.APIKey);
    let p2 = $.getJSON("https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?prox=" + mapLeaflet.getCenter().lat + ',' + mapLeaflet.getCenter().lng + "&query=" + query.term + "&apikey=" + HEREInitials.Credentials.APIKey);

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

//#endregion