let car_last_status = new Map();
//team name - num(firestation_infobox_num)
let firestation_infobox_num = new Map();
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
let car_infobox = [];
// create direction service and direction display layer
var directionsService;
var directionsDisplay;
//for rain
let Kaohsiung_Rain_Layer;
let Tainan_Rain_Layer;

// 中寮隧道
let layer4;

function initMap() {
  //for direction service
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: { lat: 23.745523, lng: 120.912494 },
  });

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
      layer4 = new google.maps.KmlLayer({
        url: 'http://140.116.245.229:3000/GetTunnelKML',
        suppressInfoWindows: true,
        preserveViewport: true,
        map: null,
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
            '<br>地區:北區<br>電量:' +
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

  //set rain image
  GetRainDrop();
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
      let seed_content = '';
      for (let i = 0; i < JData.length; i++) {
        if (JData[i].seed_status == 1) {
          seed_markers[i].setIcon(red_marker);
        } else {
          seed_markers[i].setIcon(blue_marker);
        }
        seed_content =
          '<div id="infoDiv' +
          i +
          '" class="infoDiv">' +
          '<h6>種子ID:' +
          JData[i].seed_id +
          '</h6>' +
          '<p id="infoDivSeedStat' +
          i +
          '" class="infoDiv">' +
          '種子狀態:' +
          (JData[i].seed_status ? '危險' : '安全') +
          '<br>地區:北區<br>電量:' +
          JData[i].seed_battery +
          '</p></div>';
        seed_infobox[i].setContent(seed_content);
      }
    },
    error: function () {
      alert('ERROR!!!');
    },
  });
  //set car markers on map
  let car_location;
  $.ajax({
    url: 'http://140.116.245.229:3000/GetCarsJson',
    type: 'POST',
    dataType: 'json',
    success: function (JData) {
      var NumOfJData = JData.length;
      for (var i = 0; i < NumOfJData; i++) {
        if (first_load_in == 1) {
          car_location = {
            lat: JData[i].car_latitude,
            lng: JData[i].car_longitude,
          };
          //get brigade and squadron for infobox
          let tmp_b = firestation_brigade.get(JData[i].team_name);
          let tmp_s = firestation_squadron.get(JData[i].team_name);
          car_infobox[i] = new google.maps.InfoWindow({
            content:
              '<div id="car_info' +
              i +
              'class="infoDiv><h6>車牌: <br>  ' +
              JData[i].car_license_plate +
              '</h6>' +
              '<p id="infoDivCarStat' +
              i +
              '" class="infoDiv">' +
              '車輛狀態:' +
              (JData[i].car_status ? '值勤中' : '待命中') +
              '<br>隸屬分隊:' +
              JData[i].team_name +
              '<br>' +
              tmp_b +
              '>>' +
              tmp_s +
              '</p></div>',
          });
          car_markers[i] = new google.maps.Marker({
            position: car_location,
            icon: ambulance_marker,
            map: null,
          });
          car_markers[i].addListener(
            'click',
            (function (i) {
              return function () {
                car_infobox[i].open(map, car_markers[i]);
              };
            })(i)
          );
        } else {
          if (JData[i]['car_status'] == 0) {
            if (car_last_status.get(JData[i]['car_license_plate']) == 1) {
              //changed
              //reset car container
              var element1 = document.getElementById('team_1');
              var element2 = document.getElementById('team_2');
              var element3 = document.getElementById('team_3');
              SelectTeam3(element1.value, element2.value, element3.value);
              //reset info box
              let j;
              let unsent_cars = 0;
              let sent_cars = 0;
              for (j = 0; j < JData.length; j++) {
                if (JData[j].team_name == JData[i].team_name) {
                  if (JData[j].car_status == 0) {
                    unsent_cars++;
                  } else {
                    sent_cars++;
                  }
                }
              }
              reset_info_box(
                firestation_infobox_num.get(JData[i].team_name),
                unsent_cars,
                sent_cars
              );
              car_cluster.removeMarker(car_markers[i], true);
            }
            car_last_status.set(JData[i]['car_license_plate'], 0);
          } else {
            //car status = 1
            if (car_last_status.get(JData[i]['car_license_plate']) == 0) {
              //changed
              //reset car container
              var element1 = document.getElementById('team_1');
              var element2 = document.getElementById('team_2');
              var element3 = document.getElementById('team_3');
              SelectTeam3(element1.value, element2.value, element3.value);
              //reset info box
              let j;
              let unsent_cars = 0;
              let sent_cars = 0;
              for (j = 0; j < JData.length; j++) {
                if (JData[j].team_name == JData[i].team_name) {
                  if (JData[j].car_status == 0) {
                    unsent_cars++;
                  } else {
                    sent_cars++;
                  }
                }
              }
              reset_info_box(
                firestation_infobox_num.get(JData[i].team_name),
                unsent_cars,
                sent_cars
              );

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
        //add firestaion on map
        //I call these two funtion here is because these function must execute after the map objects are created
        load_fireStation_on_map();
        setRainImage();
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
    firestaions_location[i] = {
      lat: FireStations[i].fireStation_latitude,
      lng: FireStations[i].fireStation_longitude,
    };
    let tmp_address = FireStations[i].address;
    let tmp_tel = FireStations[i].phone_number;
    let name = FireStations[i].team_name;
    firestation_infobox_num.set(name, i);
    fire_station_infobox[i] = new google.maps.InfoWindow({});
    firestation_markers[i] = new google.maps.Marker({
      position: firestaions_location[i],
      icon: firestaion_img,
      map: map,
    });

    firestation_markers[i].addListener(
      'click',
      (function (i) {
        return function () {
          let tmp_content =
            '<div id="infoDiv' +
            i +
            '" class="infoDiv">' +
            '<h6>分隊:' +
            name +
            '</h6>' +
            '<p >' +
            '地址:' +
            tmp_address +
            '<br>電話:' +
            tmp_tel +
            '<br><br>' +
            FireStations[i].brigade +
            '>>' +
            FireStations[i].squadron +
            '</p></div>';

          let sent_cars = 0;
          let unsent_cars = 0;
          $.ajax({
            url: 'http://140.116.245.229:3000/GetCarsJson',
            type: 'POST',
            dataType: 'json',
            success: function (JData) {
              let j = 0;
              for (j = 0; j < JData.length; j++) {
                if (name == JData[j].team_name) {
                  if (JData[j].car_status == 0) {
                    unsent_cars++;
                  } else sent_cars++;
                }
              }
              tmp_content +=
                '<p id="unsent_car_info_' +
                i +
                '" style="color: green;font-size: 14px;"><b>待命中:' +
                unsent_cars +
                '</b></p><p id="unsent_car_info_' +
                i +
                '" style="color: red;font-size: 14px;"><b>值勤中:' +
                sent_cars +
                '</b></p>';
              fire_station_infobox[i].setContent(tmp_content);
            },
            error: function () {
              alert('ERROR!!!');
            },
          });

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
  } else if (value == '雨量') {
    if (checked == true) {
      Kaohsiung_Rain_Layer.setMap(map);
      Tainan_Rain_Layer.setMap(map);
    } else {
      Kaohsiung_Rain_Layer.setMap(null);
      Tainan_Rain_Layer.setMap(null);
    }
  } else if (value == '中寮隧道種子') {
    if (checked == true) {
      layer4.setMap(map);
    } else layer4.setMap(null);
  }
}
function setRainImage() {
  let pos = [];
  pos[0] = [
    {
      lat: imageBounds[0][0][0],
      lng: imageBounds[0][0][1],
    },
    {
      lat: imageBounds[0][1][0],
      lng: imageBounds[0][1][1],
    },
  ];
  pos[1] = [
    {
      lat: imageBounds[1][0][0],
      lng: imageBounds[1][0][1],
    },
    {
      lat: imageBounds[1][1][0],
      lng: imageBounds[1][1][1],
    },
  ];
  //kaohsiung
  var K_Bounds = new google.maps.LatLngBounds(pos[0][0], pos[0][1]);
  //Tainan
  var T_Bounds = new google.maps.LatLngBounds(pos[1][0], pos[1][1]);
  Kaohsiung_Rain_Layer = new google.maps.GroundOverlay(returnImage(), K_Bounds);
  Tainan_Rain_Layer = new google.maps.GroundOverlay(returnImage2(), T_Bounds);
}
function reset_info_box(num, unsent_cars, sent_cars) {
  let tmp_content =
    '<div id="infoDiv' +
    num +
    '" class="infoDiv">' +
    '<h6>分隊:' +
    FireStations[num].team_name +
    '</h6>' +
    '<p >' +
    '地址:' +
    FireStations[num].address +
    '<br>電話:' +
    FireStations[num].phone_number +
    '</p></div>';
  tmp_content +=
    '<p id="unsent_car_info_' +
    num +
    '" style="color: green;font-size: 14px;"><b>待命中:' +
    unsent_cars +
    '</b></p><p id="unsent_car_info_' +
    num +
    '" style="color: red;font-size: 14px;"><b>值勤中:' +
    sent_cars +
    '</b></p>';
  fire_station_infobox[num].setContent(tmp_content);
}
