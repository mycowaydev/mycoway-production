
$('.datepicker').datetimepicker({
    format: 'YYYY-MM-DD',
    allowInputToggle: true
});

var searchData = new FormData();
$("#advanced_search").on('click', function(e) {
	e.preventDefault();
	
	searchData = new FormData();
	searchData.append('product_id', $("[name=product_id]").val());
	searchData.append('title', $("[name=title]").val());
	searchData.append('fdate', $("[name=fdate]").val());
	searchData.append('tdate', $("[name=tdate]").val());

	adminGetProductList();
})

$.fn.dataTable.render.ellipsis = function (ellipsisLength) {
	ellipsisLength = ellipsisLength ? ellipsisLength : 12;
	return function(data, type, row) {
		return type == 'display' && data.length > ellipsisLength
			? data.substr(0, ellipsisLength) + '…'
			: data;
	}
};

var table = $("#table").DataTable({
	data: {},
	columns: [
		{ data: 'action' },
		{ data: 'product_id' },
		{ data: 'title' },
		{ data: 'created_date' },
	],
	columnDefs: [
		{ targets: 1, render: $.fn.dataTable.render.ellipsis() },
		{ targets: 2, render: $.fn.dataTable.render.ellipsis(72) },
		{ width: "10%", "targets": 0 },
		{ width: "15%", "targets": 1 },
		{ width: "60%", "targets": 2 },
		{ width: "10%", "targets": 3 },
	],
	order: [[ 3, 'desc' ], [ 2, 'asc' ]]
});

adminGetProductList();
function adminGetProductList() {
	fetch('/admin-get-product-list', { method: 'POST', body: searchData })
		.then(function(res) {
			if(res.ok) {
				return res.json();
			}
			notify_req_failed();
	    })
	    .then(function(result) {
	    	var statusCode = result.status_code;
	    	if (statusCode == '100') {
	    		var data = result.data.product_list;
	    		for(var i in data) {
	    			data[i]['action'] = '<a href="/adminer/edit-product-tip?product_id=' + data[i]['product_id'] + '" class="btn btn-primary btn-xs"><i class="fa fa-edit"></i> Edit</a>';
				}
	    		table.clear();
	    		table.rows.add(data).draw();
	    	} else {
	    		var errors = result.error;
	    		if (errors && errors.length > 0) {
	    			notify_err(errors[0].message);
	    		}
	    	}
	    })
	    .catch(function(err) {
	    	notify_server_err();
	    });
}
