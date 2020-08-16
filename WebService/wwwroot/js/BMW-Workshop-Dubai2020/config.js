//const center = { 
//    lat: 55.26637, 
//    lng: 25.19345, 
//   text: 'WaliedCheetos'
//}
//const hereCredentials = {
//    id: 'Lrw0yF4Z4nFpEe7jJxcd',
//    code: '9zhfUoi6kIHQqt85SunXuw',
//    apikey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
//}

const HEREInitials = {
    Center: {
        lat: 25.19893,
        lng: 55.27991,
        //lat: 25.100786, 
        //lng: 55.163554,
        text: 'WaliedCheetos'
    },
    Zoom: 13,
    Tilt: 65,
    Credentials: {
        AppID: 'Lrw0yF4Z4nFpEe7jJxcd',
        AppCode: '9zhfUoi6kIHQqt85SunXuw',
        APIKey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
    },
    Isoline: {
        MaxRange: {
            //time: 32400, //seconds
            //distance: 80000 //meters            
            time: 3600, //seconds
            distance: 30000 //meters
        },
        Style: {
            fillColor: 'rgba(74, 134, 255, 0.3)',
            strokeColor: '#4A86FF',
            lineWidth: 2
        }
    },
    Markers: {
        Icons: {
            DefaultIcon: (new H.map.Icon("../images/marker_position.png", { size: { w: 63, h: 63 } })),
            StartIcon: (new H.map.Icon("../images/location_start.png", { size: { w: 63, h: 63 } })),
            DestinationIcon: (new H.map.Icon("../images/location_destination.png", { size: { w: 63, h: 63 } })),
            VehicleIcon: (new H.map.Icon("../images/bmw-3-seriesx.png", { size: { w: 73, h: 73 } }))
        }
    },
    Route: {
        Styles: {
            //ClassicRouting: {
            //    strokeColor: 'blue',
            //    lineWidth: 7
            //},
            ClassicRouting: {
                lineWidth: 10,
                fillColor: 'yellow',
                strokeColor: 'blue',
                lineDash: [1, 3],
                lineTailCap: 'arrow-tail',
                lineHeadCap: 'arrow-head',
                lineJoin: 'bevel'
            },
            NoOverTakeRoutes: {
                lineWidth: 5,
                strokeColor: 'red',
                lineJoin: "round"
            }
        }
        , Simulation: {
            updateMapViewModel: true
        }
    },
    Icons: {
        //SedanVehicle: '../../images/vw-beetle-icon.png'
        SedanVehicle: '../../images/car.png'
    }
    ,
    Geocoding: {
        //InitialAddress: 'Paris, FRA'
        //InitialAddress: 'Dubai, ARE'
        InitialAddress: 'Dubai Mall'
    },
    PDELayers: {
        TrafficSigns: 'TRAFFIC_SIGN_FC'
    },
    TrafficCongestionTimePatterns: {
        PerDay: 'PerDay',
        PerHour: 'PerHour'
    },
    TrafficCongestionDirection: {
        North: 'N',
        South: 'S'
    },
    WCheetosAPI: {
        EndPoint_URL: 'https://localhost:44361/api/AdminWebService/GenericJSONRequest',
        UserID: 'WaliedCheetos',
        Token: 'WaliedCheetos-Token'
    },
    QRCodeInitials: {
        HERE_WeGo_BaseURL: 'https://wego.here.com/?map={lat},{lng},18,normal'
    }
}



//export { HEREInitials, center, hereCredentials };
export { HEREInitials };