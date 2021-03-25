$(document).ready(function () {
  // Fetch the initial table
  refreshTable();

  //Get firestation first
  GetFireStation();
  //change select bar 1
  $(document).on('change', '#team_1', function () {
    $('#FireStationInfo').html('');
    $('#CarsList').html('');
    $('#team_3').html('<option>-分隊-</option>');
    SelectTeam1(this.value);
  });
  //change select bar 2
  $(document).on('change', '#team_2', function () {
    $('#FireStationInfo').html('');
    $('#CarsList').html('');
    var element = document.getElementById('team_1');
    SelectTeam2(element.value, this.value);
  });
  //change select bar 3
  $(document).on('change', '#team_3', function () {
    $('#FireStationInfo').html('');
    $('#CarsList').html('');
    var element1 = document.getElementById('team_1');
    var element2 = document.getElementById('team_2');
    SelectTeam3(element1.value, element2.value, this.value);
  });
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
  $(document).on('click', '#layer_4_checkbox', function () {
    var e = document.getElementById('layer_4_checkbox');
    load_layer(e.checked, e.value);
  });
  $(document).on('click', '#rain_layer_checkbox', function () {
    var e = document.getElementById('rain_layer_checkbox');
    load_layer(e.checked, e.value);
  });
});
