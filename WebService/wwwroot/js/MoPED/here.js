import { hereCredentials } from './config.js';
import { geocoder } from './app.js';

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
`https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?apiKey=${hereCredentials.apikey}&resultType=areas&query=${query}`

export { 
   autocompleteGeocodeUrl, 
   requestGeocode,
}