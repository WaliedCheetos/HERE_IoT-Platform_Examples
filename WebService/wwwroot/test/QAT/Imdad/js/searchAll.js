import {config} from'./config.js'
import {map, marker} from './app.js'
import {log} from './logger.js'

//#region places, and geocoding search

// Combination of both Address and Place autocomplete
function fullAC(query, callback) {

    try {
        

    document.querySelector('#searchAll_result').innerHTML = '...';

    let p1 = $.getJSON(`https://places.ls.hereapi.com/places/v1/autosuggest?at=${map.getCenter().lat},${map.getCenter().lng}&q=${query.term}&apikey=${config.hereCredentials.apikey}`);
    let p2 = $.getJSON(`https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?prox=${map.getCenter().lat},${map.getCenter().lng}&query=${query.term}&apikey=${config.hereCredentials.apikey}`);

    $.when(p1, p2).done(function (data1, data2) {

        //data1 is from Places autosuggest
        var places = data1[0].results.filter(place => place.vicinity);
        places = places.map(place => {
            return {
                title: place.title,
                value: place.title + ',' + place.vicinity.replace(/<br\/>/g, ", ") + '(' + place.category + ')',
                distance: place.distance,
                id: place.id,
                subtype: 'AutoSuggest',
                position: place.position,
                userTag: 'HERE'
            };
        });

        // data2 is from address autocomplete
        var addresses = data2[0].suggestions;
        addresses = addresses.map(addr => {
            return {
                title: addr.label,
                value: addr.label + ' (address)',
                distance: addr.distance,
                id: addr.locationId,
                subtype: 'AutoComplete',
                position: undefined,
                userTag: 'HERE'
            };
        });

        //// lets merge the two arrays into the first
        $.merge(places, addresses);

        //// let's sort by distance
        places.sort(function (p1, p2) { return p1.distance - p2.distance });

        // limit display to 10 results
        return callback(places.slice(0, 10));
    });

} catch (error) {
    log(error, config.log.logLevels.ERROR);
}

}

//#endregion

//#region What3Words

function what3words_AutoSuggest(query, callback) {
    try{

    document.querySelector('#searchAll_result').innerHTML = '...';

    let url = $.getJSON(`https://api.what3words.com/v3/autosuggest?focus=${map.getCenter().lat},${map.getCenter().lng}&input=${query.term}&key=${config.w3w.credentials.apikey}`);

    $.when(url).done(function (result) {

        //result is from what3words words autosuggest
        var words = result.suggestions.filter(place => place.nearestPlace);
        words = words.map(place => {
            return {
                title: place.words,
                value: '/// ' + place.words + ',' + place.nearestPlace + '(Distance to Focus: ' + place.distanceToFocusKm + ' KM)',
                distance: place.distanceToFocusKm,
                userTag: '///w3w'
                //id: place.id,
                //id: place.position.toString(),
                //position: place.position
            };
        });

        // limit display to 10 results
        return callback(words.slice(0, 10));
    });

} catch (error) {
    log(error, config.log.logLevels.ERROR);
}
}

function what3words_Reverse(lat, lng) {
    try {
        let url = $.getJSON(`https://api.what3words.com/v3/convert-to-3wa?coordinates=${lat},${lng}&format=json&key=${config.w3w.credentials.apikey}`);

        $.when(url).done(function (result) {
            document.querySelector('#searchAll_result').innerHTML = result.words;
        });

    } catch (error) {
        log(error, config.log.logLevels.ERROR);
    }
}
//#endregion

//#region searcAll

function registerSearchAll(){
    try{
$('#searchAll_prewords').autocomplete({
    source: searchAll,
    minLength: 2,
    // open: function () {
    //     $(this).autocomplete('widget').zIndex(5001);
    // },
    select: function (event, ui) {
        if (ui.item.userTag === '///w3w') {
            
            let url_What3Words_Convert2Coordinates = $.getJSON(`https://api.what3words.com/v3/convert-to-coordinates?words=${ui.item.title}&format=json&key=${config.w3w.credentials.apikey}`);

            $.when(url_What3Words_Convert2Coordinates).done(function (result) {

                let url_HEREReverseGeocoding = $.getJSON(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${result.coordinates.lat},${result.coordinates.lng}&apikey=${config.hereCredentials.apikey}`);

                $.when(url_HEREReverseGeocoding).done(function (address) {
                    document.querySelector('#searchAll_result').innerHTML = address.items[0].address.label;

                    map.getViewModel().setLookAtData({
                        position: address.items[0].position,
                        zoom: config.map.zoom
                    }, true);

                    if (!marker) {
                        marker = new H.map.Marker(address.items[0].position);
                        map.addObject(marker);
                    } else {
                        marker.setGeometry(address.items[0].position);
                    }
                });
            });
        }
        else if (ui.item.userTag === 'HERE') {

            if (ui.item.subtype == 'AutoSuggest') {
                what3words_Reverse(ui.item.position[0], ui.item.position[1]);

                map.getViewModel().setLookAtData({
                    position: { lat: ui.item.position[0], lng: ui.item.position[1] },
                    zoom: config.map.zoom
                }, true);
    
                if (!marker) {
                    marker = new H.map.Marker({ lat: ui.item.position[0], lng: ui.item.position[1] });
                    map.addObject(marker);
                } else {
                    marker.setGeometry({ lat: ui.item.position[0], lng: ui.item.position[1] });
                }
            } else if (ui.item.subtype == 'AutoComplete') {
                let geocodeByLocationID = $.getJSON(`http://geocoder.api.here.com/6.2/geocode.json?gen=8&jsonattributes=1&locationid=${ui.item.id}&app_id=${config.hereCredentials.appid}&app_code=${config.hereCredentials.appcode}`);

                $.when(geocodeByLocationID).done(function (address) {

let x = address.response.view[0].result[0].location.displayPosition.latitude;
let y = address.response.view[0].result[0].location.displayPosition.longitude;


                    what3words_Reverse(x,y);

                    map.getViewModel().setLookAtData({
                        position: { lat: x, lng: y },
                        zoom: config.map.zoom
                    }, true);

                    if (!marker) {
                        marker = new H.map.Marker({ lat: x, lng: y });
                        map.addObject(marker);
                    } else {
                        marker.setGeometry({ lat: x, lng: y });
                    }
                });
            }
        }
    }
});
}

catch(error){
    log(error, config.log.logLevels.ERROR);
}
}


function searchAll(query, callback) {

    //check the query text pattern
    //if matches ///w3w regex then fire ///w3w RESTful API services requests
    //else then fire HERE RESTful API services requests

    if (config.w3w.RegEx.w3wFormat.test(query.term)) {
        what3words_AutoSuggest(query, callback);
    }
    else {
        fullAC(query, callback);
    }
}

//#endregion


export {registerSearchAll}