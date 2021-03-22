
function add_directions() {
    var request = {
        origin: { lat: 23.074612, lng: 120.535569 },
        destination: { lat: 23.1234567, lng: 120.5443241 },
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            // return every step details on the route
            console.log(result.routes[0].legs[0].steps);
            //get a point's position(latlng) on the route
            console.log("step" + " 0 " + result.routes[0].legs[0].steps[0].path);
            var point = result.routes[0].legs[0].steps[0].path[5];
            console.log(point.lat());
            console.log(point.lng());
            var i;
            for (i = 0; i < result.routes[0].legs[0].steps.length; i++) {
                console.log("step" + i + " " + result.routes[0].legs[0].steps[i].path);
            }
            directionsDisplay.setDirections(result);
        } else {
            console.log(status);
        }
    })
}