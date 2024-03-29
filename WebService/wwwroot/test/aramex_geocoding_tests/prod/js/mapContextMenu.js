import {config} from './config.js'
import {map} from './app.js'
import {log} from './logger.js'

/**
 * Adds context menus for the map and the created objects.
 * Context menu items can be different depending on the target.
 * That is why in this context menu on the map shows default items as well as
 * the "Add circle", whereas context menu on the circle itself shows the "Remove circle".
 *
 * @param {H.Map} map Reference to initialized map object
 */

 function registerContextMenus() {
    // First we need to subscribe to the "contextmenu" event on the map
    map.addEventListener('contextmenu', function (e) {
      // As we already handle contextmenu event callback on circle object,
      // we don't do anything if target is different than the map.
      if (e.target !== map) {
        return;
      }
  
      // "contextmenu" event might be triggered not only by a pointer,
      // but a keyboard button as well. That's why ContextMenuEvent
      // doesn't have a "currentPointer" property.
      // Instead it has "viewportX" and "viewportY" properties
      // for the associates position.
  
      // Get geo coordinates from the screen coordinates.
      var coord  = map.screenToGeo(e.viewportX, e.viewportY);

reverseGeocoding(coord.lat, coord.lng).then(reverseGeocodingResponse => {
    // alert(reverseGeocodingResponse.items[0].title);

    console.log(reverseGeocodingResponse, config.log.logLevels.DEBUG);

    e.items.push(
        // Create a menu item, that has only a label,
        // which displays the current coordinates.
        new H.util.ContextItem({
          label: [
            Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S'),
            Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W')
          ].join(' ')
        }),
        H.util.ContextItem.SEPARATOR,
        new H.util.ContextItem({
            label: reverseGeocodingResponse.items[0].title
          }),
          H.util.ContextItem.SEPARATOR,
        // Create an item, that will change the map center when clicking on it.
        new H.util.ContextItem({
          label: 'Center map here',
          callback: function() {
            map.setCenter(coord, true);
          }
        }),
        // It is possible to add a seperator between items in order to logically group them.
        H.util.ContextItem.SEPARATOR,
        // This menu item will add a new circle to the map
        new H.util.ContextItem({
          label: 'Add circle',
          callback: addCircle.bind(map, coord)
        })
      );
});

/*
 var reverseGeocodingResponse = await reverseGeocoding(coord.lat, coord.lng);

 e.items.push(
        // Create a menu item, that has only a label,
        // which displays the current coordinates.
        new H.util.ContextItem({
          label: [
            Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S'),
            Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W')
          ].join(' ')
        }),
        new H.util.ContextItem({
            label: reverseGeocodingResponse.items[0].title
          }),
        // Create an item, that will change the map center when clicking on it.
        new H.util.ContextItem({
          label: 'Center map here',
          callback: function() {
            map.setCenter(coord, true);
          }
        }),
        // It is possible to add a seperator between items in order to logically group them.
        H.util.ContextItem.SEPARATOR,
        // This menu item will add a new circle to the map
        new H.util.ContextItem({
          label: 'Add circle',
          callback: addCircle.bind(map, coord)
        })
      );

*/
      /*

      //   var reverseGeocodingRequest =  $.getJSON(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${coord.lat},${coord.lng}&lang=en-US&limit=1&apikey=${config.hereCredentials.apikey}`);
    
       $.when(reverseGeocodingRequest).done( function(response) {
      // In order to add menu items, you have to push them to the "items"
      // property of the event object. That has to be done synchronously, otherwise
      // the ui component will not contain them. However you can change the menu entry
      // text asynchronously.
      e.items.push(
        // Create a menu item, that has only a label,
        // which displays the current coordinates.
        new H.util.ContextItem({
          label: [
            Math.abs(coord.lat.toFixed(4)) + ((coord.lat > 0) ? 'N' : 'S'),
            Math.abs(coord.lng.toFixed(4)) + ((coord.lng > 0) ? 'E' : 'W')
          ].join(' ')
        }),
        new H.util.ContextItem({
            label: response.items[0].title
          }),
        // Create an item, that will change the map center when clicking on it.
        new H.util.ContextItem({
          label: 'Center map here',
          callback: function() {
            map.setCenter(coord, true);
          }
        }),
        // It is possible to add a seperator between items in order to logically group them.
        H.util.ContextItem.SEPARATOR,
        // This menu item will add a new circle to the map
        new H.util.ContextItem({
          label: 'Add circle',
          callback: addCircle.bind(map, coord)
        })
      );
      */

    });
  }
  
  /**
   * Adds a circle which has a context menu item to remove itself.
   *
   * @this H.Map
   * @param {H.geo.Point} coord Circle center coordinates
   */
  function addCircle(coord) {
    // Create a new circle object
    var circle = new H.map.Circle(coord, 5000),
        map = this;
  
    // Subscribe to the "contextmenu" eventas we did for the map.
    circle.addEventListener('contextmenu', function(e) {
      // Add another menu item,
      // that will be visible only when clicking on this object.
      //
      // New item doesn't replace items, which are added by the map.
      // So we may want to add a separator to between them.
      e.items.push(
        new H.util.ContextItem({
          label: 'Remove',
          callback: function() {
            map.removeObject(circle);
          }
        })
      );
    });
  
    // Make the circle visible, by adding it to the map
    map.addObject(circle);
  }
  

  async function reverseGeocoding(x, y){
    let reverseGeocodingRequest =  `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${x},${y}&lang=en-US&limit=1&apikey=${config.hereCredentials.apikey}`;
    
    log(reverseGeocodingRequest, config.log.logLevels.DEBUG);
    try {
            let response = await fetch(reverseGeocodingRequest);
            return await response.json();
        } catch (error) {
            log(error, config.log.logLevels.ERROR);
        }
    }
 
export {registerContextMenus}  


