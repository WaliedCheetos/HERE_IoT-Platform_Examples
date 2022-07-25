import { config } from "./config.js";
import { map, ui, mapGroup } from "./app.js";
import { log } from "./logger.js";
import { GeocodeBenchmarkResult } from "./geocodeBenchmarkResult.js";
//logic
//1- select number of records from ARAMEX sample data
//2- geocode these addresses
//3- compare each address result with ARAMEX CourierLatitude/CourierLongitude
//4- report geocoded address scoring


var geocodeBenchmarkResults = [];
var customerSampleSized = [];

async function getAddressLocation_geocoding(text){

  let addressText = String(text).split('|')[1];
  let courierLocation = `${(text).split('|')[0].split(',')[0]},${(text).split('|')[0].split(',')[1]}`;
  let geocodingRequest ;


  if (config.customerSample.includeVerifiedLocation) {
    geocodingRequest  =  `https://search.hereapi.com/v1/geocode?q=${addressText}&at=${courierLocation}&lang=en-US&limit=1&apikey=${config.hereCredentials.apikey}`;

  } else {
    geocodingRequest  =  `https://search.hereapi.com/v1/geocode?q=${addressText}&qq=country=${config.customerSample.country};city=${config.customerSample.city}&lang=en-US&limit=5&apikey=${config.hereCredentials.apikey}`;
  }


log(geocodingRequest, config.log.logLevels.DEBUG);
try {
        let response = await fetch(geocodingRequest);
        return await response.json();
    } catch (error) {
        log(error, config.log.logLevels.ERROR);
    }
}

function addGeocodedAddressResult(address, geocodedAddress, geocodeBenchmarkResult){
  try {

    let addressText = String(address).split('|')[1];
    let courierLocation = [Number((String(address).split('|')[0]).split(',')[0]), Number((String(address).split('|')[0]).split(',')[1])];

    if (geocodedAddress.items.length == 0){
      log(`No Address found - ${JSON.stringify(geocodedAddress)}`, config.log.logLevels.DEBUG);
      
      geocodeBenchmarkResult.addressText = addressText;
      geocodeBenchmarkResult.remarks = `No Address found!`;

      //geocodeBenchmarkResults.push(geocodeBenchmarkResult);
  }
  else {
              // console.log(geocodedAddress, config.log.logLevels.DEBUG);

              geocodedAddress.items.sort((a, b)=> (
                calculateDistance(courierLocation, [a.position.lat, a.position.lng]) > calculateDistance(courierLocation, [b.position.lat, b.position.lng]) ? 1 : -1
                )
            );
            
            // console.log(geocodedAddress, config.log.logLevels.DEBUG);      
    
    // let geocodedAddressLocation = [geocodedAddress.items[0].access[0].lat, geocodedAddress.items[0].access[0].lng];
          let geocodedAddressLocation;

          if (geocodedAddress.hasOwnProperty('access')) {
            geocodedAddressLocation = [geocodedAddress.items[0].access[0].lat, geocodedAddress.items[0].access[0].lng];
          } else {
            geocodedAddressLocation  = [geocodedAddress.items[0].position.lat, geocodedAddress.items[0].position.lng];
          }
          
         
          
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
          var mapGroup_result= createResultGroup(polylinePoints,mapGroup_resultData, "1|G");


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

          // geocodeBenchmarkResults.push(geocodeBenchmarkResult);
      }
  } catch (error) {
    log(error, config.log.logLevels.ERROR);
  }
}

async function getAddressLocation_places(text){
  
  let addressText = String(text).split('|')[1];
  let courierLocation = `${(text).split('|')[0].split(',')[0]},${(text).split('|')[0].split(',')[1]}`;
  let placesDiscoverRequest ;


  if (config.customerSample.includeVerifiedLocation) {
    placesDiscoverRequest  =  `https://search.hereapi.com/v1/discover?q=${addressText}&at=${courierLocation}&lang=en-US&limit=1&apikey=${config.hereCredentials.apikey}`;

  } else {
    placesDiscoverRequest  =  `https://search.hereapi.com/v1/discover?q=${addressText}&in=countryCode:${config.customerSample.countrycode}&in=bbox:${config.customerSample.bbox}&lang=en-US&limit=5&apikey=${config.hereCredentials.apikey}`;
  }

  log(placesDiscoverRequest, config.log.logLevels.DEBUG);
  try {
          let response = await fetch(placesDiscoverRequest);
          return await response.json();
      } catch (error) {
          log(error, config.log.logLevels.ERROR);
      }
  }

  function addPlacesAddressResult(address, placesAddress, geocodeBenchmarkResult){
    try {
  
      let addressText = String(address).split('|')[1];
      let courierLocation = [Number((String(address).split('|')[0]).split(',')[0]), Number((String(address).split('|')[0]).split(',')[1])];
  
      if (placesAddress.items.length == 0){
        log(`No Places Address found - ${JSON.stringify(placesAddress)}`, config.log.logLevels.DEBUG);
        
        geocodeBenchmarkResult.addressText = addressText;
        geocodeBenchmarkResult.remarks = `No Places Address found!`;
  
        //geocodeBenchmarkResults.push(geocodeBenchmarkResult);
    }

        else if (placesAddress.items.length > 0){
      
          // console.log(placesAddress, config.log.logLevels.DEBUG);

          placesAddress.items.sort((a, b)=> (
              calculateDistance(courierLocation, [a.position.lat, a.position.lng]) > calculateDistance(courierLocation, [b.position.lat, b.position.lng]) ? 1 : -1
              )
          );
          
          // console.log(placesAddress, config.log.logLevels.DEBUG);


          let placesAddressLocation ;

          if (placesAddress.hasOwnProperty('access')) {
            placesAddressLocation = [placesAddress.items[0].access[0].lat, placesAddress.items[0].access[0].lng];
          
          } else {
            placesAddressLocation  = [placesAddress.items[0].position.lat, placesAddress.items[0].position.lng];
          
          }
          


          let courier_2_placesAddress_distance = calculateDistance(courierLocation, placesAddressLocation);

          let courier_2_placesAddress_proximity; 

          if (courier_2_placesAddress_distance > 0 && courier_2_placesAddress_distance <= 10) {
              courier_2_placesAddress_proximity = "0 ~ 10 meters";
          }else if (courier_2_placesAddress_distance > 10 && courier_2_placesAddress_distance <= 50) {
            courier_2_placesAddress_proximity = "10 ~ 50 meters";
          }else if (courier_2_placesAddress_distance > 50 && courier_2_placesAddress_distance <= 100) {
            courier_2_placesAddress_proximity = "50 ~ 100 meters";
          }else if (courier_2_placesAddress_distance > 100 && courier_2_placesAddress_distance <= 200) {
            courier_2_placesAddress_proximity = "100 ~ 200 meters";
          }else if (courier_2_placesAddress_distance > 200 && courier_2_placesAddress_distance <= 400) {
            courier_2_placesAddress_proximity = "200 ~ 400 meters";
          }else if (courier_2_placesAddress_distance > 400 && courier_2_placesAddress_distance <= 800) {
            courier_2_placesAddress_proximity = "400 ~ 800 meters";
          }else if (courier_2_placesAddress_distance > 800) {
            courier_2_placesAddress_proximity = "> 800 meters";
          }

          // log(`${geocodedAddress.items[0].address.label} - ${String(geocodedAddress.items[0].access[0].lat)},${String(geocodedAddress.items[0].access[0].lng)} - Distance = ${courier_2_geocodedAddress_distance} meters`, config.log.logLevels.DEBUG);
          log(`${placesAddress.items[0].address.label} - ${String(placesAddress.items[0].position.lat)},${String(placesAddress.items[0].position.lng)} - Distance = ${courier_2_placesAddress_distance} meters`, config.log.logLevels.DEBUG);

          var polylinePoints = [
            Number((String(address).split('|')[0]).split(',')[0]), 
            Number((String(address).split('|')[0]).split(',')[1]), 
            0,
            placesAddress.items[0].position.lat, 
            placesAddress.items[0].position.lng, 
              0, 
          ];

          var mapGroup_resultData = `
            <div>Original Address: <b> ${addressText}</b></div>
            </br>
            <div><a href="https://wego.here.com/location/?map=${courierLocation},17,normal" target="_blank">Courier Location</a></div>
            </br>
            <div>Distance between 2 addresses: <b> ${Math.ceil(courier_2_placesAddress_distance)} Ms</b></div>
            </br>
            <div>Places Address: <b> ${placesAddress.items[0].address.label}</b></div>
            </br>
            <div><a href="https://wego.here.com/location/?map=${placesAddressLocation},17,normal" target="_blank">Places Address Location</a></div>
            </br>
          `
          var mapGroup_result = createResultGroup(polylinePoints,mapGroup_resultData, '1|P');


 
          geocodeBenchmarkResult.placesAddressText = placesAddress.items[0].address.label;
          geocodeBenchmarkResult.placesAddressLocation = placesAddressLocation;
          geocodeBenchmarkResult.placesAddressDistance = courier_2_placesAddress_distance;
          geocodeBenchmarkResult.placesAddressProximity = courier_2_placesAddress_proximity;
          geocodeBenchmarkResult.placesAddressMapGroupBoundingBox = mapGroup_result.getBoundingBox();
          // geocodeBenchmarkResult.placesAddressMapGroup = mapGroup_result;

          // geocodeBenchmarkResults.push(geocodeBenchmarkResult);


          }

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

        let geocodedAddress = await getAddressLocation_geocoding(address);
        addGeocodedAddressResult(address, geocodedAddress, geocodeBenchmarkResult);

        let placesAddress = await getAddressLocation_places(address);
        addPlacesAddressResult(address, placesAddress, geocodeBenchmarkResult);

        geocodeBenchmarkResults.push(geocodeBenchmarkResult);
        
          }
            // get the shape's bounding box and adjust the camera position
            map.getViewModel().setLookAtData({
                bounds: mapGroup.getBoundingBox()
            }, true);   

            log(JSON.stringify(geocodeBenchmarkResults), config.log.logLevels.DEBUG);
            // log(JSON.stringify(geocodeBenchmarkResults, getCircularReplacer()), config.log.logLevels.DEBUG);

            var geocodedAddressResultTypes_Dataset = geocodeBenchmarkResults.reduce( (acc, o) => (acc[o.geocodedAddressResultType] = (acc[o.geocodedAddressResultType] || 0)+1, acc), {} );
            var geocodedAddressProximity_Dataset = geocodeBenchmarkResults.reduce( (acc, o) => (acc[o.geocodedAddressProximity] = (acc[o.geocodedAddressProximity] || 0)+1, acc), {} );
            var placesAddressProximity_Dataset = geocodeBenchmarkResults.reduce( (acc, o) => (acc[o.placesAddressProximity] = (acc[o.placesAddressProximity] || 0)+1, acc), {} );

var x = {
  '< 200 m': geocodeBenchmarkResults.filter(item => (item.geocodedAddressDistance <= 200)).length,
  '200 > 400 M': geocodeBenchmarkResults.filter(item => (item.geocodedAddressDistance >= 200 && item.geocodedAddressDistance < 400)).length,
  '400 > 800 M': geocodeBenchmarkResults.filter(item => (item.geocodedAddressDistance >= 400 && item.geocodedAddressDistance < 800)).length,
  '> 800 M': geocodeBenchmarkResults.filter(item => (item.geocodedAddressDistance >= 800)).length,
}
var y = {
  '< 200 m': geocodeBenchmarkResults.filter(item => (item.placesAddressDistance <= 200)).length,
  '200 > 400 M': geocodeBenchmarkResults.filter(item => (item.placesAddressDistance >= 200 && item.geocodedAddressDistance < 400)).length,
  '400 > 800 M': geocodeBenchmarkResults.filter(item => (item.placesAddressDistance >= 400 && item.geocodedAddressDistance < 800)).length,
  '> 800 M': geocodeBenchmarkResults.filter(item => (item.placesAddressDistance >= 800)).length
}

            log(JSON.stringify(geocodedAddressResultTypes_Dataset), config.log.logLevels.DEBUG);
            log(JSON.stringify(geocodedAddressProximity_Dataset), config.log.logLevels.DEBUG);
            log(JSON.stringify(placesAddressProximity_Dataset), config.log.logLevels.DEBUG);
            log(JSON.stringify(x), config.log.logLevels.DEBUG);
            log(JSON.stringify(y), config.log.logLevels.DEBUG);

            // WaliedCheetos
            renderGeocodeBenchmarkResults_Analytics(geocodedAddressResultTypes_Dataset, geocodedAddressProximity_Dataset, placesAddressProximity_Dataset, x, y);
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
 function createResultGroup(_points, data, markersLabels) {
    var svgCircle = '<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="10" cy="10" r="7" fill="transparent" stroke="red" stroke-width="4"/>' +
        '</svg>',

        svgMarkup = '<svg  width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
  '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="22" />' +
  '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
  'text-anchor="middle" fill="${STROKE}" >${INDEX}</text></svg>',

    // Add the first marker
     bearsIcon = new H.map.Icon(svgMarkup.replace('${FILL}', 'blue').replace('${STROKE}', 'red').replace('${INDEX}', markersLabels.split('|')[0])),
     bearsMarker = new H.map.Marker({lat: _points[0], lng: _points[1] }, {icon: bearsIcon}),

// Add the second marker.
 cubsIcon = new H.map.Icon(svgMarkup.replace('${FILL}', 'white').replace('${STROKE}', 'orange').replace('${INDEX}', markersLabels.split('|')[1])),
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

function renderGeocodeBenchmarkResults_Analytics(geocodedAddressResultTypes_Dataset, geocodedAddressProximity_Dataset, placesAddressProximity_Dataset, x, y){
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

labels = Object.keys(x);
data = {
  labels: labels,
  datasets: [
    {
      label: 'Geocoded Addresses',
      data: Object.values(x),
      borderColor: 'rgb(255, 99, 132)',
      // borderColor: CHART_COLORS.red,
      // backgroundColor: transparentize(CHART_COLORS.red, 0.5),
    },
    {
      label: 'Places Addresses',
      data: Object.values(y),
      borderColor: 'rgb(54, 162, 235)',
      // borderColor: CHART_COLORS.blue,
      // backgroundColor: transparentize(CHART_COLORS.blue, 0.5),
    }
  ]
};

 chartConfig = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    // plugins: {
    //   legend: {
    //      position: 'top',
    //   },
    //   title: {
    //     display: true,
    //     text: 'Geocode vs One-box (Proximity)'
    //   }
    // }
  },
};

var chart03 = new Chart(document.getElementById('chart03'), chartConfig);

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
     if (geocodeBenchmarkResult.geocodedAddressDistance <= 200) {
      cell_geocodedAddressText.style.backgroundColor = "yellow";
     }

    


    var cell_geocodedAddressResultType = newRow.insertCell(2);
    cell_geocodedAddressResultType.innerHTML = geocodeBenchmarkResult.geocodedAddressResultType;

    var cell_geocodedAddressProximity = newRow.insertCell(3);
    cell_geocodedAddressProximity.innerHTML = geocodeBenchmarkResult.geocodedAddressProximity;

    var cell_geocodedAddressQueryScore = newRow.insertCell(4);
    cell_geocodedAddressQueryScore.innerHTML = geocodeBenchmarkResult.geocodedAddressQueryScore;


    var cell_placesAddressText = newRow.insertCell(5);
    cell_placesAddressText.innerHTML = geocodeBenchmarkResult.placesAddressText;
    if (geocodeBenchmarkResult.placesAddressDistance <= 200) {
      cell_placesAddressText.style.backgroundColor = "yellow";
     }


    var cell_placesAddressProximity = newRow.insertCell(6);
    cell_placesAddressProximity.innerHTML = geocodeBenchmarkResult.placesAddressProximity;


    // var registerOnClickHandler = function(row) {
    //   return function(){
    //     try {
    //       // get the shape's bounding box and adjust the camera position
    //       map.getViewModel().setLookAtData({
    //         // bounds: geocodeBenchmarkResult.geocodedAddressMapGroup.getBoundingBox()
    //         bounds: geocodeBenchmarkResult.geocodedAddressMapGroupBoundingBox
    //       }, true);
    //     } catch (error) {
    //     log(error, config.log.logLevels.ERROR);
    //     }
    //   }      
    // }

    // newRow.onclick = registerOnClickHandler(newRow);


    cell_geocodedAddressText.addEventListener('click', function(){
      try {
        // get the shape's bounding box and adjust the camera position
        map.getViewModel().setLookAtData({
          bounds: geocodeBenchmarkResult.geocodedAddressMapGroupBoundingBox
        }, true);
      } catch (error) {
      log(error, config.log.logLevels.ERROR);
      }
});

    cell_placesAddressText.addEventListener('click', function(){
      try {
        // get the shape's bounding box and adjust the camera position
        map.getViewModel().setLookAtData({
          bounds: geocodeBenchmarkResult.placesAddressMapGroupBoundingBox
        }, true);
      } catch (error) {
      log(error, config.log.logLevels.ERROR);
      }
});

  });
} catch (error) {
 log(error, config.log.logLevels.ERROR); 
}

}

 function processCustomerSample(sampleSize){
var input = document.getElementById('fileInput')


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
          // // CourierLatitude, CourierLongitude, CleanedAddress
          // var sampleItem = `${row[5]},${row[6]}|${row[4]}`;

          // PredictedLatitude, PredictedLongitude, CleanedAddress
          var sampleItem = `${row[11]},${row[12]}|${row[4]}`;

          customerSampleSized.push(sampleItem);
         }

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

export {processCustomerSample}


