import { markersGroup, map } from './app.js'
import { writeLog, logLevels } from './logger.js';
import { HEREInitials } from './config.js'

const getCurrentLocation = function () {
    try {
        writeLog(logLevels.info, 'getCurrentLocation has started', '');
        // let's get HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {


                let coordinates = position.coords.latitude + "," + position.coords.longitude;
                writeLog(logLevels.info, "current location: " + coordinates);

                markersGroup.removeAll();
                var currentLocationMarker = new H.map.Marker({
                    lat: position.coords.latitude, lng: position.coords.longitude
                }, {
                    icon: HEREInitials.Markers.Icons.LocationIcon
                });

                markersGroup.addObject(currentLocationMarker);
                map.addObject(markersGroup);

                // get geo bounding box for the group and set it to the map
                map.getViewModel().setLookAtData({
                    zoom: (HEREInitials.Zoom + 3),
                    bounds: markersGroup.getBoundingBox()
                }, true);
            });
        } else {
            writeLog(logLevels.error, "Geolocation is not supported by this browser.", '');
        }
    } catch (e) {
        writeLog(logLevels.exception, e.stack, '');
    }
    finally {
        writeLog(logLevels.info, 'getCurrentLocation has ended', '');
    }
}

export { getCurrentLocation }
