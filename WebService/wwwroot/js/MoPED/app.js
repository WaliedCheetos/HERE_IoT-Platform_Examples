import { $, $$, to24HourFormat, formatRangeLabel, toDateInputFormat } from './helpers.js';
import { center, hereCredentials } from './config.js';
import MapRotation from './MapRotation.js';
import Search from './Search.js';
//Height calculations
const height = $('#content-group-2').clientHeight || $('#content-group-2').offsetHeight;
$('.content').style.height = height + 'px';
$$('.view-controls').forEach(c => c.onchange = () => calculateView());



//#region init leaflet map

// const mapLeaflet = L.map('map_right', {

//   center: [center.lat, center.lng],
//   zoom: center.zoom,
//   layers: [L.tileLayer(`${hereCredentials.mapTileURLSuffix}/${hereCredentials.mapTileStyle_Default}/{z}/{x}/{y}/512/png8?apiKey=${hereCredentials.apikey}&ppi=320`)]
// });

// mapLeaflet.zoomControl.setPosition('topright');

// //init, and add attributions to the map
// mapLeaflet.attributionControl.addAttribution(hereCredentials.attribution);
// //map.attributionControl.addAttribution(HEREInitials.Attribution);

// // var marker_Leaflet;
// // // Creating MapkeyIcon object
// // var mki = L.icon.mapkey({
// //   icon: "car", color: '#725139', background: '#f2c357', size: 30
// // });

var leafletMap = L.map('map_right').setView([center.lat, center.lng], center.zoom);

L.tileLayer(`https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/reduced.night/{z}/{x}/{y}/512/png8?apiKey=${hereCredentials.apikey}&ppi=320`, {
  // maxZoom: 18,
  attribution: hereCredentials.attribution,
  id: 'HERE, 2021',
  tileSize: 512,
  zoomOffset: -1
}).addTo(leafletMap);

leafletMap.attributionControl.addAttribution('&copy; WaliedCheetos &copy; HERE 2021');

//#endregion

// Initialize HERE Map
const platform = new H.service.Platform({ apikey: hereCredentials.apikey });
const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(
  document.getElementById('map_left'),
  defaultLayers.vector.normal.map, {
   center,
   zoom: center.zoom,
   pixelRatio: window.devicePixelRatio || 1
});
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

var mapSettings = ui.getControl('mapsettings');
var zoom = ui.getControl('zoom');
var scalebar = ui.getControl('scalebar');

mapSettings.setAlignment('bottom-right');
zoom.setAlignment('bottom-right');
scalebar.setAlignment('bottom-right');

const provider = map.getBaseLayer().getProvider();

//Initialize geocoder
const geocoder = platform.getGeocodingService();

window.addEventListener('resize', () => map.getViewPort().resize());

const marker = new H.map.Marker(center, {volatility: true});
marker.draggable = true;
map.addObject(marker);

// map.getViewModel().addEventListener('sync', function() {
//   //var center = map.getCenter();
//   // Set marker position here:
//   //alert(center);
// });

// Add event listeners for marker movement
map.addEventListener('dragstart', evt => {
   if (evt.target instanceof H.map.Marker) behavior.disable();

}, false);
map.addEventListener('dragend', evt => {
   if (evt.target instanceof H.map.Marker) {
      behavior.enable();

      let url_HEREReverseGeocoding = jQuery.getJSON("https://revgeocode.search.hereapi.com/v1/revgeocode?at=" + map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY).lat + "," + map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY).lng + "&apikey=" + hereCredentials.apikey);
jQuery.when(url_HEREReverseGeocoding).done(function (address) {
    alert(address.items[0].address.label);

});
      //calculateIsoline(); 
   }
  //  else{
  //   marker.setGeometry(map.getCenter());
  //  }
}, false);
map.addEventListener('drag', evt => {
   const pointer = evt.currentPointer;
   if (evt.target instanceof H.map.Marker) {
     evt.target.setGeometry(map.screenToGeo(pointer.viewportX, pointer.viewportY));
   }
   else{
    marker.setGeometry(map.getCenter());
  }
}, false);

new Search('Cairo, EGY');


//#region Tab control for sidebar

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
      const style = new H.map.Style('../../resources/MoPED/night.yaml');
      provider.setStyle(style);
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

//#endregion


 //#region WaliedCheetos - process uploaded file

 // Hold a reference to any infobubble opened
var bubble;

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
   const dropZoneElement = inputElement.closest(".drop-zone");
 
   dropZoneElement.addEventListener("click", (e) => {
     //inputElement.click();
   });
 
   inputElement.addEventListener("change", (e) => {
     if (inputElement.files.length) {
       //updateThumbnail(dropZoneElement, inputElement.files[0]);
     }
   });
 
   dropZoneElement.addEventListener("dragover", (e) => {
     e.preventDefault();
     dropZoneElement.classList.add("drop-zone--over");
   });
 
   ["dragleave", "dragend"].forEach((type) => {
     dropZoneElement.addEventListener(type, (e) => {
       dropZoneElement.classList.remove("drop-zone--over");
     });
   });
 
   dropZoneElement.addEventListener("drop", (e) => {
      e.preventDefault();
  
      if (e.dataTransfer.files.length) {
        inputElement.files = e.dataTransfer.files;

 
        let reader = new FileReader();


        
     
        reader.onload = (e) => {
            const file = e.target.result;
            const lines = file.split(/\r\n|\n/);

            // var addressPoints = [];
            var markers = L.markerClusterGroup();
            lines.forEach(line => {

              try {
                var leafletMarker = L.marker(
                  new L.LatLng(parseFloat(line.split('|')[3]), parseFloat(line.split('|')[4])), 
                  { title: line.split('|')[5] 
                });
                leafletMarker.bindPopup(line.split('|')[5]);
                leafletMarker.on('click', function (a) {
                  console.log(a.latlng);

                  // adjust tilt and rotation of the map

map.getViewModel().setLookAtData({
  position: { lat: a.latlng.lat, lng: a.latlng.lng },
  zoom: 19,
  heading: 60,
  tilt: 45
}, true); 
marker.setGeometry({ lat: a.latlng.lat, lng: a.latlng.lng });

// let url_HEREReverseGeocoding = jQuery.getJSON("https://revgeocode.search.hereapi.com/v1/revgeocode?at=" + a.latlng.lat + "," + a.latlng.lng + "&apikey=" + hereCredentials.apikey);
// jQuery.when(url_HEREReverseGeocoding).done(function (address) {
//     alert(address.items[0].address.label);

// });
                  //console.log('marker ' + a.layer);
                });
                markers.addLayer(leafletMarker);
              } catch (error) {
                
              }


            // var addressPoint = [parseFloat(line.split('|')[3]), parseFloat(line.split('|')[4]), line.split('|')[5]];
            // addressPoints.push(addressPoint);
            });

    //         var markers = L.markerClusterGroup();
		// alert(addressPoints.length);
		// for (var i = 0; i < addressPoints.length; i++) {
		// 	var a = addressPoints[i];
		// 	var title = a[2];

    //   try {
    //     var marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
    //     marker.bindPopup(title);
    //     markers.addLayer(marker);
    //   } catch (error) {
        
    //   }
		// }

		leafletMap.addLayer(markers);
    leafletMap.fitBounds(markers.getBounds());
    displayChart();
            
          //   //map.removeLayer(clusteringLayer);

          //   // First we need to create an array of DataPoint objects,
          //   // for the ClusterProvider
          //   var dataPoints = lines.map(function (line) {
          //     console.log(`${line.split('|')[3]}, ${line.split('|')[4]}`);
          //     return new H.clustering.DataPoint(parseFloat(line.split('|')[3]), parseFloat(line.split('|')[4]));
          //   });
          
          //   // Create a clustering provider with custom options for clusterizing the input
          // var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
          //     clusteringOptions: {
          //       // Maximum radius of the neighbourhood
          //       eps: 32,
          //       // minimum weight of points required to form a cluster
          //       minWeight: 2
          //     }
          //   });
          
          //   // Create a layer tha will consume objects from our clustering provider
          // var markerClusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
          
          //   // To make objects from clustering provder visible,
          //   // we need to add our layer to the map
          //   map.addLayer(markerClusteringLayer);
            


        /*    
            var geojson = {};
geojson['type'] = 'FeatureCollection';
geojson['features'] = [];
            

for (let i = 0; i < lines.length; i++) {
   if(i>0){
   var newFeature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [parseFloat(lines[i].split('|')[3]), parseFloat(lines[i].split('|')[4])]
      },
      "properties": {
         'SeqNumber' : lines[i].split('|')[0],
         'displayLatitude' : lines[i].split('|')[3],
         'displayLongitude' : lines[i].split('|')[4],
         'locationLabel' : lines[i].split('|')[5],
         'houseNumber' : lines[i].split('|')[6],
         'street' : lines[i].split('|')[7],
         'district' : lines[i].split('|')[8],
         'city' : lines[i].split('|')[9],
         'postalCode' : lines[i].split('|')[10],
         'county' : lines[i].split('|')[11],
         'state' : lines[i].split('|')[12],
         'country' : lines[i].split('|')[13],

      }
    }
    geojson['features'].push(newFeature);
   }
}

console.log(JSON.stringify(geojson));
*/

//var i = 0;
            // lines.forEach(line => {
               
            //    if(i>0){
            //    var newFeature = {
            //       "type": "Feature",
            //       "geometry": {
            //         "type": "Point",
            //         "coordinates": [parseFloat(line.split('|')[3]), parseFloat(line.split('|')[4])]
            //       },
            //       "properties": {
            //          'SeqNumber' : line.split('|')[0],
            //          'displayLatitude' : line.split('|')[3],
            //          'displayLongitude' : line.split('|')[4],
            //          'locationLabel' : line.split('|')[5],
            //          'houseNumber' : line.split('|')[6],
            //          'street' : line.split('|')[7],
            //          'district' : line.split('|')[8],
            //          'city' : line.split('|')[9],
            //          'postalCode' : line.split('|')[10],
            //          'county' : line.split('|')[11],
            //          'state' : line.split('|')[12],
            //          'country' : line.split('|')[13],
       
            //       }
            //     }
            //     geojson['features'].push(newFeature);
            //    }

            //    if(i >= 10){
            //       console.log(JSON.stringify(geojson));
            //       break;
            //    }
            //    else{i++;}
            // });
        };
     
        reader.onerror = (e) => alert(e.target.error.name);
     
        reader.readAsText(e.dataTransfer.files[0]); 
      }
  
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });
  


   /*
   dropZoneElement.addEventListener("drop", (e) => {
     e.preventDefault();
 
     if (e.dataTransfer.files.length) {
       inputElement.files = e.dataTransfer.files;
 

         //Validate whether File is valid Excel file.
         var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
         var fileUpload = e.dataTransfer;
         if (regex.test(fileUpload.files[0].name.toLowerCase())) {
         // if (regex.test(fileUpload.value.toLowerCase())) {
             if (typeof (FileReader) != "undefined") {
                 var reader = new FileReader();
  
                 //For Browsers other than IE.
                 if (reader.readAsBinaryString) {
                     reader.onload = function (e) {
                         GetTableFromExcel(e.target.result);
                     };
                     reader.readAsBinaryString(fileUpload.files[0]);
                 } else {
                     //For IE Browser.
                     reader.onload = function (e) {
                         var data = "";
                         var bytes = new Uint8Array(e.target.result);
                         for (var i = 0; i < bytes.byteLength; i++) {
                             data += String.fromCharCode(bytes[i]);
                         }
                         GetTableFromExcel(data);
                     };
                     reader.readAsArrayBuffer(fileUpload.files[0]);
                 }
             } else {
                 alert("This browser does not support HTML5.");
             }
         } else {
             alert("Please upload a valid Excel file.");
         }
 
 
       //updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
     }
 
     dropZoneElement.classList.remove("drop-zone--over");
   });
 });
 */


 /**
  * Updates the thumbnail on a drop zone element.
  *
  * @param {HTMLElement} dropZoneElement
  * @param {File} file
  */
 function updateThumbnail(dropZoneElement, file) {
   let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
 
   // First time - remove the prompt
   if (dropZoneElement.querySelector(".drop-zone__prompt")) {
     dropZoneElement.querySelector(".drop-zone__prompt").remove();
   }
 
   // First time - there is no thumbnail element, so lets create it
   if (!thumbnailElement) {
     thumbnailElement = document.createElement("div");
     thumbnailElement.classList.add("drop-zone__thumb");
     dropZoneElement.appendChild(thumbnailElement);
   }
 
   thumbnailElement.dataset.label = file.name;
 
   // Show thumbnail for image files
   if (file.type.startsWith("image/")) {
     const reader = new FileReader();
 
     reader.readAsDataURL(file);
     reader.onload = () => {
       thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
     };
   } else {
     thumbnailElement.style.backgroundImage = null;
   }
 }
 
 let array = new Array;
 var clusteringLayer;
 function get(url) {
   return new Promise((resolve, reject) => {
     fetch(url)
       .then(res => { return res.text(); })
       .then(res => {
         //let reg = /\<meta name="description" content\=\"(.+?)\"/;
         //res = res.match(reg);
         resolve(JSON.parse(res).items[0]);
         //console.log(res);
       }
       )
       .catch(err => { reject(err) })
   });
 }
 
 async function result(rows) {
     array.splice(0, array.length)
   for (let i = 0; i < rows.length; i++) {
     const value = await get(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${rows[i].X},${rows[i].Y}&lang=en-US&apikey=${hereCredentials.apikey}`);
     array.push(value)
   }
   console.log(array.length);
   console.log(JSON.stringify(array));
   //addLocationsToMap(array);
   startClustering(map, array);
 }
 
 /**
  * Display clustered markers on a map
  *
  * Note that the maps clustering module https://js.api.here.com/v3/3.1/mapsjs-clustering.js
  * must be loaded to use the Clustering
 
  * @param {H.Map} map A HERE Map instance within the application
  * @param {Object[]} data Raw data that contains airports' coordinates
 */
 function startClustering(map, data) {

 map.removeLayer(clusteringLayer);

   // First we need to create an array of DataPoint objects,
   // for the ClusterProvider
   var dataPoints = data.map(function (item) {
     return new H.clustering.DataPoint(item.position.lat, item.position.lng);
   });
 
   // Create a clustering provider with custom options for clusterizing the input
 var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
     clusteringOptions: {
       // Maximum radius of the neighbourhood
       eps: 32,
       // minimum weight of points required to form a cluster
       minWeight: 2
     }
   });
 
   // Create a layer tha will consume objects from our clustering provider
 clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
 
   // To make objects from clustering provder visible,
   // we need to add our layer to the map
   map.addLayer(clusteringLayer);
 }
  
 function GetTableFromExcel(data) {
         //Read the Excel File data in binary
         var workbook = XLSX.read(data, {
             type: 'binary'
         });
  
         //get the name of First Sheet.
         var Sheet = workbook.SheetNames[0];
  
         //Read all rows from First Sheet into an JSON array.
         var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);
 
 result(excelRows);
      }
 
 /**
  * Opens/Closes a infobubble
  * @param  {H.geo.Point} position     The location on the map.
  * @param  {String} text              The contents of the infobubble.
  */
 function openBubble(position, text){
  if(!bubble){
     bubble =  new H.ui.InfoBubble(
       position,
       {content: text});
     ui.addBubble(bubble);
   } else {
     bubble.setPosition(position);
     bubble.setContent(text);
     bubble.open();
   }
 }
 
 
 /**
  * Creates a series of H.map.Markers for each location found, and adds it to the map.
  * @param {Object[]} locations An array of locations as received from the
  *                             H.service.GeocodingService
  */
  function addLocationsToMap(locations){
   var group = new  H.map.Group(),
       position,
       i;
 
   // Add a marker for each location found
   for (i = 0;  i < locations.length; i += 1) {
     let location = locations[i];
     marker = new H.map.Marker(location.position);
     marker.label = location.address.label;
     group.addObject(marker);
   }
 
   group.addEventListener('tap', function (evt) {
     map.setCenter(evt.target.getGeometry());
     openBubble(
        evt.target.getGeometry(), evt.target.label);
   }, false);
 
   // Add the locations group to the map
   map.addObject(group);
   map.getViewModel().setLookAtData({
     bounds: group.getBoundingBox()
   });
 }
 //#endregion
function displayChart(){
 var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	theme: "light2", // "light1", "light2", "dark1", "dark2"
	title:{
		text: "Addresses match level"
	},
	axisY: {
		title: "Match level count"
	},
	data: [{        
		type: "column",  
		showInLegend: true, 
		legendMarkerColor: "grey",
		dataPoints: [      
			{ y: 300878, label: "House number" },
			{ y: 266455,  label: "street" },
			{ y: 169709,  label: "district" },
			{ y: 158400,  label: "county" },
			{ y: 142503,  label: "city" },
			{ y: 101500, label: "country" }
		]
	}]
});
chart.render();
}
export { marker, geocoder, map }

