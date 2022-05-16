let checkbox_count;
//unsend to send
function change_status() {
  //suppose that there are only three cars
  let checkbox;
  let dest_element = document.getElementById('destination_button');
  let dest_info = dest_element.value;
  let data = [];
  let dest_data = [];
  let tmp_data;
  for (let i = 0; i < checkbox_count; i++) {
    let tmp = 'car_checkbox_' + String(i);
    checkbox = document.getElementById(tmp);
    let car_license_plate = $(checkbox).attr('car_license_plate');
    if (checkbox.checked == true) {
      tmp_data = { car_license_plate: car_license_plate, car_status: 1 };
      data.push(tmp_data);
      tmp_data = { car_license_plate: car_license_plate, car_where: dest_info };
      dest_data.push(tmp_data);
    }
  }
  $.ajax({
    url: 'http://140.116.245.229:3000/ChangeCarStatus',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    dataType: 'json',
    crossDomain: true,
    data: JSON.stringify(data),
    success: function () {},
    error: function (xhr) {
      alert('ERROR IN CHANGE STAT: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
  $.ajax({
    url: 'http://140.116.245.229:3000/ChangeCarAddress',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    dataType: 'json',
    crossDomain: true,
    data: JSON.stringify(dest_data),
    success: function () {},
    error: function (xhr) {
      alert('ERROR IN CHANGE ADDRESS: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
  dest_element.value = '';
}
//send to unsend
function change_status2() {
  //suppose that there are only three cars
  let checkbox;
  let data = [];
  let dest_data = [];
  let tmp_data;
  for (let i = 0; i < checkbox_count; i++) {
    let tmp = 'car_checkbox2_' + String(i);
    checkbox = document.getElementById(tmp);
    let car_license_plate = $(checkbox).attr('car_license_plate');
    if (checkbox.checked == true) {
      tmp_data = { car_license_plate: car_license_plate, car_status: 0 };
      data.push(tmp_data);
      tmp_data = { car_license_plate: car_license_plate, car_where: ' ' };
      dest_data.push(tmp_data);
    }
  }
  $.ajax({
    url: 'http://140.116.245.229:3000/ChangeCarStatus',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    dataType: 'json',
    crossDomain: true,
    data: JSON.stringify(data),
    success: function () {},
    error: function (xhr) {
      alert('ERROR IN CHANGE STAT: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
  $.ajax({
    url: 'http://140.116.245.229:3000/ChangeCarAddress',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    dataType: 'json',
    crossDomain: true,
    data: JSON.stringify(dest_data),
    success: function () {},
    error: function (xhr) {
      alert('ERROR IN CHANGE ADDRESS: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
}
async function change_volunteer_status() {
  let have_task = 1;
  let task_descript = document.getElementById('task_descript_button').value;
  let task_dest = document.getElementById('task_dest_button').value;
  let time_phase = [5];
  let error_num = 0;
  for (let i = 0; i < 5; i++) {
    time_phase[i] = document.getElementById('task_button' + (i + 1)).value;
    if (time_phase[i] > 7 || time_phase[i] < 0 || time_phase[i] == '') {
      alert(i + 1 + '號桿輸入錯誤\n範圍: 0~7');
      error_num = 1;
    }
  }
  if (error_num == 1) return;
  let dest_latlng = await get_latlng_v(task_dest);
  tmp =
    String(time_phase[0]) +
    ',' +
    String(time_phase[1]) +
    ',' +
    String(time_phase[2]) +
    ',' +
    String(time_phase[3]) +
    ',' +
    String(time_phase[4]);
  tmp2 = String(dest_latlng);
  tmp2 = tmp2.split(' ');
  lat = tmp2[0];
  lat = lat.split('(');
  lat = lat[1].split(',');
  lng = tmp2[1];
  lng = lng.split(')');

  let num = 0;
  let id = [];
  for (let i = 0; i < Volunteers.length; i++) {
    checkbox = document.getElementById('V_checkbox_' + (i + 1));
    if (checkbox != null) {
      if (checkbox.checked == true) {
        console.log('checked', i);
        num++;
        id.push(i + 1);
        Volunteers[i].have_task = 1;
      }
    }
  }
  console.log(num, id);
  // test_id = [1, 3];
  send_data = {
    nofv: num,
    id: id,
    latitude: parseFloat(lat[0]),
    longitude: parseFloat(lng[0]),
    taskinfo: task_descript,
    lightpoles_phase: tmp,
  };
  send_data = JSON.stringify(send_data);
  console.log(send_data);
  $.ajax({
    url: 'http://140.116.245.229:3000/SetTask',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    dataType: 'json',
    crossDomain: true,
    data: send_data,
    success: function () {},
    error: function (xhr) {
      alert('ERROR IN CHANGE ADDRESS: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
  let return_str = '';
  let area = document.getElementById('SelectArea').value;
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
function change_volunteer_status2() {
  let have_task = 0;
}
