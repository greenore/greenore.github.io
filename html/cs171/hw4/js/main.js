var allData = [];

// Variable for the visualization instance
var MBTAlines, stationMap;

// Start application by loading the data
loadData();

function loadData() {

    // Hubway XML station feed
    var url = 'http://www.thehubway.com/data/stations/bikeStations.xml';
    var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('SELECT * FROM xml WHERE url="' + url + '"') + '&format=json&callback=?';

    $.getJSON(yql, function (jsonData) {
        //console.log(jsonData);
        allData = jsonData.query.results.stations.station;
        //console.log(allData);
        $('#station-count').text(allData.length);

        $.getJSON('data/MBTA-Lines.json', function (data) {
            MBTAlines = data.features;
            //console.log(MBTAlines);
            createVis();
        });

    });
}


function createVis() {
    // TO-DO: INSTANTIATE VISUALIZATION
    stationMap = new StationMap('station-map', allData, [42.360082, -71.058880], MBTAlines);
    // console.log(stationMap);
}