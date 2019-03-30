
$('.datepicker').datetimepicker({
	format: 'YYYY-MM-DD',
	allowInputToggle: true
});

$("#advanced_search").on('click', function (e) {
	e.preventDefault();
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

			// { targets: 1, render: $.fn.dataTable.render.ellipsis() },
			// { targets: 2, render: $.fn.dataTable.render.ellipsis(72) },
			{ width: "10%", "targets": 0 },
			{ width: "15%", "targets": 1 },
			{ width: "30%", "targets": 2 },
			{ width: "30%", "targets": 3 },
			{ width: "10%", "targets": 4 },
		],
		order: [[4, 'desc']]
	});
}