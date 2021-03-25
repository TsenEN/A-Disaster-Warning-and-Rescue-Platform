$(document).ready(function () {
  //button change car stat
  $(document).on('click', '#CarButton', function () {
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
