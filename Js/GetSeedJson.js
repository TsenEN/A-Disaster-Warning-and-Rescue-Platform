$(document).ready(function() {
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
				$.each(JData, function() {
					SeedsListData += '<tr id="rowSeedsStatus" class="">';
					SeedsListData += '<td>'+'北區'+'</td>';
					SeedsListData += '<td>'+JData[i].seed_id +'</td>';
					SeedsListData += '<td>'+JData[i].seed_battery+'</td>';
					SeedsListData += '<td>'+JData[i].seed_status+'</td>';
					SeedsListData += '<td>'+JData[i].seed_latitude+'</td>';
					SeedsListData += '<td>'+JData[i].seed_longitude+'</td>';
					SeedsListData += '</tr>'; 

				i++;
				});
				$('#SeedsList').html(SeedsListData);
				setTimeout(refreshTable, 1000);
				//Fetch every 1 seconds
			},
			
			error:function(xhr){
				alert("ERROR: " + xhr.status + " " + xhr.statusText);
			},

		});
}	
