var map;

$(document).ready(function() {
	map = new OpenSpace.Map('map');
	var envhack = new OpenSpace.MapPoint(358206, 173144);
	map.setCenter(envhack, 7);

    markers_layer = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers_layer);

    var data = new Array();
    data[0] = Array(358206, 173144);
    data[1] = Array(358306, 173044);

    for(n=0; n<data.length;n++) {
        marker = new OpenLayers.Marker(new OpenSpace.MapPoint(data[n][0],data[n][1]));
        marker.id = n;
        markers_layer.addMarker(marker);
        marker.events.register('click', marker, function (e) {
            $('#query')[0].innerHTML = 'id:' + e.object.id + ' easting:' + e.object.lonlat.lon + ' northing:' + e.object.lonlat.lat;
            console.log(e);
            OpenLayers.Event.stop(e);
        });
    }
});