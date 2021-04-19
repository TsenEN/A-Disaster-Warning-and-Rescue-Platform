let imageBounds = [];
function GetRainDrop() {
  $.ajax({
    type: 'GET',
    url:
      'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-37D2694B-14C9-47FB-BB98-4A36CDABFED5&format=JSON&elementName=HOUR_24&parameterName=CITY',
    dataType: 'json',
    success: function (JData) {
      let raindrop;
      let Kaohsiung_raindrop = [];
      let Tainan_raindrop = [];
      raindrop = JData.records.location;
      let i = 0,
        j = 0,
        k = 0;
      for (i = 0; i < raindrop.length; i++) {
        if (raindrop[i].parameter[0].parameterValue == '高雄市') {
          Kaohsiung_raindrop[j] = raindrop[i];
          j++;
        } else if (raindrop[i].parameter[0].parameterValue == '臺南市') {
          Tainan_raindrop[k] = raindrop[i];
          k++;
        }
      }
      loadkriging(Kaohsiung, 'KaohsiungRainDrop', Kaohsiung_raindrop, 0);
      loadkriging(Tainan, 'TainanRainDrop', Tainan_raindrop, 1);
      setRainImage();
    },

    error: function (xhr) {
      alert('ERROR IN RAINDROP ' + xhr.status + ' ' + xhr.statusText);
    },
  });
}
//Kaohsiung
function loadkriging(city, ele_name, raindrop, pos_num) {
  var pos = [];
  city[0].forEach(function (point) {
    pos.push([point[1], point[0]]);
  });
  var scope = L.polyline(pos, { color: 'red' });

  var xlim = [
    scope.getBounds()._southWest.lng,
    scope.getBounds()._northEast.lng,
  ];
  var ylim = [
    scope.getBounds()._southWest.lat,
    scope.getBounds()._northEast.lat,
  ];
  imageBounds[pos_num] = [
    [ylim[0], xlim[0]],
    [ylim[1], xlim[1]],
  ];
  var canvas = document.getElementById(ele_name);
  canvas.width = 1000;
  canvas.height = 1000;
  var n = raindrop.length;
  var t = [];
  var x = [];
  var y = [];
  for (var i = 0; i < n; i++) {
    if (raindrop[i].weatherElement[0].elementValue < 0) t.push(0.01);
    else if (raindrop[i].weatherElement[0].elementValue == 0) t.push(0.01);
    else t.push(raindrop[i].weatherElement[0].elementValue);
    x.push(raindrop[i].lon);
    y.push(raindrop[i].lat);
  }

  var variogram = kriging.train(t, x, y, 'exponential', 0, 100);

  var grid = kriging.grid(city, variogram, (ylim[1] - ylim[0]) / 350);

  var colors = [
    '#f7fdfd',
    '#69bbce',
    '#68deb7',
    '#e5f584',
    '#f7f18d',
    '#fee08b',
    '#fdae61',
    '#f46d43',
    '#d73027',
    '#d62ed3',
    '#fdcef3',
  ];
  //transparent canvas
  var ctx = canvas.getContext('2d');
  ctx.globalAlpha = 0.69;

  kriging.plot(canvas, grid, [xlim[0], xlim[1]], [ylim[0], ylim[1]], colors);
}

//Kaohsiung
function returnImage() {
  var canvas = document.getElementById('KaohsiungRainDrop');
  return canvas.toDataURL('image/png');
}
//Tainan
function returnImage2() {
  var canvas = document.getElementById('TainanRainDrop');
  return canvas.toDataURL('image/png');
}
