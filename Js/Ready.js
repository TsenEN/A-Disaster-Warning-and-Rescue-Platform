$(document).ready(function () {
  let retun_tmp =
    "<tr><td Align='Center' scope='col'>-</Td><td Align='Center' scope='col'>-</Td><td Align='Center' scope='col'>-</Td><td Align='Center' scope='col'>-</Td></tr>";
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
  //switching send cars department(select container: for select bars)
  $(document).on('click', '#SwitchFire', function () {
    let return_string =
      '<div id=SelectFireStation><div class="form-group"><div class="row"><div class="col"><select class="form-control text-dark" id="team_1"><option>-大隊-</option></select></div><div class="col"><select class="form-control text-dark" id="team_2"><option>-中隊-</option></select></div><div class="col"><select class="form-control text-dark" id="team_3"><option>-分隊-</option></select></div></div></div></div><div id=FireStationInfo><!--for fire station information --></div>';
    $('#SelectContainer').html(return_string);
    $('#CarsList').html(retun_tmp);
    $('#CarContainer').show();
    $('#VolunteerContainer').hide();
    SetFireStation();
  });

  $(document).on('click', '#SwitchVolunteer', function () {
    let return_select =
      '<div id=SelectAreaContainer class="form-group"><div class="row"><div class="col"><select class="form-control text-dark" id="SelectArea"><option>-選擇區域-</option></select></div></div></div>';
    return_tmp =
      "<tr><td Align='Center' scope='col'>-</Td><td Align='Center' scope='col'>-</Td><td Align='Center' scope='col'>-</Td><td Align='Center' scope='col'>-</Td></tr>";

    $('#SelectContainer').html(return_select);
    $('#VolunteerList').html(retun_tmp);
    $('#VolunteerContainer').show();
    $('#CarContainer').hide();
  });
  //test zoom in
  // $(document).on('click', '#rowCarsStatus_0', function () {
  //   alert('click 0');
  // });
  // $(document).on('click', '#rowCarsStatus_1', function () {
  //   alert('click 1');
  // });
  // $(document).on('click', '#rowCarsStatus_2', function () {
  //   alert('click 2');
  // });
});
