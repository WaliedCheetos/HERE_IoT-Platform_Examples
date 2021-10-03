var points = [];
var trackPoints = [{ lat: 28.6309576, lng: 77.2172193 },
  { lat: 28.620801, lng: 77.1934175 },
  { lat: 28.5916507, lng: 77.1603942 },
  { lat: 28.5562348, lng: 77.1327138 },
  { lat: 28.5127401, lng: 77.0930815 },
  { lat: 28.4455776, lng: 77.0347166 },
  { lat: 28.3965898, lng: 76.9829714 },
  { lat: 28.3426237, lng: 76.9383287 },
  { lat: 28.325876, lng: 76.9035351 },
  { lat: 28.267554, lng: 76.8316948 },

  { lat: 28.2054985, lng: 76.7845201 },
  { lat: 28.1505454, lng: 76.6717708 },
  { lat: 28.0806041, lng: 76.5705764 },
  { lat: 28.0025947, lng: 76.434803 },
  { lat: 27.953167, lng: 76.3592076 }]

var startCoord = trackPoints[0];
var imageMarker;index = 0;i=0;

var svg = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" width="10px" height="10px">
	  <circle cx="5" cy="5" r="4" fill="rgb(250, 127, 0)" stroke-width="1" stroke="black" opacity="1"/>
	  </svg>`;
var icon = new H.map.DomIcon(svg);
  
// this function is required to calculate the waypoints between the start coordinate and the end coordinate
function calculateRouteFromAtoB (platform, start, end) {
    var router = platform.getRoutingService(null, 8),
        routeRequestParams = {
          routingMode: 'fast',
          transportMode: 'car',
          origin: start.lat+','+start.lng,
          destination: end.lat+','+end.lng,
          //return: 'polyline,turnByTurnActions,actions'
          return: 'polyline'
        };
    router.calculateRoute(
      routeRequestParams,
      onSuccess,
      onError
    );
    
}
/**
 * This function will be called once the Routing REST API provides a response
 * @param  {Object} result          A JSONP object representing the calculated route
 *
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
 */
function onSuccess(result) {
  addRouteShapeToMap(result.routes[0]);
}

function addRouteShapeToMap(route){
	// clear the points array to store 
	points.splice(0, points.length);
	route.sections.forEach((section) => {
	    // decode LineString from the flexible polyline
	    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
			
	    for (var i = 0; i < linestring.W.length - 1; i++) {
	      if (linestring.W[i] != 0 && linestring.W[i+1] !=0) {
	        points.push(new H.geo.Point(linestring.W[i], linestring.W[i+1]));
	      }
	    }
  	});
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map  + panel
var mapContainer = document.getElementById('map');

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: 'A4mAGN4zDl4qA41HXQFQNtdkIf3WVocj1tN2rNCjSZM'
});

var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered to the initial waypoint marker
var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.map,{
  center: {lat:28.6309576, lng:77.2172193},
  zoom: 15,
  pixelRatio: (window.devicePixelRatio && window.devicePixelRatio > 1) ? 2 : 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);


imageMarker = new H.map.DomMarker(startCoord, { icon: icon });
imageMarker.$id = "marker";
map.addObject(imageMarker);
plotPath(platform, startCoord, trackPoints[index]);

var calculate;
var timerId;
var processMarkerTimeOut;

function _start() {
	if (calculate) {
	   clearTimeout(calculate);
	}
	if (processMarkerTimeOut) {
	   clearTimeout(processMarkerTimeOut);
	}
	if (timerId) {
	   clearInterval(timerId);
	}
	//Update start coordinate to the last evaluated coordinate 
  startCoord = trackPoints[index];
  //increment index to point at the next coordinate
  index = index + 1;

  plotPath(platform, imageMarker.getGeometry(), trackPoints[index]);
}


function plotPath(platform, start, end) {
	calculate = setTimeout(calculateRouteFromAtoB(platform, start, end), 3000);
  //imageMarker.setGeometry(imageMarker.getGeometry());

	i = 1;
	sleep(3000).then(() => {
	  timerId = setInterval(() => processMarkers(start), 100);
	  processMarkerTimeOut = setTimeout(() => clearInterval(timerId), 100*points.length);
	});
}

function processMarkers(start){
  if (points[i]) {
  	var polylineGeometry =[points[i-1].lat
    	,points[i-1].lng
    	,points[i].lat
    	,points[i].lng];

  	  // Create a polyline to display the route:
    map.addObject(new H.map.Polyline(new H.geo.LineString.fromLatLngArray(polylineGeometry), {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    }));
          
		ease(
		    points[i-1],
		    points[i],
		    100,
		    function(coord) { 
		        imageMarker.setGeometry(coord);
		        map.setCenter(coord);
		    }
	    );

	    if (i < points.length) {
	    	i++;
	    }
  }


}

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Ease function
 * @param   {H.geo.IPoint} startCoord   start geo coordinate
 * @param   {H.geo.IPoint} endCoord     end geo coordinate
 * @param   number durationMs           duration of animation between start & end coordinates
 * @param   function onStep             callback executed each step
 * @param   function onStep             callback executed at the end
 */
function ease(
  startCoord = {lat: 0, lng: 0},
  endCoord = {lat: 1, lng: 1},
  durationMs = 200,
  onStep = console.log,
  onComplete = function() {},
) {

  var raf = window.requestAnimationFrame || function(f) {window.setTimeout(f, 16)},
      stepCount = durationMs / 16,
      valueIncrementLat = (endCoord.lat - startCoord.lat) / stepCount,
      valueIncrementLng = (endCoord.lng - startCoord.lng) / stepCount,
      sinValueIncrement = Math.PI / stepCount,
      currentValueLat = startCoord.lat,
      currentValueLng = startCoord.lng,
      currentSinValue = 0;

  function step() {
    currentSinValue += sinValueIncrement;
    currentValueLat += valueIncrementLat * (Math.sin(currentSinValue) ** 2) * 2;
    currentValueLng += valueIncrementLng * (Math.sin(currentSinValue) ** 2) * 2;

    if (currentSinValue < Math.PI) {
      onStep({lat: currentValueLat, lng: currentValueLng});
      raf(step);
    } else {
      onStep(endCoord);
      onComplete();
    }
  }

  raf(step);
}