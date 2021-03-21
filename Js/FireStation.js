var FireStations;
function GetFireStation() {
  console.log('outside getfire');
  $.ajax({
    type: 'GET',
    url: 'http://140.116.245.229:3000/GetFireStationJson',
    dataType: 'json',
    success: function (JData) {
      console.log('get fire');
      FireStations = JData;
      var i = 0;
      var team_1 = []; //存大隊資料
      $.each(FireStations, function () {
        team_1[i] = FireStations[i][i].隸屬大隊;
        i++;
      });

      //filter for team_1 array(remove repeated object)
      team_1 = team_1.filter(function (element, index, arr) {
        return arr.indexOf(element) === index;
      });

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
    if (value == FireStations[i][i].隸屬大隊) {
      team_2[j] = FireStations[i][i].隸屬中隊;
      j++;
    }
    i++;
  });

  //filter for team_2 array(remove repeated object)
  team_2 = team_2.filter(function (element, index, arr) {
    return arr.indexOf(element) === index;
  });

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
      value_1 == FireStations[i][i].隸屬大隊 &&
      value_2 == FireStations[i][i].隸屬中隊
    ) {
      team_3[j] = FireStations[i][i].隊名;
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
    if (value_3 == FireStations[i][i].隊名) {
      address_str = FireStations[i][i].地址;
      tel_str = FireStations[i][i].電話號碼;
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
}
