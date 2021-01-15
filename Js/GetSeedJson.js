$(document).ready(function () {
	// Fetch the initial table
	refreshTable();
	//button change car stat
	$(document).on('click', '#CarButton', function () {
		var car_license_plate = $(this).attr('button_id');
		var stat = $(this).attr('stat');
		if (stat == 1) {
			stat = 0;
		}
		else {
			stat = 1;
		}
		var data = [{ "car_license_plate": car_license_plate, "car_status": stat }];
		$.ajax({
			url: 'http://140.116.245.229:3000/ChangeCarStatus',
			type: 'POST',
			contentType: 'application/x-www-form-urlencoded',
			dataType: "json",
			crossDomain: true,
			data: JSON.stringify(data),
			success: function () {
				alert("send json success!");
			},
			error: function (xhr) {
				alert("ERROR IN CHANGE STAT: " + xhr.status + " " + xhr.statusText);
			},
		});

	});
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
			alert("ERROR IN SEED: " + xhr.status + " " + xhr.statusText);
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
			var CarButtonString = '';
			$.each(JData, function () {
				if (JData[i].car_status == 1) {
					CarStatString = "派遣中";
					CarButtonString = '<td><button id = CarButton button_id = "' + JData[i].car_license_plate + '"stat = 1 class="btn btn-primary  text-light disabled">派遣</button></td>'
				}
				else {
					CarStatString = "未派遣";
					CarButtonString = '<td><button id = CarButton button_id = "' + JData[i].car_license_plate + '" stat = 0 class="btn btn-primary text-light">派遣</button></td>'
				}
				CarsListData += '<tr id="rowCarsStatus" class="">';
				CarsListData += '<td>' + JData[i].car_license_plate + '</td>';
				CarsListData += '<td>' + CarStatString + '</td>';
				CarsListData += CarButtonString;
				CarsListData += '</tr>';
				i++;
			});
			$('#CarsList').html(CarsListData);
		},

		error: function (xhr) {
			alert("ERROR IN CAR: " + xhr.status + " " + xhr.statusText);
		},
	});
}	
