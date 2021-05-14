//for destination info
function sent_car(plate, car_destination) {
  this.plate = plate;
  this.car_destination = car_destination;
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
function look_up_dest(destination) {
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
