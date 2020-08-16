
import { HEREInitials } from './config.js';
import { router, geocoder } from './app.js';

/* ...
 * Calculate an isoline
 * ...
 */
const requestIsolineShape = options => {
    const params = {
        'mode': `fastest;${options.mode};traffic:enabled`,
        'start': `geo!${options.center.lat},${options.center.lng}`,
        'range': options.range,
        'rangetype': options.rangeType,
        'departure': `${options.date}T${options.time}:00`,
    };

    return new Promise((resolve, reject) => {
        router.calculateIsoline(
            params,
            res => {
                const shape = res.response.isoline[0].component[0].shape.map(z => z.split(','));
                resolve(shape)
            },
            err => reject(err)
        );
    })
}


/* ...
 * Calculate a route
 * ...
 */
const requestRouteInfo = options => {
    const params = {
        'mode': `fastest;${options.mode};traffic:enabled`,
        'waypoint0': `geo!${options.waypoint0.lat},${options.waypoint0.lng}`,
        'waypoint1': `geo!${options.waypoint1.lat},${options.waypoint1.lng}`,
        'waypoint2': `geo!${options.waypoint2.lat},${options.waypoint2.lng}`,
        'departure': `${options.date}T${options.time}:00`,
        'representation': `${options.representation}`,
        'routeAttributes': `${options.routeAttributes}`,
        'legAttributes': `${options.legAttributes}`,
        'linkAttributes': `${options.linkAttributes}`,
    };

    return new Promise((resolve, reject) => {
        router.calculateRoute (
            params,
            res => {
                const shape = res.response.route[0];
                resolve(shape)
            },
            err => reject(err)
        );
    })
}

//export { requestIsolineShape }


/* ...
 * Enable geocoding and autocomplete
 * ...
 */

const requestGeocode = locationid => {
    return new Promise((resolve, reject) => {
        geocoder.geocode(
            { locationid },
            res => {
                const coordinates = res.Response.View[0].Result[0].Location.DisplayPosition;
                resolve(coordinates);
            },
            err => reject(err)
        )
    })
}

/*
const autocompleteGeocodeUrl = (query) =>
    `https://autocomplete.geocoder.api.here.com/6.2/suggest.json
?app_id=${HEREInitials.Credentials.AppID}
&app_code=${HEREInitials.Credentials.AppCode}
&resultType=areas
&query=${query}`
*/ 

const autocompleteGeocodeUrl = (query) =>
    `https://places.sit.ls.hereapi.com/places/v1/autosuggest
?at=25.19893,55.27991
&app_id=${HEREInitials.Credentials.AppID}
&app_code=${HEREInitials.Credentials.AppCode}
&result_types=place
&pretty
&q=${query}`





var startWalking = function () {
    var walker = new Walker(imageMarker, strip2 /*polyline.getStrip()*/
    );
    walker.walk();
}


var Walker = function(marker, path) {
                    this.path = path;
                    this.marker = marker;
                    this.idx = 0;
                    this.dir = -1;
                    this.isWalking = false;
                    var that = this;
                    this.walk = function() {
                        // Get the next coordinate from the route and set the marker to this coordinate
                        var coord = path.extractPoint(that.idx);

                        marker.setPosition(coord);

                        // If we get to the end of the route reverse direction
                        if (!that.idx || that.idx === path.getPointCount() - 1) {
                            that.dir *= -1;
                        }

                        that.idx += that.dir;

                        /* Recursively call this function with time that depends on the distance to the next point
				* which makes the marker move in similar random fashion
				*/
                        // that.timeout = setTimeout(that.walk, Math.round(coord.distance(path.extractPoint(that.idx)) * 2.5));
                        that.timeout = setTimeout(that.walk, 200);
                        that.isWalking = true;
                        var pixelcoord = map.geoToScreen(coord)
                          , objects = map.getObjectsAt(pixelcoord.x, pixelcoord.y)
                          , covers = false
                          , log = document.getElementById("log");
/*
                        for (var object in objects) {
                            if (objects[object] === this.circle) {
                                log.innerHTML += "Object is in circle geofence <br>";
                                this.circle.setStyle({
                                    fillColor: 'rgba(255, 0, 0, 0.5'
                                });
                                covers = true;
                            } else if (objects[object] === this.polyline) {
                                log.innerHTML += "Object is in route geofence <br>";
                                this.polyline.setStyle({
                                    strokeColor: 'rgba(255, 0, 0, 0.5',
                                    lineWidth: 8
                                });
                                covers = true;
                            } else if (objects[object] === this.polygon) {
                                log.innerHTML += "Object is in polygon geofence <br>";
                                this.polygon.setStyle({
                                    strokeColor: 'rgba(255, 0, 0, 0.5',
                                    lineWidth: 8
                                });
                                covers = true;
                            } else if (objects[object] === this.isoline) {
                                log.innerHTML += "Object is in isoline geofence <br>";
                                this.isoline.setStyle({
                                    strokeColor: 'rgba(255, 0, 0, 0.5',
                                    lineWidth: 8
                                });
                                covers = true;
                            }
                            if (covers)
                                break;
                        }


                        if (!covers && (this.circle !== undefined || this.polyline !== undefined || this.isoline !== undefined || this.polygon !== undefined)) {
                            log.innerHTML += "Object is not in geofence <br>";
                            this.circle.setStyle({
                                fillColor: 'rgba(255, 255, 255, 0.5'
                            });
                            this.polyline.setStyle({
                                strokeColor: 'rgba(0,0,0,0.4)',
                                lineWidth: 8
                            });
                            this.polygon.setStyle({
                                strokeColor: "#f00",
                                lineWidth: 1
                            });
                            this.isoline.setStyle({
                                strokeColor: "#f00",
                                lineWidth: 1
                            });
                        }
*/
                        log.scrollTop = log.scrollHeight;
                    }
                    ;

                    this.stop = function() {
                        clearTimeout(that.timeout);
                        this.isWalking = false;
                    }
                    ;
                };

export {
    autocompleteGeocodeUrl,
    //isolineMaxRange,
    requestGeocode,
    requestIsolineShape,
    requestRouteInfo  
}



                