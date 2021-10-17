
const config = {
   attribution: 'WaliedCheetos - &copy; HERE 2021',
   hereCredentials : {
      id: '***',
      code: '***',
      apikey: 'QICW7garcjxE7C7sSguJcNolMZXqYCJ9m5o6Qq3ygjg'
      // apikey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
   },
   map:{
    //   center : { 
    //      lat: 52.5159, 
    //      lng: 13.3777, 
    //      text: 'Berlin, Germany'
    //   },
      center : {
          lat:47.4523, 
          lng:8.5613,
          text: 'Berlin, Germany'},
      zoom: 13
   },
   venues:{
      ZurichAirport:{
         id:7348,
         initial_drawingID:7880
      }
   },
   initialDetections:{
      WaliedCheetos:{
      detections:[
          {
              id:"detect_01",
              object:{
                  type:"vehicle",
                  subtype:"light vehicle",
                  id:"obj_01"
              },
              location:{
                  venue_info:{
                      id:"venue_01",
                      name:"WaliedCheetos_Venue_01",
                      level:1,
                      space:"bathroom"
                  },
                  coordinates:{lat:47.4523, lng:8.5612}
              },
              timestamp:"",
              timestamp:"#WaliedCheetos|#BMW|#AGMC"
          },
          {
              id:"detect_02",
              object:{
                  "type":"vehicle",
                  "subtype":"heavy vehicle",
                  id:"obj_02"
              },
              location:{
                  venue_info:{
                      id:"venue_01",
                      name:"WaliedCheetos_Venue_01",
                      level:1,
                      space:"retail"
                  },
                  coordinates:{lat:47.4523, lng:8.5613}
              },
              timestamp:"",
              timestamp:"#WaliedCheetos|#BMW|#AGMC"
          },
          {
              id:"detect_03",
              object:{
                  "type":"person",
                  "subtype":"safety engineer",
                  id:"obj_03"
              },
              location:{
                  venue_info:{
                      id:"venue_01",
                      name:"WaliedCheetos_Venue_01",
                      level:1,
                      space:"retail"
                  },
                  coordinates:{lat:47.4536, lng:8.5615}
              },
              timestamp:"",
              timestamp:"#WaliedCheetos|#BMW|#AGMC"
          },
          {
              id:"detect_04",
              object:{
                  "type":"person",
                  "subtype":"maintenance engineer",
                  id:"obj_04"
              },
              location:{
                  venue_info:{
                      id:"venue_01",
                      name:"WaliedCheetos_Venue_01",
                      level:1,
                      space:"retail"
                  },
                  coordinates:{lat:47.4529, lng:8.5611}
              },
              timestamp:"",
              timestamp:"#WaliedCheetos|#BMW|#AGMC"
          },
          {
              id:"detect_05",
              object:{
                  "type":"person",
                  "subtype":"service engineer",
                  id:"obj_05"
              },
              location:{
                  venue_info:{
                      id:"venue_01",
                      name:"WaliedCheetos_Venue_01",
                      level:1,
                      space:"retail"
                  },
                  coordinates:{lat:47.4515, lng:8.5613}
              },
              timestamp:"",
              timestamp:"#WaliedCheetos|#BMW|#AGMC"
          },
          {
              id:"detect_06",
              object:{
                  "type":"person",
                  "subtype":"vehicle owner",
                  id:"obj_06"
              },
              location:{
                  venue_info:{
                      id:"venue_01",
                      name:"WaliedCheetos_Venue_01",
                      level:1,
                      space:"retail"
                  },
                  coordinates:{lat:47.4515, lng:8.5608}
              },
              timestamp:"",
              timestamp:"#WaliedCheetos|#BMW|#AGMC"
          }
      ],
      vehciles_types:["light vehicle", "heavy vehicle"],
      persons_types:["safety engineer", "service engineer", "vehicle owner"]
  }
  }
}

export { config};