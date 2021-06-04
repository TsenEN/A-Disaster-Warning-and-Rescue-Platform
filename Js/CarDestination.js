//for destination info
function sent_car(plate, car_destination, kind, team_name, location) {
  this.plate = plate;
  this.car_destination = car_destination; //string
  this.kind = kind;
  this.team_name = team_name;
  this.location = location;
}
let sent_cars_dest = [];
let sent_cars_num = [];
function reset_dest_info() {
  let tmp_sent_cars = [];
  for (let i = 0; i < Cars.length; i++) {
    let a_sent_car = new sent_car(
      Cars[i].car_license_plate,
      Cars[i].car_where,
      Cars[i].car_kind,
      Cars[i].team_name,
      {
        lat: Cars[i]['car_latitude'],
        lng: Cars[i]['car_longitude'],
      }
    );
    tmp_sent_cars.push(a_sent_car);
  }
  sent_cars_dest = tmp_sent_cars;
  let destinations = [];

  for (let i = 0; i < sent_cars_num.length; i++) {
    destinations.push(Cars[sent_cars_num[i]].car_where);
  }
  //remove repeated index
  destinations = destinations.filter(function (element, index, arr) {
    return arr.indexOf(element) === index;
  });
  let return_str = '<option>-選擇目的地-</option>';
  //sort
  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i] == '') {
      let tmp = destinations[destinations.length - 1];
      destinations[destinations.length - 1] = destinations[i];
      destinations[i] = tmp;
    }
  }
  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i] == '') {
      return_str += '<option>未知</option>';
    } else return_str += '<option>' + destinations[i] + '</option>';
  }
  $('#dest').html(return_str);
  $('#car_dest_info').html('');
}
async function look_up_dest(destination) {
  let return_status = '';
  if (destination == '-選擇目的地-') {
    $('#car_dest_info').html('');
    return;
  }
  await get_latlng(destination);
  let return_str = '<p><strong>前往車輛: &nbsp</strong></p>';
  return_str +=
    '<table class="table table-bordered table-hover" id="dest_table"><thead class="thead-light"><tr><td Align="Center" scope="col"><B>車牌</B></Td><td Align="Center" scope="col"><B>距離目的地</B></Td><td Align="Center" scope="col"><B>隸屬分隊</B></Td><td Align="Center" scope="col"><B>隸屬大隊</B></Td><td Align="Center" scope="col"><B>隸屬中隊</B></Td></tr></thead><tbody>';

  for (let i = 0; i < sent_cars_dest.length; i++) {
    if (sent_cars_dest[i].car_destination == destination) {
      return_status = await get_distance(i);
      let tmp_b = firestation_brigade.get(sent_cars_dest[i].team_name);
      let tmp_s = firestation_squadron.get(sent_cars_dest[i].team_name);
      return_str +=
        '<tr><td><span class="badge badge-secondary">' +
        (sent_cars_dest[i].kind ? '消防車' : '救護車') +
        '</span><br>' +
        sent_cars_dest[i].plate +
        '</td><td>' +
        sent_cars_dest[i].distance +
        '</td>' +
        '<td>' +
        sent_cars_dest[i].team_name +
        '</td><td>' +
        tmp_b +
        '</td><td>' +
        tmp_s +
        '</td></tr>';
    } else if (destination == '未知') {
      if (sent_cars_dest[i].car_destination == '') {
        let tmp_b = firestation_brigade.get(sent_cars_dest[i].team_name);
        let tmp_s = firestation_squadron.get(sent_cars_dest[i].team_name);
        return_str +=
          '<tr><td><span class="badge badge-secondary">' +
          (sent_cars_dest[i].kind ? '消防車' : '救護車') +
          '</span><br>' +
          sent_cars_dest[i].plate +
          '</td><td>未知</td>' +
          '<td>' +
          sent_cars_dest[i].team_name +
          '</td><td>' +
          tmp_b +
          '</td><td>' +
          tmp_s +
          '</td></tr>';
      }
    }
  }
  return_str += '</tbody></table>';
  $('#car_dest_info').html(return_str);
}

//get dest latlng
function get_latlng(destination) {
  let address;
  var geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    if (address == '未知') resolve('ok');
    geocoder.geocode({ address: destination }, function (results, status) {
      if (status == 'OK') {
        for (let j = 0; j < sent_cars_dest.length; j++) {
          if (sent_cars_dest[j].car_destination == destination) {
            sent_cars_dest[j].dest_latlng = results[0].geometry.location;
          }
        }
        resolve(results[0].geometry.location);
        // dest_markers = new google.maps.Marker({
        //   position: results[0].geometry.location,
        //   icon: dest_marker_image,
        //   map: map,
        // });
      } else {
        alert('error in get get latlng');
        reject('error');
      }
    });
  });
}
//get distance between car and destination every seconds
function get_distance(i) {
  return new Promise((resolve, reject) => {
    var request = {
      origin: sent_cars_dest[i].location,
      destination: sent_cars_dest[i].dest_latlng,
      travelMode: 'DRIVING',
    };
    directionsService.route(request, function (result, status) {
      if (status == 'OK') {
        // return every step details on the route
        sent_cars_dest[i].distance = result.routes[0].legs[0].distance.text;
        resolve(result.routes[0].legs[0].distance.text);
      } else {
        alert('error in get distance');
        reject('error');
      }
    });
  });
}
