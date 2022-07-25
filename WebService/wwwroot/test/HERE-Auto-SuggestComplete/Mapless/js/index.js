let APP_ID_HERE = "Lrw0yF4Z4nFpEe7jJxcd";
let APP_CODE_HERE = "9zhfUoi6kIHQqt85SunXuw";
let apikey = "pmYeJOpIGhJHSyyizwSKKPJoAHdjJ_bj12yfckgiT4E";

// by default, Paris...
// let coordinates = "48.8,2.3";
let coordinates = "25.22238,55.280763";
// let coordinates = "31.046051,34.851612";

// let's get HTML5 geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        coordinates = position.coords.latitude + "," + position.coords.longitude;
        document.getElementById("coords").innerHTML = "Location: " + coordinates;
    });
} else {
    console.log("Geolocation is not supported by this browser.");
}


$("#place_HLS").autocomplete({
    source: placeAC_HLS,
    minLength: 2,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);
    }
});


$("#address_HLS").autocomplete({
    source: addressAC_HLS,
    minLength: 2,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);
    }
});

$("#full_HLS").autocomplete({
    source: fullAC_HLS,
    minLength: 2,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);
    }
});
$("#place_GS7").autocomplete({
    source: placeAC_GS7,
    minLength: 2,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);
    }
});


$("#address_GS7").autocomplete({
    source: addressAC_GS7,
    minLength: 2,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);
    }
});

$("#full_GS7").autocomplete({
    source: fullAC_GS7,
    minLength: 2,
    select: function (event, ui) {
        console.log("Selected: " + ui.item.value + " with LocationId " + ui.item.id);
    }
});





// autocomplete using Place autosuggest
// jquery autocomplete needs 2 fields: title and value
// id holds the LocationId which can be used at a later stage to get the coordinate of the selected choice
function placeAC_HLS(query, callback) {
    $.getJSON("https://places.cit.api.here.com/places/v1/autosuggest?at=" + coordinates + "&q=" + query.term + "&app_id=" + APP_ID_HERE + "&app_code=" + APP_CODE_HERE, function (data) {
        var places = data.results.filter(place => place.vicinity);

        places = places.map(place => {
            return {
                title: place.title,
                value: place.title + ', ' + place.vicinity.replace(/<br\/>/g, ", ") + ' (' + place.category + ')',
                id: place.id
            };
        });
        return callback(places);
    });
}

// autocomplete using Address autocomplete
// jquery autocomplete needs 2 fields: title and value
// id holds the LocationId which can be used at a later stage to get the coordinate of the selected choice
function addressAC_HLS(query, callback) {
    $.getJSON("https://autocomplete.geocoder.api.here.com/6.2/suggest.json?prox=" + coordinates + "&query=" + query.term + "&app_id=" + APP_ID_HERE + "&app_code=" + APP_CODE_HERE, function (data) {
        var addresses = data.suggestions;
        addresses = addresses.map(addr => {
            return {
                title: addr.label,
                value: addr.label,
                id: addr.locationId
            };
        });

        return callback(addresses);
    });
}

// Combination of both Address and Place autocomplete
function fullAC_HLS(query, callback) {

    let p1 = $.getJSON("https://places.cit.api.here.com/places/v1/autosuggest?at=" + coordinates + "&result_types=Place" + "&q=" + query.term + "&app_id=" + APP_ID_HERE + "&app_code=" + APP_CODE_HERE);
    let p2 = $.getJSON("https://autocomplete.geocoder.api.here.com/6.2/suggest.json?prox=" + coordinates + "&query=" + query.term + "&app_id=" + APP_ID_HERE + "&app_code=" + APP_CODE_HERE);

    $.when(p1, p2).done(function (data1, data2) {

        //data1 is from Places autosuggest
        var places = data1[0].results.filter(place => place.vicinity);
        places = places.map(place => {
            return {
                title: place.title,
                value: place.title + ',' + place.vicinity.replace(/<br\/>/g, ", ") + '(' + place.category + ')',
                distance: place.distance,
                id: place.id
            };
        });

        // data2 is from address autocomplete
        var addresses = data2[0].suggestions;
        addresses = addresses.map(addr => {
            return {
                title: addr.label,
                value: addr.label + ' (address)',
                distance: addr.distance,
                id: addr.locationId
            };
        });

        // lets merge the two arrays into the first
        $.merge(places, addresses);

        // let's sort by distance
        places.sort(function (p1, p2) { return p1.distance - p2.distance });

        // limit display to 10 results
        return callback(places.slice(0, 10));
    })

}


// autocomplete using Place autosuggest
// jquery autocomplete needs 2 fields: title and value
// id holds the LocationId which can be used at a later stage to get the coordinate of the selected choice
function placeAC_GS7(query, callback) {
    $.getJSON(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=${coordinates}&q=${query.term}&apikey=${apikey}`, function (data) {
      
    ////vicinity is NOT supported in GS7
    //var places = data.items.filter(place => place.vicinity);

        var places = data.items.map(place => {
            return {
                title: place.title,
                value: place.hasOwnProperty('categories') ? `${place.title} ( ${place.categories[0].name} )` : `${place.title}`,
                // value: place.title + ', ' + place.vicinity.replace(/<br\/>/g, ", ") + ' (' + place.category + ')',
                id: place.id
            };
        });
        return callback(places);
    });
}

// autocomplete using Address autocomplete
// jquery autocomplete needs 2 fields: title and value
// id holds the LocationId which can be used at a later stage to get the coordinate of the selected choice
function addressAC_GS7(query, callback) {
    $.getJSON(`https://autocomplete.search.hereapi.com/v1/autocomplete?at=${coordinates}&q=${query.term}&apikey=${apikey}`, function (data) {
        var addresses = data.items;
        addresses = addresses.map(addr => {
            return {
                title: addr.label,
                value: `${addr.address.label} ( ${addr.hasOwnProperty('resultType')} ? ${addr.resultType} : Address )`,
                id: addr.id
            };
        });

        return callback(addresses);
    });
}

// Combination of both Address and Place autocomplete
function fullAC_GS7(query, callback) {

    let p1 = $.getJSON(`https://autosuggest.search.hereapi.com/v1/autosuggest?at=${coordinates}&q=${query.term}&apikey=${apikey}`);
    let p2 = $.getJSON(`https://autocomplete.search.hereapi.com/v1/autocomplete?at=${coordinates}&q=${query.term}&apikey=${apikey}`);

    $.when(p1, p2).done(function (data1, data2) {

        //data1 is from Places autosuggest
        var places = data1[0].items.filter(place => place.categories);
        places = places.map(place => {
            return {
                title: place.title,
                value: place.hasOwnProperty('categories') ? `${place.title} ( ${place.categories[0].name} )` : `${place.title}`,
                distance: place.distance,
                id: place.id
            };
        });

        // data2 is from address autocomplete
        var addresses = data2[0].items;

        addresses = addresses.map(addr => {
            return {
                title: addr.label,
                value: addr.hasOwnProperty('resultType') ? (`${addr.address.label} ( ${addr.resultType} )`) : (`${addr.address.label} ( Address )`),
                distance: addr.distance,
                id: addr.locationId
            };
        });

        // lets merge the two arrays into the first
        $.merge(places, addresses);

        // let's sort by distance
        places.sort(function (p1, p2) { 
            if (p1.hasOwnProperty('distance') && p2.hasOwnProperty('distance')) {
                return p1.distance - p2.distance;
            }
        });

        // limit display to 10 results
        return callback(places.slice(0, 10));
    })

}