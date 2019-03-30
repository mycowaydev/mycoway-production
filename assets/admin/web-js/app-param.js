
$('.datepicker').datetimepicker({
	format: 'YYYY-MM-DD',
	allowInputToggle: true
});

// var searchData = new FormData();
$("#advanced_search").on('click', function (e) {
	e.preventDefault();

	// searchData = new FormData();
	// searchData.append('key', $("[name=key]").val());
	// searchData.append('value', $("[name=value]").val());
	// searchData.append('remarks', $("[name=remarks]").val());
	// searchData.append('fdate', $("[name=fdate]").val());
	// searchData.append('tdate', $("[name=tdate]").val());
	// searchData.append('page', 1);
	// searchData.append('length', 10);

	//console.log(searchData);
	console.log("advanced_search");
	fill_datatable();
})

$.fn.dataTable.render.ellipsis = function (ellipsisLength) {
	ellipsisLength = ellipsisLength ? ellipsisLength : 12;
	return function (data, type, row) {
		return type == 'display' && data.length > ellipsisLength
			? data.substr(0, ellipsisLength) + '…'
			: data;
	}
};

fill_datatable();
function fill_datatable() {

	console.log("fill_datatable");

	let key = $("[name=key]").val();
	let value = $("[name=value]").val();
	let remarks = $("[name=remarks]").val();
	let fdate = $("[name=fdate]").val();
	let tdate = $("[name=tdate]").val();

	$('#table').DataTable().destroy();
	$("#table").DataTable({

		paging: true,
		pageLength: 10,
		processing: true,
		serverSide: true,
		searching: false,
		dom: 'Rlfrtip',
		colReorder: {
			//fixedColumnsLeft: 1,
			allowReorder: false
		},
		ajax: {
			url: "/admin-get-app-param-list",
			type: "POST",
			data: {
				key: key, value: value, remarks: remarks, fdate: fdate, tdate: tdate
			}
		},
		columns: [
			{ data: 'action', orderable: false },
			{ data: 'key' },
			{ data: 'value' },
			{ data: 'remarks' },
			{ data: 'opr_date' },
		],
		columnDefs: [
			{ orderable: true, "targets": "_all" },
			{ orderData: [1], "targets": 1 },
			{ orderData: [2], "targets": 2 },
			{ orderData: [3], "targets": 3 },
			{ orderData: [4], "targets": 4 },

			{ targets: 1, render: $.fn.dataTable.render.ellipsis() },
			{ targets: 2, render: $.fn.dataTable.render.ellipsis(72) },
			{ width: "10%", "targets": 0 },
			{ width: "15%", "targets": 1 },
			{ width: "30%", "targets": 2 },
			{ width: "30%", "targets": 3 },
			{ width: "10%", "targets": 4 },
		],
		order: [[4, 'desc']]
		//order: [[4, 'desc'], [1, 'asc']]
	});
	//new $.fn.dataTable.ColReorder(table);
}


//adminGetAppParamList();
// function adminGetAppParamList() {
// 	fetch('/admin-get-app-param-list', { method: 'POST', body: searchData })
// 		.then(function (res) {
// 			if (res.ok) {
// 				return res.json();
// 			}
// 			notify_req_failed();
// 		})
// 		.then(function (result) {
// 			var statusCode = result.status_code;
// 			if (statusCode == '100') {
// 				var data = result.data.app_param_list;
// 				for (var i in data) {
// 					data[i]['action'] = '<a href="/adminer/edit-app-param?key=' + data[i]['key'] + '" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i> Edit</a>';
// 				}
// 				table.clear();

// 				table.rows.add(data).draw();
// 			} else {
// 				var errors = result.error;
// 				if (errors && errors.length > 0) {
// 					notify_err(errors[0].message);
// 				}
// 			}
// 		})
// 		.catch(function (err) {
// 			console.log(err);
// 			console.log(JSON.stringify(err));
// 			notify_server_err();
// 		});
// }
