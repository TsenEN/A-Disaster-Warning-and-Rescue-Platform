
$(document).ready(function(){

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
        $("#seedForm").submit();
    });
});
