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
