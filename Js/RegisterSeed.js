
$(document).ready(function () {

  var longitudeValue = "";
  var latitudeValue = "";
  var numberValue = "";
    // 將input值傳入modal欄位
    $("#formSubmit").click(function () {
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
    });
});
