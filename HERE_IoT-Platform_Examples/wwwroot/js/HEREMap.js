var AppConfig = new config();

//Step 1: initialize communication with the platform
var HERE_Platform = new H.service.Platform({
    //app_id: AppConfig.HEREMaps_AppID,
    //app_code: AppConfig.HEREMaps_AppCode,
    useCIT: true,
    useHTTPS: true,
    "apikey": AppConfig.HEREMaps_AppKey
});

var pixelRatio = window.devicePixelRatio || 1;

var HERE_DefaultLayers = HERE_Platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320,
    pois: true 
});

//Step 2: initialize a map - this map is centered over whereever comes from configuration
var HERE_Map = new H.Map(
    document.getElementById('_div_HEREMapContainer'),
    HERE_DefaultLayers.raster.normal.map, {
    center: { lat: AppConfig.HEREMaps_initial_latitude, lng: AppConfig.HEREMaps_initial_longitude },
    zoom: AppConfig.HEREMaps_initial_zoom
});


// Set the traffic variant of the satellite map type as the base layer for the map
//HERE_Map.setBaseLayer(HERE_DefaultLayers.raster.satellite.traffic);

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => HERE_Map.getViewPort().resize());



//Step 3A: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var HERE_MapEventsBehavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(HERE_Map));
HERE_MapEventsBehavior.disable(H.mapevents.Behavior.WHEELZOOM);

////Step 3B: adjust tilt and rotation of the map
//HERE_Map.getViewModel().setLookAtData({
//    tilt: AppConfig.HEREMaps_initial_tilt,
//    heading: AppConfig.HEREMaps_initial_heading
//});

// Step 4: Create the default UI components
var HERE_ui = H.ui.UI.createDefault(HERE_Map, HERE_DefaultLayers);

const HERE_MapSettings = HERE_ui.getControl('mapsettings');
const HERE_Scalebar = HERE_ui.getControl('scalebar');
const HERE_Zoom = HERE_ui.getControl('zoom');

HERE_MapSettings.setAlignment('top-right');
HERE_Scalebar.setAlignment('top-right');
//HERE_Zoom.setAlignment('top-right');


if (AppConfig.HEREMaps_UseCustomizedMapControl) {
    try {
        //remove default mapsettings control
        HERE_ui.removeControl("mapsettings");
        // create custom one
        var HERE_MapSettingsControl = new H.ui.MapSettingsControl({
            baseLayers: [{
                label: "WaliedCheetos: Normal", layer: HERE_DefaultLayers.raster.normal.map
            }, {
                label: "WaliedCheetos: Satellite", layer: HERE_DefaultLayers.raster.satellite.map
            }, {
                label: "WaliedCheetos: Terrain", layer: HERE_DefaultLayers.raster.terrain.map
            }]
        });
        HERE_ui.addControl("customized", HERE_MapSettingsControl);

        HERE_MapSettingsControl.setAlignment('top-right');
    } catch (e) {
        _fx_Log(e, LogLevels.ERROR);
    }
}



///Step 5: Set tiles to traffic and add incidents

//HERE_Map.setBaseLayer(HERE_DefaultLayers.vector.normal.traffic);
//HERE_Map.addLayer(HERE_DefaultLayers.incidents);

//const viewPort = HERE_Map.getViewPort();
//const paddingLeft = this.props.isMobile ? 10 : 500;
//viewPort.setPadding(10, 10, 10, paddingLeft);


// #region HERE Map Events

/**
* An event listener is added to listen to tap events on the map.
* Clicking on the map displays an alert box containing the latitude and longitude
* of the location pressed.
* @param  {H.Map} map      A HERE Map instance within the application
*/
function setup_Map_PointerMove_Listener(map) {
    try {
        // Attach an event listener to map display
        // obtain the coordinates and process accordingly.
        map.addEventListener('pointermove', function (evt) {
            var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
            $('#_div_FooterContainer').text(Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S')
                + ', ' +
                Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W')
                + ', ' +
                evt.currentPointer.type);
        });
    }
    catch (e) {
        _fx_Log(e, LogLevels.ERROR);
    }
}
// #endregion

// #region HERE Map API


function _fx_addBubble(eventObject, mapUI) {
    try {
        _fx_removeBubbles(mapUI);
        const bubble = new H.ui.InfoBubble(eventObject.target.getPosition(), {
            content: eventObject.target.getData()
        });
        mapUI.addBubble(bubble);
        omnitureClick(eventObject.target, 'Landmark-click', 'Section-Reach-Map');
    }
    catch (e) {
        _fx_Log(e, LogLevels.ERROR);
    }
}

function _fx_removeBubbles(HERE_mapUI) {
    try {
        const bubbles = HERE_mapUI.getBubbles();
        bubbles.forEach((b) => HERE_mapUI.removeBubble(b));
    }
    catch (e) {
        _fx_Log(e, LogLevels.ERROR);
    }
}


/**
 * Adds a  draggable marker to the map.
 *
 * @param {H.Map} map                      A HERE Map instance within the
 *                                         application
 *                                         
 * @param {H.mapevents.Behavior} mapEventsBehaviour  Behavior implements
 *                                         default interactions for pan/zoom
 */
function _fx_addDraggableMarker(map, mapEventsBehaviour, isDraggable, bubbleText, mapUI) {
    try {
        var HERE_mapMarker = new H.map.Marker({ lat: AppConfig.HEREMaps_initial_latitude, lng: AppConfig.HEREMaps_initial_longitude }, {
            // mark the object as volatile for the smooth dragging
            volatility: true,
            //set customer icon to the marker
            icon: new H.map.Icon("/images/marker_pyramids.png", { size: { w: 56, h: 56 } })
        });

        //ensure that the marker can receive drag events
        draggable = true;

        HERE_mapMarker.draggable = isDraggable ? true : false;
        HERE_mapMarker.setZIndex(isDraggable ? 100 : 1);

        if (bubbleText) {
            HERE_mapMarker.setData(bubbleText);
            HERE_mapMarker.addEventListener('tap', function (eventObject) {
                _fx_addBubble(eventObject, mapUI);
            }, false);
        }

        //add the marker to the map
        map.addObject(HERE_mapMarker);

        //while map marker drag starts, disable default underlying map draggability
        map.addEventListener('dragstart', function (eventObject) {
            if (eventObject.target instanceof H.map.Marker)
                mapEventsBehaviour.disable();
        }, false);

        //while map marker drag ends, enable default underlying map draggability
        map.addEventListener('dragend', function (eventObject) {
            if (eventObject.target instanceof H.map.Marker)
                mapEventsBehaviour.enable();
        }, false);

        //listen to map marker drag event and move its position on the map accordingly.
        map.addEventListener('drag', function (eventObject) {
            if (eventObject.target instanceof H.map.Marker)
                eventObject.target.setGeometry(map.screenToGeo(eventObject.currentPointer.viewportX, eventObject.currentPointer.viewportY));

        }, false);

    }
    catch (e) {
        _fx_Log(e, LogLevels.ERROR);
    }
}

///**
//*send a request to HERE Javascript API for an Isolone
//* @param  {H.Map} map      A HERE Map instance within the application
//*/
//export function getIsoline
//    (
//        { lat, lng }: { lat: number, lng: number },
//        hour: number,
//        range: string,
//        quality: number
//    ) {

//    try {
//        return new Promise((resolve, reject) => {
//            // ref: https://developer.here.com/api-explorer/rest/routing/time-based-isoline-start-as-center
//            // ref: https://developer.here.com/documentation/routing/topics/resource-calculate-isoline.html
//            // ref: https://developer.here.com/documentation/routing/topics/resource-param-type-routing-mode.html
//            // Remove .cit and use the production environment when ready.
//            const now = new Date();
//            const dateString = now.toISOString().slice(0, 11) + (hour < 10 ? '0' : '') + String(hour) + ':00:00';
//            //console.log(dateString);

//            $.ajax({
//                url: 'https://isoline.route.api.here.com/routing/7.2/calculateisoline.json',
//                type: 'GET',
//                dataType: 'jsonp',
//                jsonp: 'jsoncallback',
//                data: {
//                    app_id: appId,
//                    app_code: appCode,
//                    mode: /*fastest*/'balanced;car;traffic:enabled',
//                    start: String(lat) + ',' + String(lng),
//                    rangetype: 'time',
//                    range: Number(range) * 60, // min = > in sec
//                    departure: dateString,//'now',
//                    singlecomponent: true,
//                    quality: quality, // 1 (best), 2, 3
//                    //maxpoints: 300 // to test
//                    //resolution=?
//                },
//                success: function (data) {
//                    // data
//                    if (!data.response) {
//                        console.error("api can't get back isolines");
//                        reject();
//                    } else {
//                        //console.log("api resolve:", data.response.metaInfo)
//                        const shape = data.response.isoline[0].component[0].shape
//                        const points: Array<GeoPoint> = shape.map(function (str) {
//                            const point = str.split(",")
//                            return { lat: parseFloat(point[0]), lng: parseFloat(point[1]) };
//                        });
//                        resolve(points);
//                    }
//                    //console.log(JSON.stringify(shape));
//                    //console.log(points);
//                }
//                , error: function () {
//                    reject();
//                }
//            });
//        });
//    } catch (e) {
//        _fx_Log(e, LogLevels.ERROR);
//    }
//}


//const icons = {
//    empty: new H.map.Icon('<svg></svg>'),
//    center: new H.map.Icon(svgMarker),
//    moveme: new H.map.Icon(svgMoveMe),
//    landmarks: new H.map.Icon(svgLandmark)
//};

//export let cameraZoom = 12;

//function toLinestring(points: Array<GeoPoint>) {
//    const linestring = new H.geo.LineString();
//    points.forEach((point) => linestring.pushPoint(point));
//    return linestring;
//};


//export function createPolygon(range: string, isolinePoints: Array<GeoPoint>, isolineHoles: ?Array<GeoPoint>, updateMode: string, map: any) {

//    // ref: https://developer.here.com/documentation/maps/topics/routing.html
//    // ref: https://developer.here.com/api-explorer/maps-js/v3.0/geoshapes/polygon-with-holes-on-the-map
//    const geoPolygon = isolineHoles ? new H.geo.Polygon(
//        // define exterior shape
//        toLinestring(isolinePoints),
//        // define interior geometries - holes
//        isolineHoles ? [toLinestring(isolineHoles)] : ""
//    ) :
//        toLinestring(isolinePoints);

//    // Create a polygon to represent the isoline:
//    const color = isolineColors.find(c => c.range === range).rgba;
//    const isolinePolygon = new H.map.Polygon(
//        geoPolygon,
//        {
//            style: {
//                fillColor: 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + /*color.a*/opacity.fill + ')',
//                strokeColor: 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + (color.a + 0.1)/*opacity.stroke*/ + ')',
//                lineWidth: 0
//            }
//        }
//    );

//    // Zoom the map to make sure the whole polygon is visible
//    /*
//    if (updateMode !== 'play' && range === ranges[ranges.length - 1]) {
//        const cameraData = map.getCameraDataForBounds(isolinePolygon.getBounds());
//        cameraZoom = Math.ceil(((cameraData.zoom + extraZoom) * 100) / 100) - 1;
//    }
//    */

//    return isolinePolygon;
//}

//export function createBoundary(isolinePoints: Array<GeoPoint>) {
//    const geoPolygon = new H.geo.Polygon(toLinestring(isolinePoints));
//    const isolinePolygon = new H.map.Polygon(geoPolygon, { style: { strokeColor: '#00afaa', lineWidth: '0.75', fillColor: 'rgba(0,0,0,0)' } });
//    return isolinePolygon;
//}

//function addBubble(evt, ui) {
//    removeBubbles(ui);
//    const bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
//        content: evt.target.getData()
//    });
//    ui.addBubble(bubble);
//    omnitureClick(evt.target, 'Landmark-click', 'Section-Reach-Map');
//}

//export function removeBubbles(ui) {
//    const bubbles = ui.getBubbles();
//    bubbles.forEach((b) => ui.removeBubble(b));
//}

//export function createMarker(coord: GeoPoint, type: string, isDraggable?: boolean = false, ui: Object, bubbleText: string) {
//    // ref: https://developer.here.com/documentation/maps/topics/markers.html

//    // Create the svg marker
//    const center = new H.geo.Point(coord.lat, coord.lng);
//    const marker = new H.map.Marker(center, { icon: icons[type] });
//    if (bubbleText) {
//        marker.setData(bubbleText);
//        marker.addEventListener('tap', (evt) => addBubble(evt, ui), false);
//    }

//    marker.draggable = isDraggable ? true : false;
//    marker.setZIndex(isDraggable ? 100 : 1);

//    return marker;
//}


// #endregion

// Now use the map as required...
window.onload = function () {
    try {
        alert('HERE Map has been loaded');

        setup_Map_PointerMove_Listener(HERE_Map);

        this._fx_addDraggableMarker(this.HERE_Map, this.HERE_MapEventsBehavior, true, "Walied Cheetos", this.HERE_ui);

        // // add listener to map
        // map.addEventListener('pointermove', function(pointer) {
        // try	{
        // //alert(pointer.changedPointers[0].viewportX + ', ' + pointer.changedPointers[0].viewportY + ', ' + pointer.changedPointers[0].type);
        // $('#_div_FooterContainer').text(pointer.changedPointers[0].viewportX + ', ' + pointer.changedPointers[0].viewportY + ', ' + pointer.changedPointers[0].type);					
        // }catch(e){alert(e);}
        // });

        var chart = new CanvasJS.Chart("_div_TestChart", {
            theme: "light2",
            animationEnabled: true,
            title: {
                text: "Simple Column Chart in ASP.NET MVC"
            },
            subtitles: [
                { text: "Try Resizing the Browser" }
            ],
            data: [
                {
                    type: "column", //change type to bar, line, area, pie, etc
                    dataPoints: [
                        { x: 10, y: 71 },
                        { x: 20, y: 55 },
                        { x: 30, y: 50 },
                        { x: 40, y: 65 },
                        { x: 50, y: 95 },
                        { x: 60, y: 68 },
                        { x: 70, y: 28 },
                        { x: 80, y: 34 },
                        { x: 90, y: 14 }
                    ]
                    //Uncomment below line to add data coming from the controller.
                    //dataPoints: @Html.Raw(ViewBag.DataPoints),
                }
            ]
        });
        chart.render();

    } catch (e) { alert(e); }
}
