import { initials } from '../../js/SolutionsDay2021/config.js'
import {probeSample_1000} from '../../js/SolutionsDay2021/ProbeSample_1000.js'


//#region business logic
/**
 * Observes master map events to control the second one
 *
 * @param  {H.Map} firstMap  A HERE Map instance within the application
 *  @param  {H.Map} secondMap  A HERE Map instance within the application
 */

 function synchronizeMaps(firstMap, secondMap) {
  // get view model objects for both maps, view model contains all data and
  // utility functions that're related to map's geo state
  var viewModel1 = firstMap.getViewModel(),
      viewModel2 = secondMap.getViewModel();

  // set up view change listener on interactive map
  firstMap.addEventListener('mapviewchange', function() {
    // on every view change take a "snapshot" of a current geo data for
    // interactive map and set this values to the second, non-interactive, map
    viewModel2.setLookAtData(viewModel1.getLookAtData());
  });
}

function loadProbe(map) {

    try {
          // First we need to create an array of DataPoint objects, for the ClusterProvider
          var dataPoints = [];
    
    // JSON.parse(initials.probeSample_1000).forEach(probeSample => {
      probeSample_1000.forEach(probeSample => {
      dataPoints.push(
        new H.clustering.DataPoint(
          probeSample.location.latitude,
          probeSample.location.longitude,
          null,
          probeSample));
    });
  
    // Create a clustering provider with custom options for clusterizing the input
    var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
      clusteringOptions: {
        // Maximum radius of the neighbourhood
        eps: 32,
        // minimum weight of points required to form a cluster
        minWeight: 2,
  //This strategy implements an efficient way to cluster large sets of data points.
  //      strategy: H.clustering.Provider.Strategy.FASTGRID
  
  //this strategy uses the same algorithm of clustering as the GRID, but clusters on the viewport basis and utilizes Web Workers for a better performance. 
  //It is best suited for data sets that are subject to frequent updates.
  strategy: H.clustering.Provider.Strategy.DYNAMICGRID
      }
    });
    
    clusteredDataProvider.addEventListener('tap', handleClusterTap, {passive: true});
    clusteredDataProvider.addEventListener('update', handleClusterDataUpdate, {passive: true});
  
    // Create a layer tha will consume objects from our clustering provider
    var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
    
  
  
    // To make objects from clustering provder visible,
    // we need to add our layer to the map
    map.addLayer(clusteringLayer);
  
  } catch (error) {
    console.error(`WaliedCheeetos - EXCEPTION: ${error}`);
    }
  }
  
  function handleClusterTap(evt) {
    try {
      // console.debug(`WaliedCheeetos - Debug: ${evt}`);
  
      if(evt.target.getData().isCluster()){
        // get the shape's bounding box and adjust the camera position
        map_01.getViewModel().setLookAtData({
            zoom: evt.target.getData().minZoom,
            bounds: evt.target.getData().getBoundingBox()
          }, true);
      }
      else{
        generateRandomData_sync(map_02, evt.target.data.getPosition());
      }
     } catch (error) {
      console.error(`WaliedCheeetos - EXCEPTION: ${error}`);
    }
  }
  
  function handleClusterDataUpdate(evt) {
    try {
      // console.debug(`WaliedCheeetos - Debug: ${evt}`);
    } catch (error) {
      console.error(`WaliedCheeetos - EXCEPTION: ${error}`);
    }
  }
  
  //#region AI predictive analysis 

var randomData = [];
var randomPoints = [];
var randomParts = [];
var mapGroup = new H.map.Group();

var geojson = {};
 geojson['type'] = 'FeatureCollection';
 geojson['features'] = [];



function generateRandomParts() {
var randomOccuranceCount = (Math.random() * (13-1) + 1);
var randomPart = (initials.randomDataSetSpecs.parts[Math.floor(Math.random() * initials.randomDataSetSpecs.parts.length)]);

for (let index = 0; index < randomOccuranceCount; index++) {
randomParts.push(randomPart);
}

  // randomParts(randomOccuranceCount).fill(randomPart);
}

function addMarker2MapGroup(group, coordinate, data) {
  
  var marker = new H.map.Marker(coordinate);

  // add custom data to the marker
  marker.setData(html);
  mapGroup.addObject(marker);
}

//generates random id;
let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function createRandomData_Geocoded(reverseGeocodedItem, metaData) {
  generateRandomParts();

    reverseGeocodedItem.items.forEach(item => {

        var heatValue = Math.random() * (4-1) + 1;
        randomPoints.push(JSON.parse(`{"lat":${item.position.lat}, "lng":${item.position.lng}, "value":${heatValue}}`));


        var datatimeCurrent = new Date();

        var randomDataItem = {
       "type": "Feature",
       "geometry": {
         "type": "Point",
         "coordinates": `${item.position.lat},${item.position.lng}`
       },
       "properties": {
         'id': `${guid()}`,
          'name' : 'WaliedCheetos',
          'datetime' : datatimeCurrent.toISOString(),
          'type' : 'observationType',
          'officer' : 'WaliedCheetos',
          'zone_number' : 'xyz',
          'plate' : 'x-xyz',
          'start' : '',
          'end' : '',
          
          "Address": `${item.address.label}`,
      "BatteryVoltage": 0,
      "CANaxle3weight": 0,
      "CarId": 30413,
      "CurrentProfile": 0,
      "Din4_hours": 0,
      "Direction": "17",
      "ECO_ext_hrsh_braking": 0,
      "ECO_harsh_acceleration": 0,
      "ECO_idling_time": 0,
      "GPSspeed": 0,
      "GpsTime": "2021-10-14 05:45:23 PM",
      "GSMjamming": 0,
      "GSMSignalStrength": 0,
      "iButtonID": "",
      "Id": 30413,
      "IgnitionDIN4": 0,
      "isMDVR": 0,
      "IsStop": "1",
      "latitude": `${item.position.lat}`,
      "location": {
        "latitude": 24.963948,
        "longitude": 55.148805,
        "elevation": 0
      },
      "longitude": `${item.position.lng}`,
      "Marker": "",
      "Movement_sensor": 0,
      "ObjectName": "WaliedCheetos_30413",
      "PowerSupplyVoltage": 0,
      "SDLogRecordMarker": 0,
      "Speed": 0,
      "Status": "0",
      "VirtualOdometer": 7,
      "DriverName": "N/A",
      "PhoneNumber": "N/A",
      "VehicleMake": "Buggy",
      "VehicleModel": "Electric Buggy",
      "VehicleCategory": "Buggy",
      "IsValid": 0,
      "InternalNo": "",
      "_isSelected": false
       }
     }

     geojson['features'].push(randomDataItem);
     randomData.push(randomDataItem);
     document.getElementById('randomDataResult').value += JSON.stringify(randomDataItem) +"\n"+",";

var html = `<div><a>WaliedCheetos</a></div>
<div>
  ${item.address.label}
  <br />
${metaData}
  </div>`;

  var marker = new H.map.Marker({
    lat: item.position.lat,
    lng:item.position.lng
  });


  // var marker = new H.map.DomMarker(({lat: item.position.lat,lng:item.position.lng}), {
  //       icon: domIcon_BlinkingDot});

  // add custom data to the marker
  marker.setData(html);
  mapGroup.addObject(marker);

  });
}

function createRandomData(item, metaData) {

  generateRandomParts();

        var heatValue = Math.random() * (4-1) + 1;
        randomPoints.push(JSON.parse(`{"lat":${item.lat}, "lng":${item.lng}, "value":${heatValue}}`));


        var datatimeCurrent = new Date();

        var randomDataItem = {
       "type": "Feature",
       "geometry": {
         "type": "Point",
         "coordinates": `${item.lat},${item.lng}`
       },
       "properties": {
         'id': `${guid()}`,
          'name' : 'WaliedCheetos',
          'datetime' : datatimeCurrent.toISOString(),
          'type' : 'observationType',
          'officer' : 'WaliedCheetos',
          'zone_number' : 'xyz',
          'plate' : 'x-xyz',
          'start' : '',
          'end' : '',
          
          "Address": '',
      "BatteryVoltage": 0,
      "CANaxle3weight": 0,
      "CarId": 30413,
      "CurrentProfile": 0,
      "Din4_hours": 0,
      "Direction": "17",
      "ECO_ext_hrsh_braking": 0,
      "ECO_harsh_acceleration": 0,
      "ECO_idling_time": 0,
      "GPSspeed": 0,
      "GpsTime": "2021-10-14 05:45:23 PM",
      "GSMjamming": 0,
      "GSMSignalStrength": 0,
      "iButtonID": "",
      "Id": 30413,
      "IgnitionDIN4": 0,
      "isMDVR": 0,
      "IsStop": "1",
      "latitude": `${item.lat}`,
      "location": {
        "latitude": 24.963948,
        "longitude": 55.148805,
        "elevation": 0
      },
      "longitude": `${item.lng}`,
      "Marker": "",
      "Movement_sensor": 0,
      "ObjectName": "WaliedCheetos_30413",
      "PowerSupplyVoltage": 0,
      "SDLogRecordMarker": 0,
      "Speed": 0,
      "Status": "0",
      "VirtualOdometer": 7,
      "DriverName": "N/A",
      "PhoneNumber": "N/A",
      "VehicleMake": "Buggy",
      "VehicleModel": "Electric Buggy",
      "VehicleCategory": "Buggy",
      "IsValid": 0,
      "InternalNo": "",
      "_isSelected": false
       }
     }

     geojson['features'].push(randomDataItem);
     randomData.push(randomDataItem);
     document.getElementById('randomDataResult').value += JSON.stringify(randomDataItem) +"\n"+",";

var html = `<div><a>WaliedCheetos</a></div>
<div>
  ${item.lat}, ${item.lng}
  <br />
${metaData}
  </div>`;

  var marker = new H.map.Marker({
    lat: item.lat,
    lng:item.lng
  });

  // add custom data to the marker
  marker.setData(html);
  mapGroup.addObject(marker);
}

function generateRandomData_sync(map, position) {
  try {
    randomData.length = 0;
    randomPoints.length = 0;
    randomParts.length = 0;
    heatmapProvider.clear();
    mapGroup.removeAll();
    $("#randomDataResult").val("");

    document.getElementById('predictiveMaintenance_Summary').innerHTML = "";
    document.getElementById('ondemandServices_Summary').innerHTML = "";

    geojson['features'] = [];

for (let index = 0; index < initials.randomDataSetSpecs.size; index++) {
      
      // get random position 0 - x km from map's center in random direction
      let randomPoint = position.walk(Math.random() * 360, Math.random() * initials.randomDataSetSpecs.isoline);
      // let randomPoint = map.getCenter().walk(Math.random() * 360, Math.random() * initials.randomDataSetSpecs.isoline);

if (initials.randomDataSetSpecs.geocoded) {
  //perform reverse geocoding RESTful call to make sure the random point is reachable (i.e. navigable)
      $.ajax({
        type: "GET",
        url: `https://revgeocode.search.hereapi.com/v1/revgeocode?lang=en-US&at=${randomPoint.lat},${randomPoint.lng}&limit=1&apiKey=${initials.hereCredentials.apikey}`,
        async: false,
        success: function (response) {
          createRandomData_Geocoded(response, '');
        }
    });
} else {
  createRandomData(randomPoint, '');
}
      
}
    
    heatmapRandomData();
    wordCloudRandomParts();

  } catch (error) {
    console.error(error);
  }
}

function generateRandomData_async(map, position) {
  try {
    randomData.length = 0;
    randomPoints.length = 0;
    randomParts.length = 0;
    heatmapProvider.clear();
    mapGroup.removeAll();
    $("#randomDataResult").val("");

    document.getElementById('predictiveMaintenance_Summary').innerHTML = "";
    document.getElementById('ondemandServices_Summary').innerHTML = "";

    geojson['features'] = [];

for (let index = 0; index < initials.randomDataSetSpecs.size; index++) {
      
      // get random position 0 - x km from map's center in random direction
      // let randomPoint = map.getCenter().walk(Math.random() * 360, Math.random() * initials.randomDataSetSpecs.isoline);
      let randomPoint = position.walk(Math.random() * 360, Math.random() * initials.randomDataSetSpecs.isoline);

      if (initials.randomDataSetSpecs.geocoded) {
      //perform reverse geocoding RESTful call to make sure the random point is reachable (i.e. navigable)
      $.ajax({
        type: "GET",
        url: `https://revgeocode.search.hereapi.com/v1/revgeocode?lang=en-US&at=${randomPoint.lat},${randomPoint.lng}&limit=1&apiKey=${initials.hereCredentials.apikey}`,
        async: true,
        success: function (response) {
          createRandomData_Geocoded(response, '');
        }
    });
  }
  else{
    createRandomData(randomPoint, '');
  }
    }

    heatmapRandomData();
    wordCloudRandomParts();

  } catch (error) {
    console.error(error);
  }
}

function heatmapRandomData() {
    try {
      heatmapProvider.clear();
        heatmapProvider.addData(randomPoints);
      
        // get the shape's bounding box and adjust the camera position
      map_01.getViewModel().setLookAtData({
          zoom: 11,
          bounds: mapGroup.getBoundingBox()
        }, true);
        

    } catch (error) {
        console.error(`WaliedCheetos - EXCEPTION : ${error}`);
    }
}
    
function wordCloudRandomParts(){
  try {

    const text = randomParts.join(','),
    lines = text.split(/[,\. ]+/g),
    data = lines.reduce((arr, word) => {
        let obj = Highcharts.find(arr, obj => obj.name === word);
        if (obj) {
            obj.weight += 1;
        } else {
            obj = {
                name: word,
                weight: 1
            };
            arr.push(obj);
        }
        return arr;
    }, []);



   // Highcharts.series[0].data[0].updateData(data);
   randomParts_Chart.series[0].setData(data);

   data.forEach(item => {
    if (item.weight >= 15 && item.weight < 20) {
      document.getElementById('predictiveMaintenance_Summary').innerHTML += `<li> <b> ${item.name} </b> needs attentions! </li> <br />`;
    }else if (item.weight >= 20) {
           document.getElementById('predictiveMaintenance_Summary').innerHTML += `<li> <b>${item.name}</b> needs <b>IMMEDIATE</b> action!  <input type='button' value='Notify customer!' onclick='alert("Notification has been sent to in-dash");'></input> </li> <br />`;
         }
       });
    
       document.getElementById('ondemandServices_Summary').innerHTML += `<li> This vehicle requires <b> REFULEING </b>   <input type='button' value='Propose refuling' onclick='alert("Notification has been sent to in-dash");'></input> </li> <br />`;
    
      } catch (error) {
        console.error(`WaliedCheetos - EXCEPTION : ${error}`);
      }
    }
//#endregion

//#region charts
const text = 'HERE©, HERE©, HERE©, HERE©, HERE©,  Platform, Platform, Platform, Platform, Dubai-2021, Dubai-2021, Dubai-2021, Solutions-day, Solutions-day, Welcome!',
lines = text.split(/[,\. ]+/g),
data = lines.reduce((arr, word) => {
    let obj = Highcharts.find(arr, obj => obj.name === word);
    if (obj) {
        obj.weight += 1;
    } else {
        obj = {
            name: word,
            weight: 1
        };
        arr.push(obj);
    }
    return arr;
}, []);

var randomParts_Chart = Highcharts.chart('randomPartsChart_Container', {
accessibility: {
    screenReaderSection: {
        beforeChartFormat: '<h5>{chartTitle}</h5>' +
            '<div>{chartSubtitle}</div>' +
            '<div>{chartLongdesc}</div>' +
            '<div>{viewTableButton}</div>'
    }
},
series: [{
    type: 'wordcloud',
    data,
    name: 'Occurrences'
}],
title: {
    text: 'NLP based predictive-maintenance analytics'
},
subtitle: {
    text: 'Powered by HERE Platform ©'
}
});

var partsLifespan_Chart ;

Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json', function (data) {

// Create the chart
partsLifespan_Chart = Highcharts.stockChart('partsLifespanChart_Container', {


rangeSelector: {
    selected: 0
},

title: {
    text: 'AI/ML Vehicle parts lifespan'
},
subtitle: {
    text: 'Powered by HERE Platform ©'
},
tooltip: {
    style: {
        width: '200px'
    },
    valueDecimals: 4,
    shared: true
},

yAxis: {
    title: {
        text: 'Lifespan vs Conditions'
    }
},

series: [{
    name: 'Vechile parts predicted lifespan over time',
    data: data,
    id: 'dataseries'

// the event marker flags
}, {
    type: 'flags',
    data: [{
        x: Date.UTC(2017, 11, 1),
        title: 'A',
        text: 'Assigned driver has changed'
    }, {
        x: Date.UTC(2017, 11, 12),
        title: 'B',
        text: 'Roads have been paved'
    }, {
        x: Date.UTC(2017, 11, 22),
        title: 'C',
        text: 'Troubles with roads roughness & temprature'
    }],
    onSeries: 'dataseries',
    shape: 'circlepin',
    width: 16
}]
});
});

//#endregion

//#endregion


//#region map init

// Initialize HERE Map
const platform = new H.service.Platform({ apikey: initials.hereCredentials.apikey });

// create two sets of the default layers for each map instance
const defaultLayers = platform.createDefaultLayers();
const defaultLayersSync = platform.createDefaultLayers();

const map_01 = new H.Map(document.getElementById('map_01'),       
defaultLayers.vector.normal.map, {
    center: {lat:initials.mapCenter.lat, lng:initials.mapCenter.lng},
    zoom: initials.mapCenter.zoom,
   pixelRatio: window.devicePixelRatio || 1
});

// initialize a map that will be synchronised
var map_02 = new H.Map(document.getElementById('map_02'),
  defaultLayersSync.vector.normal.map,{
      center: {lat:initials.mapCenter.lat, lng:initials.mapCenter.lng},
      zoom: initials.mapCenter.zoom,
      pixelRatio: window.devicePixelRatio || 1
    });

// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map_01));
const provider = map_01.getBaseLayer().getProvider();
// Create the default UI components
const ui = H.ui.UI.createDefault(map_01, defaultLayers);



    // add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map_01.getViewPort().resize());
window.addEventListener('resize', () => map_02.getViewPort().resize());

const mapStyle_Night = new H.map.Style('../../resources/SolutionsDay2021/night.yaml');
map_01.getBaseLayer().getProvider().setStyle(mapStyle_Night);

  // get the shape's bounding box and adjust the camera position
  map_01.getViewModel().setLookAtData({
    tilt: initials.mapCenter.tilt,
    heading: initials.mapCenter.heading
  }, true);

  map_02.addObject(mapGroup);

  //#region add heat map tiles
    // Create a provider for a semi-transparent heat map:
    
    const heatmapProvider = new H.data.heatmap.Provider({
        type: 'value',
        colors: new H.data.heatmap.Colors({
          '0': 'red',
          '0.5': 'blue',
          '1': 'yellow'
     }, true),
     opacity: 0.5,
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
  
   var heatmapTile = new H.map.layer.TileLayer(heatmapProvider);
   map_02.addLayer(heatmapTile);
   //#endregion

synchronizeMaps(map_01, map_02);
loadProbe(map_01);

//#endregion

// export { router, geocoder }
