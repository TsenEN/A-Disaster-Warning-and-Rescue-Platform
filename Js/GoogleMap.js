
var locations = [];

function initMap() {
	$.ajax({ 
		type: 'GET', 
		url: 'http://140.116.245.229:3000/GetSeedJson', 
		dataType: 'json',
		success: function (JData) {
			var i = 0; 
			$.each(JData, function() {
				locations[i] = {lat: parseFloat(JData[i].n), lng: parseFloat(JData[i].e)};
				i++;
			});
			const map = new google.maps.Map(document.getElementById("map"), {
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
		
		error:function(xhr){
			alert("ERROR: " + xhr.status + " " + xhr.statusText);
		},

	});

  }

 
 