import { $, $$, to24HourFormat, formatRangeLabel, toDateInputFormat } from './helpers.js';
import { config } from './config.js';
import { isolineMaxRange, requestIsolineShape,  } from './here.js';
import HourFilter from './HourFilter.js';
import MapRotation from './MapRotation.js';
import Search from './Search.js';
import { log } from './logger.js';
import { GeocodeBenchmarkResult } from './geocodeBenchmarkResult.js';
import { processCustomerSample } from './geocodingBenchmark.js';
import { registerSearchAll } from './searchAll.js'
import { registerContextMenus } from './mapContextMenu.js'

//Height calculations
const height = $('#content-group-1').clientHeight || $('#content-group-1').offsetHeight;
$('.content').style.height = height + 'px';

//Manage initial state
$('#slider-val').innerText = formatRangeLabel($('#range').value, 'time');
$('#date-value').value = toDateInputFormat(new Date()); 

//Add event listeners
$$('.isoline-controls').forEach(c => c.onchange = () => calculateIsoline());
$$('.view-controls').forEach(c => c.onchange = () => calculateView());

//Tab control for sidebar
const tabs = $$('.tab');
tabs.forEach(t => t.onclick = tabify)
function tabify(evt) {
   tabs.forEach(t => t.classList.remove('tab-active'));
   if (evt.target.id === 'tab-1') {
      $('.tab-bar').style.transform = 'translateX(0)';
      evt.target.classList.add('tab-active');
      $('#content-group-1').style.transform = 'translateX(0)';
      $('#content-group-2').style.transform = 'translateX(100%)';
   } else {
      $('.tab-bar').style.transform = 'translateX(100%)';
      evt.target.classList.add('tab-active');
      $('#content-group-1').style.transform = 'translateX(-100%)';
      $('#content-group-2').style.transform = 'translateX(0)';
   }
}

//Theme control
const themeTiles = $$('.theme-tile');
themeTiles.forEach(t => t.onclick = tabifyThemes);
function tabifyThemes(evt) {
   themeTiles.forEach(t => t.classList.remove('theme-tile-active'));
   evt.target.classList.add('theme-tile-active');
   if (evt.target.id === 'day') {
      const style = new H.map.Style('https://js.api.here.com/v3/3.1/styles/omv/normal.day.yaml')
      provider.setStyle(style);
   } else { 
      const style = new H.map.Style('./resources/night.yaml');
      provider.setStyle(style);
   }
}

// Initialize HERE Map
const platform = new H.service.Platform({ apikey: config.hereCredentials.apikey });
const defaultLayers = platform.createDefaultLayers({pois: true});
const map = new H.Map(
   document.getElementById('map'),
   defaultLayers.vector.normal.map, 
   {
      center: config.map.center,
      zoom: config.map.zoom,
   pixelRatio: window.devicePixelRatio || 1,
   padding: {top: 50, left: 50, bottom: 50, right: 50}
});
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const provider = map.getBaseLayer().getProvider();
// create default UI with layers provided by the platform
var ui = H.ui.UI.createDefault(map, defaultLayers);

registerSearchAll();
registerContextMenus();

//Initialize router and geocoder
const router = platform.getRoutingService();
const geocoder = platform.getGeocodingService();

window.addEventListener('resize', () => map.getViewPort().resize());

let polygon;
const marker = new H.map.Marker(config.map.center, {volatility: true});
marker.draggable = true;
map.addObject(marker);

// Add event listeners for marker movement
map.addEventListener('dragstart', evt => {
   if (evt.target instanceof H.map.Marker) behavior.disable();
}, false);
map.addEventListener('dragend', evt => {
   if (evt.target instanceof H.map.Marker) {
      behavior.enable();
      calculateIsoline(); 
   }
}, false);
map.addEventListener('drag', evt => {
   const pointer = evt.currentPointer;
   if (evt.target instanceof H.map.Marker) {
     evt.target.setGeometry(map.screenToGeo(pointer.viewportX, pointer.viewportY));
   }
}, false);

 //Initialize the HourFilter
const hourFilter = new HourFilter();

async function calculateIsoline() {
    console.log('updating...')
 
    //Configure the options object
    const options = {
       mode: $('#car').checked ? 'car' : $('#pedestrian').checked ? 'pedestrian' : 'truck',
       range: $('#range').value,
       rangeType: $('#distance').checked ? 'distance' : 'time',
       center: marker.getGeometry(),
       date: $('#date-value').value === '' ? toDateInputFormat(new Date()) : $('#date-value').value,
       time: to24HourFormat($('#hour-slider').value)
    }
 
    //Limit max ranges
    if (options.rangeType === 'distance') {
       if (options.range > isolineMaxRange.distance) {
          options.range = isolineMaxRange.distance
       }
       $('#range').max = isolineMaxRange.distance;
    } else if (options.rangeType == 'time') {
       if (options.range > isolineMaxRange.time) {
          options.range = isolineMaxRange.time
       }
       $('#range').max = isolineMaxRange.time;
    }
 
    //Format label
    $('#slider-val').innerText = formatRangeLabel(options.range, options.rangeType);
    
    //Center map to isoline
    map.setCenter(options.center, true);

    const linestring = new H.geo.LineString();

   const isolineShape = await requestIsolineShape(options);
   isolineShape.forEach(p => linestring.pushLatLngAlt.apply(linestring, p));

   if (polygon !== undefined) {
      map.removeObject(polygon);
   }

   polygon = new H.map.Polygon(linestring, {
      style: {
         fillColor: 'rgba(74, 134, 255, 0.3)',
         strokeColor: '#4A86FF',
         lineWidth: 2
      }
   });
   map.addObject(polygon);

   //Enable bar graph for car and time options
   if (options.mode === 'car' && options.rangeType === 'time') {
    const promises = [];
    for (let i = 0; i < 24; i++) {
       options.time = to24HourFormat(i);
       promises.push(requestIsolineShape(options))
    }
    const polygons = await Promise.all(promises);
    const areas = polygons.map(x => turf.area(turf.polygon([x])));
    hourFilter.setData(areas);
 } else {
    hourFilter.hideData();
 }

 }

 const rotation = new MapRotation(map);
function calculateView() {
   const options = {
      theme: $('#day').checked ? 'day' : 'night',
      static: $('#static').checked 
   }
   if (options.static) {
      rotation.stop();
   } else {
      rotation.start();
   }
}

new Search('Dubai, ARE');

//#region geocoding bench marking
var mapGroup = new H.map.Group();
map.addObject(mapGroup);



processCustomerSample(config.customerSample.sampleSize);
//#endregion


export { calculateIsoline, marker, router, geocoder, map, ui, mapGroup }