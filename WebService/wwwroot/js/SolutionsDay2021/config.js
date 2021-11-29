const initials = {
   attribution: 'WaliedCheetos - &copy; HERE 2021',
   randomDataSetSpecs:{
       size: 13,
       isoline: 17000,
       geocoded: true,
       parts:['Alternator', 'Brake-pads', 'Brake-rotors', 'Engine-oil', 'Transmission-oil', 'Spark-plugs', 'Tyres', 'Suspension'],
       partsLifespan:{
         parts:[
           {
             x:[{
         year: 202,
         month: 0,
         day: 1,
         lifespan: 0.7,
         avgtemp: 20,
         avgmilage: 1300,
         avgroughness: 0.79,
         avgdiffturns: 0.3,
         avgharshbreaking: 0.47,
         avgspeedvslinkspecs: 0.87, 
         event: 'WaliedCheetos !',
       }, {
         year: 202,
         month: 0,
         day: 1,
         lifespan: 0.3,
         avgtemp: 20,
         avgmilage: 1300,
         avgroughness: 0.79,
         avgdiffturns: 0.3,
         avgharshbreaking: 0.47,
         avgspeedvslinkspecs: 0.87, 
         event: 'WaliedCheetos !',
       }]
      },
      {y:[{
         year: 202,
         month: 0,
         day: 1,
         lifespan: 0.5,
         avgtemp: 20,
         avgmilage: 1300,
         avgroughness: 0.79,
         avgdiffturns: 0.3,
         avgharshbreaking: 0.47,
         avgspeedvslinkspecs: 0.87, 
         event: 'WaliedCheetos !',
       }, {
         year: 202,
         month: 0,
         day: 1,
         lifespan: 0.9,
         avgtemp: 20,
         avgmilage: 1300,
         avgroughness: 0.79,
         avgdiffturns: 0.3,
         avgharshbreaking: 0.47,
         avgspeedvslinkspecs: 0.87, 
         event: 'WaliedCheetos !',
       }]
      }
    ]
       }
   },
   hereCredentials : {
      id: 'Lrw0yF4Z4nFpEe7jJxcd',
      code: '9zhfUoi6kIHQqt85SunXuw',
      apikey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
   },
   mapCenter : { 
      lat: 23.755399865802094,
      lng: 54.66024872659155,
      tilt:45,
      zoom:7,
      heading: 169,
      text: 'Dubai, ARE'
   },
services:{
  reverseGeocoding: "https://revgeocode.search.hereapi.com/v1/revgeocode?lang=en-US"
}
};

export { initials };