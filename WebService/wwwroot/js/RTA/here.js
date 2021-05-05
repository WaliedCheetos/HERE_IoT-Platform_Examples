import { router, geocoder } from './app.js';
import { initials} from './config.js'

const requestIsolineShape = options => {
   const params = {
      'mode': `${initials.routeIsoline.mode.profile};${options.mode};${initials.routeIsoline.mode.traffic}`,
      'start': `geo!${options.center.lat},${options.center.lng}`,
      'range': options.range,
      'rangetype': options.rangeType,
      'departure': `${options.date}T${options.time}:00`,
   };

   return new Promise((resolve, reject) => {
      router.calculateIsoline(
         params,
         res => {
            const shape = res.response.isoline[0].component[0].shape.map(z => z.split(','));
            resolve( shape )
         },
         err => reject(err)
      );
   })
}

const requestGeocode = locationid => {
    return new Promise((resolve, reject) => {
       geocoder.geocode(
          { locationid },
          res => {
             const coordinates = res.Response.View[0].Result[0].Location.DisplayPosition;
             resolve(coordinates);
          },
          err => reject(err)
       )
    })
 }
 
 const autocompleteGeocodeUrl = (query) => 
 `${initials.geocoding.autoCompleteAreasURL}${initials.hereCredentials.apikey}&query=${query}`

export { requestIsolineShape, autocompleteGeocodeUrl,requestGeocode }