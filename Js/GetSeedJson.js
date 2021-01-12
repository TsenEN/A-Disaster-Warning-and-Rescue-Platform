$(document).ready(function () {
	// Fetch the initial table
	refreshTable();
});

function refreshTable() {
	$.ajax({
		type: 'GET',
		url: 'http://140.116.245.229:3000/GetSeedsJson',
		dataType: 'json',
		success: function (JData) {
			var i = 0;
			var SeedsListData = '';
			$.each(JData, function () {
				SeedsListData += '<tr id="rowSeedsStatus" class="">';
				SeedsListData += '<td>' + '北區' + '</td>';
				SeedsListData += '<td>' + JData[i].seed_id + '</td>';
				SeedsListData += '<td>' + JData[i].seed_battery + '</td>';
				SeedsListData += '<td>' + JData[i].seed_status + '</td>';
				SeedsListData += '<td>' + JData[i].seed_latitude + '</td>';
				SeedsListData += '<td>' + JData[i].seed_longitude + '</td>';
				SeedsListData += '</tr>';

				i++;
			});
			$('#SeedsList').html(SeedsListData);
			setTimeout(refreshTable, 1000);
			//Fetch every 1 seconds
		},

		error: function (xhr) {
			alert("ERROR: " + xhr.status + " " + xhr.statusText);
		},

	});
	$.ajax({ //Get Car Json
		type: 'GET',
		url: 'http://140.116.245.229:3000/GetCarsJson',
		dataType: 'json',
		success: function (JData) {
			var i = 0;
			var CarsListData = '';
			var CarStatString = '';
			$.each(JData, function () {
				if (JData[i].car_status == 1) {
					CarStatString = "派遣中";
				}
				else {
					CarStatString = "未派遣";
				}
				CarsListData += '<tr id="rowCarsStatus" class="">';
				CarsListData += '<td>' + JData[i].car_license_plate + '</td>';
				CarsListData += '<td>' + CarStatString + '</td>';
				if (JData[i].car_status == 1) {
					CarsListData += '<td><button id = "CarButton' + JData[i].car_license_plate + '" class="btn btn-primary  text-light disabled">派遣</button></td>';
				}
				else {
					CarsListData += '<td><button id = "CarButton' + JData[i].car_license_plate + '" class="btn btn-primary text-light">派遣</button></td>';
				}
				CarsListData += '</tr>';
				i++;
			});
			$('#CarsList').html(CarsListData);
			setTimeout(refreshTable, 1000000);
			//Fetch every 1 seconds
		},

		error: function (xhr) {
			alert("ERROR: " + xhr.status + " " + xhr.statusText);
		},
	});
}	
