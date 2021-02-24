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
        var tmp_string =
          'FireStations.' + Object.keys(FireStations)[i] + '.隸屬大隊';
        team_1[i] = eval(tmp_string);
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
      //$('#SeedsList').html(SeedsListData); 會把寫好的內容填回去 #id .class
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
    var tmp_string =
      'FireStations.' + Object.keys(FireStations)[i] + '.隸屬大隊';
    if (value == eval(tmp_string)) {
      var tmp_string_2 =
        'FireStations.' + Object.keys(FireStations)[i] + '.隸屬中隊';
      team_2[j] = eval(tmp_string_2);
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
    var tmp_string =
      'FireStations.' + Object.keys(FireStations)[i] + '.隸屬大隊';
    var tmp_string_2 =
      'FireStations.' + Object.keys(FireStations)[i] + '.隸屬中隊';
    if (value_1 == eval(tmp_string) && value_2 == eval(tmp_string_2)) {
      var tmp_string_3 =
        'FireStations.' + Object.keys(FireStations)[i] + '.單位名稱';
      team_3[j] = eval(tmp_string_3);
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
  var address_str = '';
  var tel_str = '';
  address_str = eval('FireStations.' + value_3 + '.地址');
  tel_str = eval('FireStations.' + value_3 + '.電話號碼');
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
