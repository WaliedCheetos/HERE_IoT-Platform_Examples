const $ = q => document.querySelector(q);
const $$ = qq => document.querySelectorAll(qq);

function myTime(time) {
    var hr = ~~(time / 3600);
    var min = ~~((time % 3600) / 60);
    var sec = time % 60;
    var sec_min = "";
    if (hr > 0) {
        sec_min += "" + hrs + ":" + (min < 10 ? "0" : "");
    }
    sec_min += "" + min + ":" + (sec < 10 ? "0" : "");
    sec_min += "" + sec;
    return sec_min + " min";
}

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

function loadingFadeIn() {
    $('#loadingDiv').fadeIn('slow');
}

function loadingFadeOut() {
    $('#loadingDiv').fadeOut('slow');
}

//
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
//

export {
    $,
    $$,
    toAMPMFormat,
    to24HourFormat,
    toDateInputFormat,
    formatRangeLabel,
    loadingFadeIn,
    loadingFadeOut,
    getRandomColor,
    myTime
}