import { featureGroup_Drawings } from './app-admin.js'

var dialog, form,

    // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
    emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    name = $("#name"),
    email = $("#email"),
    password = $("#password"),


    ZoneName = $("#ZoneName"),
    ZoneType = $("#ZoneType"),
    ZoneViewer = $("#ZoneViewer"),
    allFields = $([]).add(name).add(email).add(password).add(ZoneName).add(ZoneType).add(ZoneViewer),
    tips = $(".validateTips");

function updateTips(t) {
    tips
        .text(t)
        .addClass("ui-state-highlight");
    setTimeout(function () {
        tips.removeClass("ui-state-highlight", 1500);
    }, 500);
}

function checkLength(o, n, min, max) {
    if (o.val().length > max || o.val().length < min) {
        o.addClass("ui-state-error");
        updateTips("Length of " + n + " must be between " +
            min + " and " + max + ".");
        return false;
    } else {
        return true;
    }
}

function checkRegexp(o, regexp, n) {
    if (!(regexp.test(o.val()))) {
        o.addClass("ui-state-error");
        updateTips(n);
        return false;
    } else {
        return true;
    }
}

function addUser() {
    //var currentGeoJSON = current.layer.toGeoJSON();
    var valid = true;
    allFields.removeClass("ui-state-error");

    valid = valid && checkLength(name, "username", 3, 16);
    valid = valid && checkLength(email, "email", 6, 80);
    valid = valid && checkLength(password, "password", 5, 16);

    valid = valid && checkLength(ZoneName, "ZoneName", 3, 15);
    valid = valid && checkLength(ZoneType, "ZoneType", 3, 15);
    //valid = valid && checkLength(ZoneViewer, "ZoneViewer", 3, 15);

    valid = valid && checkRegexp(name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
    valid = valid && checkRegexp(email, emailRegex, "eg. ui@jquery.com");
    valid = valid && checkRegexp(password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9");

    valid = valid && checkRegexp(ZoneName, /^[a-z]([0-9a-z_\s])+$/i, "Zone name may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
    valid = valid && checkRegexp(ZoneType, /^[a-z]([0-9a-z_\s])+$/i, "Zone type may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
    //valid = valid && checkRegexp(ZoneViewer, /^[a-z]([0-9a-z_\s])+$/i, "Zone viewer may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");

    if (valid) {
        //$("#users tbody").append("<tr>" +
        //    "<td>" + name.val() + "</td>" +
        //    "<td>" + email.val() + "</td>" +
        //    "<td>" + password.val() + "</td>" +
        //    "</tr>");



        var properties = {};
        properties['ZoneName'] = ZoneName.val();
        properties['ZoneType'] = ZoneType.val();
        properties['ZoneViewer'] = $('#ZoneViewers option:selected').text();

        var currentGeoJSON = featureGroup_Drawings.getLayers()[featureGroup_Drawings.getLayers().length - 1].toGeoJSON();

        currentGeoJSON.properties = properties;

        alert(JSON.stringify(currentGeoJSON));
        //var x = featureGroup_Drawings;

        dialog.dialog("close");
    }
    return valid;
}

dialog = $("#dialog-form").dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
        "Update shape attributes": addUser,
        Cancel: function () {
            dialog.dialog("close");
        }
    },
    close: function () {
        form[0].reset();
        allFields.removeClass("ui-state-error");
    }
});

form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    addUser();
});

$("#create-user").button().on("click", function () {
    dialog.dialog("open");
});

export { dialog }