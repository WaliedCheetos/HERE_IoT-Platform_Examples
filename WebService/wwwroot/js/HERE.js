//import { router } from './app.js';
import { HEREInitials } from './config.js';
import { router, geocoder } from './app.js';

/* ...
 * Calculate an isoline
 * ...
 */
const requestIsolineShape = options => {
    const params = {
        'mode': `fastest;${options.mode};traffic:enabled`,
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
                resolve(shape)
            },
            err => reject(err)
        );
    })
}

//export { requestIsolineShape }


/* ...
 * Enable geocoding and autocomplete
 * ...
 */

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
    `https://autocomplete.geocoder.api.here.com/6.2/suggest.json
?app_id=${HEREInitials.Credentials.AppID}
&app_code=${HEREInitials.Credentials.AppCode}
&resultType=areas
&query=${query}`

export {
    autocompleteGeocodeUrl,
    //isolineMaxRange,
    requestGeocode,
    requestIsolineShape
}
