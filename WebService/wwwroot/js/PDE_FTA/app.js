import { HEREInitials } from './config.js';
import { PDEManager } from './HERE_PDEManager.js';
import {  svgMarkerBase64Image, svgMarkerImageTransit, svgMarkerImage_Line, svgMarkerPublicTransit } from './markers.js';

var demoOptions = { colorful: false };

var postalBoundsContainer = new H.map.Group();
var midpointsContainer = new H.map.Group();

var pdeManager;


// check if the site was loaded via secure connection
var secure = (location.protocol === 'https:') ? true : false;

// Init map
const platform = new H.service.Platform({
    apikey: HEREInitials.Credentials.APIKey,
    useHTTPS: secure
}),
     maptypes = platform.createDefaultLayers();


const map = new H.Map(
    document.getElementById("mapContainer"),
    maptypes.vector.normal.map,
    {
        //64311 Setomaa vald, Estonia
        center: new H.geo.Point(HEREInitials.Center.lat, HEREInitials.Center.lng),
        zoom: HEREInitials.Zoom,
        pixelRatio: window.devicePixelRatio || 1
    }
);

// Enable the map event system
var mapevents = new H.mapevents.MapEvents(map);

// Enable map interaction (pan, zoom, pinch-to-zoom)
var behavior = new H.mapevents.Behavior(mapevents);

// Enable the default UI + Bbox-Selector
var ui = H.ui.UI.createDefault(map, maptypes);

//add JS API Release information
console.log("JS API: 3." + H.buildInfo().version);


window.addEventListener('resize', function () {
    map.getViewPort().resize();
});

// Update postal bounds after every view change
map.addEventListener("mapviewchangeend", function (evt) {
    requestPDE();
});


var requestPDE = function () {
    // Clean up old results
    postalBoundsContainer.removeAll();
    midpointsContainer.removeAll();

     //restrict zoomlevel for PDE requests
    if (map.getZoom() < 11) {
        return;
    }

    //loading
    //you can show/hide a loading indication if required
    console.log('started HERE PED/FTA loading');

    // Select PDE/FTA layers
    var layers = new Object();
    layers[HEREInitials.ftaLayers.PSTLCB_GenGeom] = { callback: pcmgenResponse, isFCLayer: false, level: 11 };

    // Init HERE PDE/FTA
    var pdeManager = new PDEManager(null, null, layers, HEREInitials.Credentials.APIKey);
    pdeManager.setBoundingBox(map.getViewModel().getLookAtData().bounds.getBoundingBox());
    pdeManager.setOnTileLoadingFinished(pcmgenFinished);
    pdeManager.start();
};

function pcmgenFinished() {
    map.addObject(postalBoundsContainer);

    // Select PDE/FTA layers
    var layers = new Object();
    layers[HEREInitials.ftaLayers.PSTLCB_MidPntLoc] = { callback: pcmmpResponse, isFCLayer: false, level: 12 };

    // Init HERE PDE/FTA
//    var pdeManager = new PDEManager(null, null, layers, HEREInitials.Credentials.APIKey);
//    pdeManager.setBoundingBox(map.getViewModel().getLookAtData().bounds.getBoundingBox());
//    pdeManager.setOnTileLoadingFinished(pcmmpFinished);
//    pdeManager.start();
}

function pcmmpFinished() {
    map.addObject(midpointsContainer);
    //loading
    //you can show/hide a loading indication if required
    console.log('finished HERE PED/FTA loading');
}

function pcmgenResponse(response) {
	if (response.error != undefined) {
		alert(response.error);

		//loading
		//you can show/hide a loading indication if required
		console.log('finished HERE PED/FTA loading');

		if (map.objects)
			map.objects.clear();
		return;
	}

	if (response.message != undefined) {
		alert(response.message);

		//loading
		//you can show/hide a loading indication if required
		console.log('finished HERE PED/FTA loading');

		if (map.objects)
			map.objects.clear();
		return;
	}

	//loading
	//you can show/hide a loading indication if required
	console.log('finished HERE PED/FTA loading');

	var cacheFragments = new Array();

	for (var r = 0; r < response.Rows.length; r++) {

		//console.log(response.Rows[r].NAME);

		//if (response.Rows[r].NAME != 'Al Quoz 1' && response.Rows[r].NAME != 'Al Quoz 3' && response.Rows[r].NAME != 'Burj Khalifa') {


			//if (response.Rows[r].NAME != 'Business Bay') {
			if (response.Rows[r].NAME != 'Burj Khalifa') {
			continue;
        }
			console.log(response.Rows[r].NAME);
		var latString = response.Rows[r].LAT;
		var lonString = response.Rows[r].LON;
		if (latString == undefined)
			alert("no coordinate");

		var previousCoordLatLink = 0;
		var previousCoordLonLink = 0;
		var arrayLat = latString.split(',');
		var arrayLon = lonString.split(',');
		var coords = new Array();

		var alllines = new Array();


		//var svgMarkerCircle = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
		//	+
		//	'< circle cx = "3" cy = "3" r = "3" />'
		//	+
		//	'</svg >';


		var svgMarkerCircle = '<svg width="24" height="24" ' +
			'xmlns="http://www.w3.org/2000/svg">' +
			'<rect stroke="white" fill="#1b468d" x="1" y="1" width="33" height = "33" />'
			//+
			//'<text x = "12" y = "18" font - size="12pt" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">H</text>'
			+
				'</svg > ';

		var icon = new H.map.Icon(svgMarkerCircle)



		for (var i = 0; i < arrayLat.length; i++) {
			if (arrayLat[i] == "")
				arrayLat[i] = 0;
			if (arrayLon[i] == "")
				arrayLon[i] = 0;

			var latitude = parseFloat(arrayLat[i]) / 100000.0 + previousCoordLatLink; // degree WGS84, values are relative to previous values on link
			var longitude = parseFloat(arrayLon[i]) / 100000.0 + previousCoordLonLink; // degree WGS84
			var previousCoordLatLink = latitude;
			var previousCoordLonLink = longitude;

			var g = arrayLon[i].toString();
			if (g.charAt(0) === '-')
				g = g.substr(1);
			if (g.indexOf("0") === 0 && arrayLon[i] != 0 || g == "00") { // next line is artifical
				if (i == 0) { // start of array
					continue;
				}
				coords.push(new H.geo.Point(latitude, longitude));
				alllines.push(coords);
				coords = new Array();
				continue;
			}
			coords.push(new H.geo.Point(latitude, longitude));

			var londonMarker = new H.map.Marker({ lat: latitude, lng: longitude }, {icon:icon});
			map.addObject(londonMarker);
		}



		//alllines.push(coords);

		//for (var k = 0; k < alllines.length; k++) {
		//	coords = alllines[k];
		//	if (coords && coords.length > 1) {
		//		var strip = new H.geo.LineString();

		//		for (var j = 0; j < coords.length; j++)
		//			strip.pushPoint(coords[j]);

		//		var polyline = new H.map.Polyline(strip,
		//			{
		//				style:
		//				{
		//					lineWidth: 3,
		//					strokeColor: (demoOptions.colorful) ? getRandomColor() : "#1111DD",
		//					lineJoin: "round"
		//				}
		//			});


		//		//polyline.addEventListener('tap', pointerclick);
		//		postalBoundsContainer.addObject(polyline);
		//		cacheFragments.push(polyline);
		//	}
		//}
	}
};

//var pointerclick = function (evt) {
//	var polygon = evt.target;
//	if (!polygon.selected) {
//		polygon.setStyle({ fillColor: 'rgba(255, 0, 0, 0.6)' });
//		polygon.selected = true;
//		//selectedPolygons.push(polygon);
//	}
//	else {
//		polygon.setStyle();
//		polygon.selected = false;
//		//var index = selectedPolygons.indexOf(polygon);
//		//if (index > -1) {
//		//	selectedPolygons.splice(index, 1);
//		//}
//	}
//}

function pcmmpResponse(response) {
	if (response.responseCode == 400 || response.error != undefined)
		return;
	var cacheFragment = new Array();
	for (var r = 0; r < response.Rows.length; r++) {
		var latString = response.Rows[r].LAT;
		var lonString = response.Rows[r].LON;
		var postalCode = response.Rows[r].POSTAL_CODE;

		var pointA = new H.geo.Point(parseFloat(latString) / 100000.0, parseFloat(lonString) / 100000.0);
		var marker = new H.map.Marker(pointA, {
			icon: createMarker(postalCode, "#F5F05F")
		});
		midpointsContainer.addObject(marker);
		cacheFragment.push(marker);
	}
};

var getRandomColor = function () {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

//SVG-Marker definition
var createIcon = function (line1, line2) {
	var div = document.createElement("div");
	var svg = svgMarkerImage_Line;

	svg = svg.replace(/__line1__/g, line1);
	svg = svg.replace(/__line2__/g, line2);
	svg = svg.replace(/__width__/g, 220);
	svg = svg.replace(/__widthAll__/g, 270);
	div.innerHTML = svg;

	return new H.map.Icon(svg, {
		anchor: new H.math.Point(24, 57)
	});

};

var createMarker = function (text, colorMarker) {
	var svgMarker = '<svg width="__widthAll__" height="38" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
		'<g>' +
		'<rect id="label-box" ry="13" rx="3" stroke="#000000" height="22" width="__width__" y="12" x="20" fill="__color__"/>' +
		'<text id="label-text" xml:space="preserve" text-anchor="start" font-family="Sans-serif" font-size="13" font-weight="bold" y="28" x="24" stroke-width="0" fill="#000000">__line1__</text>' +
		'</g>' +
		'</svg>';

	svgMarker = svgMarker.replace(/__line1__/g, text);
	svgMarker = svgMarker.replace(/__width__/g, text.length * 4 + 20);
	svgMarker = svgMarker.replace(/__widthAll__/g, text.length * 4 + 48);
	svgMarker = svgMarker.replace(/__color__/g, colorMarker);
	return new H.map.Icon(svgMarker);
};
