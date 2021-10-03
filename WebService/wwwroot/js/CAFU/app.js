import { $, $$, to24HourFormat, formatRangeLabel, toDateInputFormat } from './helpers.js';
import { initials } from './config.js';
import { requestIsolineShape } from './here.js';
import HourFilter from './HourFilter.js';
import MapRotation from './MapRotation.js';
import Search from './Search.js';
import { chart_RTAAIParkingAnalytics_Types, create_RTAAIParkingAnalytics_Types, render_RTAAIParkingAnalytics_Types } from './AIAnalytics.js'
//import {} from '././geojson/RTA/rtaParkingLots.json';

//Height calculations
const height = $('#content-group-1').clientHeight || $('#content-group-1').offsetHeight;
$('.content').style.height = height + 'px';

//Manage initial state
$('#slider-val').innerText = formatRangeLabel($('#range').value, 'time');
$('#date-value').value = toDateInputFormat(new Date()); 

//Add event listeners
$$('.isoline-controls').forEach(c => c.onchange = () => {
   calculateIsoline();

   var dateSelected =  $('#date-value').value === '' ? toDateInputFormat(new Date()) : $('#date-value').value;
   var timeSelected = to24HourFormat($('#hour-slider').value);

   console.log(`WaliedCheetos: Info - selected data time : ${dateSelected}T${timeSelected}:00.000Z`);
});
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
      const style = new H.map.Style('../../resources/Nissan/night.yaml');
      provider.setStyle(style);
   }
}


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

//#region HERE maps initialization

// Initialize HERE Map
const platform = new H.service.Platform({ apikey: initials.hereCredentials.apikey });
const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(document.getElementById('map'),       defaultLayers.vector.normal.map, {
    center: initials.mapCenter,
    zoom: 12,
    pixelRatio: window.devicePixelRatio || 1
 });

const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const provider = map.getBaseLayer().getProvider();

//Initialize router and geocoder
const router = platform.getRoutingService();
const geocoder = platform.getGeocodingService();
var heatmapProvider;

//socket
var socket;

// create a group
let mapObjectsGroup = new H.map.Group();

window.addEventListener('resize', () => map.getViewPort().resize());
    
// Create the default UI:
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    // Create a provider for a semi-transparent heat map:
heatmapProvider = new H.data.heatmap.Provider({
   type: 'value',
   colors: new H.data.heatmap.Colors({
     '0': 'red',
     '0.5': 'blue',
     '1': 'yellow'
   }, true),
   opacity: 0.7,
   // Paint assumed values in regions where no data is available
   assumeValues: false,
   //A numeric value defining the resolution reduction when producing tiles.
   //If the coarseness is set to 0, tiles are produced in the original resolution. 
   //A coarseness of 1 allows the renderer to render tiles at half the size and then scale the output. 
   //A coarseness of 2 allows the renderer to create tiles at a size of a quarter of the original tile size. 
   //Increasing the number dramatically increases performance but also reduces visual quality, especially when using "posterization" (non-interpolated colors). 
   //Values are restricted to a integer in the range [0 ... 3].
   coarseness: 2
 });
 
 // Add the data:
//  heatmapProvider.addData([
//    {lat: 25.2053, lng: 55.2827, value: 1},
//    {lat: 25.1987, lng: 55.2687, value: 2},
//    {lat: 25.1863, lng: 55.2785, value: 3}
//  ]);
 var heatmapTile = new H.map.layer.TileLayer(heatmapProvider);
 // Add a layer for the heatmap provider to the map:
 map.addLayer(heatmapTile);

if(initials.webSocketServer.enabled){
 socket = io(initials.webSocketServer.url);
//socket = io('http://localhost:3000');
}

//showGeoJSONData(map);
displayRTAParkingCheckHistory();

new Search(initials.mapCenter.text);

const rotation = new MapRotation(map);

create_RTAAIParkingAnalytics_Types();
//#endregion

//#region display rta parking check history data

function isPrime(value) {
   for(var i = 2; i < value; i++) {
       if(value % i === 0) {
           return false;
       }
   }
   return value > 1;
}

//var markers = [];
function generateRandomData(count){
   try {
 
//      // create SVG Dom Icon
//    var svg = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" width="10px" height="10px">
//      <circle cx="5" cy="5" r="4" fill="rgb(250, 127, 0)" stroke-width="1" stroke="black" opacity="1"/>
//      </svg>`;
 
//      var domIcon = new H.map.DomIcon(svg);
     
//  if (markers.length > 0) {
//    map.removeObjects(markers);
//  }
 



 var geojson = {};
 geojson['type'] = 'FeatureCollection';
 geojson['features'] = [];
             
 var randomPoints = [];
 
 for (let index = 0; index < count; index++) {

   var observationType;
   var heatValue;
   if (isPrime(index)) {
     observationType = 'fine';
     heatValue = 1;
   } else if( index % 2 == 0) {
     observationType = 'warning';
     heatValue = 2;
   }else{
     observationType = 'paid';
     heatValue = 3;
   }

   // get random position 0 - 1.3km from map's center in random direction ==> 1300


   let randomPoint = map.getCenter().walk(Math.random() * 360, Math.random() * initials.rtaParkingCheckHistory.randomDataRange);

randomPoint = JSON.parse(`{"lat":${randomPoint.lat}, "lng":${randomPoint.lng}, "value":${heatValue}}`);
// randomPoint = JSON.parse(`{"lat":${randomPoint.lat}, "lng":${randomPoint.lng}, "value":${index}}`);

 randomPoints.push(randomPoint);
   // markers.push(new H.map.DomMarker(randomPoint, {
   //       icon: domIcon
   //     }));
 

 
 var datatimeCurrent = new Date();
 
       var newFeature = {
       "type": "Feature",
       "geometry": {
         "type": "Point",
         "coordinates": [parseFloat(randomPoint.lat), parseFloat(randomPoint.lng)]
       },
       "properties": {
         'id': index,
          'name' : 'WaliedCheetos',
          'datetime' : datatimeCurrent.toISOString(),
          'type' : observationType,
          'officer' : 'WaliedCheetos',
          'zone_number' : 'xyz',
          'plate' : 'x-xyz',
          'start' : '',
          'end' : ''
       }
     }
 
     geojson['features'].push(newFeature);
 }
 
   heatmapProvider.addData(randomPoints);
     // add markers to map
     //map.addObjects(markers); 
     console.log(JSON.stringify(geojson));
 

   var officerJobsPositions = `${marker.getGeometry().lat},${marker.getGeometry().lng}|${randomPoints[5].lat},${randomPoints[5].lng}|${randomPoints[13].lat},${randomPoints[13].lng}`;

     if(initials.webSocketServer.enabled){
        socket.emit("WaliedCheetos_NavigateOfficer", officerJobsPositions);
       }

render_RTAAIParkingAnalytics_Types();

   } catch (error) {
     console.error(`WaliedCheetos - Exception: ${error}`);
   }
 }

function displayRTAParkingCheckHistory (){
   try {
      fetch(initials.rtaParkingCheckHistory.serviceEndpoint)
      .then(response => {
          if (!response.ok) {
              throw new Error("HTTP error " + response.status);
          }
          return response.json();
      })
      .then(json => {

         var dateSelected =  $('#date-value').value === '' ? toDateInputFormat(new Date()) : $('#date-value').value;
         var timeSelected = to24HourFormat($('#hour-slider').value);

         console.log(`WaliedCheetos: Info - selected data time : ${dateSelected}T${timeSelected}:00.000Z`);
         //console.log(`WaliedCheetos: Info - selected time : ${timeSelected}`);

         var startDate = new Date('2019-07-04T12:00:00.000Z') ;
         var endDate = new Date('2019-07-15T12:00:00.000Z') ;
         
         var requiredData = _.filter(json.features, function(data){
            return new Date(data.properties.datetime) >= startDate && new Date(data.properties.datetime) <= endDate;
         }); 

          console.log(`WaliedCheetos: Info - ${requiredData.length}`);
      })
      .catch(function (error) {
         console.error(`WaliedCheetos: Error - ${error}`);
      })
   } catch (error) {
      console.error(`WaliedCheetos: Error - ${error}`);
   }
}

function showGeoJSONData (map) {
    // Create GeoJSON reader which will download the specified file.
    // Shape of the file was obtained by using HERE Geocoder API.
    // It is possible to customize look and feel of the objects.

     var reader = new H.data.geojson.Reader('../../geojson/RTA/rtaParkingLots.geojson', {
    //var reader = new H.data.geojson.Reader('http://localhost/WaliedCheetos/HERE_IoT-Platform_Examples/WebService/wwwroot/geojson/RTA/rtaParkingLots.json', {
        disableLegacyMode: true,
      // This function is called each time parser detects a new map object
      style: function (mapObject) {
        // Parsed geo objects could be styled using setStyle method
        if (mapObject instanceof H.map.Polygon) {
          mapObject.setStyle({
            fillColor: 'rgba(255, 0, 0, 0.5)',
            strokeColor: 'rgba(0, 0, 255, 0.2)',
            lineWidth: 3
          });
        }
      }
    });
  
    // Start parsing the file
    reader.parse();
  
    // Add layer which shows GeoJSON data on the map
    map.addLayer(reader.getLayer());
  }

//#endregion

//#region WaliedCheetos - draggable marker events business logic

const marker = new H.map.Marker(initials.mapCenter, {volatility: true});
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

//#endregion

//#region WaliedCheetos - route isoline business logic

//Initialize the HourFilter
const hourFilter = new HourFilter();
let polygon;

//We’ll want to add the word async before the function to take advantage of the ES6 async/await functionality.
async function calculateIsoline() {
    console.log('updating...');

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
       if (options.range > initials.routeIsoline.maxRange.distance) {
          options.range = initials.routeIsoline.maxRange.distance
       }
       $('#range').max = initials.routeIsoline.maxRange.distance;
    } else if (options.rangeType == 'time') {
       if (options.range > initials.routeIsoline.maxRange.time) {
          options.range = initials.routeIsoline.maxRange.time
       }
       $('#range').max = initials.routeIsoline.maxRange.time;
    }
 
    //Format label
    $('#slider-val').innerText = formatRangeLabel(options.range, options.rangeType);
    
    //Center map to isoline
    map.setCenter(options.center, true);

    //initialize an empty LineString to hold our isoline response data.
    //add the isoline response data to the linestring.
    //create a polygon object from the isoline response (and remove the existing polygon).
    //add the polygon to the map.

    const linestring = new H.geo.LineString();

   const isolineShape = await requestIsolineShape(options);
   isolineShape.forEach(p => linestring.pushLatLngAlt.apply(linestring, p));

   if (polygon !== undefined) {
      map.removeObject(polygon);
   }

   polygon = new H.map.Polygon(linestring, {
      style: initials.routeIsoline.style
   });
   map.addObject(polygon);

   heatmapProvider.clear();
   //generate random data for the heatmap
   generateRandomData(1000);

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

 calculateIsoline();

//#endregion

export { marker, calculateIsoline, router, geocoder }
