

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
    //Isoline: {
    //    MaxRange: {
    //        //time: 32400, //seconds
    //        //distance: 80000 //meters            
    //        time: 3600, //seconds
    //        distance: 30000 //meters
    //    },
    //    Style: {
    //        fillColor: 'rgba(74, 134, 255, 0.3)',
    //        strokeColor: '#4A86FF',
    //        lineWidth: 2
    //    }
    //},
    Markers: {
        Icons: {
            //DefaultIcon: (new H.map.Icon("../images/marker_position.png", { size: { w: 63, h: 63 } })),
            DestinationIcon: (new H.map.Icon("../../images/Aramex-Workshop/destination.gif", { size: { w: 33, h: 45 } }, { anchor: new H.math.Point(10, 35) })),
            LocationIcon: (new H.map.Icon("../../images/Aramex-Workshop/user-location.png", { size: { w: 39, h: 53 } }, { anchor: new H.math.Point(10, 35) })),
            DepotLocationIcon: (new H.map.Icon("../../images/Aramex-Workshop/depot.svg", { size: { w: 63, h: 75 } }))

            //StartIcon: (new H.map.Icon("../images/location_start.png", { size: { w: 63, h: 63 } })),
            //VehicleIcon: (new H.map.Icon("../images/bmw-3-seriesx.png", { size: { w: 73, h: 73 } }))
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
    }
    //,
    //Geocoding: {
    //    //InitialAddress: 'Paris, FRA'
    //    //InitialAddress: 'Dubai, ARE'
    //    InitialAddress: 'Dubai Mall'
    //},
    //PDELayers: {
    //    TrafficSigns: 'TRAFFIC_SIGN_FC'
    //},
    //TrafficCongestionTimePatterns: {
    //    PerDay: 'PerDay',
    //    PerHour: 'PerHour'
    //},
    //TrafficCongestionDirection: {
    //    North: 'N',
    //    South: 'S'
    //},
    //WCheetosAPI: {
    //    EndPoint_URL: 'https://localhost:44361/api/AdminWebService/GenericJSONRequest',
    //    UserID: 'WaliedCheetos',
    //    Token: 'WaliedCheetos-Token'
    //},
    //QRCodeInitials: {
    //    HERE_WeGo_BaseURL: 'https://wego.here.com/?map={lat},{lng},18,normal'
    //}
}

const AramexInitials = {
    StemTrip: {
        Oubound: {
            description: 'outbound operations',
            data: '',
            usertag: 'WaliedCheetos',
            operations: [
                {
                    operation: {
                        description: 'outbound operation 1',
                        data: '',
                        usertag: 'WaliedCheetos',
                        depot: {
                            description: 'depot 1 location',
                            data: '',
                            usertag: 'WaliedCheetos',
                            address: '',
                            routingLocation: {
                                //lat: 25.19893,
                                //lng: 55.27991                                
                                lat: 25.2394074, 
                                lng: 55.3713804
                            },
                            displayLocation: {
                                //lat: 25.19893,
                                //lng: 55.27991                                
                                lat: 25.2394074,
                                lng: 55.3713804
                            }
                        },
                        territories: [
                            {
                                territory: {
                                    description: 'Aramex depot 1: territory # 1 center',
                                    data: '',
                                    usertag: 'WaliedCheetos',
                                    address: '',
                                    routingLocation: {
                                        lat: 25.2121818034,
                                        lng: 55.3595998682
                                    },
                                    displayLocation: {
                                        lat: 25.2121818034,
                                        lng: 55.3595998682
                                    },
                                    stemTime:0.00
                                }
                            },
                            {
                                territory: {
                                    description: 'Aramex depot 1: territory # 2 center',
                                    data: '',
                                    usertag: 'WaliedCheetos',
                                    address: '',
                                    routingLocation: {
                                        lat: 24.9378274172,
                                        lng: 55.4876364907
                                    },
                                    displayLocation: {
                                        lat: 24.9378274172,
                                        lng: 55.4876364907
                                    },
                                    stemTime: 0.00
                                }
                            },
                            {
                                territory: {
                                    description: 'Aramex depot 1: territory # 3 center',
                                    data: '',
                                    usertag: 'WaliedCheetos',
                                    address: '',
                                    routingLocation: {
                                        lat: 24.9808776005,
                                        lng: 55.1890807635
                                    },
                                    displayLocation: {
                                        lat: 24.9808776005,
                                        lng: 55.1890807635
                                    },
                                    stemTime: 0.00
                                }
                            },
                            {
                                territory: {
                                    description: 'Aramex depot 1: territory # 4 center',
                                    data: '',
                                    usertag: 'WaliedCheetos',
                                    address: '',
                                    routingLocation: {
                                        lat: 25.0515120088,
                                        lng: 55.1558832367
                                    },
                                    displayLocation: {
                                        lat: 25.0515120088,
                                        lng: 55.1558832367
                                    },
                                    stemTime: 0.00
                                }
                            },
                            {
                                territory: {
                                    description: 'Aramex depot 1: territory # 5 center',
                                    data: '',
                                    usertag: 'WaliedCheetos',
                                    address: '',
                                    routingLocation: {
                                        lat: 25.2309359687,
                                        lng: 55.3219928606
                                    },
                                    displayLocation: {
                                        lat: 25.2309359687,
                                        lng: 55.3219928606
                                    },
                                    stemTime: 0.00
                                }
                            },
                            {
                                territory: {
                                    description: 'Aramex depot 1: territory # 6 center',
                                    data: '',
                                    usertag: 'WaliedCheetos',
                                    address: '',
                                    routingLocation: {
                                        lat: 25.0811604517,
                                        lng: 55.1387578422
                                    },
                                    displayLocation: {
                                        lat: 25.0811604517,
                                        lng: 55.1387578422
                                    },
                                    stemTime: 0.00
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
}


const AramexInitials_JSON = {
    "StemTrip": {
        "Oubound": {
            "description": "depot locations",
            "start": [
                {
                    "point1": {
                        "lat": "25.19893",
                        "lng": "55.27991",
                        "description": "depot 1 locations",
                        "usertag": "WaliedCheetos"
                    }
                }
            ],
            "destination": [
                {
                    "point1": {
                        "description": "Aramex polygon 1 center",
                        "usertag": "WaliedCheetos",
                        "lat": "25.2121818034",
                        "lng": "55.3595998682"
                    },
                    "point2": {
                        "description": "Aramex polygon 2 center",
                        "usertag": "WaliedCheetos",
                        "lat": "24.9378274172",
                        "lng": "55.4876364907"
                    },
                    "point3": {
                        "description": "Aramex polygon 3 center",
                        "usertag": "WaliedCheetos",
                        "lat": "24.9808776005",
                        "lng": "55.1890807635"
                    },
                    "point4": {
                        "description": "Aramex polygon 4 center",
                        "usertag": "WaliedCheetos",
                        "lat": "25.0515120088",
                        "lng": "55.1558832367"
                    },
                    "point5": {
                        "description": "Aramex polygon 5 center",
                        "usertag": "WaliedCheetos",
                        "lat": "25.2309359687",
                        "lng": "55.3219928606"
                    },
                    "point6": {
                        "description": "Aramex polygon 6 center",
                        "usertag": "WaliedCheetos",
                        "lat": "25.0811604517",
                        "lng": "55.1387578422"
                    }
                }
            ]
        }
    }
}


//export { HEREInitials, center, hereCredentials };
export { HEREInitials, AramexInitials};