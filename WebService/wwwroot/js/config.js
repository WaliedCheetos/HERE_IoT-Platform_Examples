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
        //lat: 48.85824,
        //lng: 2.2945,
        text: 'WaliedCheetos'
    },
    Zoom: 13,
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
    Geocoding: {
        //InitialAddress: 'Paris, FRA'
        InitialAddress: 'Dubai, ARE'
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
    }
}



//export { HEREInitials, center, hereCredentials };
export { HEREInitials };