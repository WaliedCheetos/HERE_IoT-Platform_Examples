const initials = {
   attribution: 'WaliedCheetos - &copy; HERE 2020',
   hereCredentials : {
      id: 'Lrw0yF4Z4nFpEe7jJxcd',
      code: '9zhfUoi6kIHQqt85SunXuw',
      apikey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
   },
   mapCenter : { 
      lat: 28.63096, 
      lng: 77.21722,
      text: 'New Delhi, IND'
      // lat: 25.26952, 
      // lng: 55.30885, 
      // text: 'Dubai, ARE'
   },
   routeIsoline : {
      maxRange : {
         time: 32400, //seconds
         distance: 80000 //meters
      },
      mode :{
profile: 'fastest',
traffic: 'traffic:enabled'
      },
      style:{
         fillColor: 'rgba(74, 134, 255, 0.3)',
         strokeColor: '#4A86FF',
         lineWidth: 2
      }
   },
   geocoding : {
      autoCompleteAreasURL : 'https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?resultType=areas&apiKey='
   }
}

export { initials };