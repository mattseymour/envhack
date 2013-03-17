var map;

$(document).ready(function() {
    // create the map, and zoom to envhack
	map = new OpenSpace.Map('map');
	var envhack = new OpenSpace.MapPoint(358206, 173144);
	map.setCenter(envhack, 7);

    // create a new layer for the markers
    markers_layer = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers_layer);

    // icons
    var size = new OpenLayers.Size(33,45);
    var icon_blue = new OpenLayers.Icon('http://osopenspacepro.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/images/markers/marker_blue.png', size);
    var icon_green = new OpenLayers.Icon('http://osopenspacepro.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/images/markers/marker_green.png', size);
    var icon_yellow = new OpenLayers.Icon('http://osopenspacepro.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/images/markers/marker_yellow.png', size);
    var icon_red = new OpenLayers.Icon('http://osopenspacepro.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/images/markers/marker_red.png', size);

    for(n=0; n<fc.features.length;n++) {
        // add a new marker
        var ico;
        if (fc.features[n].properties['EIL_WATER'] == 'Category 4 (No Impact)') {
            ico = icon_blue.clone();
        } else if (fc.features[n].properties['EIL_WATER'] == 'Category 3 (Minor)') {
            ico = icon_green.clone();
        } else if (fc.features[n].properties['EIL_WATER'] == 'Category 2 (Significant)') {
            ico = icon_yellow.clone();
        } else {
            ico = icon_red.clone();
        }
        marker = new OpenLayers.Marker(new OpenSpace.MapPoint(fc.features[n].geometry.coordinates[0],fc.features[n].geometry.coordinates[1]),ico);
        marker.fid = n;
        markers_layer.addMarker(marker);

        // onclick method for markers
        marker.events.register('click', marker, function (e) {
            //$('#query')[0].innerHTML = 'fid: ' + e.object.fid + '<br />easting: ' + e.object.lonlat.lon + '<br />northing: ' + e.object.lonlat.lat + '<br />date: ' + fc.features[e.object.fid].properties['NOT_DATE'] + '<br />category: ' + fc.features[e.object.fid].properties['EIL_WATER'];
            $('#content').fadeOut(250, function() {
                $('#query_fid')[0].innerHTML = e.object.fid;
                $('#query_date')[0].innerHTML = fc.features[e.object.fid].properties['NOT_DATE'];
                $('#query_severity')[0].innerHTML = fc.features[e.object.fid].properties['EIL_WATER'];
                $('#content').fadeIn(250);
            });
            OpenLayers.Event.stop(e);
        });
    }
});