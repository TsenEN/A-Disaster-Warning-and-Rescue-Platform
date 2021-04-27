function add_directions() {
  var request = {
    origin: { lat: 23.0833145, lng: 120.5902528 },
    destination: { lat: 23.070942, lng: 120.551832 },
    travelMode: 'DRIVING',
  };
  directionsService.route(request, function (result, status) {
    if (status == 'OK') {
      // return every step details on the route
      console.log(result.routes[0].legs[0].steps);

      var i;
      for (i = 0; i < result.routes[0].legs[0].steps.length; i++) {
        console.log('step' + i + ' ' + result.routes[0].legs[0].steps[i].path);
      }
      directionsDisplay.setDirections(result);
    } else {
      console.log(status);
    }
  });
}
