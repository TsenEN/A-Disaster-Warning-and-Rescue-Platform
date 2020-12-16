var map;
var my_home_latlng = { lat: 23.077774168439802, lng: 120.51821082797129 }
var seed_latlng = new Map();
var seed_status = new Map();
var seed_markers = [];
var car_latlng = new Map();
var car_status = new Map();
var car_markers = [];
var infowindow = []

var interval = setInterval(function () {
    /* do something that will execute every 3000 milliseconds*/
    $.ajax({
        url: "http://140.116.245.229:3000/GetSeedsJson",
        type: "POST",
        dataType: "json",
        success: function (JData) {
            var NumOfJData = JData.length;
            for (var i = 0; i < NumOfJData; i++) {
                seed_status.set(JData[i]["seed_id"], JData[i]["seed_status"]);
                seed_latlng.set(JData[i]["seed_id"], { lat: JData[i]["seed_latitude"], lng: JData[i]["seed_longitude"] });
                let s_id_tmp = JData[i]["seed_id"].toString();
                var string_seed_stat; //用中文表示種子狀態
                if (JData[i]["seed_status"] == 0) string_seed_stat = "安全";
                else string_seed_stat = "警戒"
                infowindow[i] = new google.maps.InfoWindow({
                    content: '<h2>種子ID:' + JData[i]["seed_id"] + '</h2>'
                        + '<span>經緯度:</br>' + JData[i]["seed_latitude"] + ',' + JData[i]["seed_longitude"] + '</br>'
                        + '種子狀態:' + string_seed_stat + '</span>'
                });
                seed_markers[i] = new google.maps.Marker({
                    position: seed_latlng.get(JData[i]["seed_id"]),
                    map: map,
                    label: s_id_tmp
                });

                seed_markers[i].setMap(map);
                seed_markers[i].addListener('click', (function (i) {
                    return function () {
                        infowindow[i].open(map, seed_markers[i]);
                    }
                })(i));
            }
        },
        error: function () {
            alert("ERROR!!!");
        }
    });
    $.ajax({
        url: "http://140.116.245.229:3000/GetCarsJson",
        type: "POST",
        dataType: "json",
        success: function (JData) {
            var NumOfJData = JData.length;
            for (var i = 0; i < NumOfJData; i++) {
                car_status.set(JData[i]["car_license_plate"], JData[i]["car_status"]);
                car_latlng.set(JData[i]["car_license_plate"], { lat: JData[i]["car_latitude"], lng: JData[i]["car_longitude"] });
                //let s_id_tmp = JData[i]["car_license_plate"].toString();
                var string_car_stat; //用中文表示種子狀態
                if (JData[i]["car_status"] == 0) string_car_stat = "未派遣";
                else string_car_stat = "值勤中"
                // infowindow[i] = new google.maps.InfoWindow({
                //     content: '<h2>種子ID:' + JData[i]["car_license_plate"] + '</h2>'
                //         + '<span>經緯度:</br>' + JData[i]["car_latitude"] + ',' + JData[i]["car_longitude"] + '</br>'
                //         + '種子狀態:' + string_car_stat + '</span>'
                // });
                car_markers[i] = new google.maps.Marker({
                    position: car_latlng.get(JData[i]["car_license_plate"]),
                    map: map,
                    label: JData[i]["car_license_plate"]
                });

                car_markers[i].setMap(map);
                car_markers[i].addListener('click', (function (i) {
                    return function () {
                        //infowindow[i].open(map, car_markers[i]);
                        alert('')
                    }
                })(i));
            }
        },
        error: function () {
            alert("ERROR!!!");
        }
    });
}, 3000);
