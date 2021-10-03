import { HEREInitials } from './config.js';
import { logLevels, writeLog } from './logger.js';


//Height calculations
const height = $('#content-group-1').clientHeight || $('#content-group-1').offsetHeight;
$('.content').style.height = height + 'px';

/* ...
 * Manage initial state and add event listeners
 * ...
 */

//Manage initial state
$('#slider-val').innerText = formatRangeLabel($('#range').value, 'time');
$('#date-value').value = toDateInputFormat(new Date());



////Add event listeners
//$$('.isoline-controls').forEach(c => c.onchange = () => calculateStemInOutBounds());
//$$('.view-controls').forEach(c => c.onchange = () => calculateView());


/* ...
 * Enable the UI controls
 * ...
 */
//Tab control for sidebar
const tabs = $$('.tab');
tabs.forEach(t => t.onclick = tabify)
function tabify(evt) {
    tabs.forEach(t => t.classList.remove('tab-active'));
    if (evt.target.id === 'tab-1') {
        $('.tab-bar').style.transform = 'translateX(0)';
        evt.target.classList.add('tab-active');
        $('#content-group-1').style.transform = 'translateX(0)';
        $('#content-group-2').style.transform = 'translateX(100%)';
    } else {
        $('.tab-bar').style.transform = 'translateX(100%)';
        evt.target.classList.add('tab-active');
        $('#content-group-1').style.transform = 'translateX(-100%)';
        $('#content-group-2').style.transform = 'translateX(0)';
    }
}

/* ...
 * Switch between map themes
 * ...
 */

//Theme control
const themeTiles = $$('.theme-tile');
themeTiles.forEach(t => t.onclick = tabifyThemes);
function tabifyThemes(evt) {
    themeTiles.forEach(t => t.classList.remove('theme-tile-active'));
    evt.target.classList.add('theme-tile-active');
    if (evt.target.id === 'day') {
        const style = new H.map.Style('https://js.api.here.com/v3/3.1/styles/omv/normal.day.yaml')
        provider.setStyle(style);
    } else {
        const style = new H.map.Style('https://heremaps.github.io/maps-api-for-javascript-examples/change-style-at-load/data/dark.yaml',
            'https://js.api.here.com/v3/3.1/styles/omv/');
        provider.setStyle(style);
    }
}

/* ...
 * Initialize the platform and map
 * ...
 */

// Initialize HERE Map
const platform = new H.service.Platform({ apikey: HEREInitials.Credentials.APIKey });
const defaultLayers = platform.createDefaultLayers();

const map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
    //center: HEREInitials.Center,
    //zoom: HEREInitials.Zoom,
    pixelRatio: window.devicePixelRatio || 1
});

const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

var mapSettings = ui.getControl('mapsettings');
var zoom = ui.getControl('zoom');
var scalebar = ui.getControl('scalebar');

mapSettings.setAlignment('bottom-right');
zoom.setAlignment('bottom-right');
scalebar.setAlignment('bottom-right');

// this will used to set new styles whenever requested 
// ==> refer to tabifyThemes method
const provider = map.getBaseLayer().getProvider();