let Volunteers = [];
//volunteer get destination latlng
function get_latlng_v(destination) {
  var geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: destination }, function (results, status) {
      if (status == 'OK') {
        resolve(results[0].geometry.location);
      } else {
        alert('error in get get latlng v');
        reject('error');
      }
    });
  });
}
//set area into Volunteer
async function set_area_v() {
  for (let i = 0; i < Volunteers.length; i++) {
    var pos = {
      lat: Volunteers[i].latitude,
      lng: Volunteers[i].longitude,
    };
    let area;
    area = get_area_v(pos, i);
  }
}
//volunteer get area
function get_area_v(pos, j) {
  return new Promise((resolve, reject) => {
    let string;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ latLng: pos }, function (results, status) {
      if (status == 'OK') {
        for (let i = 0; i < results.length; i++) {
          if (results[i].types[0] == 'administrative_area_level_3') {
            string =
              results[i].address_components[1].long_name +
              results[i].address_components[0].long_name;
          }
        }
        Volunteers[j].area = string;
        resolve(string);
      } else {
        alert('error in get seed area');
        reject('error');
      }
    });
  });
}

//要寫選擇區域的設定，因為前面都有加同步設定，所以分開寫
function set_v_select() {
  let return_str = '<option>-選擇區域-</option>';
  for (let i = 0; i < Volunteers.length; i++) {
    return_str += '<option>' + Volunteers[i].area + '</option>';
  }
  $('#SelectArea').html(return_str);
}

function SelectV(area) {
  let return_str = '';
  for (let i = 0; i < Volunteers.length; i++) {
    if (Volunteers[i].area == area) {
      return_str +=
        '<tr><td>' +
        (i + 1) +
        '</td><td>' +
        (Volunteers[i].have_task ? '值勤中' : '待命中') +
        '</td><td><input type="checkbox"  id="V_checkbox_' +
        (i + 1) +
        '" ' +
        (Volunteers[i].have_task ? 'disabled="true"' : ' ') +
        '></td><td><input type="checkbox"  id="V_checkbox2_' +
        (i + 1) +
        '" ' +
        (Volunteers[i].have_task ? '' : 'disabled="true"') +
        '></td></tr>';
    }
  }
  $('#VolunteerList').html(return_str);
}
