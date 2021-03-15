let car_latlng = new Map();
let car_status = new Map();
let car_last_status = new Map();
let car_markers = [];
let seed_markers = [];
let car_cluster;
let locations = [];
let firestaions_location = [];
let map;
let layer1;
let layer2;
let layer3;
let seed_infobox = [];
let fire_station_infobox = [];

// create direction service and direction display layer
var directionsService;
var directionsDisplay;

// 中寮隧道
var kmzLayer, kmlLayer;
var src = 'https://raw.githubusercontent.com/TsenEN/A-Disaster-Warning-and-Rescue-Platform/seedMap/%E9%82%8A%E5%9D%A1%E7%A8%AE%E5%AD%902.kml?token=AM765KOAAO4BJ6QVO2MM2YTAJMKGM';

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

      //layer 4 - 中寮隧道
      layer4 = new google.maps.Data({ map: map });
      
      layer4.setStyle({
        visible: false,
      });

      layer4 = new google.maps.KmlLayer(src, {
        suppressInfoWindows: true,
        preserveViewport: false,
        map: map,
      });

      //blue spot image
      var blue_marker = {
        url: './Img/blue_spot.png',
        size: new google.maps.Size(42, 42),
        scaledSize: new google.maps.Size(42, 42),
      };
      //red spot image
      var red_marker = {
        url: './Img/red_spot.png',
        size: new google.maps.Size(42, 42),
        scaledSize: new google.maps.Size(42, 42),
      };
      i = 0;

      for (i = 0; i < JData.length; i++) {
        seed_infobox[i] = new google.maps.InfoWindow({
          content:
            '<div id="infoDiv' +
            i +
            '" class="infoDiv">' +
            '<h6>種子ID:' +
            seed_id[i] +
            '</h6>' +
            '<p id="infoDivSeedStat' +
            i +
            '" class="infoDiv">' +
            '種子狀態:' +
            (JData[i].seed_status ? '危險' : '安全') +
            '</p><p>電量:' +
            JData[i].seed_battery +
            '</p></div>',
        });
        seed_markers[i] = new google.maps.Marker({
          position: locations[i],
          icon: JData[i].seed_status ? red_marker : blue_marker,
          label: String(seed_id[i]),
          map: map,
        });
        seed_markers[i].addListener(
          'click',
          (function (i) {
            return function () {
              seed_infobox[i].open(map, seed_markers[i]);
            };
          })(i)
        );
      }
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
  var ambu_size;
  ambu_size = new google.maps.Size(42, 42);

  //ambulance marker image
  var ambulance_marker = {
    url: './Img/ambulance_red.png',
    size: ambu_size,
    scaledSize: ambu_size,
  };
  //blue spot image
  var blue_marker = {
    url: './Img/blue_spot.png',
    size: new google.maps.Size(42, 42),
    scaledSize: new google.maps.Size(42, 42),
  };
  //red spot image
  var red_marker = {
    url: './Img/red_spot.png',
    size: new google.maps.Size(42, 42),
    scaledSize: new google.maps.Size(42, 42),
  };
  //if seed status changed
  $.ajax({
    url: 'http://140.116.245.229:3000/GetSeedsJson',
    type: 'POST',
    dataType: 'json',
    success: function (JData) {
      for (let i = 0; i < JData.length; i++) {
        if (JData[i].seed_status == 1) {
          seed_markers[i].setIcon(red_marker);
        } else {
          seed_markers[i].setIcon(blue_marker);
        }
      }
    },
    error: function () {
      alert('ERROR!!!');
    },
  });
  //set car markers on map
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
    let tmp_address = 'FireStations.' + Object.keys(FireStations)[i] + '.地址';
    tmp_address = eval(tmp_address);
    let tmp_tel = 'FireStations.' + Object.keys(FireStations)[i] + '.電話號碼';
    tmp_tel = eval(tmp_tel);
    let name = Object.keys(FireStations)[i];
    fire_station_infobox[i] = new google.maps.InfoWindow({
      content:
        '<div id="infoDiv' +
        i +
        '" class="infoDiv">' +
        '<h6>分隊:' +
        name +
        '</h6>' +
        '<p id="infoDivFSAdress' +
        i +
        '" class="infoDiv">' +
        '地址:' +
        tmp_address +
        '</p><p>電話:' +
        tmp_tel +
        '</p></div>',
    });
    firestation_markers[i] = new google.maps.Marker({
      position: firestaions_location[i],
      icon: firestaion_img,
      map: map,
    });
    firestation_markers[i].addListener(
      'click',
      (function (i) {
        return function () {
          fire_station_infobox[i].open(map, firestation_markers[i]);
        };
      })(i)
    );
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
  } else if (value == '中寮隧道種子') {
    if (checked == true) {
      layer4.setStyle({
        fillColor: 'red',
        strokeColor: 'red',
        strokeWeight: 1,
        visible: true,
      });
    } else
      layer4.setStyle({
        visible: false,
      });
  }
}
