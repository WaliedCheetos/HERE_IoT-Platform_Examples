
//#region configuration
const HEREInitials = {
    Messages: {
        NoImplemntation: 'WaliedCheetos says Hollla - Nothing implemented yet!',
        NoCADFileSelected: 'WaliedCheetos says: please select a CAD file for processing!'
    },
    Center: {
        //lat: 25.19893,
        //lng: 55.27991,

        lat: 25.2841478,
        lng: 51.4419567,
        text: 'WaliedCheetos'
    },
    MapTileStyle_Default: 'reduced.night',
    MapTileStyles: {
        ReducedNight: 'reduced.night',
        NormalDay: 'normal.day',
        NormalDayGrey: 'normal.day.grey',
        NormalDayTransit: 'normal.day.transit',
        ReducedDay: 'reduced.day',
        NormalNight: 'normal.night',
        ReducedNight: 'reduced.night',
        PedestrianDay: 'pedestrian.day'
    },
    //MapTileURLSuffix: `https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${HEREInitials.MapTileStyle.ReducedDay}/{z}/{x}/{y}/512/png8?apiKey=${HEREInitials.Credentials.APIKey}&ppi=320`,
    MapTileURLSuffix: 'https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest',
    HEREVectorTileURLSuffix: 'https://assets.vector.hereapi.com/styles/berlin/base/tangram/tilezen',
    MapContenxtMenuZoomInImage: 'https://aratcliffe.github.io/Leaflet.contextmenu/examples/images/zoom-in.png',
    MapContenxtMenuZoomOutImage: 'https://aratcliffe.github.io/Leaflet.contextmenu/examples/images/zoom-out.png',
    Zoom: 17,
    Heading: 180,
    Tilt: 65,
    Credentials: {
        AppID: 'Lrw0yF4Z4nFpEe7jJxcd',
        AppCode: '9zhfUoi6kIHQqt85SunXuw',
        APIKey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
    },
    Attribution: '&copy; HERE 2020'
}

// Your web app's Firebase configuration
const firebaseInitials = {
    apiKey: "AIzaSyAm8erna2Kveiuzr04s9O2LE2plRJjX8-M",
    authDomain: "waliedcheetos-trackingapp.firebaseapp.com",
    databaseURL: "https://waliedcheetos-trackingapp.firebaseio.com",
    projectId: "waliedcheetos-trackingapp",
    storageBucket: "waliedcheetos-trackingapp.appspot.com",
    messagingSenderId: "1064815929628",
    appId: "1:1064815929628:web:fb7593513026a47cd972d9",
    measurementId: "G-NL2Y1QFYB2"
};

const firebaseDBsRef = {
    WaliedCheetos_TrackingApp: {
        name: 'WaliedCheetos-TrackingApp',
        trackerId: '123',
        realtimeAttribute: 'time'
    }
}

//#endregion

export { HEREInitials, firebaseInitials, firebaseDBsRef};