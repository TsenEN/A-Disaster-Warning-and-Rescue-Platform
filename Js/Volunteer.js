let Volunteers;
function get_latlng_v(destination) {
  var geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: destination }, function (results, status) {
      if (status == 'OK') {
        resolve(results[0].geometry.location);
      } else {
        alert('error in get get latlng v');
        reject('error');
      }
    });
  });
}
//要寫選擇區域的設定
