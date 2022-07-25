import { config } from "./config.js";
import { map, ui, mapGroup } from "./app.js";
import { log } from "./logger.js";

function processCustomerSample(){
    var input = document.getElementById('fileInput')
    var tpJobs = [];
    var tpPlan;
    
    var tpFleetTypes = [];
    var tpFleet;

    var tpProblem;

    input.addEventListener('change', () => {
      log(`Status: ${config.statusIndicators.PROCESSING}`, config.log.logLevels.DEBUG);
      document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.PROCESSING}`;
    
        try {
          if (!input.files[0]) {
            alert('No files selected!');
            return ;
          }

          readXlsxFile(input.files[0], { sheet: 'jobs' }).then((rows) => {

            log(`Status: ${config.statusIndicators.PROCESSING} (${rows.length} rows)`, config.log.logLevels.DEBUG);
            document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.PROCESSING} (${rows.length} rows)`;

            rows = rows.slice(1);
                        // `rows` is an array of rows
            // each row being an array of cells.
    
            // removing the first row because it is a table header
            //rows = rows.slice(1, sampleSize);
            var index = 0;
             
            for (const row of rows){
index++;
var jobDeliveries = `"deliveries": [
    {
    "places": [
    {
    "times": [
    [
    "2020-07-04T07:00:00Z",
    "2020-07-04T19:00:00Z"
    ]
    ],
    "location": {
    "lat": ${row[12]},
    "lng": ${row[13]}
    },
    "duration": 300
    }
    ],
    "demand": [
    ${Math.round(row[14])}
    ]
    }
    ]`;

    var jobSkill = (row[11]).toUpperCase().includes('COMPACTOR') ? 'COMPACTOR' : 'SKIP';


    var job = `{
        "id": "${index}",
        "tasks": {
            ${jobDeliveries}
        },
        "skills": [
        "${jobSkill}"
        ],
        "priority": 1,
        "customerId": "${row[3]}"
        }`;
    // var job = `{
    //     "id": "${row[0]}",
    //     "tasks": {
    //         ${jobDeliveries}
    //     },
    //     "skills": [
    //     "${jobSkill}"
    //     ],
    //     "priority": 1,
    //     "customerId": "${row[3]}"
    //     }`;
        
        if (row[12] != null) {
            tpJobs.push(job);
        }

        
             }

              tpPlan =  `{
                "plan": {
                "jobs": [
                    ${tpJobs}
                ]
             }
            }`;

            //log(`Final sample size ${customerSampleSized.length}`, config.log.logLevels.DEBUG);
            //await processAddressesLocations(customerSampleSized);
    
            log(`${tpPlan}`, config.log.logLevels.DEBUG);
            log(`Status: ${config.statusIndicators.COMPLETED}`, config.log.logLevels.DEBUG);
            document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.COMPLETED}`;
          });


          readXlsxFile(input.files[0], { sheet: 'fleet' }).then((rows) => {

            log(`Status: ${config.statusIndicators.PROCESSING} (${rows.length} rows)`, config.log.logLevels.DEBUG);
            document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.PROCESSING} (${rows.length} rows)`;

            rows = rows.slice(1);

            for (const row of rows){


                var fleetSkill = (row[1]).toUpperCase().includes('COMPACTOR') ? 'COMPACTOR' : 'SKIP';

            var fleetType = `{
                "id": "${row[0]}",
                "profile": "${(row[1]).replaceAll(' ', '_')}",
                "costs": {
                "fixed": 22,
                "distance": 0.0001,
                "time": 0.0048
                },
                "shifts": [
                {
                "start": {
                "time": "2020-07-04T07:00:00Z",
                "location": {
                "lat": ${row[7].split(',')[0]},
                "lng": ${row[7].split(',')[1]}
                }
                },
                "end": {
                "time": "2020-07-04T19:00:00Z",
                "location": {
                "lat": ${row[7].split(',')[0]},
                "lng": ${row[7].split(',')[1]}
                }
                },
                "breaks": [
                {
                "duration": 1800,
                "times": [
                [
                "2020-07-04T13:00:00Z",
                "2020-07-04T14:00:00Z"
                ]
                ]
                }
                ]
                }
                ],
                "capacity": [
                    ${row[2]}
                ],
                "skills": [
                "${fleetSkill}"
                ],
                "limits": {
                "maxDistance": 20000,
                "shiftTime": 21600
                },
                "amount": 1
                }`;

                tpFleetTypes.push(fleetType);

            }

tpFleet = `{
    "fleet":{
"types": [
    ${tpFleetTypes}
],
"profiles": [
{
"type": "truck",
"name": "Compactor"
},
{
"type": "truck",
"name": "Mini_Compactor"
},
{
"type": "truck",
"name": "Double_Skip_Truck"
},
{
"type": "truck",
"name": "Skip_Truck"
},
{
"type": "truck",
"name": "Truck_Roll_On_Roll_Off"
}
],
"traffic": "liveOrHistorical"
}
}`
log(`${tpFleet}`, config.log.logLevels.DEBUG);
log(`Status: ${config.statusIndicators.COMPLETED}`, config.log.logLevels.DEBUG);
document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.COMPLETED}`;
          });

//           tpProblem =  `{
//             ${tpFleet},
//             ${tpPlan}
//           }`;

// log(`${tpProblem}`, config.log.logLevels.DEBUG);

        } catch (error) {
          log(error, config.log.logLevels.ERROR);
        }
      });
    }

    function processCustomerSample_Sized(sampleSize){
        var input = document.getElementById('fileInput')
        var tpJobs = [];
        var tpPlan;
        
        var tpFleetTypes = [];
        var tpFleet;
    
        var tpProblem;
    
        input.addEventListener('change', () => {
          log(`Status: ${config.statusIndicators.PROCESSING}`, config.log.logLevels.DEBUG);
          document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.PROCESSING}`;
        
            try {
              if (!input.files[0]) {
                alert('No files selected!');
                return ;
              }
    
              readXlsxFile(input.files[0], { sheet: 'jobs' }).then((rows) => {
    

    
                
                            // `rows` is an array of rows
                // each row being an array of cells.
        
                // removing the first row because it is a table header
                rows = rows.slice(1, sampleSize);
                var index = 0;

                log(`Status: ${config.statusIndicators.PROCESSING} (${rows.length} rows)`, config.log.logLevels.DEBUG);
                document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.PROCESSING} (${rows.length} rows)`;
                 
                for (const row of rows){
    index++;
    var jobDeliveries = `"deliveries": [
        {
        "places": [
        {
        "times": [
        [
        "2020-07-04T07:00:00Z",
        "2020-07-04T19:00:00Z"
        ]
        ],
        "location": {
        "lat": ${row[12]},
        "lng": ${row[13]}
        },
        "duration": 300
        }
        ],
        "demand": [
        ${Math.round(row[14])}
        ]
        }
        ]`;
    
        var jobSkill = (row[11]).toUpperCase().includes('COMPACTOR') ? 'COMPACTOR' : 'SKIP';
    
    
        var job = `{
            "id": "${index}",
            "tasks": {
                ${jobDeliveries}
            },
            "skills": [
            "${jobSkill}"
            ],
            "priority": 1,
            "customerId": "${row[3]}"
            }`;
        // var job = `{
        //     "id": "${row[0]}",
        //     "tasks": {
        //         ${jobDeliveries}
        //     },
        //     "skills": [
        //     "${jobSkill}"
        //     ],
        //     "priority": 1,
        //     "customerId": "${row[3]}"
        //     }`;
            
            if (row[12] != null) {
                tpJobs.push(job);
            }
    
            
                 }
    
                  tpPlan =  `{
                    "plan": {
                    "jobs": [
                        ${tpJobs}
                    ]
                 }
                }`;
    
                //log(`Final sample size ${customerSampleSized.length}`, config.log.logLevels.DEBUG);
                //await processAddressesLocations(customerSampleSized);
        
                log(`${tpPlan}`, config.log.logLevels.DEBUG);
                log(`Status: ${config.statusIndicators.COMPLETED}`, config.log.logLevels.DEBUG);
                document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.COMPLETED}`;
              });
    
    
              readXlsxFile(input.files[0], { sheet: 'fleet' }).then((rows) => {
    
                log(`Status: ${config.statusIndicators.PROCESSING} (${rows.length} rows)`, config.log.logLevels.DEBUG);
                document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.PROCESSING} (${rows.length} rows)`;
    
                rows = rows.slice(1);
    
                for (const row of rows){
    
    
                    var fleetSkill = (row[1]).toUpperCase().includes('COMPACTOR') ? 'COMPACTOR' : 'SKIP';
    
                var fleetType = `{
                    "id": "${row[0]}",
                    "profile": "${(row[1]).replaceAll(' ', '_')}",
                    "costs": {
                    "fixed": 22,
                    "distance": 0.0001,
                    "time": 0.0048
                    },
                    "shifts": [
                    {
                    "start": {
                    "time": "2020-07-04T07:00:00Z",
                    "location": {
                    "lat": ${row[7].split(',')[0]},
                    "lng": ${row[7].split(',')[1]}
                    }
                    },
                    "end": {
                    "time": "2020-07-04T19:00:00Z",
                    "location": {
                    "lat": ${row[7].split(',')[0]},
                    "lng": ${row[7].split(',')[1]}
                    }
                    },
                    "breaks": [
                    {
                    "duration": 1800,
                    "times": [
                    [
                    "2020-07-04T13:00:00Z",
                    "2020-07-04T14:00:00Z"
                    ]
                    ]
                    }
                    ]
                    }
                    ],
                    "capacity": [
                        ${row[2]}
                    ],
                    "skills": [
                    "${fleetSkill}"
                    ],
                    "limits": {
                    "maxDistance": 20000,
                    "shiftTime": 21600
                    },
                    "amount": 1
                    }`;
    
                    tpFleetTypes.push(fleetType);
    
                }
    
    tpFleet = `{
        "fleet":{
    "types": [
        ${tpFleetTypes}
    ],
    "profiles": [
    {
    "type": "truck",
    "name": "Compactor"
    },
    {
    "type": "truck",
    "name": "Mini_Compactor"
    },
    {
    "type": "truck",
    "name": "Double_Skip_Truck"
    },
    {
    "type": "truck",
    "name": "Skip_Truck"
    },
    {
    "type": "truck",
    "name": "Truck_Roll_On_Roll_Off"
    }
    ],
    "traffic": "liveOrHistorical"
    }
    }`
    log(`${tpFleet}`, config.log.logLevels.DEBUG);
    log(`Status: ${config.statusIndicators.COMPLETED}`, config.log.logLevels.DEBUG);
    document.getElementById('statusIndicator').innerHTML = `Status: ${config.statusIndicators.COMPLETED}`;
              });
    
    //           tpProblem =  `{
    //             ${tpFleet},
    //             ${tpPlan}
    //           }`;
    
    // log(`${tpProblem}`, config.log.logLevels.DEBUG);
    
            } catch (error) {
              log(error, config.log.logLevels.ERROR);
            }
          });
        }
    export {processCustomerSample, processCustomerSample_Sized}