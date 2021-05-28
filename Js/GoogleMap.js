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
// 中寮隧道
let layer4;
let seed_infobox = [];
let fire_station_infobox = [];
let car_infobox = [];
// create direction service and direction display layer
var directionsService;
var directionsDisplay;
//for rain
let Kaohsiung_Rain_Layer;
let Tainan_Rain_Layer;

function initMap() {
  //for direction service
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  //create map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: { lat: 22.5, lng: 120.512494 },
  });

  //layers init
  load_layer();

  //seed init
  $.ajax({
    type: 'GET',
    url: 'http://140.116.245.229:3000/GetSeedsJson',
    dataType: 'json',
    success: function (JData) {
      let seed_id = [];
      let area = [];
      var i = 0;
      $.each(JData, function () {
        locations[i] = {
          lat: parseFloat(JData[i].seed_latitude),
          lng: parseFloat(JData[i].seed_longitude),
        };
        seed_id[i] = JData[i].seed_id.toString();

        i++;
      });

      //blue spot image
      var blue_marker = {
        url: './Img/safe_seed.png',
        size: new google.maps.Size(45, 45),
        scaledSize: new google.maps.Size(45, 45),
      };
      //red spot image
      var red_marker = {
        url: './Img/danger_seed.png',
        size: new google.maps.Size(53, 53),
        scaledSize: new google.maps.Size(53, 53),
      };

      for (i = 0; i < JData.length; i++) {
        seed_infobox[i] = new google.maps.InfoWindow({
          content:
            '<div id="infoDiv' +
            i +
            '" class="infoDiv">' +
            '<h6>種子ID:' +
            seed_id[i] +
            '</h6>' +
            '<p><br>地區:北區<br>電量:' +
            JData[i].seed_battery +
            '</p><p id="infoDivSeedStat' +
            i +
            '" class="infoDiv"' +
            (JData[i].seed_status
              ? 'style="color: red">危險'
              : 'style="color: green">安全') +
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
              if (seed_infobox[i].anchor == null) {
                map.setCenter(locations[i]);
                if (map.zoom < 11) map.setZoom(11);
                seed_infobox[i].open(map, seed_markers[i]);
              } else {
                seed_infobox[i].close();
              }
            };
          })(i)
        );
      }
    },
    error: function (xhr) {
      alert('ERROR: ' + xhr.status + ' ' + xhr.statusText);
    },
  });

  //car init
  $.ajax({
    url: 'http://140.116.245.229:3000/GetCarsJson',
    type: 'POST',
    dataType: 'json',
    success: function (JData) {
      let car_location;
      var ambu_size;
      ambu_size = new google.maps.Size(42, 42);

      //ambulance marker image
      var ambulance_marker = {
        url: './Img/ambulance_sent.png',
        size: ambu_size,
        scaledSize: ambu_size,
      };
      //firetruck marker image
      var firetruck_marker = {
        url: './Img/fire-truck_sent.png',
        size: ambu_size,
        scaledSize: ambu_size,
      };
      var NumOfJData = JData.length;

      //all car data
      for (var i = 0; i < NumOfJData; i++) {
        //for sent cars destination info
        if (JData[i].car_status == 1) {
          let a_sent_car = new sent_car(
            JData[i].car_license_plate,
            JData[i].car_where,
            JData[i].car_kind,
            JData[i].team_name,
            {
              lat: JData[i].car_latitude,
              lng: JData[i].car_longitude,
            }
          );
          sent_cars_dest.push(a_sent_car);
        }

        //first load in setting
        car_location = {
          lat: JData[i].car_latitude,
          lng: JData[i].car_longitude,
        };
        let car_where_str;
        if (JData[i].car_where == '') car_where_str = '未知';
        else car_where_str = JData[i].car_where;
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
            '" class="infoDiv"><br>車種:' +
            (JData[i].car_kind ? '消防車' : '救護車') +
            '<br>隸屬分隊:' +
            JData[i].team_name +
            '<br>隸屬大隊:' +
            tmp_b +
            '<br>隸屬中隊:' +
            tmp_s +
            '<br>目的地:' +
            car_where_str +
            '</p></div>',
        });
        car_markers[i] = new google.maps.Marker({
          position: car_location,
          icon: JData[i].car_kind ? firetruck_marker : ambulance_marker,
          map: null,
        });
        car_markers[i].addListener(
          'click',
          (function (i) {
            return function () {
              if (car_infobox[i].anchor == null) {
                map.setCenter({
                  lat: JData[i].car_latitude,
                  lng: JData[i].car_longitude,
                });
                if (map.zoom < 11) map.setZoom(11);
                car_infobox[i].open(map, car_markers[i]);
              } else {
                car_infobox[i].close();
              }
            };
          })(i)
        );
      }
      car_cluster = new MarkerClusterer(map, car_markers, {
        imagePath: './Img/cluster_yellow/m',
      });
      for (var i = 0; i < car_markers.length; i++) {
        if (JData[i]['car_status'] == 0) {
          car_cluster.removeMarker(car_markers[i], true);
        }
      }
      car_cluster.resetViewport_();
      car_cluster.redraw_();
      reset_dest_info();
    },
    error: function () {
      alert('ERROR!!!');
    },
  });

  //navigation function
  //set direction display layer
  directionsDisplay.setMap(map);
  // add_directions();

  //set rain image
  GetRainDrop();
}

var seed_interval = setInterval(function () {
  //blue spot image
  var blue_marker = {
    url: './Img/safe_seed.png',
    size: new google.maps.Size(45, 45),
    scaledSize: new google.maps.Size(45, 45),
  };
  //red spot image
  var red_marker = {
    url: './Img/danger_seed.png',
    size: new google.maps.Size(53, 53),
    scaledSize: new google.maps.Size(53, 53),
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
          '<p><br>地區:北區<br>電量:' +
          JData[i].seed_battery +
          '</p><p id="infoDivSeedStat' +
          i +
          '" class="infoDiv"' +
          (JData[i].seed_status
            ? 'style="color: red">種子狀態: 危險'
            : 'style="color: green">種子狀態: 安全') +
          '</p></div>';
        seed_infobox[i].setContent(seed_content);
      }
    },
    error: function () {
      alert('ERROR!!!');
    },
  });
}, 1000);

var car_interval = setInterval(function () {
  var ambu_size;
  ambu_size = new google.maps.Size(42, 42);

  //ambulance marker image
  var ambulance_marker = {
    url: './Img/ambulance_sent.png',
    size: ambu_size,
    scaledSize: ambu_size,
  };
  //firetruck marker image
  var firetruck_marker = {
    url: './Img/fire-truck_sent.png',
    size: ambu_size,
    scaledSize: ambu_size,
  };

  //for sent cars destination info
  let tmp_sent_cars = [];
  let changed = false;
  $.ajax({
    url: 'http://140.116.245.229:3000/GetCarsJson',
    type: 'POST',
    dataType: 'json',
    success: function (JData) {
      var NumOfJData = JData.length;
      //all car data
      for (var i = 0; i < NumOfJData; i++) {
        {
          if (JData[i]['car_status'] == 0) {
            if (car_last_status.get(JData[i]['car_license_plate']) == 1) {
              //changed from unsent to sent
              changed = true;
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
            //for sent cars destination info
            let a_sent_car = new sent_car(
              JData[i].car_license_plate,
              JData[i].car_where,
              JData[i].car_kind,
              JData[i].team_name,
              {
                lat: JData[i]['car_latitude'],
                lng: JData[i]['car_longitude'],
              }
            );
            tmp_sent_cars.push(a_sent_car);
            //reset car infobox everyseconds
            let car_content;
            let car_where_str;
            if (JData[i].car_where == '') car_where_str = '未知';
            else car_where_str = JData[i].car_where;
            //get brigade and squadron for infobox
            let tmp_b = firestation_brigade.get(JData[i].team_name);
            let tmp_s = firestation_squadron.get(JData[i].team_name);
            car_content =
              '<div id="car_info' +
              i +
              'class="infoDiv><h6>車牌: <br>  ' +
              JData[i].car_license_plate +
              '</h6>' +
              '<p id="infoDivCarStat' +
              i +
              '" class="infoDiv"><br>車種:' +
              (JData[i].car_kind ? '消防車' : '救護車') +
              '<br>隸屬分隊:' +
              JData[i].team_name +
              '<br>' +
              '隸屬大隊: ' +
              tmp_b +
              '<br>隸屬中隊:' +
              tmp_s +
              '<br>目的地:' +
              car_where_str +
              '</p></div>';
            car_infobox[i].setContent(car_content);
            if (car_last_status.get(JData[i]['car_license_plate']) == 0) {
              //changed from sent to unsent
              changed = true;
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
            car_markers[i].setIcon(
              JData[i].car_kind ? firetruck_marker : ambulance_marker
            );
            car_last_status.set(JData[i]['car_license_plate'], 1);
          }
        }
      }
      if (changed == true) {
        sent_cars_dest = tmp_sent_cars;
        reset_dest_info();
      }
      car_cluster.resetViewport_();
      car_cluster.redraw_();
    },
    error: function () {
      alert('ERROR!!!');
    },
  });
}, 1000);

setTimeout(function load_fireStation_on_map() {
  console.log('load firestation');

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
    let car_data;
    $.ajax({
      url: 'http://140.116.245.229:3000/GetCarsJson',
      type: 'POST',
      dataType: 'json',
      success: function (JData) {
        car_data = JData;
      },
      error: function () {
        alert('ERROR IN LOAD FIRESTATION ON MAP - GET CAR');
      },
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
            '<br><br>隸屬大隊:' +
            FireStations[i].brigade +
            '<br>隸屬中隊:' +
            FireStations[i].squadron +
            '</p></div>';

          let sent_cars = 0;
          let unsent_cars = 0;
          let j = 0;
          for (j = 0; j < car_data.length; j++) {
            if (name == car_data[j].team_name) {
              if (car_data[j].car_status == 0) {
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
          if (fire_station_infobox[i].anchor == null) {
            map.setCenter(firestaions_location[i]);
            if (map.zoom < 11) map.setZoom(11);
            fire_station_infobox[i].open(map, firestation_markers[i]);
          } else {
            fire_station_infobox[i].close();
          }
        };
      })(i)
    );
    i++;
  });
  var firestation_cluster = new MarkerClusterer(map, firestation_markers, {
    imagePath: './Img/cluster_orange/m',
  });
}, 1000);

function load_layer() {
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
  //高雄甲仙
  layer1.loadGeoJson(
    'https://www.geologycloud.tw/data/zh-tw/GeologicalSensitiveAreas?category=%E5%B1%B1%E5%B4%A9%E8%88%87%E5%9C%B0%E6%BB%91&name=%E9%AB%98%E9%9B%84%E5%B8%82&town=%E7%94%B2%E4%BB%99%E5%8D%80&all=true'
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
}

function show_layer(checked, value) {
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
