
$(document).ready(function () {
  
  var longitudeValue = document.getElementById("longitude").value;
  var latitudeValue = document.getElementById("latitude").value;
  var numberValue = document.getElementById("number").value;

  
  // 獲得焦點時，警告訊息移除
  function focusLongitude(){
    $('#longitude-error').empty();
    $('#longitude').removeClass('errorClass');
  };

  function focuslatitude() {
    $('#latitude-error').empty();
    $('#latitude').removeClass('errorClass');
  };

  function focusNumber() {
    $('#number-error').empty();
    $('#number').removeClass('errorClass');
  };

  // 驗證經度
  function verityLongitude() {
    //console.log(typeof longitudeValue);
    longitudeValue = document.getElementById("longitude").value;
    if (!(/^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/.test(longitudeValue)) || longitudeValue == "") {
      $('#longitude-error').text('請輸入有效經度數值');
      $('#longitude').addClass('errorClass');
      return false;
    } else {
      $('#longitude').addClass('rightClass');
      return true;
    }
  };

  // 驗證緯度
  function veritylatitude() {
    latitudeValue = document.getElementById("latitude").value;
    if (!(/^[\-\+]?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$/.test(latitudeValue)) || latitudeValue == "" ) {
      $('#latitude-error').text('請輸入有效緯度數值');
      $('#latitude').addClass('errorClass');
      return false;
    } else {
      $('#latitude').addClass('rightClass');
      return true;
    }
  };

  // 驗證種子編號：只能是數字
  function verityNumber() {
    numberValue = document.getElementById("number").value;
    if (!(/^[0-9]*$/.test(numberValue)) || numberValue == "" ) {
      $('#number-error').text('請輸入數字');
      $('#number').addClass('errorClass');
      return false;
    } else {
      $('#number').addClass('rightClass');
      return true;
    }
  };
  
  // 監聽事件
  $("#longitude").focus(focusLongitude);
  $("#latitude").focus(focuslatitude);
  $("#number").focus(focusNumber);

  $("#longitude").blur(verityLongitude);
  $("#latitude").blur(veritylatitude);
  $("#number").blur(verityNumber);

  // 數值若正確 button會取消disable狀態
  
  


  // 傳值到彈跳確認視窗
  $("#submitBtn").click(function (event) {
    longitudeValue = document.getElementById("longitude").value;
    latitudeValue = document.getElementById("latitude").value;
    numberValue = document.getElementById("number").value;
    if (longitudeValue == "" || latitudeValue == "" || numberValue == "") {
      alert("欄位不能空白");
      return false;
    } else {
      document.getElementById("longitudeCheck").innerHTML = longitudeValue;
      document.getElementById("latitudeCheck").innerHTML = latitudeValue;
      document.getElementById("numberCheck").innerHTML = numberValue;
      return true;
    }
  });

  // 按下確認鈕後將 form submit 至後端
  $("#confirm").click(function () {
    var seed = [{ seed_id: numberValue, seed_longitude: longitudeValue, seed_latitude: latitudeValue, seed_status: 0}];
    $.ajax({
      type: "POST",
      url: "http://140.116.245.229:3000/RegisterSeeds",
      contentType: "application/json;charset=UTF-8",
      dataType: "json", //宣告用JSON 
      clearForm: true, //發送後清空FORM的值
      data: JSON.stringify(seed),
      headers: { 
        'Access-Control-Allow-Origin': '*'
      },
      success: function (res) {
        console.log(seed);
      },
    });
    $('input').val(""); 
    $('#number').removeClass('rightClass');
    $('#longitude').removeClass('rightClass');
    $('#latitude').removeClass('rightClass');
  });
});

