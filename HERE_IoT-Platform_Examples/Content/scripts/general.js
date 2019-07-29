var LogLevels = {
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    TRACE: 'TRACE',
    WARN: 'WARN'
};
function _fx_Log(LogMessage, LogLevel) {
    try {
        switch (LogLevel) {
            case LogLevels.DEBUG:
                console.debug(LogMessage);
            case LogLevels.INFO:
                console.info(LogMessage);
            case LogLevels.ERROR:
                console.error(LogMessage);
            case LogLevels.TRACE:
                console.trace(LogMessage);
            case LogLevels.WARN:
                console.warn(LogMessage);
            default:
                console.log(LogMessage);
        }
    }
    catch (e) {
        console.error(e);
    }
}
//# sourceMappingURL=general.js.map