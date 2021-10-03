var chart_RTAAIParkingAnalytics_Types;

function create_RTAAIParkingAnalytics_Types(){
    chart_RTAAIParkingAnalytics_Types = new CanvasJS.Chart("chart_RTAAIParkingAnalytics_Types", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        exportEnabled: true,
        animationEnabled: true,
        title: {
            // text: "Toyota AI Services Analytics (per type)"
            text: "Nissan AI Services Analytics (per type)"
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}",
            dataPoints: [
                JSON.parse(`{"y" : ${(Math.floor(Math.random() * (133 - 13 + 1)) + 13)}, "label":"Fule charging"}`),
                        JSON.parse(`{"y" : ${(Math.floor(Math.random() * (99 - 53 + 1)) + 53)}, "label":"EV charging"}`),
                        JSON.parse(`{"y" : ${(Math.floor(Math.random() * (3333 - 2222 + 1)) + 2222)}, "label":"Service due"}`)
                    ]
        }]
    });
    chart_RTAAIParkingAnalytics_Types.render();
}

function render_RTAAIParkingAnalytics_Types(){

    chart_RTAAIParkingAnalytics_Types.data[0].dataPoints[0] = JSON.parse(`{"y" : ${(Math.floor(Math.random() * (133 - 13 + 1)) + 13)}, "label":"Fule charging"}`);
    chart_RTAAIParkingAnalytics_Types.data[0].dataPoints[1] = JSON.parse(`{"y" : ${(Math.floor(Math.random() * (99 - 53 + 1)) + 53)}, "label":"EV charging"}`);
    chart_RTAAIParkingAnalytics_Types.data[0].dataPoints[2] = JSON.parse(`{"y" : ${(Math.floor(Math.random() * (3333 - 2222 + 1)) + 2222)}, "label":"Service due"}`);

     chart_RTAAIParkingAnalytics_Types.render();
}

export {chart_RTAAIParkingAnalytics_Types, create_RTAAIParkingAnalytics_Types, render_RTAAIParkingAnalytics_Types}


