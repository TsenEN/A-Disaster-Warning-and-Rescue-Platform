var map;
var my_home_latlng = { lat: 23.077774168439802, lng: 120.51821082797129 }
var seed_latlng = new Map();
var seed_status = new Map();
var seed_markers = [];
var car_latlng = new Map();
var car_status = new Map();
var car_markers = [];
var infowindow = []
var s = -1;
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
                seed_markers[i] = new google.maps.Marker({
                    position: seed_latlng.get(JData[i]["seed_id"]),
                    map: map,
                    label: s_id_tmp
                });

                seed_markers[i].setMap(map);
                seed_markers[i].addListener('click', (function (i) {
                    return function () {
                        var el = document.getElementById('seed_detail_block');
                        el.remove();
                        $('<div id="seed_detail_block">' + '<h2>種子ID:' + JData[i]["seed_id"] + '</h2>'
                            + '<span>經緯度:</br>' + JData[i]["seed_latitude"] + ',' + JData[i]["seed_longitude"] + '</br>'
                            + '種子狀態:' + string_seed_stat + '</span>' + '</div>').appendTo('.seed_detail');
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
                var string_car_stat;
                if (JData[i]["car_status"] == 0) {
                    string_car_stat = "未派遣";
                }
                else {
                    string_car_stat = "值勤中"
                }
                infowindow[i] = new google.maps.InfoWindow({
                    content: '<div id="infoDiv' + i + '" class="infoDiv">' + '<h2>車牌:' + JData[i]["car_license_plate"] + '</h2>'
                        + '<span>經緯度:</br>' + JData[i]["car_latitude"] + ',' + JData[i]["car_longitude"] + '</br></span>' +
                        '<span>'
                        + '<p id="infoDivCarStat' + i + '" class="infoDiv">' + '車子狀態:' + string_car_stat + '</p></span>' +
                        '  <div id="infoDivButton' + i + '"></div>' +
                        '</div>' + '<input type="hidden" id="s' + i + '" value=' + JData[i]["car_status"] + ' >'
                });
                if (car_status.get(JData[i]["car_license_plate"]) == 0) {
                    var button_light = document.getElementById('infoDivButton' + i);
                    console.log(button_light);
                    $(button_light).css({
                        'background-position': '-70px 0'
                    });
                }
                else {
                    var button_light = document.getElementById('infoDivButton' + i);
                    console.log(button_light);
                    $(button_light).css({
                        'background-position': '0 0'
                    });
                }
                infowindow[i].addListener('domready', (function (i) {
                    return function () {
                        _content(i, JData[i]["car_license_plate"]);
                    }
                })(i));

                car_markers[i] = new google.maps.Marker({
                    position: car_latlng.get(JData[i]["car_license_plate"]),
                    icon: './icon/ambulance_s.png',
                    map: map,
                    label: JData[i]["car_license_plate"]
                });

                car_markers[i].setMap(map);
                car_markers[i].addListener('click', (function (i) {
                    return function () {
                        infowindow[i].open(map, car_markers[i]);
                    }
                })(i));
            }
        },
        error: function () {
            alert("ERROR!!!");
        }
    });
}, 3000);

function _content(e, car_license_plate) {
    $('#infoDiv' + e + ' div').on('click', function () {
        var car_s = document.getElementById('s' + e);
        s = car_s.value;
        alert("print s " + s);
        if (s == 0) { s = -1 }
        s = s * -1;
        if (s < 0) {
            //button關閉
            var el = document.getElementById('infoDivCarStat' + e);
            el.textContent = "車子狀態:未派遣"
            el.style.color = "black";
            var data = [{ "car_license_plate": car_license_plate, "car_status": 0 }]
            $.ajax({
                url: 'http://140.116.245.229:3000/ChangeCarStatus',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                dataType: "json",
                crossDomain: true,
                data: JSON.stringify(data),
                success: function () {
                    alert("send json success!");
                }
            });
            car_status.set(car_license_plate, 0);
            car_s.value = 0;
            $(this).css({
                'background-position': '-70px 0'
            });
        } else {
            //按下BUTTON
            //把原本的內容拿掉
            var el = document.getElementById('infoDivCarStat' + e);
            el.textContent = "車子狀態:值勤中"
            el.style.color = "red";

            var data = [{ "car_license_plate": car_license_plate, "car_status": 1 }]
            $.ajax({
                url: 'http://140.116.245.229:3000/ChangeCarStatus',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                dataType: "json",
                crossDomain: true,
                data: JSON.stringify(data),
                success: function () {
                    alert("send json success!");
                }
            });
            car_status.set(car_license_plate, 1);
            car_s.value = 1;
            $(this).css({
                'background-position': '0 0'
            });
        }

    });
}