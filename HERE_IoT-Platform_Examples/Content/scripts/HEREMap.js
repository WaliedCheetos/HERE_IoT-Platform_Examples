var AppConfig = new config();

//Step 1: initialize communication with the platform
var HERE_Platform = new H.service.Platform({
    app_id: AppConfig.HEREMaps_AppID,
    app_code: AppConfig.HEREMaps_AppCode,
    useCIT: true,
    useHTTPS: true
});

var pixelRatio = window.devicePixelRatio || 1;

var HERE_DefaultLayers = HERE_Platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map - this map is centered over whereever comes from configuration
var HERE_Map = new H.Map(
    document.getElementById('_div_HEREMapContainer'),
    HERE_DefaultLayers.vector.normal.map, {
    center: { lat: AppConfig.HEREMaps_initial_latitude, lng: AppConfig.HEREMaps_initial_latitude },
    zoom: AppConfig.HEREMaps_initial_zoom
});

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => HERE_Map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var HERE_MapEventsBehavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(HERE_Map));

// Create the default UI components
var ui = H.ui.UI.createDefault(HERE_Map, HERE_DefaultLayers);


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


// Now use the map as required...
window.onload = function () {
    try {
        alert('HERE Map has been loaded');

        setup_Map_PointerMove_Listener(HERE_Map);

        // // add listener to map
        // map.addEventListener('pointermove', function(pointer) {
        // try	{
        // //alert(pointer.changedPointers[0].viewportX + ', ' + pointer.changedPointers[0].viewportY + ', ' + pointer.changedPointers[0].type);
        // $('#_div_FooterContainer').text(pointer.changedPointers[0].viewportX + ', ' + pointer.changedPointers[0].viewportY + ', ' + pointer.changedPointers[0].type);					
        // }catch(e){alert(e);}
        // });




    } catch (e) { alert(e); }
}
