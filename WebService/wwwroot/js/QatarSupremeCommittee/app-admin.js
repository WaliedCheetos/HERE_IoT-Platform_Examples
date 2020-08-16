//import { $, $$ } from './helpers.js';
import { HEREInitials } from './config.js';
import { logLevels, writeLog } from './logger.js';
import { AddressPoints_01 } from './50k_AddressPoints_01.js';
import { AddressPoints_02 } from './50k_AddressPoints_02.js';
import { dialog } from './modalForm.js'
//import { } from './here.js';

//Height calculations
const height = document.querySelector('#content-group-2').clientHeight || document.querySelector('#content-group-2').offsetHeight;
document.querySelector('.content').style.height = height + 'px';

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


//#region global variables
//var tileLayers = [];
var baseMaps = {};
var overlayMaps = {};
var featureGroup_Drawings;
//#endregion




//push all map tile styles configuration into one tileLayersTOC as a key value pair json object for layers control
for (var mapTileStyle in HEREInitials.MapTileStyles) {
    var tileLayer = L.tileLayer(HEREInitials.MapTileURLSuffix + `/${HEREInitials.MapTileStyles[mapTileStyle]}/{z}/{x}/{y}/512/png8?apiKey=${HEREInitials.Credentials.APIKey}&ppi=320`);
    //tileLayers.push(tileLayer);

    baseMaps[HEREInitials.MapTileStyles[mapTileStyle]] = tileLayer;
}

//var tangramLayer  = Tangram.leafletLayer({
//    scene: HEREInitials.HEREVectorTileURLSuffix + `?apiKey=${HEREInitials.Credentials.APIKey}`,
//    attribution: `<a href='https://www.facebook.com/Walied.Cheetos/' target="_blank">WaliedCheetos</a> | &copy; ${HEREInitials.Attribution}`
//    });

//init the map
const map = L.map('map', {
    contextmenu: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
        text: 'Show coordinates',
        callback: showCoordinates
    }, {
        text: 'Center map here',
        callback: centerMap
    }, '-', {
        text: 'Zoom in',
            icon: HEREInitials.MapContenxtMenuZoomInImage,
        callback: zoomIn
        }, {
            text: 'Zoom out',
            icon: HEREInitials.MapContenxtMenuZoomOutImage,
            callback: zoomOut
        }],

    center: [HEREInitials.Center.lat, HEREInitials.Center.lng],
    zoom: 11,
    //layers: tileLayers    
        //layers: [tangramLayer]
     layers: [L.tileLayer(HEREInitials.MapTileURLSuffix + `/${HEREInitials.MapTileStyle_Default}/{z}/{x}/{y}/512/png8?apiKey=${HEREInitials.Credentials.APIKey}&ppi=320`)]
});


//init Mapillary
var mly = new Mapillary.Viewer(
    'mly',
    'QjI1NnU0aG5FZFZISE56U3R5aWN4Zzo3NTM1MjI5MmRjODZlMzc0',
    'u0P76tytQBWjrc0alKvR2g');
//    null);
//'zarcRdNFZwg3FkXNcsFeGw');

var mlyMarker;
// Creating MapkeyIcon object
var mki = L.icon.mapkey({
    icon: "car", color: '#725139', background: '#f2c357', size: 30
});
mly.on(Mapillary.Viewer.nodechanged, function (node) {
    var latLon = [node.latLon.lat, node.latLon.lon];

    if (!mlyMarker) {
        mlyMarker = L.marker(latLon, { icon: mki });
        mlyMarker.addTo(map);
    } else {
        mlyMarker.setLatLng(latLon, { icon: mki });
    }
    //map.flyTo(latLon, 17);
    map.setView(latLon, 17);
});


//#region map context menu ==================================================================================================================================

function showCoordinates(e) {
    alert(e.latlng);
}

function centerMap(e) {
    map.panTo(e.latlng);
}

function zoomIn(e) {
    map.zoomIn();
}

function zoomOut(e) {
    map.zoomOut();
}

function noImplementation(e) {
    alert(HEREInitials.Messages.NoImplemntation);
}

//#endregion map context menu ==================================================================================================================================


featureGroup_Drawings = L.featureGroup().addTo(map);

var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    imageBounds = [[25.176817, 51.604843], [25.2841478, 51.4419567]];
//imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];

//var imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
//opacity: 0.5
//}).addTo(map);

var imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
    opacity: 0.5
});





//#region marker clustering ==================================================================================================================================

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

//#endregion ==================================================================================================================================



//#region map overlays ==================================================================================================================================

overlayMaps['Image Overlay'] = imageOverlay;
overlayMaps['C. Markers'] = markerClusterGroup;
overlayMaps['Drawings'] = featureGroup_Drawings;

//#endregion ==================================================================================================================================

map.zoomControl.setPosition('topright');

//init layers control
//add layers control to the map
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

//init, and add attributions to the map
//map.attributionControl.addAttribution(HEREInitials.Center.text);
map.attributionControl.addAttribution(HEREInitials.Attribution);

// add leaflet-geoman controls with some options to the map
map.pm.addControls({
    position: 'topright',
    //drawCircle: false,
});

map.pm.setPathOptions({
    color: 'orange',
    fillColor: 'green',
    fillOpacity: 0.4,
});

// Have the map adjust view anytime the user uses the Layers Control overlays.
//map.on('overlayadd overlayremove', function () {    
//var bounds = parentGroup.getBounds();
map.on('overlayadd ', function (layer) { 

    var bounds;

    if (layer.name == 'Image Overlay') {
         bounds = imageOverlay.getBounds();
    }
    else if (layer.name == 'C. Markers') {
        bounds = markerClusterGroup.getBounds();
    }
    else if (layer.name == 'Drawings') {
        bounds = featureGroup_Drawings.getBounds();
    }



    // Fit bounds only if the Parent Group actually has some markers,
    // i.e. it returns valid bounds.
    if (bounds.isValid()) {
        map.fitBounds(bounds);
    }
});




map.on('pm:create', e => {
    console.log(e);
    const layer = e.layer
    // Each time a feaute is created, it's added to the over arching feature group
    featureGroup_Drawings.addLayer(e.layer);

    ////add it to a control
    //layerControl.addOverlay(e.layer, 'WaliedCheetos');
    //x = layer.toGeoJSON();
    //console.log(layer.toGeoJSON());

    dialog.dialog("open");
    ////alert(turf.area(layer.toGeoJSON()))
});


$("#full").autocomplete({
    source: fullAC,
    minLength: 2,
    select: function (event, ui) {
        //console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);
        map.flyTo(ui.item.position, 17);
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


//#region register file upload events

const fileUpload = document.querySelector("#fileUpload");

fileUpload.addEventListener("change", handleFiles, false);
function handleFiles() {
    const fileList = this.files; /* now you can work with the file list */
    if (fileList.length > 0) {


        if (fileList[0].name == 'test00.dwg') {

            setTimeout(function () {
                document.querySelector("#loadingIMG").style.display = 'block';
            }, 1000);
            
            setTimeout(function () {
                var imageUrl = '../../images/QatarSupremeCommittee/test00.Layout1.png',
                    imageBounds = [[30.06658, 31.32669], [30.04834, 31.35471]];

                var imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
                    opacity: 0.5
                }).addTo(map);

                map.flyTo([30.0609, 31.3321], 15);

                document.querySelector("#loadingIMG").style.display = 'none';

            }, 10000);

            
        }

        else if (fileList[0].name == 'test01.dwg') {

            setTimeout(function () {
                document.querySelector("#loadingIMG").style.display = 'block';
            }, 1000);

            setTimeout(function () {

                var imageUrl = '../../images/QatarSupremeCommittee/test01.Layout1.png',
                    imageBounds = [[25.176817, 51.604843], [25.2841478, 51.4419567]];

                var imageOverlay = L.imageOverlay(imageUrl, imageBounds, {
                    opacity: 0.5
                }).addTo(map);

                map.flyTo([25.18865, 51.58777], 15);

                document.querySelector("#loadingIMG").style.display = 'none';
            }, 13000);


        }

    }
    else
        alert(HEREInitials.Messages.NoCADFileSelected);
}

//#endregion


export { featureGroup_Drawings }