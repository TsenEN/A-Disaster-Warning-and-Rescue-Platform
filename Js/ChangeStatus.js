$(document).ready(function () {
  //button change car stat
  $(document).on('click', '#CarButtonssss', function () {
    var car_license_plate = $(this).attr('button_id');
    var stat = $(this).attr('stat');
    if (stat == 1) {
      stat = 0;
    } else {
      stat = 1;
    }
    var data = [{ car_license_plate: car_license_plate, car_status: stat }];
    $.ajax({
      url: 'http://140.116.245.229:3000/ChangeCarStatus',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'json',
      crossDomain: true,
      data: JSON.stringify(data),
      success: function () {
        var CarsListData = '';
        var CarStatString = '';
        var CarButtonString = '';
        if (stat == 1) {
          CarStatString = '派遣中';
          CarButtonString =
            '<td><button id = CarButton button_id = "' +
            car_license_plate +
            '"stat = 1 class="btn btn-primary  text-light disabled">派遣</button></td>';
        } else {
          CarStatString = '未派遣';
          CarButtonString =
            '<td><button id = CarButton button_id = "' +
            car_license_plate +
            '" stat = 0 class="btn btn-primary text-light">派遣</button></td>';
        }
        CarsListData += '<td>' + car_license_plate + '</td>';
        CarsListData += '<td>' + CarStatString + '</td>';
        CarsListData += CarButtonString;
        $('#rowCarsStatus' + car_license_plate).html(CarsListData);
      },
      error: function (xhr) {
        alert('ERROR IN CHANGE STAT: ' + xhr.status + ' ' + xhr.statusText);
      },
    });
  });
});
function change_status() {
  //suppose that there are only three cars
  let car1 = document.getElementById('car_checkbox_0');
  let car2 = document.getElementById('car_checkbox_1');
  let car3 = document.getElementById('car_checkbox_2');
  let data = [];
  let tmp_data;
  let i = 0;
  let car_license_plate = $(car1).attr('car_license_plate');
  if (car1.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 1 };
    data[i] = tmp_data;
    i++;
  }
  car_license_plate = $(car2).attr('car_license_plate');
  if (car2.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 1 };
    data[i] = tmp_data;
    i++;
  }
  car_license_plate = $(car3).attr('car_license_plate');
  if (car3.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 1 };
    data[i] = tmp_data;
    i++;
  }
  $.ajax({
    url: 'http://140.116.245.229:3000/ChangeCarStatus',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    dataType: 'json',
    crossDomain: true,
    data: JSON.stringify(data),
    success: function () {
      alert('success');
    },
    error: function (xhr) {
      alert('ERROR IN CHANGE STAT: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
}
function change_status2() {
  //suppose that there are only three cars
  let car1 = document.getElementById('car_checkbox2_0');
  let car2 = document.getElementById('car_checkbox2_1');
  let car3 = document.getElementById('car_checkbox2_2');
  let data = [];
  let tmp_data;
  let i = 0;
  let car_license_plate = $(car1).attr('car_license_plate');
  if (car1.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 0 };
    data[i] = tmp_data;
    i++;
  }
  car_license_plate = $(car2).attr('car_license_plate');
  if (car2.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 0 };
    data[i] = tmp_data;
    i++;
  }
  car_license_plate = $(car3).attr('car_license_plate');
  if (car3.checked == true) {
    tmp_data = { car_license_plate: car_license_plate, car_status: 0 };
    data[i] = tmp_data;
    i++;
  }
  $.ajax({
    url: 'http://140.116.245.229:3000/ChangeCarStatus',
    type: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    dataType: 'json',
    crossDomain: true,
    data: JSON.stringify(data),
    success: function () {
      alert('success');
    },
    error: function (xhr) {
      alert('ERROR IN CHANGE STAT: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
}
