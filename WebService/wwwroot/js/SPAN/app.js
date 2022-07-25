app = {

     
//#region global variables

map: null,
HEREGeocoder: null,
HERETracking,
trackingId: null,
HEREAuthenticator : null,
timeoutTimer :  null,
intervalTimer : null,
deviceLocationMarker : null,
// svgAnimatedPerson : '<svg id="mePin" xmlns="http://www.w3.org/2000/svg" width="43.3" height="42.4" viewBox="0 0 43.3 42.4"><path class="ring_outer" fill="#878787" d="M28.6 23c6.1 1.4 10.4 4.4 10.4 8 0 4.7-7.7 8.6-17.3 8.6-9.6 0-17.4-3.9-17.4-8.6 0-3.5 4.2-6.5 10.3-7.9.7-.1-.4-1.5-1.3-1.3C5.5 23.4 0 27.2 0 31.7c0 6 9.7 10.7 21.7 10.7s21.6-4.8 21.6-10.7c0-4.6-5.7-8.4-13.7-10-.8-.2-1.8 1.2-1 1.4z"/><path class="ring_inner" fill="#5F5F5F" d="M27 25.8c2 .7 3.3 1.8 3.3 3 0 2.2-3.7 3.9-8.3 3.9-4.6 0-8.3-1.7-8.3-3.8 0-1 .8-1.9 2.2-2.6.6-.3-.3-2-1-1.6-2.8 1-4.6 2.7-4.6 4.6 0 3.2 5.1 5.7 11.4 5.7 6.2 0 11.3-2.5 11.3-5.7 0-2-2.1-3.9-5.4-5-.7-.1-1.2 1.3-.7 1.5z"/><path class="mePin" d="M21.6 8.1a4 4 0 0 0 4-4 4 4 0 0 0-4-4.1 4.1 4.1 0 0 0-4.1 4 4 4 0 0 0 4 4.1zm4.9 8v-3.7c0-1.2-.6-2.2-1.7-2.6-1-.4-1.9-.6-2.8-.6h-.9c-1 0-2 .2-2.8.6-1.2.4-1.8 1.4-1.8 2.6V16c0 .9 0 2 .2 2.8.2.8.8 1.5 1 2.3l.2.3.4 1 .1.8.2.7.6 3.6c-.6.3-.9.7-.9 1.2 0 .9 1.4 1.7 3.2 1.7 1.8 0 3.2-.8 3.2-1.7 0-.5-.3-.9-.8-1.2l.6-3.6.1-.7.2-.8.3-1 .1-.3c.3-.8 1-1.5 1.1-2.3.2-.8.2-2 .2-2.8z" fill="#282828"/></svg>',


//#endregion

setLoading: function(isLoading) {
    if (isLoading) {
      loading.style.display = 'block';
    } else {
      loading.style.display = 'none';
      document.querySelector('#refresh img').classList.remove('loading');
    }
  },
  
  parseQueryStrings: function(qstr) {
    var query = {};
    var a = qstr.substr(1).split('&');

    for (var i = 0; i < a.length; i++) {
      var b = a[i].split('=');
      query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
  },

/**
 * Ease function
 * @param   {H.geo.IPoint} startCoord   start geo coordinate
 * @param   {H.geo.IPoint} endCoord     end geo coordinate
 * @param   number durationMs           duration of animation between start & end coordinates
 * @param   function onStep             callback executed each step
 * @param   function onStep             callback executed at the end
 */
 ease : function( 
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
 

  // Event Listeners
  addEventListeners: function() {
    document.querySelector('#trace').addEventListener('click', function() {
    //   showTrace = !showTrace;
    //   if (!showTrace) {
    //     hideTrace();
    //   } else {
    //     setLoading(true)
    //     update();
    //   }

    console.info(`WaliedCheetos - INFO : Hollla, you just clicked on the trace buttton.`);    
    });
    document.querySelector('#refresh').addEventListener('click', function() {
    //   document.querySelector('#refresh img').classList.add('loading');
    //   mapSnapped = true;
    //   update();

    document.querySelector('#refresh img').classList.add('loading');
    console.info(`WaliedCheetos - INFO : Hollla, you just clicked on the refresh buttton.`);    

    });
    document.querySelector('#back').addEventListener('click', function() {
    //   window.location = "index.html"
    console.info(`WaliedCheetos - INFO : Hollla, you just clicked on the back buttton.`);  
    });

    // map.addEventListener('dragend', function(e) {
    //     mapSnapped = false
    // });

  },


  initHEREMaps: function(){
        /* ...
     * Initialize the platform and map
     * ...
     */
    
    // Initialize HERE Map
    //const platform = new H.service.Platform({ apikey: hereCredentials.apikey });
    const platform = new H.service.Platform({ apikey: config.hereCredentials.apikey });
    const defaultLayers = platform.createDefaultLayers();
    
    this.map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
      center: {lat:config.mapCenter.lat, lng: config.mapCenter.lng},
      zoom:config.mapCenter.zoom,  
      pixelRatio: window.devicePixelRatio || 1
    });
    
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    // Create the default UI components
    var ui = H.ui.UI.createDefault(this.map, defaultLayers);
    
    var mapSettings = ui.getControl('mapsettings');
    var zoom = ui.getControl('zoom');
    var scalebar = ui.getControl('scalebar');
    
    // mapSettings.setAlignment('top-right');
    // zoom.setAlignment('top-right');
    // scalebar.setAlignment('bottom-right');
    
          
    
    window.addEventListener('resize', () => this.map.getViewPort().resize());
    
    //init thee geocoding service from the platform
    this.HEREGeocoder = platform.getSearchService();

      // Venues provider interacts with tile layer to visualize and control the venue map
      const venuesProvider = new H.venues.Provider();
      const venuesService = platform.getVenuesService({ apikey: config.hereCredentials.apikey_venues });
    
      this.addVenue2Map(this.map, venuesProvider, venuesService, ui);
    //   this.addEventListeners();
      this.setLoading(false);
    
},

  /**
  * Load and add venue data on the map.
  *
  * @param  {H.Map} map A HERE Map instance
  */
 addVenue2Map: function addVenueToMap(map, venuesProvider, venuesService, ui) {

    // Venues service provides a loadVenue method
    venuesService.loadVenue(config.venues.Initial.id).then((venue) => {
      // add venue data to venues provider
      venuesProvider.addVenue(venue);
      venuesProvider.setActiveVenue(venue);
  
      // create a tile layer for the venues provider
      map.addLayer(new H.map.layer.TileLayer(venuesProvider));
  
      // optionally select drawing/level
    //   venue.setActiveDrawing(config.venues.Initial.initial_drawingID);
  
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

     
    //register on venue level change event
      venue.addEventListener(H.venues.Venue.EVENTS.LEVEL_CHANGE, (event) => {
        this.onVenueLevelChange(event);
  });

  // venue.setHighlightedGeometries(true, venue.getGeometries(), 
  //   {
  //       fillColor: '#FFFFCC',
  //       outlineColor: '#FFFFCC',
  //       outlineWidth: 1
      
  //   });
  
  venue.getGeometries().forEach((venueGeomtry)=>{
    venueGeomtry.addEventListener('tap', (event) => {
      // var venueGeometry = new H.venues.Geometry(event.target.model);

        console.info(`WaliedCheetos - INFO : ${JSON.stringify(event.target.model)}`);
        console.info(`WaliedCheetos - INFO : ${JSON.stringify(event.target.model.properties)}`);
        // console.info(`WaliedCheetos - INFO : ${venueGeometry.getAddress()}`);
  });
});

//   venue.getActiveLevels()[venue.getActiveLevelIndex()].model.geometries.forEach((geometry) => {
//     //   console.info(geometry.getProperties());
//       console.info(`WaliedCheetos - INFO : ${JSON.stringify(geometry.getProperties())}`);

//     });
 
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
       //venuesProvider.activeVenue.setActiveLevelIndex(1);
         console.info(`WaliedCheetos - INFO : Hollla, you just clicked on the new custom UI element.`);

         if(this.deviceLocationMarker){
                   // get the shape's bounding box and adjust the camera position
                   this.map.getViewModel().setLookAtData({
                    position: this.deviceLocationMarker.getGeometry(),
                   zoom: 19,
                   //bounds: venue.getBoundingBox(),
                   //tilt: this.config.map.tilt,
                   //heading: this.config.map.heading,
                   //incline: this.config.map.incline
                 }, true);
         }
         else{
          this.map.getViewModel().setLookAtData({
            position: this.map.getObjects()[0].getGeometry(),
            zoom: 19,
           //bounds: venue.getBoundingBox(),
           //tilt: this.config.map.tilt,
           //heading: this.config.map.heading,
           //incline: this.config.map.incline
         }, true);
          
         }
     }
 };
 
 var WaliedCheetos_CustomUI = new customUI();
 ui.addControl('WaliedCheetos_CustomUI', WaliedCheetos_CustomUI);
 
 //#endregion
  
    });
},
  

onVenueLevelChange: function(event) {
   try {
    console.info(`WaliedCheetos - INFO : Hollla, you just changed the venue level`);   
    console.info(`WaliedCheetos - INFO : ${event}`);
     } catch (error) {
        console.error(`WaliedCheetos - EXCEPTION : ${error}`);
     }
    },


    initHERETracking: function(){
        try {
            // Create new HERETracking object
            this.HERETracking= new HERETracking(); 
            this.HERETracking.environment = config.hereCredentials.tracking.environment;
            
            this.HEREAuthenticator = hereAccountHelper(this.HERETracking);
            this.HEREAuthenticator.login(config.hereCredentials.tracking.embed.email, config.hereCredentials.tracking.embed.password);

            const query = this.parseQueryStrings(window.location.search);
            this.trackingId = query.trackingId;


  // If we aren't logged in, redirect to login page
  if (this.HEREAuthenticator.isLoggedIn() && this.trackingId) {
    // HEREMap.onLoad(update);

    this.fetchDeviceTraces(this.trackingId, this.map);
      // this.intervalTimer = setInterval(() => this.fetchDeviceTraces(trackingId, this.map), config.hereCredentials.tracking.fetchfrequency);
   this.addEventListeners();
    // map = HEREMap.map(document.querySelector('#map'), [52.5, 13.4], 14);

  } else {
    console.error(`WaliedCheetos  - ERROR : please check your HERE tracking credintials or make sure to add trackingId query string paramter value`);
  }

        } catch (error) {
            console.error(`WaliedCheetos - EXCEPTION : ${error}`);
        }
    },


    fetchDeviceTraces: function(deviceTrackingID, map){
        console.info(`WaliedCheetos - INFO : Hollla I am HERE!`);
        clearTimeout(this.timeoutTimer);
        console.info(`WaliedCheetos -  INFO : timeout has been cleared`);

        var requestOptions = {
            token: this.HEREAuthenticator.getToken()
          };

          this.HERETracking.shadows.get(deviceTrackingID, requestOptions)
          .then(function(deviceShadow){

            document.querySelector('h1').innerText = `${deviceShadow.reported.system.client.name} ---- ${deviceShadow.reported.system.client.manufacturer} ---- ${deviceShadow.reported.system.computed.online?'online':'offline'}`;
            // document.querySelector('h1').innerText = deviceShadow.name || deviceTrackingID;

            //check if position is reported
            if (
                deviceShadow 
                &&  
                deviceShadow.reported 
                && 
                deviceShadow.reported.position 
                && 
                deviceShadow.reported.position.lat 
                && 
                deviceShadow.reported.position.lng) {

               console.debug(`WaliedCheetos -  DEBUG  : ${JSON.stringify(deviceShadow)}`);
               
               //update address info
               app.retrieveDeviceShadowAddress(deviceShadow);
               //update map and marker position

               var svgAnimatedPerson = '<svg id="mePin" xmlns="http://www.w3.org/2000/svg" width="43.3" height="42.4" viewBox="0 0 43.3 42.4"><path class="ring_outer" fill="#878787" d="M28.6 23c6.1 1.4 10.4 4.4 10.4 8 0 4.7-7.7 8.6-17.3 8.6-9.6 0-17.4-3.9-17.4-8.6 0-3.5 4.2-6.5 10.3-7.9.7-.1-.4-1.5-1.3-1.3C5.5 23.4 0 27.2 0 31.7c0 6 9.7 10.7 21.7 10.7s21.6-4.8 21.6-10.7c0-4.6-5.7-8.4-13.7-10-.8-.2-1.8 1.2-1 1.4z"/><path class="ring_inner" fill="#5F5F5F" d="M27 25.8c2 .7 3.3 1.8 3.3 3 0 2.2-3.7 3.9-8.3 3.9-4.6 0-8.3-1.7-8.3-3.8 0-1 .8-1.9 2.2-2.6.6-.3-.3-2-1-1.6-2.8 1-4.6 2.7-4.6 4.6 0 3.2 5.1 5.7 11.4 5.7 6.2 0 11.3-2.5 11.3-5.7 0-2-2.1-3.9-5.4-5-.7-.1-1.2 1.3-.7 1.5z"/><path class="mePin" d="M21.6 8.1a4 4 0 0 0 4-4 4 4 0 0 0-4-4.1 4.1 4.1 0 0 0-4.1 4 4 4 0 0 0 4 4.1zm4.9 8v-3.7c0-1.2-.6-2.2-1.7-2.6-1-.4-1.9-.6-2.8-.6h-.9c-1 0-2 .2-2.8.6-1.2.4-1.8 1.4-1.8 2.6V16c0 .9 0 2 .2 2.8.2.8.8 1.5 1 2.3l.2.3.4 1 .1.8.2.7.6 3.6c-.6.3-.9.7-.9 1.2 0 .9 1.4 1.7 3.2 1.7 1.8 0 3.2-.8 3.2-1.7 0-.5-.3-.9-.8-1.2l.6-3.6.1-.7.2-.8.3-1 .1-.3c.3-.8 1-1.5 1.1-2.3.2-.8.2-2 .2-2.8z" fill="#282828"/></svg>';


               var svgOnlineDevice = new H.map.DomIcon(svgAnimatedPerson);
               var svgOfflineDevice = new H.map.DomIcon(svgAnimatedPerson);

               if (!this.deviceLocationMarker) {
                   //add marker to the map
                   this.deviceLocationMarker = new H.map.DomMarker(deviceShadow.reported.position, {
                       icon: ((deviceShadow.reported.system.computed.online) ? svgOnlineDevice : svgOfflineDevice)
                    });
                    
                    map.addObject(this.deviceLocationMarker);

               } else {
                   // update marker's position within ease function callback
                   app.ease(
                       this.deviceLocationMarker.getGeometry(),
                       deviceShadow.reported.position,
                       4000,
                       function(coord) {
                           this.deviceLocationMarker.setGeometry(coord);
                           if (deviceShadow.reported.system.computed.online) {
                               this.deviceLocationMarker.setIcon(svgOnlineDevice);
                            } else {
                                this.deviceLocationMarker.setIcon(svgOfflineDevice);
                            }
                        });
                    }

    //                 // get the shape's bounding box and adjust the camera position
    //  map.getViewModel().setLookAtData({
    //    position: deviceShadow.reported.position 
    //   //zoom: this.config.map.zoom,
    //   //bounds: venue.getBoundingBox(),
    //   //tilt: this.config.map.tilt,
    //   //heading: this.config.map.heading,
    //   //incline: this.config.map.incline
    // }, true);
                    // Show the time the shadow was last updated
                    document.querySelector('time').innerHTML = '</br> Last updated: ' + (new Date(deviceShadow.reported.timestamp));
                    app.setLoading(false);

                } else {
                this.setLoading(false);
                console.debug(`WaliedCheetos -  DEBUG  : this device has not reported a position`);
            }
            // this.timeoutTimer = setTimeout(app.fetchDeviceTraces(app.trackingId, app.map), 30000);
            this.timeoutTimer = setTimeout(() => app.fetchDeviceTraces(app.trackingId, app.map), config.hereCredentials.tracking.fetchfrequency);
            console.info(`WaliedCheetos -  INFO : timeout has been set`);
          });

    },

retrieveDeviceShadowAddress:  function(deviceShadow){
try {
    var reverseGeocodingParameters = {
        at: `${deviceShadow.reported.position.lat},${deviceShadow.reported.position.lng}`,
        limit: '1'
      };

    this.HEREGeocoder.reverseGeocode(reverseGeocodingParameters, function(address){

      var indoorAddressInfo = '';


      if (deviceShadow.reported.position.type  != undefined) {
      if (deviceShadow.reported.position.type.toUpperCase() === 'INDOOR') {
         indoorAddressInfo = `Floor ID: ${deviceShadow.reported.position.floor.id} - Floor name: ${deviceShadow.reported.position.floor.name} - Floor level: ${deviceShadow.reported.position.floor.level}`;
        }
      }

        document.querySelector('address').innerHTML = `${indoorAddressInfo} </br> ${address.items[0].address.label} </br>`;
    }, function(error){
        console.error(`WaliedCheetos - Reverese Geocoding ERROR : ${error}`);
    });
} catch (error) {
    console.error(`WaliedCheetos - EXCEPTION : ${error}`);
}
}

    
}