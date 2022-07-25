const config = {
    attribution: 'WaliedCheetos - &copy; HERE 2021',
    hereCredentials : {
        app_id: 'Lrw0yF4Z4nFpEe7jJxcd',
        app_code: '9zhfUoi6kIHQqt85SunXuw',
        // apikey: 'VyfVpUsLIC3HTmgC8O5xTnYfaH_mrA51IwCD7hQJ29w',
        // apikey: 'UFykqZqE8BtxnVnLxaA_tf71CB_yEW94BujWeUHxIR4',
        // apikey: '5v9nseCYh74Gp-Bk391n8Lj7xuW48vPcrsQqaq3MOgs',
        // apikey: 'QICW7garcjxE7C7sSguJcNolMZXqYCJ9m5o6Qq3ygjg',
        apikey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E',
        apikey_venues: 'UFykqZqE8BtxnVnLxaA_tf71CB_yEW94BujWeUHxIR4',
        // apikey_venues: 'QICW7garcjxE7C7sSguJcNolMZXqYCJ9m5o6Qq3ygjg',
        tracking:{
          environment: 'production',
          initialfetchtimeout:30000,
          fetchfrequency:30000,
          embed: { // Only needed if you want to use the 'embed.html' demo
              email: "dcd_demo@here.com",
              password: "2Hshu7ta5NKfpfM",
              //WaliedCheetos-Device
              // trackingId_WaliedCheetos: "HERE-ae8425b4-dc2e-454d-91c4-709e21f6fd63",
              //SPAN bodytrack device
              // trackingId_SPAN: "HERE-65e6058a-98f2-4f28-a148-a24868438060",

              trackingId: "HERE-ae8425b4-dc2e-454d-91c4-709e21f6fd63",

              ui: {
                header: true,
                info: true,
                buttons: true
              }
            }
        }
    },
    mapCenter : { 
       lat: 25.204247,
       lng: 55.3733013,
       tilt:45,
       zoom:17,
       heading: 169,
       text: 'Dubai, ARE'
    },
    venues:{
      ZurichAirport:{
         id:7348,
         initial_drawingID:7880
      },
      SPANGroupOffice:{
        id:27608,
        initial_drawingID:1234
      },
      Initial:{
        id:27608,
        initial_drawingID:7880
      }
   },
 services:{
   reverseGeocoding: "https://revgeocode.search.hereapi.com/v1/revgeocode?lang=en-US"
 }
 };