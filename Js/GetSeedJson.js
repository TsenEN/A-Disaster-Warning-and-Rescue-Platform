$(document).ready(function () {
  // Fetch the initial table
  refreshTable();

  //Get firestation first
  GetFireStation();
  //change select bar 1
  $(document).on('change', '#team_1', function () {
    $('#FireStationInfo').html('');
    $('#team_3').html('<option>-分隊-</option>');
    SelectTeam1(this.value);
  });
  //change select bar 2
  $(document).on('change', '#team_2', function () {
    $('#FireStationInfo').html('');
    var element = document.getElementById('team_1');
    SelectTeam2(element.value, this.value);
  });
  //change select bar 3
  $(document).on('change', '#team_3', function () {
    $('#FireStationInfo').html('');
    var element1 = document.getElementById('team_1');
    var element2 = document.getElementById('team_2');
    SelectTeam3(element1.value, element2.value, this.value);
  });
  // //change select bar-map layer
  // $(document).on('change', '#layer_type', function () {
  //   var e = document.getElementById('layer_type');
  //   load_layer(e.value);
  // });
  $(document).on('click', '#layer_1_checkbox', function () {
    var e = document.getElementById('layer_1_checkbox');
    load_layer(e.checked, e.value);
  });
  $(document).on('click', '#layer_2_checkbox', function () {
    var e = document.getElementById('layer_2_checkbox');
    load_layer(e.checked, e.value);
  });
  $(document).on('click', '#layer_3_checkbox', function () {
    var e = document.getElementById('layer_3_checkbox');
    load_layer(e.checked, e.value);
  });
});

function refreshTable() {
  $.ajax({
    type: 'GET',
    url: 'http://140.116.245.229:3000/GetSeedsJson',
    dataType: 'json',
    success: function (JData) {
      var i = 0;
      var SeedsListData = '';
      $.each(JData, function () {
        SeedsListData += '<tr id="rowSeedsStatus" class="">';
        SeedsListData += '<td>' + '北區' + '</td>';
        SeedsListData += '<td>' + JData[i].seed_id + '</td>';
        SeedsListData += '<td>' + JData[i].seed_battery + '</td>';
        SeedsListData += '<td>' + JData[i].seed_status + '</td>';
        SeedsListData += '<td>' + JData[i].seed_latitude + '</td>';
        SeedsListData += '<td>' + JData[i].seed_longitude + '</td>';
        SeedsListData += '</tr>';

        i++;
      });
      $('#SeedsList').html(SeedsListData);
      setTimeout(refreshTable, 1000);
      //Fetch every 1 seconds
    },

    error: function (xhr) {
      alert('ERROR IN SEED: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
  $.ajax({
    //Get Car Json
    type: 'GET',
    url: 'http://140.116.245.229:3000/GetCarsJson',
    dataType: 'json',
    success: function (JData) {
      var i = 0;
      var CarsListData = '';
      var CarStatString = '';
      var CarButtonString = '';
      $.each(JData, function () {
        if (JData[i].car_status == 1) {
          CarStatString = '派遣中';
          CarButtonString =
            '<td><button id = CarButton button_id = "' +
            JData[i].car_license_plate +
            '"stat = 1 class="btn btn-primary  text-light disabled">派遣</button></td>';
        } else {
          CarStatString = '未派遣';
          CarButtonString =
            '<td><button id = CarButton button_id = "' +
            JData[i].car_license_plate +
            '" stat = 0 class="btn btn-primary text-light">派遣</button></td>';
        }
        //for checkbox
        // CarButtonString =
        //   '<td><input type="checkbox" value="活動斷層" id="car_button_' +
        //   JData[i].car_license_plate +
        //   '"><label for="car_button_' +
        //   JData[i].car_license_plate +
        //   '"> ' +
        //   JData[i].car_license_plate +
        //   '</label></td>';
        CarsListData += '<tr id="rowCarsStatus" class="">';
        CarsListData += '<td>' + JData[i].car_license_plate + '</td>';
        CarsListData += '<td>' + CarStatString + '</td>';
        CarsListData += CarButtonString;
        CarsListData += '</tr>';
        i++;
      });
      $('#CarsList').html(CarsListData);
    },

    error: function (xhr) {
      alert('ERROR IN CAR: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
}
