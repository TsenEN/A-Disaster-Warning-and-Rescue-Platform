//unsend to send
function change_status() {
  //suppose that there are only three cars
  let car1 = document.getElementById('car_checkbox_0');
  let car2 = document.getElementById('car_checkbox_1');
  let car3 = document.getElementById('car_checkbox_2');
  let dest_element = document.getElementById('destination_button');
  let dest_info = dest_element.value;
  let data = [];
  let dest_data = [];
  let tmp_data;
  let i = 0;
  let car_license_plate = $(car1).attr('car_license_plate');
  if (car1.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 1 };
    data[i] = tmp_data;
    tmp_data = { car_license_plate: car_license_plate, car_where: dest_info };
    dest_data[i] = tmp_data;
    i++;
  }
  car_license_plate = $(car2).attr('car_license_plate');
  if (car2.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 1 };
    data[i] = tmp_data;
    tmp_data = { car_license_plate: car_license_plate, car_where: dest_info };
    dest_data[i] = tmp_data;
    i++;
  }
  car_license_plate = $(car3).attr('car_license_plate');
  if (car3.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 1 };
    data[i] = tmp_data;
    tmp_data = { car_license_plate: car_license_plate, car_where: dest_info };
    dest_data[i] = tmp_data;
    i++;
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
  let car1 = document.getElementById('car_checkbox2_0');
  let car2 = document.getElementById('car_checkbox2_1');
  let car3 = document.getElementById('car_checkbox2_2');
  let data = [];
  let dest_data = [];
  let tmp_data;
  let i = 0;
  let car_license_plate = $(car1).attr('car_license_plate');
  if (car1.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 0 };
    data[i] = tmp_data;
    tmp_data = { car_license_plate: car_license_plate, car_where: ' ' };
    dest_data[i] = tmp_data;
    i++;
  }
  car_license_plate = $(car2).attr('car_license_plate');
  if (car2.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 0 };
    data[i] = tmp_data;
    tmp_data = { car_license_plate: car_license_plate, car_where: ' ' };
    dest_data[i] = tmp_data;
    i++;
  }
  car_license_plate = $(car3).attr('car_license_plate');
  if (car3.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 0 };
    data[i] = tmp_data;
    tmp_data = { car_license_plate: car_license_plate, car_where: ' ' };
    dest_data[i] = tmp_data;
    i++;
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
