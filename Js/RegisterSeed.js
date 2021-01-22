
$(document).ready(function () {
  
  var longitudeValue = "";
  var latitudeValue = "";
  var numberValue = "";
  $('.btn').on('click', function () {
    $('.btn').toggleClass('active');
  });

  $("#submitBtn").click(function (event) {
    longitudeValue = document.getElementById("longitude").value;
    latitudeValue = document.getElementById("latitude").value;
    numberValue = document.getElementById("number").value;
    
    // if ($(this)[0].checkValidity() === false) {
    //   event.preventDefault();// 阻止提交表单
    //   event.stopPropagation();
    //   $(this).addClass("was-validated");
    // }
    // else {
    //   $('#modal').modal('show');
    //   document.getElementById("longitudeCheck").innerHTML = longitudeValue;
    //   document.getElementById("latitudeCheck").innerHTML = latitudeValue;
    //   document.getElementById("numberCheck").innerHTML = numberValue;
    // }
    
    // $('.btn').toggleClass('active');
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

// function checkform(form) {

//   if (readcount == 0) {
//     return false;
//   }
//   return true;
// };

