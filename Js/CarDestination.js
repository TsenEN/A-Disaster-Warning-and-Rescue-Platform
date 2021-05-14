//for destination info
function sent_car(plate, car_destination, kind, team_name) {
  this.plate = plate;
  this.car_destination = car_destination;
  this.kind = kind;
  this.team_name = team_name;
}
let sent_cars_dest = [];
function reset_dest_info() {
  let destinations = [];

  for (let i = 0; i < sent_cars_dest.length; i++) {
    destinations.push(sent_cars_dest[i].car_destination);
  }
  //remove repeated index
  destinations = destinations.filter(function (element, index, arr) {
    return arr.indexOf(element) === index;
  });
  let return_str = '<option>-選擇目的地-</option>';
  //sort
  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i] == '') {
      let tmp = destinations[destinations.length - 1];
      destinations[destinations.length - 1] = destinations[i];
      destinations[i] = tmp;
    }
  }
  for (let i = 0; i < destinations.length; i++) {
    if (destinations[i] == '') {
      return_str += '<option>未知</option>';
    } else return_str += '<option>' + destinations[i] + '</option>';
  }
  $('#dest').html(return_str);
}
function look_up_dest_old(destination) {
  let return_str = '<p><strong>前往車輛: &nbsp</strong>';
  for (let i = 0; i < sent_cars_dest.length; i++) {
    if (sent_cars_dest[i].car_destination == destination) {
      return_str += sent_cars_dest[i].plate + '&nbsp';
    } else if (destination == '未知') {
      if (sent_cars_dest[i].car_destination == '')
        return_str += sent_cars_dest[i].plate + '&nbsp';
    }
  }
  return_str += '</p>';
  $('#car_dest_info').html(return_str);
}
function look_up_dest(destination) {
  if (destination == '-選擇目的地-') {
    $('#car_dest_info').html('');
    return;
  }
  let return_str = '<p><strong>前往車輛: &nbsp</strong></p>';
  return_str +=
    '<table class="table table-bordered table-hover" id="dest_table"><thead class="thead-light"><tr><td Align="Center" scope="col"><B>車牌</B></Td><td Align="Center" scope="col"><B>隸屬分隊</B></Td><td Align="Center" scope="col"><B>大隊>>中隊</B></Td></tr></thead><tbody>';
  for (let i = 0; i < sent_cars_dest.length; i++) {
    if (sent_cars_dest[i].car_destination == destination) {
      let tmp_b = firestation_brigade.get(sent_cars_dest[i].team_name);
      let tmp_s = firestation_squadron.get(sent_cars_dest[i].team_name);
      return_str +=
        '<tr><td><span class="badge badge-secondary">' +
        (sent_cars_dest[i].kind ? '消防車' : '救護車') +
        '</span><br>' +
        sent_cars_dest[i].plate +
        '</td>' +
        '<td>' +
        sent_cars_dest[i].team_name +
        '</td><td>' +
        tmp_b +
        '>>' +
        tmp_s +
        '</td></tr>';
    } else if (destination == '未知') {
      if (sent_cars_dest[i].car_destination == '') {
        let tmp_b = firestation_brigade.get(sent_cars_dest[i].team_name);
        let tmp_s = firestation_squadron.get(sent_cars_dest[i].team_name);
        return_str +=
          '<tr><td><span class="badge badge-secondary">' +
          (sent_cars_dest[i].kind ? '消防車' : '救護車') +
          '</span><br>' +
          sent_cars_dest[i].plate +
          '</td>' +
          '<td>' +
          sent_cars_dest[i].team_name +
          '</td><td>' +
          tmp_b +
          '>>' +
          tmp_s +
          '</td></tr>';
      }
    }
  }
  return_str += '</tbody></table>';
  $('#car_dest_info').html(return_str);
}
