var FireStations;
function GetFireStation() {
  $.ajax({
    type: 'GET',
    url: 'http://140.116.245.229:3000/GetFireStationJson',
    dataType: 'json',
    success: function (JData) {
      FireStations = JData;
      var i = 0;
      var team_1 = []; //存大隊資料
      $.each(FireStations, function () {
        team_1[i] = FireStations[i].brigade;
        i++;
      });

      //filter for team_1 array(remove repeated object)
      team_1 = team_1.filter(function (element, index, arr) {
        return arr.indexOf(element) === index;
      });

      //sort (in chinese)
      let sort_team = [];
      for (i = 0; i < team_1.length; i++) {
        sort_team[i] = team_1[i];
      }
      for (i = 0; i < team_1.length; i++) {
        switch (sort_team[i]) {
          case '第一救災救護大隊':
            team_1[0] = sort_team[i];
            break;
          case '第二救災救護大隊':
            team_1[1] = sort_team[i];
            break;
          case '第三救災救護大隊':
            team_1[2] = sort_team[i];
            break;
          case '第四救災救護大隊':
            team_1[3] = sort_team[i];
            break;
          case '第五救災救護大隊':
            team_1[4] = sort_team[i];
            break;
          case '第六救災救護大隊':
            team_1[5] = sort_team[i];
            break;
        }
      }

      //write back to SeedInfo.html
      var team_1_back = '<option>-大隊-</option>';
      for (i = 0; i < team_1.length; i++) {
        team_1_back += '<option>' + team_1[i] + '</option>';
      }
      $('#team_1').html(team_1_back);
      // 會把寫好的內容填回去 #id .class
    },

    error: function (xhr) {
      alert('ERROR IN GetFireSTation: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
}

function SelectTeam1(value) {
  var team_2 = [];
  var i = 0;
  var j = 0;
  $.each(FireStations, function () {
    if (value == FireStations[i].brigade) {
      team_2[j] = FireStations[i].squadron;
      j++;
    }
    i++;
  });

  //filter for team_2 array(remove repeated object)
  team_2 = team_2.filter(function (element, index, arr) {
    return arr.indexOf(element) === index;
  });

  //sort (in chinese)
  let sort_team = [];
  for (i = 0; i < team_2.length; i++) {
    sort_team[i] = team_2[i];
  }
  for (i = 0; i < team_2.length; i++) {
    switch (sort_team[i]) {
      case '第一中隊':
        team_2[0] = sort_team[i];
        break;
      case '第二中隊':
        team_2[1] = sort_team[i];
        break;
      case '第三中隊':
        team_2[2] = sort_team[i];
        break;
      case '第四中隊':
        team_2[3] = sort_team[i];
        break;
    }
  }

  //write back to SeedInfo.html
  var team_2_back = '<option>-中隊-</option>';

  for (i = 0; i < team_2.length; i++) {
    team_2_back += '<option>' + team_2[i] + '</option>';
  }
  $('#team_2').html(team_2_back);
}

//value 1是大隊value 2是中隊
function SelectTeam2(value_1, value_2) {
  var team_3 = [];
  var i = 0;
  var j = 0;
  $.each(FireStations, function () {
    if (
      value_1 == FireStations[i].brigade &&
      value_2 == FireStations[i].squadron
    ) {
      team_3[j] = FireStations[i].team_name;
      j++;
    }
    i++;
  });

  //filter for team_2 array(remove repeated object)
  team_3 = team_3.filter(function (element, index, arr) {
    return arr.indexOf(element) === index;
  });

  //write back to SeedInfo.html
  var team_3_back = '<option>-分隊-</option>';
  for (i = 0; i < team_3.length; i++) {
    team_3_back += '<option>' + team_3[i] + '</option>';
  }
  $('#team_3').html(team_3_back);
}

function SelectTeam3(value_1, value_2, value_3) {
  if (value_3 == '-分隊-') {
    var back = '';
    $('#FireStationInfo').html(back);
    return;
  }
  var i = 0;
  var address_str = '';
  var tel_str = '';
  $.each(FireStations, function () {
    if (value_3 == FireStations[i].team_name) {
      address_str = FireStations[i].address;
      tel_str = FireStations[i].phone_number;
    }
    i++;
  });

  var back =
    '<p>結果: <strong>' +
    value_1 +
    '>' +
    value_2 +
    '>' +
    value_3 +
    '</strong><br>．地址: ' +
    address_str +
    '<br>．電話: ' +
    tel_str +
    '</p>';
  $('#FireStationInfo').html(back);
  $.ajax({
    //Get Car Json
    type: 'GET',
    url: 'http://140.116.245.229:3000/GetCarsJson',
    dataType: 'json',
    success: function (JData) {
      var i = 0;
      var j = 0;
      var CarsListData = '';
      var CarCheckboxString = '';
      //checkbarstring2 for reset
      var CarCheckboxString2 = '';
      $.each(JData, function () {
        if (value_3 == JData[i].team_name) {
          CarCheckboxString =
            '<td><input type="checkbox"  id="car_checkbox_' +
            j +
            '" ' +
            (JData[i].car_status ? 'disabled="true"' : ' ') +
            'car_license_plate=' +
            JData[i].car_license_plate +
            '></td>';
          CarCheckboxString2 =
            '<td><input type="checkbox"  id="car_checkbox2_' +
            j +
            '" ' +
            (JData[i].car_status ? '' : 'disabled="true" ') +
            'car_license_plate=' +
            JData[i].car_license_plate +
            '></td>';
          CarsListData +=
            '<tr id="rowCarsStatus' +
            JData[i].car_license_plate +
            '" class="">';
          CarsListData += '<td>' + JData[i].car_license_plate + '</td>';
          CarsListData +=
            '<td>' + (JData[i].car_status ? '值勤中' : '待命中') + '</td>';
          CarsListData += CarCheckboxString;
          CarsListData += CarCheckboxString2;
          CarsListData += '</tr>';
          j++;
        }
        i++;
      });
      $('#CarsList').html(CarsListData);
    },

    error: function (xhr) {
      alert('ERROR IN CAR: ' + xhr.status + ' ' + xhr.statusText);
    },
  });
}
