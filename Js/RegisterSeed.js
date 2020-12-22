
$(document).ready(function(){
    $("#formSubmit").click(function () {
        var longitudeValue = document.getElementById("longitude").value;
        var latitudeValue = document.getElementById("latitude").value;
        var numberValue = document.getElementById("number").value;
        document.getElementById("longitudeCheck").innerHTML = longitudeValue;
        document.getElementById("latitudeCheck").innerHTML = latitudeValue;
        document.getElementById("numberCheck").innerHTML = numberValue;
    });
});
