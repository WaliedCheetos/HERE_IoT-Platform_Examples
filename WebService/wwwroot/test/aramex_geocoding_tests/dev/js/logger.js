import { config } from "./config";


function log(LogMessage, LogLevel) {
    try {
        if ((LogLevel.toUpperCase() == config.log.logLevels.DEBUG) && (config.log.logLevel.toUpperCase() != 'ERROR')) 
            console.debug(`WaliedCheetos - DEBUG : ${LogMessage}`);
        else if ((LogLevel.toUpperCase() == config.log.logLevels.INFO) && (config.log.logLevel.toUpperCase() != 'ERROR'))
            console.trace(`WaliedCheetos - INFO : ${LogMessage}`);
        else if ((LogLevel.toUpperCase() == config.log.logLevels.TRACE) && (config.log.logLevel.toUpperCase() != 'ERROR'))
            console.trace(`WaliedCheetos - TRACE : ${LogMessage}`);
        else if ((LogLevel.toUpperCase() == config.log.logLevels.WARN) && (config.log.logLevel.toUpperCase() != 'ERROR'))
            console.warn(`WaliedCheetos - WARN : ${LogMessage}`);
        else if (LogLevel.toUpperCase() == config.log.logLevels.ERROR)
            console.error(`WaliedCheetos - ERROR : ${LogMessage}`);
        // else
        //     console.log(LogMessage);
    }
    catch (e) {
        console.error(e);
    }
}

export {log}