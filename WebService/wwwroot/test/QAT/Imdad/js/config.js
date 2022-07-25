// const center = { 
//    lat: 25.26952,
//    lng: 55.30885,
//    text: 'Dubai, United Arab Emarites'
// }

// const hereCredentials = {
//    id: 'YOUR-HERE-ID',
//    code: 'YOUR-HERE-CODE',
//    apikey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
// }

// export { center, hereCredentials };

const config = {
   hereCredentials : {
       apikey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E',
       appid:'Lrw0yF4Z4nFpEe7jJxcd',
       appcode:'9zhfUoi6kIHQqt85SunXuw'
   },
   w3w:{
    credentials: {
        apikey: 'MMFFK8O1'
    },
    RegEx: {
        w3wFormat: /^\/{0,}[^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]{1,}[・.。][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]{1,}[・.。][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]{1,}$/i
    }
   },
   map :{
       center:{
           lat: 25.19893,
           lng: 55.27991,
           text: 'Dubai, United Arab Emarites'
       },
       zoom: 13,
       tilt: 65,
       heading: 0
   },
   log :{
       logLevels : {
           ERROR: 'ERROR',
           DEBUG: 'DEBUG',
           INFO: 'INFO',
           TRACE: 'TRACE',
           WARN: 'WARN'
       },
       logLevel:'TRACE'
   },
   customerSample:{
       sampleSize : 250,
       includeVerifiedLocation : false,
       country : 'United Arab Emirates',
       countrycode: 'ARE',
       city: 'Dubai',
       bbox: '55.0375297,24.4881882,55.6537921,25.3182279'
   },
   statusIndicators:{
       PROCESSING: 'PROCESSING',
       COMPLETED: 'COMPLETED'
   }
}

export {config}