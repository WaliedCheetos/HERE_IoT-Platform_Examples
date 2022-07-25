const config = {
    hereCredentials : {
        apikey: 'pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E'
    },
    map :{
        center:{
            lat: 25.19893,
            lng: 55.27991
        },
        zoom: 13,
        tilt: 65,
        heading: 0
    },
    log :{
        logLevels : {
            ERROR: 'ERROR',
            DEBUG: 'DEBUG',
            INFO: 'INFO',
            TRACE: 'TRACE',
            WARN: 'WARN'
        },
        logLevel:'TRACE'
    },
    customerSample:{
        sampleSize : 15,
        country : 'United Arab Emirates',
        city: 'Dubai'
    },
    statusIndicators:{
        PROCESSING: 'PROCESSING',
        COMPLETED: 'COMPLETED'
    }
}

export {config}