$(document).ready(function () {
  //Get firestation first
  GetFireStation();
  let retun_tmp =
    "<tr><td Align='Center' scope='col'>-先選擇消防隊-</Td><td Align='Center' scope='col'>-先選擇消防隊-</Td><td Align='Center' scope='col'>-先選擇消防隊-</Td><td Align='Center' scope='col'>-先選擇消防隊-</Td></tr>";
  //change select bar 1
  $(document).on('change', '#team_1', function () {
    $('#FireStationInfo').html('');
    $('#CarsList').html(retun_tmp);
    $('#team_3').html('<option>-分隊-</option>');
    SelectTeam1(this.value);
  });
  //change select bar 2
  $(document).on('change', '#team_2', function () {
    $('#FireStationInfo').html('');
    $('#CarsList').html(retun_tmp);
    var element = document.getElementById('team_1');
    SelectTeam2(element.value, this.value);
  });
  //change select bar 3
  $(document).on('change', '#team_3', function () {
    $('#FireStationInfo').html('');
    $('#CarsList').html(retun_tmp);
    var element1 = document.getElementById('team_1');
    var element2 = document.getElementById('team_2');
    SelectTeam3(element1.value, element2.value, this.value);
  });
  $(document).on('click', '#layer_1_checkbox', function () {
    var e = document.getElementById('layer_1_checkbox');
    show_layer(e.checked, e.value);
  });
  $(document).on('click', '#layer_2_checkbox', function () {
    var e = document.getElementById('layer_2_checkbox');
    show_layer(e.checked, e.value);
  });
  $(document).on('click', '#layer_3_checkbox', function () {
    var e = document.getElementById('layer_3_checkbox');
    show_layer(e.checked, e.value);
  });
  $(document).on('click', '#layer_4_checkbox', function () {
    var e = document.getElementById('layer_4_checkbox');
    show_layer(e.checked, e.value);
  });
  $(document).on('click', '#rain_layer_checkbox', function () {
    var e = document.getElementById('rain_layer_checkbox');
    show_layer(e.checked, e.value);
  });
  $(document).on('click', '#CarButton', function () {
    change_status();
  });
  $(document).on('click', '#CarButtonReset', function () {
    change_status2();
  });
  //change car dest select bar
  $(document).on('change', '#dest', function () {
    $('#car_dest_info').html('');
    var element = document.getElementById('dest');
    look_up_dest(element.value);
  });
});
