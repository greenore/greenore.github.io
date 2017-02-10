
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data , _mapPosition, _lines) {
  this.parentElement = _parentElement;
  this.lines = _lines;
  this.data = _data;
  this.mapPosition = _mapPosition;
  L.Icon.Default.imagePath = 'img';
  this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {

  function lineStyle(feature) {
    //console.log(feature.properties.LINE);
    return { color : feature.properties.LINE} ;
  }

  var vis = this;

  var map = L.map(vis.parentElement).setView(vis.mapPosition, 13);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  stations = L.layerGroup().addTo(map);
  lines = L.layerGroup().addTo(map);


  //add station markers to  layer
  vis.data.map(function(d){
    d.marker = L.marker([+d.lat, +d.long]).addTo(map)
    stations.addLayer(d.marker);
  });
  vis.lines.map(function(d){
    d.line = L.geoJson(d,{
      style : lineStyle,
      weight : 10,
      fillOpacity : 1
    }).addTo(map);
    lines.addLayer(d.line);
  });

  vis.wrangleData();
};


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
  var vis = this;

  // Update the visualization
  vis.updateVis();
}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {
};
