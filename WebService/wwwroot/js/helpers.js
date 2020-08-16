const $ = q => document.querySelector(q);
const $$ = qq => document.querySelectorAll(qq);

function toAMPMFormat(val) {
   val = Number(val);
   if (val === 0) {
      return '12:00 AM';
   } else if (val < 12) {
      return `${val}:00 AM`;
   } else if (val === 12) {
      return `12:00 PM`;
   } else {
      return `${val - 12}:00 PM`;
   }
}

function to24HourFormat(val) {
   val = val + ':00';
   return val.length === 4 ? '0' + val : val;
}

function toDateInputFormat(val) {
   const local = new Date(val);
   local.setMinutes(val.getMinutes() - val.getTimezoneOffset());
   return local.toJSON().slice(0, 10);
}

function formatRangeLabel(range, type) {
   if (type === 'time') {
      const minutes = range / 60;
      if (minutes < 60) {
         return minutes.toFixed(0) + ' mins';
      } else {
         return (minutes / 60).toFixed(0) + ' hours, ' + (minutes % 60).toFixed(0) + ' mins';
      }
   } else { //Distance
      if (range < 2000) {
         return range + ' meters';
      } else {
         const km = range / 1000;
         return km.toFixed(1) + ' KM';
      }  
   }
}

const logLevels = {
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    TRACE: 'TRACE',
    WARN: 'WARN'
};

function log(LogMessage, LogLevel) {
    try {
        if (LogLevel.toUpperCase() == logLevels.DEBUG)
            console.debug(LogMessage);
        else if (LogLevel.toUpperCase() == logLevels.INFO)
            console.info(LogMessage);
        else if (LogLevel.toUpperCase() == logLevels.TRACE)
            console.trace(LogMessage);
        else if (LogLevel.toUpperCase() == logLevels.WARN)
            console.warn(LogMessage);
        else if (LogLevel.toUpperCase() == logLevels.er)
            console.error(LogMessage);
        else
            console.log(LogMessage);
            

        //switch (LogLevel.toUpperCase()) {
        //    case logLevels.DEBUG:
        //        console.debug(LogMessage);
        //    case logLevels.INFO:
        //        console.info(LogMessage);
        //    case logLevels.ERROR:
        //        console.error(LogMessage);
        //    case logLevels.TRACE:
        //        console.trace(LogMessage);
        //    case logLevels.WARN:
        //        console.warn(LogMessage);
        //    default:
        //        console.log(LogMessage);
        //}
    }
    catch (e) {
        console.error(e);
    }
}

export {
    $,
    $$,
    toAMPMFormat,
    to24HourFormat,
    toDateInputFormat,
    formatRangeLabel,
    logLevels,
    log
}