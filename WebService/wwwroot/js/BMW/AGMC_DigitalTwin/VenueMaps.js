
class VenueMaps {

    /**
 * construct HERE venue map instance
 *
 * @param  {H.Map} map A HERE Map instance
 * @param  {venuesService} venueService A HERE Map venue platform service instance
 * @param  {H.venues.Provider} venuesProvider A HERE Map venue provider instance
 * @param  {H.ui.UI} ui A HERE Map ui instance
 */
    constructor(map, venuesService, venuesProvider, ui, venueID, activeDrawingID) {
       this.map = map;
       this.venuesService = venuesService;
       this.venuesProvider = venuesProvider;
       this.ui = ui;
       this.venueID = venueID;

  this.venuesService.loadVenue(this.venueID).then((venue) => {
    // add venue data to venues provider
    this.venuesProvider.addVenue(venue);
    this.venuesProvider.setActiveVenue(venue);

    // create a tile layer for the venues provider
    this.map.addLayer(new H.map.layer.TileLayer(venuesProvider));

    // optionally select drawing/level
    if(activeDrawingID)
        venue.setActiveDrawing(activeDrawingID);

    // create level control
    const levelControl = new H.venues.ui.LevelControl(venue);
    this.ui.addControl('level-control', levelControl);

    // create drawing control:
    const drawingControl = new H.venues.ui.DrawingControl(venue);
    this.ui.addControl('drawing-control', drawingControl);

      // center map on venue
  //map.setCenter(venue.getCenter());

   // get the shape's bounding box and adjust the camera position
   map.getViewModel().setLookAtData({
      //zoom: evt.target.getData().minZoom,
      bounds: venue.getBoundingBox()
    }, true);

  //register on venue level change event
    venue.addEventListener(H.venues.Venue.EVENTS.LEVEL_CHANGE, (event) => {
      this.onVenueLevelChange(event);
    });
  });

}
    onVenueLevelChange(event) {
        try {
            console.log(event);
          } catch (error) {
            console.error(error);
          }
        }
    }
 
 export default VenueMaps;