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
					SeedsListData += '<td>'+JData[i].seedID +'</td>';
					SeedsListData += '<td>'+JData[i].battery+'</td>';
					SeedsListData += '<td>'+JData[i].status+'</td>';
					SeedsListData += '<td>'+JData[i].n+'</td>';
					SeedsListData += '<td>'+JData[i].e+'</td>';
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
