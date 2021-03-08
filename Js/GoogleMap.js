let car_latlng = new Map();
let car_status = new Map();
let car_last_status = new Map();
let car_markers = [];
let car_cluster;
let locations = [];
let firestaions_location = [];
let map;
let layer1;
let layer2;
let layer3;

// create direction service and direction display layer
var directionsService;
var directionsDisplay;

function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  $.ajax({
    type: 'GET',
    url: 'http://140.116.245.229:3000/GetSeedsJson',
    dataType: 'json',
    success: function (JData) {
      let seed_id = [];
      var i = 0;
      $.each(JData, function () {
        locations[i] = {
          lat: parseFloat(JData[i].seed_latitude),
          lng: parseFloat(JData[i].seed_longitude),
        };
        seed_id[i] = JData[i].seed_id.toString();
        console.log(seed_id[i]);
        i++;
      });
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: 23.745523, lng: 120.912494 },
      });

      //add layer
      //layer1 - ground slip
      layer1 = new google.maps.Data({ map: map });
      layer1.setStyle({
        visible: false,
      });
      //GeoJson
      //玉井
      layer1.loadGeoJson(
        'https://www.geologycloud.tw/data/zh-tw/GeologicalSensitiveAreas?category=%E5%B1%B1%E5%B4%A9%E8%88%87%E5%9C%B0%E6%BB%91&name=%E8%87%BA%E5%8D%97%E5%B8%82&town=%E7%8E%89%E4%BA%95%E5%8D%80&all=true'
      );
      //南化
      layer1.loadGeoJson(
        'https://www.geologycloud.tw/data/zh-tw/GeologicalSensitiveAreas?category=%E5%B1%B1%E5%B4%A9%E8%88%87%E5%9C%B0%E6%BB%91&name=%E8%87%BA%E5%8D%97%E5%B8%82&town=%E5%8D%97%E5%8C%96%E5%8D%80&all=true'
      );
      //楠西
      layer1.loadGeoJson(
        'https://www.geologycloud.tw/data/zh-tw/GeologicalSensitiveAreas?category=%E5%B1%B1%E5%B4%A9%E8%88%87%E5%9C%B0%E6%BB%91&name=%E8%87%BA%E5%8D%97%E5%B8%82&town=%E6%A5%A0%E8%A5%BF%E5%8D%80&all=true'
      );

      //layer2 - under water
      layer2 = new google.maps.Data({ map: map });
      layer2.setStyle({
        visible: false,
      });
      //嘉南平原
      layer2.loadGeoJson(
        'https://www.geologycloud.tw/data/zh-tw/GeologicalSensitiveAreas?category=%E5%9C%B0%E4%B8%8B%E6%B0%B4%E8%A3%9C%E6%B3%A8&name=%E5%98%89%E5%8D%97%E5%B9%B3%E5%8E%9F'
      );

      //layer 3 - fault
      layer3 = new google.maps.Data({ map: map });
      layer3.setStyle({
        visible: false,
      });
      //六甲斷層
      layer3.loadGeoJson(
        'https://www.geologycloud.tw/data/zh-tw/GeologicalSensitiveAreas?category=%E6%B4%BB%E5%8B%95%E6%96%B7%E5%B1%A4&name=%E5%85%AD%E7%94%B2%E6%96%B7%E5%B1%A4'
      );
      //新化斷層
      layer3.loadGeoJson(
        'https://www.geologycloud.tw/data/zh-tw/GeologicalSensitiveAreas?category=%E6%B4%BB%E5%8B%95%E6%96%B7%E5%B1%A4&name=%E6%96%B0%E5%8C%96%E6%96%B7%E5%B1%A4'
      );

      //blue spot image
      var blue_marker = {
        url: './Img/blue_spot.png',
        size: new google.maps.Size(42, 42),
        scaledSize: new google.maps.Size(42, 42),
      };
      i = 0;
      const markers = locations.map((location, i) => {
        return new google.maps.Marker({
          position: location,
          map: map,
          label: String(seed_id[i]),
          icon: blue_marker,
        });
      });
    },

    error: function (xhr) {
      alert('ERROR: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
  //navigation function
  //set direction display layer
  directionsDisplay.setMap(map);
  // add_directions();

  //fire station info
  GetFireStation();
}

//for deciding whether set markers to null or not
var first_load_in = 1;

var interval = setInterval(function () {
  /* do something that will execute every 1000 milliseconds*/
  //set car markers on map

  //edit image size by zoom
  var zoom = map.getZoom();
  var ambu_size;
  ambu_size = new google.maps.Size(42, 42);
  // if (zoom < 13) {
  //   ambu_size = new google.maps.Size(42, 42);
  // } else ambu_size = new google.maps.Size(42 + 1.5 * zoom, 42 + 1.5 * zoom);

  //ambulance marker
  var ambulance_marker = {
    url: './Img/ambulance_red.png',
    size: ambu_size,
    scaledSize: ambu_size,
  };

  $.ajax({
    url: 'http://140.116.245.229:3000/GetCarsJson',
    type: 'POST',
    dataType: 'json',
    success: function (JData) {
      var NumOfJData = JData.length;
      for (var i = 0; i < NumOfJData; i++) {
        if (first_load_in == 1) {
          car_status.set(JData[i]['car_license_plate'], JData[i]['car_status']);
          JData[i]['car_license_plate'], JData[i]['car_status'];
          car_latlng.set(JData[i]['car_license_plate'], {
            lat: JData[i]['car_latitude'],
            lng: JData[i]['car_longitude'],
          });
          car_markers[i] = new google.maps.Marker({
            position: car_latlng.get(JData[i]['car_license_plate']),
            icon: ambulance_marker,
            //label: JData[i]['car_license_plate'],
            map: null,
          });
          //add firestaion on map
          //I call this funtion here is because this function must execute after the map and the Firestation object are created
          load_fireStation_on_map();
        } else {
          car_status.set(JData[i]['car_license_plate'], JData[i]['car_status']);
          if (JData[i]['car_status'] == 0) {
            if (car_last_status.get(JData[i]['car_license_plate']) == 1) {
              car_cluster.removeMarker(car_markers[i], true);
            }
            car_last_status.set(JData[i]['car_license_plate'], 0);
          } else {
            if (car_last_status.get(JData[i]['car_license_plate']) == 0) {
              car_cluster.addMarker(car_markers[i], true);
            }
            car_markers[i].setPosition({
              lat: JData[i]['car_latitude'],
              lng: JData[i]['car_longitude'],
            });
            car_markers[i].setIcon(ambulance_marker);
            car_last_status.set(JData[i]['car_license_plate'], 1);
          }
        }
      }
      if (first_load_in == 1) {
        car_cluster = new MarkerClusterer(map, car_markers, {
          imagePath:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        });
        for (var i = 0; i < car_markers.length; i++) {
          if (JData[i]['car_status'] == 0) {
            car_cluster.removeMarker(car_markers[i], true);
          }
        }
      }
      first_load_in = 0;
      car_cluster.resetViewport_();
      car_cluster.redraw_();
    },
    error: function () {
      alert('ERROR!!!');
    },
  });
}, 1000);

function load_fireStation_on_map() {
  //add firestation markers
  var i = 0;
  var firestaion_img = {
    url: './Img/fireStation_orange2.png',
    size: new google.maps.Size(42, 42),
    scaledSize: new google.maps.Size(42, 42),
  };
  var firestation_markers = [];
  $.each(FireStations, function () {
    var tmp_lat = 'FireStations.' + Object.keys(FireStations)[i] + '.N';
    var tmp_lng = 'FireStations.' + Object.keys(FireStations)[i] + '.E';
    tmp_lat = eval(tmp_lat);
    tmp_lng = eval(tmp_lng);
    tmp_lat = parseFloat(tmp_lat);
    tmp_lng = parseFloat(tmp_lng);
    firestaions_location[i] = {
      lat: tmp_lat,
      lng: tmp_lng,
    };
    firestation_markers[i] = new google.maps.Marker({
      position: firestaions_location[i],
      icon: firestaion_img,
      map: map,
    });
    i++;
  });
  var firestation_cluster = new MarkerClusterer(map, firestation_markers, {
    imagePath: './Img/cluster_orange/m',
  });
}

function load_layer(checked, value) {
  if (value == '山崩與地滑') {
    if (checked == true) {
      layer1.setStyle({
        fillColor: 'green',
        strokeColor: 'green',
        strokeWeight: 1,
        visible: true,
      });
    } else
      layer1.setStyle({
        visible: false,
      });
  } else if (value == '地下水補注') {
    if (checked == true) {
      layer2.setStyle({
        fillColor: 'blue',
        strokeColor: 'blue',
        strokeWeight: 1,
        visible: true,
      });
    } else
      layer2.setStyle({
        visible: false,
      });
  } else if (value == '活動斷層') {
    if (checked == true) {
      layer3.setStyle({
        fillColor: 'red',
        strokeColor: 'red',
        strokeWeight: 1,
        visible: true,
      });
    } else
      layer3.setStyle({
        visible: false,
      });
  }
}
