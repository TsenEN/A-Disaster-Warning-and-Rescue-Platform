let raindrop;
let Kaohsiung_raindrop = [];
let Tainan_raindrop = [];
let imageBounds = [];
function GetRainDrop() {
  $.ajax({
    type: 'GET',
    url:
      'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-37D2694B-14C9-47FB-BB98-4A36CDABFED5&format=JSON&elementName=HOUR_24&parameterName=CITY',
    dataType: 'json',
    success: function (JData) {
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
      console.log(Tainan_raindrop);
      loadkriging();
      loadkriging2();
    },

    error: function (xhr) {
      alert('ERROR IN RAINDROP ' + xhr.status + ' ' + xhr.statusText);
    },
  });
}
//Kaohsiung
function loadkriging() {
  var pos = [];
  Kaohsiung[0].forEach(function (point) {
    pos.push([point[1], point[0]]);
  });
  var scope = L.polyline(pos, { color: 'red' });

  //根据scope边界线的范围，计算范围变量
  var xlim = [
    scope.getBounds()._southWest.lng,
    scope.getBounds()._northEast.lng,
  ];
  var ylim = [
    scope.getBounds()._southWest.lat,
    scope.getBounds()._northEast.lat,
  ];
  imageBounds[0] = [
    [ylim[0], xlim[0]],
    [ylim[1], xlim[1]],
  ];
  var canvas = document.getElementById('KaohsiungRainDrop');
  canvas.width = 1000;
  canvas.height = 1000;
  var n = Kaohsiung_raindrop.length;
  var t = []; //数值
  var x = []; //经度
  var y = []; //纬度
  for (var i = 0; i < n; i++) {
    if (Kaohsiung_raindrop[i].weatherElement[0].elementValue < 0) t.push(0.01);
    else if (Kaohsiung_raindrop[i].weatherElement[0].elementValue == 0)
      t.push(0.01);
    else t.push(Kaohsiung_raindrop[i].weatherElement[0].elementValue);
    x.push(Kaohsiung_raindrop[i].lon);
    y.push(Kaohsiung_raindrop[i].lat);
  }

  //对数据集进行训练
  var variogram = kriging.train(t, x, y, 'exponential', 0, 100);

  //使用variogram对象使polygons描述的地理位置内的格网元素具备不一样的预测值,最后一个参数，是插值格点精度大小
  var grid = kriging.grid(Kaohsiung, variogram, (ylim[1] - ylim[0]) / 350);

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
  var ctx = canvas.getContext('2d');
  ctx.globalAlpha = 0.69;
  //将得到的格网grid渲染至canvas上
  kriging.plot(canvas, grid, [xlim[0], xlim[1]], [ylim[0], ylim[1]], colors);
}
//Tainan
function loadkriging2() {
  var pos = [];
  tainan[0].forEach(function (point) {
    pos.push([point[1], point[0]]);
  });
  var scope = L.polyline(pos, { color: 'red' });

  //根据scope边界线的范围，计算范围变量
  var xlim = [
    scope.getBounds()._southWest.lng,
    scope.getBounds()._northEast.lng,
  ];
  var ylim = [
    scope.getBounds()._southWest.lat,
    scope.getBounds()._northEast.lat,
  ];
  imageBounds[1] = [
    [ylim[0], xlim[0]],
    [ylim[1], xlim[1]],
  ];
  var canvas = document.getElementById('TainanRainDrop');
  canvas.width = 1000;
  canvas.height = 1000;
  var n = Tainan_raindrop.length;
  var t = []; //数值
  var x = []; //经度
  var y = []; //纬度
  for (var i = 0; i < n; i++) {
    if (Tainan_raindrop[i].weatherElement[0].elementValue < 0) t.push(0.01);
    else if (Tainan_raindrop[i].weatherElement[0].elementValue == 0)
      t.push(0.01);
    else t.push(Tainan_raindrop[i].weatherElement[0].elementValue);
    x.push(Tainan_raindrop[i].lon);
    y.push(Tainan_raindrop[i].lat);
  }

  //对数据集进行训练
  var variogram = kriging.train(t, x, y, 'exponential', 0, 100);

  //使用variogram对象使polygons描述的地理位置内的格网元素具备不一样的预测值,最后一个参数，是插值格点精度大小
  var grid = kriging.grid(tainan, variogram, (ylim[1] - ylim[0]) / 350);

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
  var ctx = canvas.getContext('2d');
  ctx.globalAlpha = 0.69;
  //将得到的格网grid渲染至canvas上
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
  return canvas.toDataURL('imagee/png');
}
