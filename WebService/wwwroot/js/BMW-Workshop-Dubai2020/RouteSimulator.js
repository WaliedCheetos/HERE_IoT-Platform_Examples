import { HEREInitials } from './config.js';
import { map, routeLine, currentRouteStrip, group } from './app.js';
import { log, logLevels} from './helpers.js';



// SIMULATION OBJECTS

// simulation running or not
var isSimulationRunning = false;

// object with all route points
//var currentRouteStrip = new H.geo.LineString();

// vehicle icon
var vehicleIcon = new H.map.Icon(HEREInitials.Icons.SedanVehicle);

// vehicle marker
//var vehicleMarker = new H.map.Marker({ lat: HEREInitials.Center.lat, lng: HEREInitials.Center.lng }, { icon: vehicleIcon });
var vehicleMarker = new H.map.Marker(HEREInitials.Center, {
	icon: HEREInitials.Markers.Icons.VehicleIcon
});
vehicleMarker.$id = "vehicleMarker";

var iSimulationIsAtPosition = 0;
// simulation walker
var simulationWalker = null;
var listLinksOnRoute = [];
var SHOW_JV_UPFRONT_DISTANCE = 1200;

// Helper for clearing all info bubble related variables
function clearInfoBubble() {
	//if (currentJvInfoBubble) {
	//	ui.removeBubble(currentJvInfoBubble);
	//	currentJvInfoBubble = null;
	//}

	//m_jvOriginalSvg = null;
	////m_skyOriginalSvg = null; note: we will keep the first loaded sky svg cause we can reuse it
	//m_sarOriginalSvg = null;
	//lastRequestedJvFileName = null;
	//lastRequestedSarFileName = null;
	//lastClickedPos = null;

	try {
		log('clearInfoBubble has started', logLevels.INFO);

	} catch (e) {
		log(e, logLevels.ERROR);
	}
	finally {
		log('clearInfoBubble has ended', logLevels.INFO);
	}
}



function clearJunctionViewSimulationContainer() {
	try {
		log('clearJunctionViewSimulationContainer has started', logLevels.INFO);
		
	} catch (e) {
		log(e, logLevels.ERROR);
	}
	finally {
		log('clearJunctionViewSimulationContainer has ended', logLevels.INFO);
	}
}


// start route simulation
function startStopRouteSimulation() {
	try {
		log('startStopRouteSimulation has started', logLevels.INFO);

		if (!isSimulationRunning) {
			startRouteSimulation();
		}
		else {
			stopRouteSimulation();
		}
	} catch (e) {
		log(e, logLevels.ERROR);
	}
	finally {
		log('startStopRouteSimulation has ended', logLevels.INFO);
	}
}

// Helper for route simulation start
function startRouteSimulation() {
	// start simulation

	try {
		log('startRouteSimulation has started', logLevels.INFO);


		// check if truck or simulation group is already part of the map - otherwise add them
		var arrayMapObjects = map.getObjects();
		var bvehicleMarkerFound = false;
		var bSimulationGroupFound = false;
		for (var k = 0; k < arrayMapObjects.length; k++) {
			if (arrayMapObjects[k] == vehicleMarker) {
				bvehicleMarkerFound = true;
			}
			if (arrayMapObjects[k] == group) {
				bSimulationGroupFound = true;
			}

			if (bvehicleMarkerFound && bSimulationGroupFound) {
				break;
			}
		}
		if (!bvehicleMarkerFound) {
			// set route start
			var startCoord = currentRouteStrip.extractPoint(0);
			//var startCoord = routeLine.extractPoint(0);
			//vehicleMarker.setPosition(startCoord);
			vehicleMarker.setGeometry(startCoord);
			iSimulationIsAtPosition = 0;
			map.addObject(vehicleMarker);
		}
		if (!bSimulationGroupFound) {
			map.addObject(simulationGroup);
		}
		document.getElementById("simulateRouteButton").value = "Stop Simulation";
		isSimulationRunning = true;
		clearInfoBubble();
		//start walker
		simulationWalker = new Walker(vehicleMarker, currentRouteStrip, HEREInitials.Route.Simulation.updateMapViewModel);
		//simulationWalker = new Walker(vehicleMarker, routeLine);
		simulationWalker.walk();
	} catch (e) {
		log(e, logLevels.ERROR);
	}
	finally {
		log('startRouteSimulation has ended', logLevels.INFO);
	}
}

// Helper for route simulation stop
function stopRouteSimulation() {
	// stop simulation
	isSimulationRunning = false;
	document.getElementById("simulateRouteButton").value = "Simulate Route";
	clearJunctionViewSimulationContainer();
	if (simulationWalker) {
		simulationWalker.stop();
	}
}



var Walker = function (marker, path, updateMapViewModel) {
	this.path = path;
	this.marker = marker;
	this.dir = -1;
	this.isWalking = false;
	this.currentShowingJv = null;
	var that = this;
	this.walk = function () {
		// Get the next coordinate from the route and set the marker to this coordinate
		var coord = path.extractPoint(iSimulationIsAtPosition);

		//marker.setPosition(coord);
		marker.setGeometry(coord);
		map.getViewPort().dispatchEvent('update'); //force requestAnimationFrame		

		/* Recursively call this function with time that depends on the distance to the next point
		* which makes the marker move in similar random fashion
		*/
		that.timeout = setTimeout(that.walk, 1000);
		that.isWalking = true;

		if (updateMapViewModel) {
			var bearing = 0;
			if (iSimulationIsAtPosition > 1)
				bearing = getBearing(path.extractPoint(iSimulationIsAtPosition - 1).lat, path.extractPoint(iSimulationIsAtPosition - 1).lng, marker.getGeometry().lat, marker.getGeometry().lng);

			if (
				(iSimulationIsAtPosition > 1)
				&&
				(bearing != 0)
			) {
				log('Hollla', logLevels.INFO);
				map.getViewModel().setLookAtData({
					position: marker.getGeometry(),
					zoom: 19,
					//heading: 45,
					heading: ( 270 - bearing),// (getBearing(path.extractPoint(iSimulationIsAtPosition - 1).lat, path.extractPoint(iSimulationIsAtPosition - 1).lng, marker.getGeometry().lat, marker.getGeometry().lng)),
					tilt: 80
				});
			}

			//map.getViewModel().setLookAtData({
			//	position: marker.getGeometry(),
			//	zoom: 16,
			//	//heading: 45,
			//	heading: ((iSimulationIsAtPosition <= 1) ? 0 : getBearing(path.extractPoint(iSimulationIsAtPosition - 1).lat, path.extractPoint(iSimulationIsAtPosition - 1).lng, marker.getGeometry().lat, marker.getGeometry().lng)),
			//	tilt: HEREInitials.Tilt
			//}, true);
		}



		// If we get to the end of the route reverse direction
		if (!iSimulationIsAtPosition || iSimulationIsAtPosition === path.getPointCount() - 1) {
			iSimulationIsAtPosition = 0;
		}

		iSimulationIsAtPosition += 1;

		var pixelcoord = map.geoToScreen(coord);
		var objects = map.getObjectsAt(pixelcoord.x, pixelcoord.y);
		var bJvSimulationPathFound = false;
		for (var object in objects) {
			if (objects[object].$jvMarker) {
				bJvSimulationPathFound = true;
				// show JV
				if (that.currentShowingJv == null || that.currentShowingJv != objects[object].$jvMarker.$jvFile) {
					// load JV
					that.currentShowingJv = objects[object].$jvMarker.$jvFile;
					requestJvSkyAndSarFile(objects[object].$jvMarker.$jvFormat, objects[object].$jvMarker.$jvFile, objects[object].$jvMarker.$sarFormat, objects[object].$jvMarker.$sarFile);
				}

				break;
			}
		}

		// clear last shown JV if out of the fence
		if (!bJvSimulationPathFound && that.currentShowingJv != null) {
			clearJunctionViewSimulationContainer();
		}
	};

	this.stop = function () {
		clearTimeout(that.timeout);
		this.isWalking = false;
	};
};

function radians(n) {
	return n * (Math.PI / 180);
}
function degrees(n) {
	return n * (180 / Math.PI);
}

function getBearing(startLat, startLong, endLat, endLong) {
	startLat = radians(startLat);
	startLong = radians(startLong);
	endLat = radians(endLat);
	endLong = radians(endLong);

	var dLong = endLong - startLong;

	var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
	if (Math.abs(dLong) > Math.PI) {
		if (dLong > 0.0)
			dLong = -(2.0 * Math.PI - dLong);
		else
			dLong = (2.0 * Math.PI + dLong);
	}

	//log('Current Bearing = ' + (degrees(Math.atan2(dLong, dPhi)) + 360) % 360.0, logLevels.INFO);

	return (degrees(Math.atan2(dLong, dPhi)) + 360) % 360.0;
}

export { startStopRouteSimulation }