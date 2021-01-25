
$(document).ready(function () {
  
  var longitudeValue = document.getElementById("longitude").value;
  var latitudeValue = document.getElementById("latitude").value;
  var numberValue = document.getElementById("number").value;
  // var longitudeValue = parseInt($('#longitude').val());
  // var latitudeValue = parseInt($('#latitude').val());
  // var numberValue = parseInt($('#number').val());

  $("#longitude").blur(function () {
    console.log(typeof longitudeValue);
    if (longitudeValue == "" || longitudeValue.length > 8 || longitudeValue.length < 13 || longitudeValue <= 180 || longitudeValue >= -180 ) {
      $('#error-feedback').addClass('error-feedback');
      $('.error-feedback').text('請輸入有效數值，長度為9到12碼');
      $('#longitude').addClass('errorClass');
      return false;
    } else {
      $('#error-feedback').removeClass('error-class');
      // modal.show
      console.log("有效數值");
      return true;
    }
  });

  $("#latitude").blur(function () {

    if (latitudeValue == "" || latitudeValue.length < 8 || latitudeValue.length > 12 || -180 <= latitudeValue <= 180) {

    } else {

    }
  });

  $("#submitBtn").click(function (event) {
    var longitudeValue = document.getElementById("longitude").value;
    var latitudeValue = document.getElementById("latitude").value;
    var numberValue = document.getElementById("number").value;
    
    document.getElementById("longitudeCheck").innerHTML = longitudeValue;
    document.getElementById("latitudeCheck").innerHTML = latitudeValue;
    document.getElementById("numberCheck").innerHTML = numberValue;
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
  });
});

// function checkform(form) {

//   if (readcount == 0) {
//     return false;
//   }
//   return true;
// };

