$(document).ready(function () {
	// Fetch the initial table
	refreshTable();
	// $(document).on('click', '.updateButton', function () {

	// 	var member_id = $(this).attr('member_id');

	// 	var name = $('#nameInput' + member_id).val();
	// 	var email = $('#emailInput' + member_id).val();

	// 	req = $.ajax({
	// 		url: '/update',
	// 		type: 'POST',
	// 		data: { name: name, email: email, id: member_id }
	// 	});

	// 	req.done(function (data) {

	// 		$('#memberSection' + member_id).fadeOut(1000).fadeIn(1000);
	// 		//$('#memberNumber'+member_id).text(data.member_num);
	// 		$('#memberSection' + member_id).html(data);

	// 	});
	// });
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
					CarButtonString = '<td><button id = CarButton button_id = ' + JData[i].car_license_plate + '" class="btn btn-primary  text-light disabled">派遣</button></td>'
				}
				else {
					CarStatString = "未派遣";
					CarButtonString = '<td><button id = CarButton button_id = ' + JData[i].car_license_plate + '" class="btn btn-primary text-light">派遣</button></td>'
				}
				CarsListData += '<tr id="rowCarsStatus" class="">';
				CarsListData += '<td>' + JData[i].car_license_plate + '</td>';
				CarsListData += '<td>' + CarStatString + '</td>';
				CarsListData += CarButtonString;
				CarsListData += '</tr>';
				i++;
			});
			$('#CarsList').html(CarsListData);
			//Fetch every 1.5 seconds
		},

		error: function (xhr) {
			alert("ERROR IN CAR: " + xhr.status + " " + xhr.statusText);
		},
	});
}	
