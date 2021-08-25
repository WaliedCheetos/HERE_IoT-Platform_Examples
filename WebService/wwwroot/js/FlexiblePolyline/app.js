import { initials } from './config.js';
//import { decode } from './flexPolyline.js'; 

//#region HERE maps initialization

// Initialize HERE Map
const platform = new H.service.Platform({ apikey: initials.hereCredentials.apikey });
const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(document.getElementById('map'),       
defaultLayers.vector.normal.map, {
    center: initials.mapCenter,
    zoom: 12,
    pixelRatio: window.devicePixelRatio || 1
 });

const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const provider = map.getBaseLayer().getProvider();

//Initialize router and geocoder
const router = platform.getRoutingService();
const geocoder = platform.getGeocodingService();


window.addEventListener('resize', () => map.getViewPort().resize());
    
// Create the default UI:
    var ui = H.ui.UI.createDefault(map, defaultLayers);
//#endregion

// //#region business logic
// function _fx_DecodeFlexPolyline(){ 
//     try {
//         // var decodedFlexPolyline = decode("BGo9llkDg_rzZkF0G8LoQ4NoQgP8QoLgKgyB0tB4XoVoLsJ0K4IwWoQsOsJ8LwHoLoGkS0KkN8GsJ0F8GgF4D4DsE0FwHoLUgK8BkIkDkIgFwHgFwCgFUgF7B4DjDsErEsE_EkD7GoLUgFoB0F8B8Q0FsE8BkmBkSgtBwWkS8GwH8B8GoBosCgKkhBsE0FU0FUgZjD8VgKoGkD4F8C");
//         // console.log(decodedFlexPolyline);
//         alert('Hi');
//     } catch (error) {
//         alert(error);
//     }
// }
// //#endregion

//  export {_fx_DecodeFlexPolyline};

export { map };