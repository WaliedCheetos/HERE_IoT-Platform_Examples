
  /**
   * @author WaliedCheetos
   * (C) HERE 2021
   * author WCheetos
   */

import { initials } from './config.js';

//#region HERE maps initialization

  // check if the site was loaded via secure connection
  var secure = (location.protocol === 'https:') ? true : false;

// Initialize HERE Map
const platform = new H.service.Platform({ apikey: initials.hereCredentials.apikey,
   useHTTPS: secure });

const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(document.getElementById('mapContainer'),       
defaultLayers.vector.normal.map, {
    center: initials.mapCenter,
    zoom: 12,
    pixelRatio: window.devicePixelRatio || 1
});

const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
behavior.disable(H.mapevents.Behavior.DBLTAPZOOM);

window.addEventListener('resize', () => map.getViewPort().resize());
    
// Create the default UI:
    var ui = H.ui.UI.createDefault(map, defaultLayers);

//#endregion


//#region global variables
var startCoord;
var growingShape = null;
  var growingStrip = new H.geo.LineString();

  // Current Layer polygons.
var polygons = [];
var polygonOptions = {style: initials.styles.unselected_style};

//#endregion


//#region register map events

map.addEventListener('dbltap', finalizePolygon);
map.addEventListener('tap', initializeOraddPointToPolygon);
map.addEventListener('pointermove', refreshNonFinalizedPolygon);

//#endregion

//#region WaliedCheetos - draw polygon business logic

function makeHandles(polygon, polygonHandles) {
   var polygonStrip = polygon.getGeometry();
   for (var k = 0; k < polygonStrip.getExterior().getPointCount(); k++) {
     var handleCenter = polygonStrip.getExterior().extractPoint(k);
     var handleMarker = new H.map.Marker(handleCenter);
     handleMarker.draggable = true;

     handleMarker.addEventListener('dragstart', function () {
       document.body.style.cursor = 'pointer';
       behavior.disable();
     }, false);
     handleMarker.addEventListener('dragend', function () {
       polygonHandles.removeObjects(polygonHandles.getObjects());
       makeHandles(polygon, polygonHandles);
       document.body.style.cursor = 'auto';
       behavior.enable();
       behavior.disable(H.mapevents.Behavior.DBLTAPZOOM);
     }, false);
     (function (closureK) {// funny closures.
       handleMarker.addEventListener('drag', function (ev) {
         var target = ev.target;
         var pointer = ev.currentPointer;
         var screenToGeo = map.screenToGeo(pointer.viewportX, pointer.viewportY);
         target.setGeometry(screenToGeo);
         var newStrip = new H.geo.LineString();
         polygonStrip.getExterior().eachLatLngAlt(function (lat, lng, alt, idx) {
           if (idx !== closureK) {
             newStrip.pushLatLngAlt(lat, lng, 0);
           } else {
             newStrip.pushLatLngAlt(screenToGeo.lat, screenToGeo.lng, 0);
           }
         });
         polygon.setGeometry(new H.geo.Polygon(newStrip));
       }, false);
     })(k);
     polygonHandles.addObject(handleMarker);
   }
 }

function initializeOraddPointToPolygon(e) {
   // Only right click, left click for navigation.
   if (e.originalEvent.which !== 3) {
     return;
   }

   growingStrip.pushPoint(map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY));
 }

function refreshNonFinalizedPolygon(e) {
   var point = map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);
   var strip = new H.geo.LineString(growingStrip.getLatLngAltArray().concat(point.lat, point.lng, point.alt));
   if (growingStrip.getPointCount() == 1) {
     // We placed first point, want to show line on cursor move.
     if (!growingShape) {
       growingShape = new H.map.Polyline(strip, polygonOptions);
       map.addObject(growingShape);
     } else {
       growingShape.setGeometry(strip);
     }
   } else if (growingStrip.getPointCount() === 2) {
     if (growingShape instanceof H.map.Polyline) {
       map.removeObject(growingShape);
       growingShape = new H.map.Polygon(strip, polygonOptions);
       map.addObject(growingShape);
     } else {
       growingShape.setGeometry(new H.geo.Polygon(strip));
     }
   } else if (growingStrip.getPointCount() > 2) {
     growingShape.setGeometry(new H.geo.Polygon(strip));
   }
 }

function finalizePolygon(e) {
   

   if (e.originalEvent.which == 1 && growingShape == null) {
     var point = map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);

     var handleMarker = new H.map.Marker(point);
     makeDraggable(handleMarker, console.log);


     //this to simulate the prompt pop up to update key pair values you have shown in your demo
     var name = window.prompt("Please specify value for key attribute NAME:");
     var strip = new H.geo.LineString();
     strip.pushPoint(point);

     polygons.push({
       $name: name,
       getStrip: function () {
         return strip;
       }
     });

     map.addObject(handleMarker);
     e.originalEvent.stopImmediatePropagation();
     saveCurrentLayer();

     return;
   }

   if (e.originalEvent.which !== 3) {
     return;// Only right click.
   }
   e.originalEvent.stopImmediatePropagation();

  growingShape.setGeometry(new H.geo.Polygon(growingStrip));

   map.removeObject(growingShape);// will be added as a group

   makePolygonModifiableAndDraggable(growingShape);

//this to simulate the prompt pop up to update key pair values you have shown in your demo
   var name = window.prompt("Please specify value for key attribute NAME:");
   growingShape.$name = name;

   saveCurrentLayer();
   
   growingShape = null;
   growingStrip = new H.geo.LineString();
 }

 function makePolygonModifiableAndDraggable(polygon) {
   var polygonStuff = new H.map.Group({volatility: true});
   polygonStuff.addObject(polygon);
   var polygonHandles = new H.map.Group();
   polygonStuff.addObject(polygonHandles);

   var oldStrip = polygon.getGeometry();
   var newStrip = new H.geo.LineString();
   // fix the dbltap adding two points in last place, removing last.
   for (var i = 0; i < oldStrip.getExterior().getPointCount() - 1; i++) {
     newStrip.pushPoint(oldStrip.getExterior().extractPoint(i));
   }
   polygon.setGeometry(new H.geo.Polygon(newStrip));


   makeHandles(polygon, polygonHandles);
   makeDraggable(polygon, function (newStrip) {
     polygonHandles.removeObjects(polygonHandles.getObjects());
     makeHandles(polygon, polygonHandles);
   });

   map.addObject(polygonStuff);

   polygons.push(polygon);
 }

 function makeDraggable(object, draggedCallback) {
   object.draggable = true;
   object.addEventListener('drag', function (evt) {
     var newCoord = map.screenToGeo((evt.pointers[0].viewportX), (evt.pointers[0].viewportY));
     if (newCoord.lat != startCoord.lat || newCoord.lng != startCoord.lng) {
       if (!object instanceof H.map.Marker) {
         var strip = object.getGeometry();
         var newStrip = new H.geo.LineString();
         strip.eachLatLngAlt(function (lat, lng, alt, idx) {
           var diffLat = (lat - startCoord.lat);
           var diffLng = (lng - startCoord.lng);
           newStrip.pushLatLngAlt(newCoord.lat + diffLat, newCoord.lng + diffLng, 0);
         });
         object.setGeometry(new H.geo.Polygon(newStrip));
         draggedCallback(newStrip);
       } else {
         object.setGeometry(newCoord);
       }
       if (!map.getViewModel().getLookAtData().bounds.getBoundingBox().containsPoint(newCoord)) {
         map.setCenter(newCoord, true);
       }
       startCoord = newCoord;
     }
   });

   object.addEventListener('dragstart', function (evt) {
     document.body.style.cursor = 'pointer';
     startCoord = map.screenToGeo((evt.pointers[0].viewportX), (evt.pointers[0].viewportY));
     behavior.disable();
   });

   object.addEventListener('dragend', function (evt) {
     document.body.style.cursor = 'auto';
     behavior.enable();
     behavior.disable(H.mapevents.Behavior.DBLTAPZOOM);
   });
 }

 function saveCurrentLayer() {

   var file = 'name\twkt\n';
  console.log("polygons:: ", polygons);
   for (var i = 0; i < polygons.length; i++) {
     var stripP;
     if(polygons[i] instanceof H.map.Polygon){
        stripP = polygons[i].getGeometry().getExterior();
     }else{
        stripP = polygons[i].getStrip();
     }
     file += polygons[i].$name + '\t' + polygonStripToWkt(stripP) + '\n';
   }

   console.log(`Polygons WKT: ${file}`);
 }

//#endregion

//#region helpers

/**
 * Generate valid WKT for given geo strip.
 */

 function polygonStripToWkt(strip) {

   if (strip.getPointCount() == 1) {
       return 'POINT (' + strip.extractPoint(0).lng + ' ' + strip.extractPoint(0).lat + ')';
   }

   var points = [];
   for (var i = 0; i < strip.getPointCount(); i++) {
       var p = strip.extractPoint(i);
       points.push(p.lng + ' ' + p.lat);
   }
   points.push(points[0]);
   return 'POLYGON ((' + points.join(', ') + '))';
}

function calculateCentroid(strip) {
   var sl = strip.getLatLngAltArray().slice();
   if (H.geo.Strip) {
       strip = new H.geo.Strip(sl);
   } else {
       strip = new H.geo.LineString(sl);
   }


   var pointCount = strip.getPointCount();
   if (pointCount === 1) {
       return [strip.extractPoint(0), 0.001];
   } else if (pointCount === 2) {
       var a = strip.extractPoint(0);
       var b = strip.extractPoint(1);
       return [new H.geo.Point((a.lat + b.lat) / 2, (a.lng + b.lng) / 2), 0.001];
   } else if (pointCount === 3) {
       var a = strip.extractPoint(0);
       var b = strip.extractPoint(1);
       var c = strip.extractPoint(2);
       var area = a.lng * (b.lat - c.lat) + b.lng * (c.lat - a.lat) + c.lng * (a.lat - b.lat);
       var number = (a.lng + b.lng + c.lng) / 3;
       var number2 = (a.lat + b.lat + c.lat) / 3;
       return [new H.geo.Point(number2, number), area];
   }

   var first = strip.extractPoint(0);
   var last = strip.extractPoint(pointCount - 1);
   if (first.lat != last.lat || first.lng != last.lng) {
       strip.pushPoint(first);
   }

   var doubleArea = 0;
   var lat = 0;
   var lng = 0;
   var point1;
   var point2;
   var tmpArea;
   for (var i = 0, j = pointCount - 1; i < pointCount; j = i++) {
       point1 = strip.extractPoint(i);
       point2 = strip.extractPoint(j);
       tmpArea = point1.lng * point2.lat - point2.lng * point1.lat;
       doubleArea += tmpArea;
       lat += (point1.lat + point2.lat) * tmpArea;
       lng += (point1.lng + point2.lng) * tmpArea;
   }
   if (doubleArea === 0) {
       // Almost no area, take one point and avoid divide by zero.
       return [strip.extractPoint(0), 0];
   }
   var divFactor = doubleArea * 3;
   return [new H.geo.Point(lat / divFactor, lng / divFactor), doubleArea / 2];
}

function calculateWeightedCentroid(centroids) {
   // TODO not really weighted at the moment :)
   // Just taking the max.
   var maxArea = -1;
   var center;
   for (var i = 0; i < centroids.length; i++) {
       if (centroids[i][1] > maxArea) {
           center = centroids[i][0];
       }
   }
   return center;
}

//#endregion

