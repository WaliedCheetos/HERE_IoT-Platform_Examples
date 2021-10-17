demo = {

  //#region global variables
  chart_DetectionsTypesCounts,
  chart_DetectionsSubTypesCounts,
  chart_DetectionsServicePerformanceCounts,
  //#endregion

config: {
   attribution: 'WaliedCheetos - &copy; HERE 2021',
   hereCredentials : {
      id: '***',
      code: '***',
      apikey: 'QICW7garcjxE7C7sSguJcNolMZXqYCJ9m5o6Qq3ygjg'
      // apikey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
   },
   map:{
      center : { 
         lat: 52.5159, 
         lng: 13.3777, 
         text: 'Berlin, Germany'
      },
      zoom: 17,
      tilt: 33,
      heading: 73,
      incline: 33
   },
   venues:{
      ZurichAirport:{
         id:7348,
         initial_drawingID:7880
      }
   },
   initialDetections:{
      WaliedCheetos:{
        detections:[
        {
            id:"detect_01",
            object:{
                type:"vehicle",
                subtype:"light vehicle",
                id:"obj_01"
            },
            location:{
                venue_info:{
                    id:"venue_01",
                    name:"WaliedCheetos_Venue_01",
                    level:1,
                    space:"bathroom"
                },
                coordinates:{lat:47.4523, lng:8.5612}
            },
            timestamp:"",
            tags:"#WaliedCheetos|#BMW|#AGMC"
        },
        {
            id:"detect_02",
            object:{
                "type":"vehicle",
                "subtype":"heavy vehicle",
                id:"obj_02"
            },
            location:{
                venue_info:{
                    id:"venue_01",
                    name:"WaliedCheetos_Venue_01",
                    level:1,
                    space:"retail"
                },
                coordinates:{lat:47.4523, lng:8.5613}
            },
            timestamp:"",
            tags:"#WaliedCheetos|#BMW|#AGMC"
        },
        {
            id:"detect_03",
            object:{
                "type":"person",
                "subtype":"safety engineer",
                id:"obj_03"
            },
            location:{
                venue_info:{
                    id:"venue_01",
                    name:"WaliedCheetos_Venue_01",
                    level:1,
                    space:"retail"
                },
                coordinates:{lat:47.4536, lng:8.5615}
            },
            timestamp:"",
            tags:"#WaliedCheetos|#BMW|#AGMC"
        },
        {
            id:"detect_04",
            object:{
                "type":"person",
                "subtype":"maintenance engineer",
                id:"obj_04"
            },
            location:{
                venue_info:{
                    id:"venue_01",
                    name:"WaliedCheetos_Venue_01",
                    level:1,
                    space:"retail"
                },
                coordinates:{lat:47.4529, lng:8.5611}
            },
            timestamp:"",
            tags:"#WaliedCheetos|#BMW|#AGMC"
        },
        {
            id:"detect_05",
            object:{
                "type":"person",
                "subtype":"service engineer",
                id:"obj_05"
            },
            location:{
                venue_info:{
                    id:"venue_01",
                    name:"WaliedCheetos_Venue_01",
                    level:1,
                    space:"retail"
                },
                coordinates:{lat:47.4515, lng:8.5613}
            },
            timestamp:"",
            tags:"#WaliedCheetos|#BMW|#AGMC"
        },
        {
            id:"detect_06",
            object:{
                "type":"person",
                "subtype":"vehicle owner",
                id:"obj_06"
            },
            location:{
                venue_info:{
                    id:"venue_01",
                    name:"WaliedCheetos_Venue_01",
                    level:1,
                    space:"retail"
                },
                coordinates:{lat:47.4515, lng:8.5608}
            },
            timestamp:"",
            tags:"#WaliedCheetos|#BMW|#AGMC"
        }
      //   ,{
      //     id:"detect_07",
      //     object:{
      //         "type":"tool",
      //         "subtype":"special inspection tool",
      //         id:"obj_07"
      //     },
      //     location:{
      //         venue_info:{
      //             id:"venue_01",
      //             name:"WaliedCheetos_Venue_01",
      //             level:2,
      //             space:"garage"
      //         },
      //         coordinates:{lat:47.4515, lng:8.5608}
      //     },
      //     timestamp:"",
      //     tags:"#WaliedCheetos|#BMW|#AGMC|#SpecialTool"
      // }
    ],
    vehciles_types:["light vehicle", "heavy vehicle"],
    persons_types:["safety engineer", "service engineer", "vehicle owner"],
    special_tools :[{
id:"special tool 01",
name:"WaliedCheetos_SpecialTool_Name",
type:"WaliedCheetos_SpecialTool_Type",
location:{
  venue_info:{
      id:"venue_01",
      name:"WaliedCheetos_Venue_01",
      level:2,
      space:"retail"
  },
  coordinates:{lat:47.4515, lng:8.5608}
},
timestamp:"",
tags:"#WaliedCheetos|#BMW|#AGMC"
    }]
  }
  },
  detectionFeedUpdate:{
    frequency:{
      timeout:2000,
      interval: 5000
    }
  }
},

  initPickColor: function() {
    $('.pick-class-label').click(function() {
      var new_class = $(this).attr('new-class');
      var old_class = $('#display-buttons').attr('data-class');
      var display_div = $('#display-buttons');
      if (display_div.length) {
        var display_buttons = display_div.find('.btn');
        display_buttons.removeClass(old_class);
        display_buttons.addClass(new_class);
        display_div.attr('data-class', new_class);
      }
    });
  },

  initDocChart: function() {
    chartColor = "#FFFFFF";

    ctx = document.getElementById('chartHours').getContext("2d");

    myChart = new Chart(ctx, {
      type: 'line',

      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: [{
            borderColor: "#6bd098",
            backgroundColor: "#6bd098",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354]
          },
          {
            borderColor: "#f17e5d",
            backgroundColor: "#f17e5d",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [320, 340, 365, 360, 370, 385, 390, 384, 408, 420]
          },
          {
            borderColor: "#fcc468",
            backgroundColor: "#fcc468",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [370, 394, 415, 409, 425, 445, 460, 450, 478, 484]
          }
        ]
      },
      options: {
        legend: {
          display: false
        },

        tooltips: {
          enabled: false
        },

        scales: {
          yAxes: [{

            ticks: {
              fontColor: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5,
              //padding: 20
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "#ccc",
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent",
              display: false,
            },
            ticks: {
              padding: 20,
              fontColor: "#9f9f9f"
            }
          }]
        },
      }
    });

  },

  initChartsPages: function() {
    chartColor = "#FFFFFF";

    ctx = document.getElementById('chartHours').getContext("2d");

    myChart = new Chart(ctx, {
      type: 'line',

      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: [{
            borderColor: "#6bd098",
            backgroundColor: "#6bd098",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354]
          },
          {
            borderColor: "#f17e5d",
            backgroundColor: "#f17e5d",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [320, 340, 365, 360, 370, 385, 390, 384, 408, 420]
          },
          {
            borderColor: "#fcc468",
            backgroundColor: "#fcc468",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: [370, 394, 415, 409, 425, 445, 460, 450, 478, 484]
          }
        ]
      },
      options: {
        legend: {
          display: false
        },

        tooltips: {
          enabled: false
        },

        scales: {
          yAxes: [{

            ticks: {
              fontColor: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5,
              //padding: 20
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "#ccc",
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent",
              display: false,
            },
            ticks: {
              padding: 20,
              fontColor: "#9f9f9f"
            }
          }]
        },
      }
    });


    ctx = document.getElementById('chartEmail').getContext("2d");

    myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [1, 2, 3],
        datasets: [{
          label: "Emails",
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: [
            '#e3e3e3',
            '#4acccd',
            '#fcc468',
            '#ef8157'
          ],
          borderWidth: 0,
          data: [342, 480, 530, 120]
        }]
      },

      options: {

        legend: {
          display: false
        },

        pieceLabel: {
          render: 'percentage',
          fontColor: ['white'],
          precision: 2
        },

        tooltips: {
          enabled: false
        },

        scales: {
          yAxes: [{

            ticks: {
              display: false
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "transparent",
              color: 'rgba(255,255,255,0.05)'
            }

          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent"
            },
            ticks: {
              display: false,
            }
          }]
        },
      }
    });

    var speedCanvas = document.getElementById("speedChart");

    var dataFirst = {
      data: [0, 19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70],
      fill: false,
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    };

    var dataSecond = {
      data: [0, 5, 10, 12, 20, 27, 30, 34, 42, 45, 55, 63],
      fill: false,
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };

    var speedData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [dataFirst, dataSecond]
    };

    var chartOptions = {
      legend: {
        display: false,
        position: 'top'
      }
    };

    var lineChart = new Chart(speedCanvas, {
      type: 'line',
      hover: false,
      data: speedData,
      options: chartOptions
    });
  },

  initGoogleMaps: function() {
/*

    var myLatlng = new google.maps.LatLng(40.748817, -73.985428);
    var mapOptions = {
      zoom: 13,
      center: myLatlng,
      scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
      styles: [{
        "featureType": "water",
        "stylers": [{
          "saturation": 43
        }, {
          "lightness": -11
        }, {
          "hue": "#0088ff"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
          "hue": "#ff0000"
        }, {
          "saturation": -100
        }, {
          "lightness": 99
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#808080"
        }, {
          "lightness": 54
        }]
      }, {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#ece2d9"
        }]
      }, {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#ccdca1"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#767676"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#ffffff"
        }]
      }, {
        "featureType": "poi",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#b8cb93"
        }]
      }, {
        "featureType": "poi.park",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "poi.sports_complex",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "poi.medical",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "poi.business",
        "stylers": [{
          "visibility": "simplified"
        }]
      }]

    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var marker = new google.maps.Marker({
      position: myLatlng,
      title: "Hello World!"
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
  },

  showNotification: function(from, align) {
    color = 'primary';

    $.notify({
      icon: "nc-icon nc-bell-55",
      message: "Welcome to <b>Paper Dashboard</b> - a beautiful bootstrap dashboard for every web developer."

    }, {
      type: color,
      timer: 8000,
      placement: {
        from: from,
        align: align
      }
    });

    */
  },

  initHEREMaps: function(){
    /* ...
 * Initialize the platform and map
 * ...
 */

// Initialize HERE Map
//const platform = new H.service.Platform({ apikey: hereCredentials.apikey });
const platform = new H.service.Platform({ apikey: this.config.hereCredentials.apikey });
const defaultLayers = platform.createDefaultLayers();

const map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
    pixelRatio: window.devicePixelRatio || 1
});

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

var mapSettings = ui.getControl('mapsettings');
var zoom = ui.getControl('zoom');
var scalebar = ui.getControl('scalebar');

// mapSettings.setAlignment('top-right');
// zoom.setAlignment('top-right');
// scalebar.setAlignment('bottom-right');

      

window.addEventListener('resize', () => map.getViewPort().resize());

  // Venues provider interacts with tile layer to visualize and control the venue map
  const venuesProvider = new H.venues.Provider();
  const venuesService = platform.getVenuesService({ apikey: this.config.hereCredentials.apikey });

  this.addVenue2Map(map, venuesProvider, venuesService, ui);

  },

  /**
  * Load and add venue data on the map.
  *
  * @param  {H.Map} map A HERE Map instance
  */
  addVenue2Map: function addVenueToMap(map, venuesProvider, venuesService, ui) {

   // Venues service provides a loadVenue method
   venuesService.loadVenue(7348).then((venue) => {
     // add venue data to venues provider
     venuesProvider.addVenue(venue);
     venuesProvider.setActiveVenue(venue);
 
     // create a tile layer for the venues provider
     map.addLayer(new H.map.layer.TileLayer(venuesProvider));
 
     // optionally select drawing/level
     venue.setActiveDrawing(7880);
 
     // create level control
     const levelControl = new H.venues.ui.LevelControl(venue);
     ui.addControl('level-control', levelControl);
 
     // create drawing control:
     const drawingControl = new H.venues.ui.DrawingControl(venue);
     ui.addControl('drawing-control', drawingControl);

    // get the shape's bounding box and adjust the camera position
    map.getViewModel().setLookAtData({
       //zoom: this.config.map.zoom,
       bounds: venue.getBoundingBox(),
       //tilt: this.config.map.tilt,
       //heading: this.config.map.heading,
       //incline: this.config.map.incline
     }, true);
 
    this.addDetections(map, venuesProvider);
    this.addChart();
    
   //register on venue level change event
     venue.addEventListener(H.venues.Venue.EVENTS.LEVEL_CHANGE, (event) => {
       this.onVenueLevelChange(event);
 });
 
 // venue.getGeometries().forEach((venueGeomtry)=>{
 //   venueGeomtry.addEventListener('tap', (event) => {
 //       console.log(event);
 // });
 // });

   //#region add new UI element

   inherits = function (childCtor, parentCtor) {
    function tempCtor() { } tempCtor.prototype = parentCtor.prototype; childCtor.superClass_ = parentCtor.prototype; childCtor.prototype = new tempCtor(); childCtor.prototype.constructor = childCtor; childCtor.base = function (me, methodName, var_args) {
        var args = new Array(arguments.length - 2);
        for (var i = 2; i < arguments.length; i++) {
            args[i - 2] = arguments[i];
        }
        return parentCtor.prototype[methodName].apply(me, args);
    };
};

var customUI = function (opt_options) {
    'use strict'; var options = opt_options || {};

    H.ui.Control.call(this);
    this.onButtonClick = this.onButtonClick.bind(this);

    // create a button element   
    this.increaseBtn_ = new H.ui.base.Button({
        'label': `<svg class="svg-icon" viewBox="0 0 20 20">
        <path d="M17.659,9.597h-1.224c-0.199-3.235-2.797-5.833-6.032-6.033V2.341c0-0.222-0.182-0.403-0.403-0.403S9.597,2.119,9.597,2.341v1.223c-3.235,0.2-5.833,2.798-6.033,6.033H2.341c-0.222,0-0.403,0.182-0.403,0.403s0.182,0.403,0.403,0.403h1.223c0.2,3.235,2.798,5.833,6.033,6.032v1.224c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403v-1.224c3.235-0.199,5.833-2.797,6.032-6.032h1.224c0.222,0,0.403-0.182,0.403-0.403S17.881,9.597,17.659,9.597 M14.435,10.403h1.193c-0.198,2.791-2.434,5.026-5.225,5.225v-1.193c0-0.222-0.182-0.403-0.403-0.403s-0.403,0.182-0.403,0.403v1.193c-2.792-0.198-5.027-2.434-5.224-5.225h1.193c0.222,0,0.403-0.182,0.403-0.403S5.787,9.597,5.565,9.597H4.373C4.57,6.805,6.805,4.57,9.597,4.373v1.193c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403V4.373c2.791,0.197,5.026,2.433,5.225,5.224h-1.193c-0.222,0-0.403,0.182-0.403,0.403S14.213,10.403,14.435,10.403"></path>
      </svg>`,

        'onStateChange': this.onButtonClick
        // 'label': '<svg class="H_icon H_icon" viewBox="0 0 25 25">' +
        //     '<path d="M 18.5,11 H 14 V 6.5 c 0,-.8 -.7,-1.5 -1.5,-1.5 -.8,0 -1.5,.7 -1.5,1.5 V 11 H 6' +
        //     '.5 C 5.7,11 5,11.7 5,12.5 5,13.3 5.7,14 6.5,14 H 11 v 4.5 c 0,.8 .7,1.5 1.5,1.5 .8,0 1.5,' +
        //     '-.7 1.5,-1.5 V 14 h 4.5 C 19.3,14 20,13.3 20,12.5 20,11.7 19.3,11 18.5,11 z" />' +
        //     '</svg>',
        // 'onStateChange': this.onButtonClick
    });

    //add the buttons as this control's children   
    this.addChild(this.increaseBtn_);

    this.setAlignment(options['alignment'] || 'top-right');

    this.options_ = options;
};
inherits(customUI, H.ui.Control);

customUI.prototype.onButtonClick = function (evt) {
    'use strict'; if (evt.currentTarget.getState() === 'down') {
      venuesProvider.activeVenue.setActiveLevelIndex(1);
        console.log('Hollla, I am the new custom UI element.');
    }
};

var WaliedCheetos_CustomUI = new customUI();
ui.addControl('WaliedCheetos_CustomUI', WaliedCheetos_CustomUI);

//#endregion
 
   });
 },
 
 onVenueLevelChange: function(event) {
  try {
      console.log(event);
    } catch (error) {
      console.error(error);
    }
  },

/**
 * function desc.
 *
 * @param  {} parameter desc.
 */
 addDetections: function (map, venuesProvider){
  try {
    // create SVG Dom Icon
  var svg = `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" width="10px" height="10px">
    <circle cx="5" cy="5" r="4" fill="rgb(250, 127, 0)" stroke-width="1" stroke="black" opacity="1"/>
    </svg>`,
    
    svgAnimatedPerson = '<svg id="mePin" xmlns="http://www.w3.org/2000/svg" width="43.3" height="42.4" viewBox="0 0 43.3 42.4"><path class="ring_outer" fill="#878787" d="M28.6 23c6.1 1.4 10.4 4.4 10.4 8 0 4.7-7.7 8.6-17.3 8.6-9.6 0-17.4-3.9-17.4-8.6 0-3.5 4.2-6.5 10.3-7.9.7-.1-.4-1.5-1.3-1.3C5.5 23.4 0 27.2 0 31.7c0 6 9.7 10.7 21.7 10.7s21.6-4.8 21.6-10.7c0-4.6-5.7-8.4-13.7-10-.8-.2-1.8 1.2-1 1.4z"/><path class="ring_inner" fill="#5F5F5F" d="M27 25.8c2 .7 3.3 1.8 3.3 3 0 2.2-3.7 3.9-8.3 3.9-4.6 0-8.3-1.7-8.3-3.8 0-1 .8-1.9 2.2-2.6.6-.3-.3-2-1-1.6-2.8 1-4.6 2.7-4.6 4.6 0 3.2 5.1 5.7 11.4 5.7 6.2 0 11.3-2.5 11.3-5.7 0-2-2.1-3.9-5.4-5-.7-.1-1.2 1.3-.7 1.5z"/><path class="mePin" d="M21.6 8.1a4 4 0 0 0 4-4 4 4 0 0 0-4-4.1 4.1 4.1 0 0 0-4.1 4 4 4 0 0 0 4 4.1zm4.9 8v-3.7c0-1.2-.6-2.2-1.7-2.6-1-.4-1.9-.6-2.8-.6h-.9c-1 0-2 .2-2.8.6-1.2.4-1.8 1.4-1.8 2.6V16c0 .9 0 2 .2 2.8.2.8.8 1.5 1 2.3l.2.3.4 1 .1.8.2.7.6 3.6c-.6.3-.9.7-.9 1.2 0 .9 1.4 1.7 3.2 1.7 1.8 0 3.2-.8 3.2-1.7 0-.5-.3-.9-.8-1.2l.6-3.6.1-.7.2-.8.3-1 .1-.3c.3-.8 1-1.5 1.1-2.3.2-.8.2-2 .2-2.8z" fill="#282828"/></svg>',

    // Define a variable holding SVG mark-up that defines an animated icon image:
    svgService = `<svg class="svg-icon" viewBox="0 0 20 20">
    <path fill="none" d="M10.032,8.367c-1.112,0-2.016,0.905-2.016,2.018c0,1.111,0.904,2.014,2.016,2.014c1.111,0,2.014-0.902,2.014-2.014C12.046,9.271,11.143,8.367,10.032,8.367z M10.032,11.336c-0.525,0-0.953-0.427-0.953-0.951c0-0.526,0.427-0.955,0.953-0.955c0.524,0,0.951,0.429,0.951,0.955C10.982,10.909,10.556,11.336,10.032,11.336z"></path>
    <path fill="none" d="M17.279,8.257h-0.785c-0.107-0.322-0.237-0.635-0.391-0.938l0.555-0.556c0.208-0.208,0.208-0.544,0-0.751l-2.254-2.257c-0.199-0.2-0.552-0.2-0.752,0l-0.556,0.557c-0.304-0.153-0.617-0.284-0.939-0.392V3.135c0-0.294-0.236-0.532-0.531-0.532H8.435c-0.293,0-0.531,0.237-0.531,0.532v0.784C7.582,4.027,7.269,4.158,6.966,4.311L6.409,3.754c-0.1-0.1-0.234-0.155-0.376-0.155c-0.141,0-0.275,0.055-0.375,0.155L3.403,6.011c-0.208,0.207-0.208,0.543,0,0.751l0.556,0.556C3.804,7.622,3.673,7.935,3.567,8.257H2.782c-0.294,0-0.531,0.238-0.531,0.531v3.19c0,0.295,0.237,0.531,0.531,0.531h0.787c0.105,0.318,0.236,0.631,0.391,0.938l-0.556,0.559c-0.208,0.207-0.208,0.545,0,0.752l2.254,2.254c0.208,0.207,0.544,0.207,0.751,0l0.558-0.559c0.303,0.154,0.616,0.285,0.938,0.391v0.787c0,0.293,0.238,0.531,0.531,0.531h3.191c0.295,0,0.531-0.238,0.531-0.531v-0.787c0.322-0.105,0.636-0.236,0.938-0.391l0.56,0.559c0.208,0.205,0.546,0.207,0.752,0l2.252-2.254c0.208-0.207,0.208-0.545,0.002-0.752l-0.559-0.559c0.153-0.303,0.285-0.615,0.389-0.938h0.789c0.295,0,0.532-0.236,0.532-0.531v-3.19C17.812,8.495,17.574,8.257,17.279,8.257z M16.747,11.447h-0.653c-0.241,0-0.453,0.164-0.514,0.398c-0.129,0.496-0.329,0.977-0.594,1.426c-0.121,0.209-0.089,0.473,0.083,0.645l0.463,0.465l-1.502,1.504l-0.465-0.463c-0.174-0.174-0.438-0.207-0.646-0.082c-0.447,0.262-0.927,0.463-1.427,0.594c-0.234,0.061-0.397,0.271-0.397,0.514V17.1H8.967v-0.652c0-0.242-0.164-0.453-0.397-0.514c-0.5-0.131-0.98-0.332-1.428-0.594c-0.207-0.123-0.472-0.09-0.646,0.082l-0.463,0.463L4.53,14.381l0.461-0.463c0.169-0.172,0.204-0.434,0.083-0.643c-0.266-0.461-0.467-0.939-0.596-1.43c-0.06-0.234-0.272-0.398-0.514-0.398H3.313V9.319h0.652c0.241,0,0.454-0.162,0.514-0.397c0.131-0.498,0.33-0.979,0.595-1.43c0.122-0.208,0.088-0.473-0.083-0.645L4.53,6.386l1.503-1.504l0.46,0.462c0.173,0.172,0.437,0.204,0.646,0.083c0.45-0.265,0.931-0.464,1.433-0.597c0.233-0.062,0.396-0.274,0.396-0.514V3.667h2.128v0.649c0,0.24,0.161,0.452,0.396,0.514c0.502,0.133,0.982,0.333,1.433,0.597c0.211,0.12,0.475,0.089,0.646-0.083l0.459-0.462l1.504,1.504l-0.463,0.463c-0.17,0.171-0.202,0.438-0.081,0.646c0.263,0.448,0.463,0.928,0.594,1.427c0.061,0.235,0.272,0.397,0.514,0.397h0.651V11.447z"></path>
  </svg>`,

    animatedSvg =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" ' + 
    'y="0px" style="margin:-112px 0 0 -32px" width="136px"' + 
    'height="150px" viewBox="0 0 136 150"><ellipse fill="#000" ' +
    'cx="32" cy="128" rx="36" ry="4"><animate attributeName="cx" ' + 
    'from="32" to="32" begin="0s" dur="1.5s" values="96;32;96" ' + 
    'keySplines=".6 .1 .8 .1; .1 .8 .1 1" keyTimes="0;0.4;1"' + 
    'calcMode="spline" repeatCount="indefinite"/>' +    
    '<animate attributeName="rx" from="36" to="36" begin="0s"' +
    'dur="1.5s" values="36;10;36" keySplines=".6 .0 .8 .0; .0 .8 .0 1"' + 
    'keyTimes="0;0.4;1" calcMode="spline" repeatCount="indefinite"/>' +
    '<animate attributeName="opacity" from=".2" to=".2"  begin="0s" ' +
    ' dur="1.5s" values=".1;.7;.1" keySplines=" .6.0 .8 .0; .0 .8 .0 1" ' +
    'keyTimes=" 0;0.4;1" calcMode="spline" ' +
    'repeatCount="indefinite"/></ellipse><ellipse fill="#1b468d" ' +
    'cx="26" cy="20" rx="16" ry="12"><animate attributeName="cy" ' +
    'from="20" to="20" begin="0s" dur="1.5s" values="20;112;20" ' +
    'keySplines=".6 .1 .8 .1; .1 .8 .1 1" keyTimes=" 0;0.4;1" ' +
    'calcMode="spline" repeatCount="indefinite"/> ' +
    '<animate attributeName="ry" from="16" to="16" begin="0s" ' + 
    'dur="1.5s" values="16;12;16" keySplines=".6 .0 .8 .0; .0 .8 .0 1" ' +
    'keyTimes="0;0.4;1" calcMode="spline" ' +
    'repeatCount="indefinite"/></ellipse></svg>',

     svgAnimated = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1"> 
    <g fill="none" stroke-width="3" transform="translate(11,11)">
    <circle id="my-circle" cx="0" cy="0" r="9" stroke="darkorange" fill="seagreen" />
    <animate href="#my-circle" attributeName="opacity"  values="1;-2" dur="1s" repeatCount="indefinite" /> </g> </svg>`,

    domIcon = new H.map.DomIcon(svg),
    svgServiceIcon = new H.map.DomIcon(svgService),
    // carIcon = new H.map.Icon('../../images/BMW/car.png'),
    bmwCarIcon = new H.map.Icon('../assets/img/bmw-marker-icon.png'),
    animatedSpecialToolDomIcon = new H.map.DomIcon(animatedSvg),
    animatedDomIcon = new H.map.DomIcon(svgAnimated),
    animatedPersonDomIcon = new H.map.DomIcon(svgAnimatedPerson),
    markers_BasementFloor = [],
    markers_FirstFloor = [],
    markers_SecondFloor = []


//create markers
this.config.initialDetections.WaliedCheetos.special_tools.forEach(specialTool=>{
  markers_SecondFloor.push(new H.map.DomMarker(specialTool.location.coordinates, {
    icon: animatedSpecialToolDomIcon
  }));
});

// add markers to map
map.addObjects(markers_SecondFloor);
        
//logic to add map object (marker) to the current active venue
venuesProvider.activeVenue.setMapObjects(
  markers_SecondFloor,
  1,
  venuesProvider.activeVenue.getActiveDrawing()
);  



this.config.initialDetections.WaliedCheetos.detections.forEach(detection => {

  markers_FirstFloor.push(new H.map.DomMarker(detection.location.coordinates, {
    icon: ((detection.object.type==='vehicle') ? animatedDomIcon : animatedPersonDomIcon)
}));
    });

    
        // add markers to map
        map.addObjects(markers_FirstFloor);
        
        //logic to add map object (marker) to the current active venue
        venuesProvider.activeVenue.setMapObjects(
          markers_FirstFloor,
          venuesProvider.activeVenue.getActiveLevelIndex(),
          venuesProvider.activeVenue.getActiveDrawing()
        );  

        //# of detections per level (pie chart)
        //select distinct values of detected objects (x axis values ==> labels)
        //select counts vs distinct values of detected objects (y axis values)

        //var detectionsTypesCounts = getDetectionsTypesCounts(initialInputs);



        //# of detections per space (double column chart)
        //select distinct values of space names
        //select counts of detected objects vs eveery space name 

    // randomly update all markers positions in intervals
    
    setTimeout(updateMarkerPositions, this.config.detectionFeedUpdate.frequency.timeout);
    setInterval(updateMarkerPositions, this.config.detectionFeedUpdate.frequency.interval);


        /**
    * update all markers' positions with animation using the ease function
     */

        
         function updateMarkerPositions() {
       var updatedDetections = [];
      markers_FirstFloor.forEach(marker => {

        var randomIndex = Math.floor(Math.random() * demo.config.initialDetections.WaliedCheetos.detections.length);
        let randomPoint = demo.config.initialDetections.WaliedCheetos.detections[randomIndex].location.coordinates;  
        updatedDetections.push(demo.config.initialDetections.WaliedCheetos.detections[randomIndex]);                                          

        // update marker's position within ease function callback
        demo.ease(
          marker.getGeometry(),
          randomPoint,
          4000,
          function(coord) {
            marker.setGeometry(coord);

if (demo.config.initialDetections.WaliedCheetos.detections[randomIndex].object.type ==='vehicle') {
  marker.setIcon(animatedDomIcon)
} else {
  marker.setIcon(animatedPersonDomIcon)
}

            //((demo.config.initialDetections.WaliedCheetos.detections[randomIndex].object.type ==='vehcile') ? marker.setIcon(domIcon) : marker.setIcon(animatedDomIcon));
}
        )
      });


      document.getElementById('dynamic_VehicleCapacity').innerHTML = `${(Math.floor(Math.random() * 15) +3)} Vehicles`;
      document.getElementById('dynamic_AIDetections').innerHTML = `${(Math.floor(Math.random() * 23) + 13)}`;
      document.getElementById('dynamic_AIDetectionsAnalysis').innerHTML = `⬆${(Math.floor(Math.random() * 5) +3)} / ⬇${(Math.floor(Math.random() * 5) +3)}`;

      var chartLabels = [];
      var chartData = [];

var detectionsTypesCounts = demo.getDetectionsTypesCounts(updatedDetections);
var detectionsSubTypesCounts = demo.getDetectionsSubTypesCounts(updatedDetections);

Object.keys(detectionsTypesCounts).forEach(function(key) {
    console.log(key, detectionsTypesCounts[key]);
    chartLabels.push(key);
    chartData.push(detectionsTypesCounts[key]);
});

// chart_DetectionsTypesCounts.data.labels = chartLabels;
// chart_DetectionsTypesCounts.data.datasets[0].data = chartData;

chart_DetectionsTypesCounts.data.labels = ['vehcile', 'person'];

chart_DetectionsTypesCounts.data.datasets[0].data = [
  Math.floor(Math.random() * demo.config.initialDetections.WaliedCheetos.detections.length), 
  Math.floor(Math.random() * demo.config.initialDetections.WaliedCheetos.detections.length)
];
chart_DetectionsTypesCounts.update();

chartLabels.splice(0, chartLabels.length);
chartData.splice(0, chartData.length);

Object.keys(detectionsSubTypesCounts).forEach(function(key) {
    console.log(key, detectionsSubTypesCounts[key]);
    chartLabels.push(key);
    chartData.push(detectionsSubTypesCounts[key]);
});

chart_DetectionsSubTypesCounts.data.labels = chartLabels;
chart_DetectionsSubTypesCounts.data.datasets[0].data = chartData;
chart_DetectionsSubTypesCounts.update();
    }


  } catch (error) {
    console.error(error);
  }
},

addChart: function(){
  var chartLabels = [];
  var chartData = [];
  var ctx;

  var detectionsTypesCounts = this.getDetectionsTypesCounts(this.config.initialDetections.WaliedCheetos.detections);
  var detectionsSubTypesCounts = this.getDetectionsSubTypesCounts(this.config.initialDetections.WaliedCheetos.detections);
  
  Object.keys(detectionsTypesCounts).forEach(function(key) {
      console.log(key, detectionsTypesCounts[key]);
      chartLabels.push(key);
      chartData.push(detectionsTypesCounts[key]);
  });

  ctx = document.getElementById('chart_DetectionsTypesCounts');

  chart_DetectionsTypesCounts = new Chart(ctx, {
    type: 'horizontalBar',
    animation: true,
    data: {
      labels: ['vehicle', 'person'],
      datasets: [{
        label: 'Detections types per floor',
        data: [2, 4],
        backgroundColor: [
          "#ccf6ec",
          "#ff6654",
          "#009784"
        ],
        hoverBackgroundColor: [
          "#ccf6ec",
          "#ff6654",
          "#009784"
        ]
      }]
    },
    options: {
      legend: {
        display: true,
        position: 'top',
        align: 'center'
      },
      scales: {
        xAxes: [{
          display: true,
          beginAtZero: true,
          ticks: {
            min: 0
          }
        }],
        yAxes: [{
          display: true,
          beginAtZero: true
        }],
      }
    }
  });
  
    chartLabels.splice(0, chartLabels.length);
     chartData.splice(0, chartData.length);
  
  Object.keys(detectionsSubTypesCounts).forEach(function(key) {
      console.log(key, detectionsSubTypesCounts[key]);
      chartLabels.push(key);
      chartData.push(detectionsTypesCounts[key]);
  });
  
  ctx = document.getElementById('chart_DetectionsSubTypesCounts');
  
  chart_DetectionsSubTypesCounts = new Chart(ctx, {
      type: 'polarArea',
      data: {
          labels: chartLabels,
          datasets: [{
              label: 'Detections sub-types per floor',
              data: chartData,
              hoverOffset: 4,
              backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(255, 205, 86)',
        'rgb(201, 203, 207)',
        'rgb(54, 162, 235)'
      ]
          }]
        
      },
      options:{
        legend: {
            display: true,
            position: 'right',
            align: 'center'
        }
  }
  });

  ctx = document.getElementById('chart_DetectionsServicePerformanceCounts');
  chart_DetectionsServicePerformanceCounts = new Chart(ctx,{
    type: 'radar',
    data: {
      labels: [
        '3 Series',
        '5 Series',
        '6 Series',
        '7 Series',
        'z4'
      ],
      datasets: [{
        label: 'Number of vehciles',
        data: [65, 59, 90, 81, 56],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }, {
        label: 'Performance index',
        data: [28, 48, 40, 19, 96],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }]
    },
    options: {
      elements: {
        line: {
          borderWidth: 3
        }
      },legend: {
        display: true,
        position: 'right',
        align: 'center'
    }
    },
  });
  
  
  },

/**
 * Ease function
 * @param   {H.geo.IPoint} startCoord   start geo coordinate
 * @param   {H.geo.IPoint} endCoord     end geo coordinate
 * @param   number durationMs           duration of animation between start & end coordinates
 * @param   function onStep             callback executed each step
 * @param   function onStep             callback executed at the end
 */
 ease : function ( 
   startCoord = {lat: 0, lng: 0}, 
   endCoord = {lat: 1, lng: 1}, 
   durationMs = 200, 
   onStep = console.log,
   onComplete = function() {},
  ) {
  var raf = window.requestAnimationFrame || function(f) {window.setTimeout(f, 16)},
      stepCount = durationMs / 16,
      valueIncrementLat = (endCoord.lat - startCoord.lat) / stepCount,
      valueIncrementLng = (endCoord.lng - startCoord.lng) / stepCount,
      sinValueIncrement = Math.PI / stepCount,
      currentValueLat = startCoord.lat,
      currentValueLng = startCoord.lng,
      currentSinValue = 0;

  function step() {
    currentSinValue += sinValueIncrement;
    currentValueLat += valueIncrementLat * (Math.sin(currentSinValue) ** 2) * 2;
    currentValueLng += valueIncrementLng * (Math.sin(currentSinValue) ** 2) * 2;

    if (currentSinValue < Math.PI) {
      onStep({lat: currentValueLat, lng: currentValueLng});
      raf(step);
    } else {
      onStep(endCoord);
      onComplete();
    }
  }

  raf(step);
},

getDetectionsTypesCounts : function (input) {
  var arr = input, obj = {};
  for (var i = 0; i < arr.length; i++) {
    if (!obj[arr[i].object.type]) {
      obj[arr[i].object.type] = 1;
    } else if (obj[arr[i].object.type]) {
      obj[arr[i].object.type] += 1;
    }
  }
  return obj;
},

getDetectionsSubTypesCounts : function (input) {
  var arr = input, obj = {};
  for (var i = 0; i < arr.length; i++) {
    if (!obj[arr[i].object.subtype]) {
      obj[arr[i].object.subtype] = 1;
    } else if (obj[arr[i].object.subtype]) {
      obj[arr[i].object.subtype] += 1;
    }
  }
  return obj;
},

};