
import { config } from './config';
import { log } from './logger';
import { GeocodeBenchmarkResult } from './geocodeBenchmarkResult';

// Initialize HERE Map
const platform = new H.service.Platform({ apikey: config.hereCredentials.apikey });
const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(document.getElementById('map_HERE'), defaultLayers.vector.normal.map, {
   center: config.map.center,
   zoom: config.map.zoom,
   pixelRatio: window.devicePixelRatio || 1,
   padding: {top: 50, left: 50, bottom: 50, right: 50}
});
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const provider = map.getBaseLayer().getProvider();

// //Initialize router and geocoder
// const router = platform.getRoutingService();
// const geocoder = platform.getGeocodingService();

window.addEventListener('resize', () => map.getViewPort().resize());
// create default UI with layers provided by the platform
var ui = H.ui.UI.createDefault(map, defaultLayers);

var mapGroup = new H.map.Group();
map.addObject(mapGroup);

var geocodeBenchmarkResults = [];



//logic
//1- select number of records from ARAMEX sample data
//2- geocode these addresses
//3- compare each address result with ARAMEX CourierLatitude/CourierLongitude
//4- report geocoded address scoring

var couriersSample = [
    '25.0449,55.125758|apartment 22Lavender Rd - Jebel Ali Village - The Gardens - Dubai - United Arab EmiratesnoJebel Ali Villagebuilding 46 apartment 22 Dubai TODO',
    '25.019756,55.260964|Dubai Al Hebiah 3 Villa 34 Rockwood Villa 34 Rockwood Villa 34  DAMAC Hills  Rockwood Unnamed Road - DAMAC Hills - Dubai - United Arab Emirates Al Hebiah 3',
    '25.096138,55.169458|Dubai Al Thanyah 3  Al ghaf 1A   Apt 210 al ghaf 1A street 1 greens dubai Please call 0506885428 to schedule delivery Al Ghaf  2'

];

var customerSampleSized = [];


async function getAddressLocation(address){
let geocodingRequest =  `https://search.hereapi.com/v1/geocode?q=${address}&qq=country=${config.customerSample.country};city=${config.customerSample.city}&lang=en-US&limit=1&apikey=${config.hereCredentials.apikey}`;

log(geocodingRequest, config.log.logLevels.DEBUG);
try {
        let response = await fetch(geocodingRequest);
        return await response.json();
    } catch (error) {
        log(error, config.log.logLevels.ERROR);
    }
}

function clearResults(){
  customerSampleSized = [];
    mapGroup.removeAll();
    geocodeBenchmarkResults = [];

  var geocodingResultsTable = document.getElementById('geocodingResultsTable');
try {
  while (geocodingResultsTable.rows.length > 1) {
    geocodingResultsTable.deleteRow(1);
  }
} catch (error) {
 log(error, config.log.logLevels.ERROR); 
}
}

 async function processAddressesLocations(addresses){
     clearResults();
     var index = 0;
     var sampleSize  = addresses.length;
     for (const addressIndex in addresses){
      index++;


      log(`Status: ${config.statusIndicators.PROCESSING} ${index} out of ${sampleSize}`, config.log.logLevels.DEBUG);
      document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.PROCESSING} ${index} out of ${sampleSize}`;
     

         var geocodeBenchmarkResult = new GeocodeBenchmarkResult();

        var address = addresses[addressIndex];
        log(`${addressIndex} - ${address}`, config.log.logLevels.DEBUG);

        //let courierLocation = String(address).split('|')[0];
        let addressText = String(address).split('|')[1];

        let geocodedAddress = await getAddressLocation(addressText);

        if (geocodedAddress.items.length == 0){
            log(`No Address found - ${JSON.stringify(geocodedAddress)}`, config.log.logLevels.DEBUG);
            
            geocodeBenchmarkResult.addressText = addressText;
            geocodeBenchmarkResult.remarks = `No Address found!`;

            geocodeBenchmarkResults.push(geocodeBenchmarkResult);
        }
        else{
                // let geocodedAddressLocation = [geocodedAddress.items[0].access[0].lat, geocodedAddress.items[0].access[0].lng];
                let geocodedAddressLocation = [geocodedAddress.items[0].position.lat, geocodedAddress.items[0].position.lng];
                let courierLocation = [Number((String(address).split('|')[0]).split(',')[0]), Number((String(address).split('|')[0]).split(',')[1])];
                
                let courier_2_geocodedAddress_distance = calculateDistance(courierLocation, geocodedAddressLocation);

                let courier_2_geocodedAddress_proximity; 

                if (courier_2_geocodedAddress_distance > 0 && courier_2_geocodedAddress_distance <= 10) {
                    courier_2_geocodedAddress_proximity = "0 ~ 10 meters";
                }else if (courier_2_geocodedAddress_distance > 10 && courier_2_geocodedAddress_distance <= 50) {
                    courier_2_geocodedAddress_proximity = "10 ~ 50 meters";
                }else if (courier_2_geocodedAddress_distance > 50 && courier_2_geocodedAddress_distance <= 100) {
                    courier_2_geocodedAddress_proximity = "50 ~ 100 meters";
                }else if (courier_2_geocodedAddress_distance > 100 && courier_2_geocodedAddress_distance <= 200) {
                    courier_2_geocodedAddress_proximity = "100 ~ 200 meters";
                }else if (courier_2_geocodedAddress_distance > 200 && courier_2_geocodedAddress_distance <= 400) {
                    courier_2_geocodedAddress_proximity = "200 ~ 400 meters";
                }else if (courier_2_geocodedAddress_distance > 400 && courier_2_geocodedAddress_distance <= 800) {
                    courier_2_geocodedAddress_proximity = "400 ~ 800 meters";
                }else if (courier_2_geocodedAddress_distance > 800) {
                    courier_2_geocodedAddress_proximity = "> 800 meters";
                }

                // log(`${geocodedAddress.items[0].address.label} - ${String(geocodedAddress.items[0].access[0].lat)},${String(geocodedAddress.items[0].access[0].lng)} - Distance = ${courier_2_geocodedAddress_distance} meters`, config.log.logLevels.DEBUG);
                log(`${geocodedAddress.items[0].address.label} - ${String(geocodedAddress.items[0].position.lat)},${String(geocodedAddress.items[0].position.lng)} - Distance = ${courier_2_geocodedAddress_distance} meters`, config.log.logLevels.DEBUG);

                var polylinePoints = [
                  Number((String(address).split('|')[0]).split(',')[0]), 
                  Number((String(address).split('|')[0]).split(',')[1]), 
                  0,
                    geocodedAddress.items[0].position.lat, 
                    geocodedAddress.items[0].position.lng, 
                    0, 
                ];

                var mapGroup_resultData = `
                  <div>Original Address: <b> ${addressText}</b></div>
                  </br>
                  <div><a href="https://wego.here.com/location/?map=${courierLocation},17,normal" target="_blank">Courier Location</a></div>
                  </br>
                  <div>Distance between 2 addresses: <b> ${Math.ceil(courier_2_geocodedAddress_distance)} Ms</b></div>
                  </br>
                  <div>Geocoded Address: <b> ${geocodedAddress.items[0].address.label}</b></div>
                  </br>
                  <div><a href="https://wego.here.com/location/?map=${geocodedAddressLocation},17,normal" target="_blank">Geocoded Address Location</a></div>
                  </br>
                `
                var mapGroup_result= createResultGroup(polylinePoints,mapGroup_resultData);


                geocodeBenchmarkResult.addressText = addressText;
                geocodeBenchmarkResult.addressCourierLocation = courierLocation;
                geocodeBenchmarkResult.geocodedAddressText = geocodedAddress.items[0].address.label;
                geocodeBenchmarkResult.geocodedAddressResultType = geocodedAddress.items[0].resultType;
                geocodeBenchmarkResult.geocodedAddressLocation = geocodedAddressLocation;
                geocodeBenchmarkResult.geocodedAddressDistance = courier_2_geocodedAddress_distance;
                geocodeBenchmarkResult.geocodedAddressProximity = courier_2_geocodedAddress_proximity;
                geocodeBenchmarkResult.geocodedAddressQueryScore = geocodedAddress.items[0].scoring.queryScore;
                geocodeBenchmarkResult.geocodedAddressMapGroupBoundingBox = mapGroup_result.getBoundingBox();
                // geocodeBenchmarkResult.geocodedAddressMapGroup = mapGroup_result;

                geocodeBenchmarkResults.push(geocodeBenchmarkResult);


            }
        }
            // get the shape's bounding box and adjust the camera position
            map.getViewModel().setLookAtData({
                bounds: mapGroup.getBoundingBox()
            }, true);   

            log(JSON.stringify(geocodeBenchmarkResults), config.log.logLevels.DEBUG);
            // log(JSON.stringify(geocodeBenchmarkResults, getCircularReplacer()), config.log.logLevels.DEBUG);

            var geocodedAddressResultTypes_Dataset = geocodeBenchmarkResults.reduce( (acc, o) => (acc[o.geocodedAddressResultType] = (acc[o.geocodedAddressResultType] || 0)+1, acc), {} );

            var geocodedAddressProximity_Dataset = geocodeBenchmarkResults.reduce( (acc, o) => (acc[o.geocodedAddressProximity] = (acc[o.geocodedAddressProximity] || 0)+1, acc), {} );

            log(JSON.stringify(geocodedAddressResultTypes_Dataset), config.log.logLevels.DEBUG);
            log(JSON.stringify(geocodedAddressProximity_Dataset), config.log.logLevels.DEBUG);

            renderGeocodeBenchmarkResults_Analytics(geocodedAddressResultTypes_Dataset, geocodedAddressProximity_Dataset);
            renderGeocodeBenchmarkResults(geocodeBenchmarkResults);
            

    //                 //   var marker_geocodedAddressLocation = new H.map.Marker(geocodedAddress.items[0].access[0]);
    //                 //   var html_geocodedAddressLocation = `<div><a>WaliedCheetos</a></div>
    //                 //   <div>
    //                 //   ${geocodedAddress.items[0].address.label}
    //                 //   <br />
    //                 //   Distance = ${courier_2_geocodedAddress_distance} meters
    //                 //   </div>`;
    //                 //   marker_geocodedAddressLocation.setData(html_geocodedAddressLocation);

    //                 //     var marker_courierLocation = new H.map.Marker({
    //                 //       lat:Number((String(address).split('|')[0]).split(',')[0]),
    //                 //       lng:Number((String(address).split('|')[0]).split(',')[1])
    //                 //     });
    //                 //     var html_courierLocation = `<div><a>WaliedCheetos</a></div>
    //                 //     <div>
    //                 //     ${addressText}
    //                 //     <br />
    //                 //     Distance = ${courier_2_geocodedAddress_distance} meters
    //                 //     </div>`;
    //                 //     marker_courierLocation.setData(html_courierLocation);




}

function addMarker2MapGroup(group, coordinate, data) {
  
    var marker = new H.map.Marker(coordinate);
  
    // add custom data to the marker
    marker.setData(html);
    mapGroup.addObject(marker);
  }

function calculateDistance(xy1, xy2){
    try {
        var from = turf.point(xy1);
        var to = turf.point(xy2);
        var options = {units: 'kilometers'};
        return (turf.distance(from, to, options) * 1000);
    } catch (error) {
        log(error, config.log.logLevels.ERROR);
    }
}

                 
/**
 * Adds resizable geo polyline to map
 *
 * @param {H.Map} map                      A HERE Map instance within the application
 */
 function createResultGroup(_points, data) {
    var svgCircle = '<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="10" cy="10" r="7" fill="transparent" stroke="red" stroke-width="4"/>' +
        '</svg>',

        svgMarkup = '<svg  width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
  '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="22" />' +
  '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
  'text-anchor="middle" fill="${STROKE}" >${INDEX}</text></svg>',

    // Add the first marker
     bearsIcon = new H.map.Icon(svgMarkup.replace('${FILL}', 'blue').replace('${STROKE}', 'red').replace('${INDEX}', '1')),
     bearsMarker = new H.map.Marker({lat: _points[0], lng: _points[1] }, {icon: bearsIcon}),

// Add the second marker.
 cubsIcon = new H.map.Icon(svgMarkup.replace('${FILL}', 'white').replace('${STROKE}', 'orange').replace('${INDEX}', '2')),
 cubsMarker = new H.map.Marker({lat: _points[3], lng: _points[4] }, {icon: cubsIcon}),

        polyline = new H.map.Polyline(
          new H.geo.LineString(_points),
          {
            style: {fillColor: 'rgba(150, 100, 0, .8)', lineWidth: 10}
          }
        ),

        verticeGroup = new H.map.Group({
          visibility: false
        }),

        mainGroup = new H.map.Group({
        //   volatility: true, // mark the group as volatile for smooth dragging of all it's objects
          objects: [bearsMarker, cubsMarker, polyline, verticeGroup]
        }),
        polylineTimeout;
  
    // ensure that the polyline can receive drag events
    // polyline.draggable = true;
  
    // create markers for each polyline's vertice which will be used for dragging
    polyline.getGeometry().eachLatLngAlt(function(lat, lng, alt, index) {
      var vertice = new H.map.Marker(
        {lat, lng},
        {
          icon: new H.map.Icon(svgCircle, {anchor: {x: 10, y: 10}})
        }
      );
    //   vertice.draggable = true;
      vertice.setData({'verticeIndex': index})
      verticeGroup.addObject(vertice);
    });
  
    // add group with polyline and it's vertices (markers) on the map
    // _map.addObject(mainGroup);
    mapGroup.addObject(mainGroup);

    // event listener for main group to show markers if moved in with mouse (or touched on touch devices)
    mainGroup.addEventListener('pointerenter', function(evt) {
      if (polylineTimeout) {
        clearTimeout(polylineTimeout);
        polylineTimeout = null;
      }
  
      // show vertice markers
      verticeGroup.setVisibility(true);
    }, true);
  
 // add 'tap' event listener, that opens info bubble, to the group
 mainGroup.addEventListener('tap', function (evt) {
  // event target is the marker itself, group is a parent event target
  // for all objects that it contains
  var bubble = new H.ui.InfoBubble(map.screenToGeo(evt.currentPointer.viewportX,evt.currentPointer.viewportY), {
    // read custom data
    content: data
  });
  // show info bubble
  ui.addBubble(bubble);
}, false);

    // event listener for main group to hide vertice markers if moved out with mouse (or released finger on touch devices)
    // the vertice markers are hidden on touch devices after specific timeout
    mainGroup.addEventListener('pointerleave', function(evt) {
      var timeout = (evt.currentPointer.type == 'touch') ? 1000 : 0;
  
      // hide vertice markers
      polylineTimeout = setTimeout(function() {
        verticeGroup.setVisibility(false);
      }, timeout);
    }, true);
  
    // event listener for vertice markers group to change the cursor to pointer if mouse position enters this group
    verticeGroup.addEventListener('pointerenter', function(evt) {
      document.body.style.cursor = 'pointer';
    }, true);
  
    // event listener for vertice markers group to change the cursor to default if mouse leaves this group
    verticeGroup.addEventListener('pointerleave', function(evt) {
      document.body.style.cursor = 'default';
    }, true);
  
    // // event listener for vertice markers group to resize the geo polyline object if dragging over markers
    // verticeGroup.addEventListener('drag', function(evt) {
    //   var pointer = evt.currentPointer,
    //       geoLineString = polyline.getGeometry(),
    //       geoPoint = map.screenToGeo(pointer.viewportX, pointer.viewportY);
  
    //   // set new position for vertice marker
    //   evt.target.setGeometry(geoPoint);
  
    //   // set new position for polyline's vertice
    //   geoLineString.removePoint(evt.target.getData()['verticeIndex']);
    //   geoLineString.insertPoint(evt.target.getData()['verticeIndex'], geoPoint);
    //   polyline.setGeometry(geoLineString);
  
    //   // stop propagating the drag event, so the map doesn't move
    //   evt.stopPropagation();
    // }, true);

    return mainGroup;
  }

function renderGeocodeBenchmarkResults_Analytics(geocodedAddressResultTypes_Dataset, geocodedAddressProximity_Dataset){
    try {
        var labels = Object.keys(geocodedAddressResultTypes_Dataset);
         var data = Object.values(geocodedAddressResultTypes_Dataset);

        //  var ctx = canvas.getContext('2d');

        var chartConfig = {
   type: 'bar',
   data: {
      labels: labels,
      datasets: [{
         label: 'Geocoded address result types',
         data: data,
         backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
      }]
   },
   options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
};

var chart01 = new Chart(document.getElementById('chart01'), chartConfig);


labels = Object.keys(geocodedAddressProximity_Dataset);
data = Object.values(geocodedAddressProximity_Dataset);

chartConfig = {
    type: 'doughnut',
    data: {
       labels: labels,
       datasets: [{
          label: 'Geocoded address proximity ranges',
          data: data,
          backgroundColor: [
             'rgba(255, 99, 132, 0.2)',
             'rgba(255, 159, 64, 0.2)',
             'rgba(255, 205, 86, 0.2)',
             'rgba(75, 192, 192, 0.2)',
             'rgba(54, 162, 235, 0.2)',
             'rgba(153, 102, 255, 0.2)',
             'rgba(201, 203, 207, 0.2)'
           ],
           borderColor: [
             'rgb(255, 99, 132)',
             'rgb(255, 159, 64)',
             'rgb(255, 205, 86)',
             'rgb(75, 192, 192)',
             'rgb(54, 162, 235)',
             'rgb(153, 102, 255)',
             'rgb(201, 203, 207)'
           ],
           borderWidth: 1,
           hoverOffset: 4
       }]
    },
 };

var chart02 = new Chart(document.getElementById('chart02'), chartConfig);


    } catch (error) {
        log(error, config.log.logLevels.ERROR);
    }
} 


function renderGeocodeBenchmarkResults(results){
var geocodingResultsTable = document.getElementById('geocodingResultsTable');

try {
  results.forEach(geocodeBenchmarkResult => {
    
    var newRow = geocodingResultsTable.insertRow(geocodingResultsTable.length);
    
    var cell_addressText = newRow.insertCell(0);
    cell_addressText.innerHTML = geocodeBenchmarkResult.addressText;

    var cell_geocodedAddressText = newRow.insertCell(1);
    cell_geocodedAddressText.innerHTML = geocodeBenchmarkResult.geocodedAddressText;

    var cell_geocodedAddressResultType = newRow.insertCell(2);
    cell_geocodedAddressResultType.innerHTML = geocodeBenchmarkResult.geocodedAddressResultType;

    var cell_geocodedAddressProximity = newRow.insertCell(3);
    cell_geocodedAddressProximity.innerHTML = geocodeBenchmarkResult.geocodedAddressProximity;

    var cell_geocodedAddressQueryScore = newRow.insertCell(4);
    cell_geocodedAddressQueryScore.innerHTML = geocodeBenchmarkResult.geocodedAddressQueryScore;

    var registerOnClickHandler = function(row) {
      return function(){
        try {
          // get the shape's bounding box and adjust the camera position
          map.getViewModel().setLookAtData({
            // bounds: geocodeBenchmarkResult.geocodedAddressMapGroup.getBoundingBox()
            bounds: geocodeBenchmarkResult.geocodedAddressMapGroupBoundingBox
          }, true);
        } catch (error) {
        log(error, config.log.logLevels.ERROR);
        }
      }      
    }

    newRow.onclick = registerOnClickHandler(newRow);

  });
} catch (error) {
 log(error, config.log.logLevels.ERROR); 
}
}



// var testGeocodingRequest = `https://search.hereapi.com/v1/geocode?q=apartment 22Lavender Rd - Jebel Ali Village - The Gardens - Dubai - United Arab EmiratesnoJebel Ali Villagebuilding 46 apartment 22 Dubai TODO&lang=en-US&limit=1&apikey=${config.hereCredentials.apikey}`;
// var geocode = function(xyz){
//     try {
//         fetch(`${xyz}`)
//         .then(response => response.json())
//         .then(
//             data => console.debug(`WaliedCheetos - DEBUG : ${JSON.stringify(data)}`)
//             );
//     } catch (error) {
//         console.error(`WaliedCheetos - ERROR : ${error}`);
//     }
// }

// geocode(testGeocodingRequest);


 function processCustomerSample(sampleSize){
var input = document.getElementById('input')


input.addEventListener('change', () => {
  log(`Status: ${config.statusIndicators.PROCESSING}`, config.log.logLevels.DEBUG);
  document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.PROCESSING}`;

    try {
      if (!input.files[0]) {
        alert('No files selected!');
        return ;
      }
      readXlsxFile(input.files[0]).then(async (rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.

        // removing the first row because it is a table header
        rows = rows.slice(1, sampleSize);
        //var index = 0;
         
        for await (const row of rows){
           

          // var sampleItem = `${row[5]},${row[6]}|${row[2]}`;
          var sampleItem = `${row[5]},${row[6]}|${row[4]}`;
          customerSampleSized.push(sampleItem);
      
         }

        // for (let index = 1; index < sampleSize; index++) {
        //   for await (var row of rows){
        //     log(`Status: ${config.statusIndicators.PROCESSING} ${index} out of ${sampleSize}`, config.log.logLevels.DEBUG);
        //               document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.PROCESSING} ${index} out of ${sampleSize}`;
        //                 const row = rows[index];
        //                 var sampleItem = `${row[5]},${row[6]}|${row[2]}`;
        //                 customerSampleSized.push(sampleItem);
        // }

        log(`Final sample size ${customerSampleSized.length}`, config.log.logLevels.DEBUG);
        await processAddressesLocations(customerSampleSized);

        log(`Status: ${config.statusIndicators.COMPLETED}`, config.log.logLevels.DEBUG);
        document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.COMPLETED}`;
      });
    } catch (error) {
      log(error, config.log.logLevels.ERROR);
    }
  });
}

//processAddressesLocations(couriersSample);
processCustomerSample(config.customerSample.sampleSize);

export { map }