import { map, markersGroup, routesMarkersGroup, calculateRoute } from './app.js';
import { logLevels, writeLog } from './logger.js';
import { AramexInitials, HEREInitials } from './config.js';
import { loadingFadeIn, loadingFadeOut, myTime } from './helpers.js';
import { requestReverseGeocodeInfo } from './HERE.js';
import { stemOperation } from './stemOperationsInfo.js';
import { getCongestionFactors, getCongestionFactorsByLinkIds, toggleDataSeries } from './TrafficAnalytics.js';
/**
 * Creates a new marker and adds it to a group
 * @param {H.map.Group} group       The group holding the new marker
 * @param {H.geo.Point} coordinate  The location of the marker
 * @param {String} html             Data associated with the marker
 */
function addMarkerToGroup(group, coordinate, icon, html) {
    var marker = new H.map.Marker(coordinate, {
        icon: icon
    });
    // add custom data to the marker
    marker.setData(html);
    group.addObject(marker);
}
var stemOperations = [];

const displayStemInOutBounds = function () {
    try {
        writeLog(logLevels.info, 'displayStemInOutBounds has started.', '');
        //loadingFadeIn();   
        markersGroup.removeAll();

        //load outbound depots locations
        AramexInitials.StemTrip.Oubound.operations.forEach(function (currentOperation, indexOperation, arrOperation) {
            addMarkerToGroup(markersGroup, currentOperation.operation.depot.displayLocation, HEREInitials.Markers.Icons.DepotLocationIcon, currentOperation.operation.depot.description);

            //load outbound destinations locations
            currentOperation.operation.territories.forEach(function (currentTerritory, indexTerritory, arrTerritory) {
                addMarkerToGroup(markersGroup, currentTerritory.territory.displayLocation, HEREInitials.Markers.Icons.DestinationIcon, currentTerritory.territory.description);
            });
        });

        map.addObject(markersGroup);

        // get geo bounding box for the group and set it to the map
        map.getViewModel().setLookAtData({
            bounds: markersGroup.getBoundingBox(),
            zoom: HEREInitials.Zoom - 1.2
        }, true);

    } catch (e) {
        writeLog(logLevels.exception, e.stack, '');
    }
    finally {
        //loadingFadeOut();
        writeLog(logLevels.info, 'displayStemInOutBounds has ended.', '');
    }
}

const calculateStemInOutBounds = function () {
    try {
        writeLog(logLevels.info, 'calculateStemInOutBounds has started.', '');
        //loadingFadeIn();   
        routesMarkersGroup.removeAll();



        while (stemOperations.length > 0) {
            stemOperations.pop();
        } //

        ////loop outbound each depot, and relevant territories locations
        //AramexInitials.StemTrip.Oubound.operations.forEach(function (currentOperation, indexOperation, arrOperation) {

        //    //Configure the options object
        //    const options = {
        //        at: (currentOperation.operation.depot.routingLocation.lat + ',' + currentOperation.operation.depot.routingLocation.lng)
        //    }

        //    requestReverseGeocodeInfo(options).then(response => {
        //        currentOperation.operation.depot.address = response[0].address.label;
        //        writeLog(logLevels.info, 'depot address: ' + currentOperation.operation.depot.address, '');
        //    });

        //    currentOperation.operation.territories.forEach(function (currentTerritory, indexTerritory, arrTerritory) {

        //        //Configure the options object
        //        const options = {
        //            at: (currentTerritory.territory.routingLocation.lat + ',' + currentTerritory.territory.routingLocation.lng)
        //        }

        //        requestReverseGeocodeInfo(options).then(response => {
        //            currentTerritory.territory.address = response[0].address.label;
        //            writeLog(logLevels.info, 'current delivery territory center address: ' + currentTerritory.territory.address, '');
        //        })

        //        //calculate route for current operation >> current depot >> current territory center
        //        calculateRoute(currentOperation.operation.depot.routingLocation, currentTerritory.territory.routingLocation).then(response => {
        //            var stemOperation_current = new stemOperation(currentOperation.operation.depot, currentTerritory.territory, 'WaliedCheetos says Hollla');
        //            alert(stemOperation_current.depot.address);
        //        });
        //    });
        //});



        //loop outbound each depot, and relevant territories locations
        AramexInitials.StemTrip.Oubound.operations.forEach(function (currentOperation, indexOperation, arrOperation) {

            //Configure the options object
            const options = {
                at: (currentOperation.operation.depot.routingLocation.lat + ',' + currentOperation.operation.depot.routingLocation.lng),
                lang: $('#english_language')[0].checked ? 'en-US' : 'ar-AE',

            }

            requestReverseGeocodeInfo(options)
                .then(response => {
                    currentOperation.operation.depot.address = response[0].address.label;
                    writeLog(logLevels.info, 'depot address: ' + currentOperation.operation.depot.address, '');
                })
                .then(response => {
                    currentOperation.operation.territories.forEach(function (currentTerritory, indexTerritory, arrTerritory) {

                        //Configure the options object
                        const options = {
                            at: (currentTerritory.territory.routingLocation.lat + ',' + currentTerritory.territory.routingLocation.lng),
                            lang: $('#english_language')[0].checked ? 'en-US' : 'ar-AE'
                        }

                        requestReverseGeocodeInfo(options)
                            .then(response => {
                                currentTerritory.territory.address = response[0].address.label;
                                writeLog(logLevels.info, 'current delivery territory center address: ' + currentTerritory.territory.address, '');
                            })
                            .then(response => {
                                calculateRoute(currentOperation.operation.depot.routingLocation, currentTerritory.territory.routingLocation)
                                    .then(response => {
                                        //var stemOperation_current = new stemOperation(currentOperation.operation.depot, currentTerritory.territory, 'WaliedCheetos says Hollla');
                                        var stemOperation_current = new stemOperation(currentOperation.operation.depot, currentTerritory.territory, response);

                                        var tbl_stemOperationsInfo = document.getElementById('tbl_stemOperationsInfo');
                                        var row = document.createElement("tr");

                                        var cell01 = document.createElement("td");
                                        var cell01_Text = document.createTextNode(currentOperation.operation.depot.address);
                                        cell01.appendChild(cell01_Text);
                                        row.appendChild(cell01);

                                        var cell02 = document.createElement("td");
                                        var cell02_Text = document.createTextNode(currentTerritory.territory.address);
                                        cell02.appendChild(cell02_Text);
                                        row.appendChild(cell02);

                                        var cell03 = document.createElement("td");
                                        cell03.innerHTML = response.summary.text;
                                        row.appendChild(cell03);

                                        var cell04 = document.createElement("td");
                                        cell04.innerHTML = response.summary.co2Emission;
                                        row.appendChild(cell04);

                                        //var cell04 = document.createElement("td");
                                        //var cell04_Text = currentOperation.operation.depot.address;
                                        //cell04.appendChild(cell04_Text);
                                        //row.appendChild(cell04);

                                        //var cell05 = document.createElement("td");
                                        //var cell05_Text = currentOperation.operation.depot.address;
                                        //cell04.appendChild(cell05_Text);
                                        //row.appendChild(cell05);
                                        tbl_stemOperationsInfo.appendChild(row); // add the row to the end of the table body

                                        stemOperations.push(stemOperation_current);
                                        //alert(stemOperation_current.territory.address);
                                    });
                            })
                    });
                })
                .then(response => {
                    ////get geo bounding box for the group and set it to the map
                    //map.getViewModel().setLookAtData({
                    //    bounds: routesMarkersGroup.getBoundingBox()
                    //}, true);
                })
        })

        //map.addObject(routesMarkersGroup);
        drawStemOperationsInfoTable();
        //getCongestionFactors();
        // get geo bounding box for the group and set it to the map
        //map.getViewModel().setLookAtData({
        //    bounds: routesMarkersGroup.getBoundingBox()
        //}, true);

    } catch (e) {
        writeLog(logLevels.exception, e.stack, '');
    }
    finally {
        //loadingFadeOut();
        writeLog(logLevels.info, 'calculateStemInOutBounds has ended.', '');
    }
}

const drawStemOperationsInfoTable = function () {
    try {
        writeLog(logLevels.info, 'drawStemOperationsInfoTable has started.', '');
        //var totalRows = 5;
        //var cellsInRow = 5;
        //var min = 1;
        //var max = 10;

        var tbl_stemOperationsInfo = document.getElementById('tbl_stemOperationsInfo');
        tbl_stemOperationsInfo.innerHTML = '';

        // Create table header row using the extracted headers above.
        var tr = tbl_stemOperationsInfo.insertRow(-1);                   // table row.

        var th01 = document.createElement("th");      // table header.
        th01.innerHTML = 'Depot address';
        tr.appendChild(th01);

        var th02 = document.createElement("th");      // table header.
        th02.innerHTML = 'Territory center address';
        tr.appendChild(th02);

        var th03 = document.createElement("th");      // table header.
        th03.innerHTML = 'Stem distance/time info';
        tr.appendChild(th03);

        var th04 = document.createElement("th");      // table header.
        th04.innerHTML = 'co2 Emission';
        tr.appendChild(th04);

        //// creating rows
        //for (var r = 0; r < totalRows; r++) {
        //    var row = document.createElement("tr");

        //    // create cells in row
        //    for (var c = 0; c < cellsInRow; c++) {
        //        var cell = document.createElement("td");
        //        //getRandom = Math.floor(Math.random() * (max - min + 1)) + min;
        //        var cellText = document.createTextNode(Math.floor(Math.random() * (max - min + 1)) + min);
        //        cell.appendChild(cellText);
        //        row.appendChild(cell);
        //    }

        //    tbl_stemOperationsInfo.appendChild(row); // add the row to the end of the table body
        //}

    } catch (e) {
        writeLog(logLevels.exception, e.stack, '');
    }
    finally {
        //loadingFadeOut();
        writeLog(logLevels.info, 'drawStemOperationsInfoTable has ended.', '');
    }
}

const addStemOperationsInfo = function () {
    try {
        writeLog(logLevels.info, 'addStemOperationsInfo has started.', '');





        // creating rows
        for (var r = 0; r < totalRows; r++) {
            

            // create cells in row
            for (var c = 0; c < cellsInRow; c++) {
                
                //getRandom = Math.floor(Math.random() * (max - min + 1)) + min;
                var cellText = document.createTextNode(Math.floor(Math.random() * (max - min + 1)) + min);
                cell.appendChild(cellText);
                row.appendChild(cell);
            }

            tbl_stemOperationsInfo.appendChild(row); // add the row to the end of the table body
        }

    } catch (e) {
        writeLog(logLevels.exception, e.stack, '');
    }
    finally {
        //loadingFadeOut();
        writeLog(logLevels.info, 'addStemOperationsInfo has ended.', '');
    }
}

var jobs = [];
var jobID = 1;

const setupOnMapTab = function (map) {
    try {
        writeLog(logLevels.info, 'setupOnMapTab has started.', '');

        // Attach an event listener to map display
        // obtain the coordinates and display in an alert box.
        map.addEventListener('tap', function (evt) {
            var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);

            //alert('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
            //    ((coord.lat > 0) ? 'N' : 'S') +
            //    ' ' + Math.abs(coord.lng.toFixed(4)) +
            //    ((coord.lng > 0) ? 'E' : 'W'));

            /*
            var pickup = {
                pickup: {
                    times: [
                        [
                            "2019-07-04T08:00:00Z",
                            "2019-07-04T10:00:00Z"
                        ],
                        [
                            "2019-07-04T16:00:00Z",
                            "2019-07-04T18:00:00Z"
                        ]
                    ],
                    location: {
                        lat: AramexInitials.StemTrip.Oubound.operations[0].operation.depot.routingLocation.lat,
                        lng: AramexInitials.StemTrip.Oubound.operations[0].operation.depot.routingLocation.lng
                    },
                    duration: 180,
                    tag: {
                        tag: "WaliedCheetos - pickup"
                    }
                }
            };

            var delivery = {
                delivery: {
                    times: [
                        [
                            "2019-07-04T08:00:00Z",
                            "2019-07-04T10:00:00Z"
                        ],
                        [
                            "2019-07-04T16:00:00Z",
                            "2019-07-04T18:00:00Z"
                        ]
                    ],
                    location: {
                        lat: coord.lat.toFixed(4),
                        lng: coord.lng.toFixed(4)
                    },
                    duration: 180,
                    tag: {
                        tag: "WaliedCheetos - delivery"
                    }
                }
            };

            var job = {
                id: jobID++,
                places: {
                    pickup,
                    delivery
                },
                demand: [
                    10,
                    5
                ],
                skills: [
                    "WaliedCheetos - skill01",
                    "WaliedCheetos - skill02",
                    "WaliedCheetos - skill03"
                ]
            };
            */

            //var job = {
            //    id: "WaliedCheetos - Job #" + jobID++,
            //    places: {
            //        delivery: {
            //            location: {
            //                lat: coord.lat.toFixed(4),
            //                lng: coord.lng.toFixed(4)
            //            },
            //            duration: 180,
            //            tag: {
            //                tag: "WaliedCheetos - delivery"
            //            }
            //        }
            //    },
            //    demand: [1],
            //    skills: [
            //        "WaliedCheetos - skill01",
            //        "WaliedCheetos - skill02",
            //        "WaliedCheetos - skill03"
            //    ]
            //};

            //var job = {
            //    id: "WaliedCheetos - Job #" + jobID++,
            //    places: {
            //        delivery: {
            //            location: {
            //                lat: Number(coord.lat),
            //                lng: Number(coord.lng)
            //            },
            //            duration: 180
            //        }
            //    },
            //    demand: [1]
            //};

            var job = {
                "id": "WaliedCheetos_Job" + jobID++, 
                "places": {
                    "delivery": {
                        "location": {
                            "lat": Number(coord.lat),
                            "lng": Number(coord.lng)
                        },
                        "duration": 180
                    }
                },
                "demand": [1]
            };

            jobs.push(job);

            writeLog(logLevels.info, JSON.stringify(jobs), '');

        });

    } catch (e) {
        writeLog(logLevels.exception, e.stack, '');
    }
    finally {
        writeLog(logLevels.info, 'setupOnMapTab has ended.', '');
    }
}

export { displayStemInOutBounds, calculateStemInOutBounds, setupOnMapTab }
