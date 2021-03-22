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
        alert('send json success!');
      },
      error: function (xhr) {
        alert('ERROR IN CHANGE STAT: ' + xhr.status + ' ' + xhr.statusText);
      },
    });
  });
});
