var map;

var drag_flag = 0;
var map_dragged_flag = 0;
var marker_delete_flag = 0;
var markers = [];
var gridProjection = new OpenSpace.GridProjection();
var markersLayer;

var user_submitted_data = [];

try {
    if (page) {}
} catch(e) {
    page = 'unknown'
}

$(document).ready(function() {
    // create the map, and zoom to envhack
	map = new OpenSpace.Map('map');
	var envhack = new OpenSpace.MapPoint(358206, 173144);
	map.setCenter(envhack, 5);

    // create a new layer for the markers
    markers_layer = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers_layer);

    if (page == 'report') {
        map.events.remove('dblclick');
        map.events.register("movestart", this, this.setMapDrag);
        map.events.register("dblclick", this, addMarker);
        map.events.register("touchend", this, this.touchAddMarker);

        dragControl = new OpenSpace.Control.DragMarkers(markersLayer);
        map.addControl(dragControl);

        markersLayer = map.getMarkerLayer();

        // // submit report overlay
        // screenOverlay = new OpenSpace.Layer.ScreenOverlay("coords");
        // screenOverlay.setPosition(new OpenLayers.Pixel(400, 10));
        // map.addLayer(screenOverlay);
        // screenOverlay.setHTML("<div style=\"padding: 3px; width: 290px; text-align: right; height=75px; color:black; background-color: white; font-size: 15px\">Double click the map to add a marker.</div>");

    } else if(page == 'view') {

        // add existing incidents

        // icons
        var size = new OpenLayers.Size(33,45);
        var icon_blue = new OpenLayers.Icon('http://osopenspacepro.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/images/markers/marker_blue.png', size);
        var icon_green = new OpenLayers.Icon('http://osopenspacepro.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/images/markers/marker_green.png', size);
        var icon_yellow = new OpenLayers.Icon('http://osopenspacepro.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/images/markers/marker_yellow.png', size);
        var icon_red = new OpenLayers.Icon('http://osopenspacepro.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/images/markers/marker_red.png', size);

        for(n=0; n<fc.features.length;n++) {
            if (fc.features[n].properties['EIL_WATER'] != 'Category 4 (No Impact)') {
                // add a new marker
                var ico;
                //if (fc.features[n].properties['EIL_WATER'] == 'Category 4 (No Impact)') {
                //    ico = icon_blue.clone();
                if (fc.features[n].properties['EIL_WATER'] == 'Category 3 (Minor)') {
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
                        $('#query_fid')[0].innerHTML = 'Report for incident number ' + e.object.fid + '.';
                        $('#query_date')[0].innerHTML = 'Incident reported on ' + fc.features[e.object.fid].properties['NOT_DATE'] + '.';
                        $('#query_severity')[0].innerHTML = 'This incident was classified as ' + fc.features[e.object.fid].properties['EIL_WATER'] + '.';
                        $('#content').fadeIn(250);
                    });
                    OpenLayers.Event.stop(e);
                });
            }
        }

        // add user submitted incidents
        $.getJSON('/data/', function(data) {
            user_submitted_data = data;
            var icon_grey = new OpenLayers.Icon('http://osopenspacepro.ordnancesurvey.co.uk/osmapapi/img_versions/img_4.0.0/OS/images/markers/marker_grey.png', size);
            for(n=0;n<data.length;n++) {
                ico = icon_grey.clone();
                marker = new OpenLayers.Marker(new OpenSpace.MapPoint(data[n].x,data[n].y),ico);
                marker.fid = n;
                markers_layer.addMarker(marker);

                // onclick method for markers
                marker.events.register('click', marker, function (e) {
                    $('#content').fadeOut(250, function() {
                        $('#query_fid')[0].innerHTML = 'Report for incident number ' + e.object.fid + '.';
                        $('#query_date')[0].innerHTML = 'Incident reported on ' + user_submitted_data[e.object.fid]['date'] + '.';
                        $('#query_severity')[0].innerHTML = '';
                        $('#content').fadeIn(250);
                    });
                    OpenLayers.Event.stop(e);
                });
            }
        });
    }
});

function addMarker(evt) {
    if (!drag_flag) {
        // hack - remove any existing markers (we only need one)
        removeAllMarkers()
        
        var posClick = map.getLonLatFromViewPortPx(evt.xy);
        var ptClick = map.getLonLatFromViewPortPx(evt.xy);

        // update form inputs with easting and northing
        $('input[name="report_northing"]').val(ptClick.lat)
        $('input[name="report_easting"]').val(ptClick.lon)
      
        // add marker with default icon
        var marker = map.createMarker(posClick);
        marker.events.register('click', marker, removeMarkerClick);
        markers.push(marker);
      
        // Stop event propagating
        
        OpenLayers.Event.stop(evt);
    }
    if (map_dragged_flag) {
        map_dragged_flag = 0;
    }
    if (marker_delete_flag) {
        marker_delete_flag = 0;
    }
    if (drag_flag) {
        drag_flag = 0;
    }
}

function touchAddMarker(evt) {
  
// Adds a Touch marker
  
  if (!first_use_flag) {
      if (!marker_delete_flag && !drag_flag && !map_dragged_flag) {

          var ptTouch = osMap.getLonLatFromViewPortPx(evt.xy);
          var lonlatTouch = gridProjection.getLonLatFromMapPoint(ptTouch);

        // update form inputs with easting and northing
        $('input[name="report_northing"]').val(ptClick.lat)
        $('input[name="report_easting"]').val(ptClick.lon)

// Add a marker with default icon
        
          var marker = osMap.createMarker(lonlatTouch);
          marker.events.register('touchend', marker, removeMarkerTouch);
          markers.push(marker);

 // Stop event propagating  
        
          OpenLayers.Event.stop(evt);
      }
    
// Resets flags if delete or drag map event occurs and this event is triggered at Touch
// End of the other events
      if (map_dragged_flag) {
          map_dragged_flag = 0;
      }
      if (marker_delete_flag) {
          marker_delete_flag = 0;
      }
  } else {
      first_use_flag = 0;
  }
}

function setMapDrag(evt) {
  
// Sets flag so that add marker, delete marker will not be triggered at the end of the event.
  
  map_dragged_flag = 1;
}

function removeMarkerClick(evt) {
  
// Remove this marker
  
    if (!drag_flag ) {

        map.removeMarker(this);
        marker_delete_flag = 0;

        $('input[name="report_northing"]').val('')
        $('input[name="report_easting"]').val('')
      
// Stop event propagating
      
        OpenLayers.Event.stop(evt);
    }
}

function removeMarkerTouch(evt) {
  
// Remove this marker
  
    if (!drag_flag && !map_dragged_flag) {

        osMap.removeMarker(this);

        $('input[name="report_northing"]').val('')
        $('input[name="report_easting"]').val('')

    }
  
// Stop event propagating
  
    OpenLayers.Event.stop(evt);
}

function removeAllMarkers() {
  
// Remove all markers
  
    map.clearMarkers();

// And remove all markers from the list
  
    markers = [];
}