var car_latlng = new Map();
var car_status = new Map();
let car_markers = [];
var locations = [];
let map;
function initMap() {

	$.ajax({
		type: 'GET',
		url: 'http://140.116.245.229:3000/GetSeedsJson',
		dataType: 'json',
		success: function (JData) {
			var i = 0;
			$.each(JData, function () {
				locations[i] = { lat: parseFloat(JData[i].seed_latitude), lng: parseFloat(JData[i].seed_longitude) };
				i++;
			});
			map = new google.maps.Map(document.getElementById("map"), {
				zoom: 8,
				center: { lat: 23.745523, lng: 120.912494 },
			});
			// Create an array of alphabetical characters used to label the markers.
			const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			// Add some markers to the map.
			// Note: The code uses the JavaScript Array.prototype.map() method to
			// create an array of markers based on a given "locations" array.
			// The map() method here has nothing to do with the Google Maps API.
			const markers = locations.map((location, i) => {
				return new google.maps.Marker({
					position: location,
					label: labels[i % labels.length],
				});
			});

			// Add a marker clusterer to manage the markers.
			new MarkerClusterer(map, markers, {
				imagePath:
					"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
			});
		},

		error: function (xhr) {
			alert("ERROR: " + xhr.status + " " + xhr.statusText);
		},

	});
	setAllCarMarkers();
}
var count = 0;
function setAllCarMarkers() {
	for (var i = 0; i < 100; i++) {
		car_markers[i] = new google.maps.Marker({
			position: null,
			map: null,
			icon: './Img/ambulance_s.png',
			label: null
		});
		//alert(" " + car_markers[i]);
	}
}
var interval = setInterval(function () {
	/* do something that will execute every 3000 milliseconds*/
	$.ajax({
		url: "http://140.116.245.229:3000/GetCarsJson",
		type: "POST",
		dataType: "json",
		success: function (JData) {
			var NumOfJData = JData.length;
			for (var i = 0; i < NumOfJData; i++) {
				car_status.set(JData[i]["car_license_plate"], JData[i]["car_status"]);
				car_latlng.set(JData[i]["car_license_plate"], { lat: JData[i]["car_latitude"], lng: JData[i]["car_longitude"] });
				car_markers[i].setMap(map);
				car_markers[i].setLabel(JData[i]["car_license_plate"]);
				car_markers[i].setPosition(car_latlng.get(JData[i]["car_license_plate"]));
				if (JData[i]["car_status"] == 0) {
					car_markers[i].setMap(null);
				}
				else {
					car_markers[i].setMap(map);
				}
				count = count + 0.1;

			}
		},
		error: function () {
			alert("ERROR!!!");
		}
	});
}, 1000);

