var car_latlng = new Map();
var car_status = new Map();
var car_last_status = new Map();
let car_markers = [];
var car_cluster;
var locations = [];
let map;
// create direction service and direction display layer
var directionsService;
var directionsDisplay;


function initMap() {
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
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
			//set direction display layer
			directionsDisplay.setMap(map);
			// Create an array of alphabetical characters used to label the markers.
			const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			// Add some markers to the map.
			// Note: The code uses the JavaScript Array.prototype.map() method to
			// create an array of markers based on a given "locations" array.
			// The map() method here has nothing to do with the Google Maps API.

			//blue spot image
			var blue_marker = {
				url: "./Img/blue_spot.png",
				size: new google.maps.Size(42, 42),
				scaledSize: new google.maps.Size(42, 42)
			};


			const markers = locations.map((location, i) => {
				return new google.maps.Marker({
					position: location,
					map: map,
					label: labels[i % labels.length],
					icon: blue_marker,
				});
			});

		},

		error: function (xhr) {
			alert("ERROR: " + xhr.status + " " + xhr.statusText);
		},

	});
	//navigation function
	// add_directions();
}

//for deciding whether set markers to null or not 
var first_load_in = 1;

var interval = setInterval(function () {
	/* do something that will execute every 1000 milliseconds*/
	//set car markers on map

	//edit image size by zoom
	var zoom = map.getZoom();
	var ambu_size;
	if (zoom < 13) {
		ambu_size = new google.maps.Size(21, 9);
	}
	else ambu_size = new google.maps.Size(21 + 3.5 * zoom, 9 + 1.5 * zoom);

	//ambulance marker
	var ambulance_marker = {
		url: "./Img/ambulance_s.png",
		size: ambu_size,
		scaledSize: ambu_size,
	};

	$.ajax({
		url: "http://140.116.245.229:3000/GetCarsJson",
		type: "POST",
		dataType: "json",
		success: function (JData) {
			var NumOfJData = JData.length;
			for (var i = 0; i < NumOfJData; i++) {
				if (first_load_in == 1) {
					car_status.set(JData[i]["car_license_plate"], JData[i]["car_status"]);
					(JData[i]["car_license_plate"], JData[i]["car_status"]);
					car_latlng.set(JData[i]["car_license_plate"], { lat: JData[i]["car_latitude"], lng: JData[i]["car_longitude"] });
					car_markers[i] = new google.maps.Marker({
						position: car_latlng.get(JData[i]["car_license_plate"]),
						icon: ambulance_marker,
						label: JData[i]["car_license_plate"],
						map: null
					});


				}
				else {
					car_status.set(JData[i]["car_license_plate"], JData[i]["car_status"]);
					if (JData[i]["car_status"] == 0) {
						if (car_last_status.get(JData[i]["car_license_plate"]) == 1) {
							car_cluster.removeMarker(car_markers[i], true);
						}
						car_last_status.set(JData[i]["car_license_plate"], 0);
					}
					else {
						if (car_last_status.get(JData[i]["car_license_plate"]) == 0) {
							car_cluster.addMarker(car_markers[i], true);
						}
						car_markers[i].setPosition({ lat: JData[i]["car_latitude"], lng: JData[i]["car_longitude"] });
						car_markers[i].setIcon(ambulance_marker);
						car_last_status.set(JData[i]["car_license_plate"], 1);
					}
				}

			}
			if (first_load_in == 1) {
				car_cluster = new MarkerClusterer(map, car_markers, {
					imagePath:
						"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
				});
				for (var i = 0; i < car_markers.length; i++) {
					if (JData[i]["car_status"] == 0) {
						car_cluster.removeMarker(car_markers[i], true);
					}
				}
			}
			first_load_in = 0;
		},
		error: function () {
			alert("ERROR!!!");
		}
	});
}, 1000);
