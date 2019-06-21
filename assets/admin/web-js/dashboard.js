var colorList19 = [
    '230, 25, 75',
    '60, 180, 75',
    '255, 225, 25',
    '0, 130, 200',
    '245, 130, 48',
    '145, 30, 180',
    '70, 240, 240',
    '240, 50, 230',
    '210, 245, 60',
    '250, 190, 190',
    '0, 128, 128',
    '230, 190, 255',
    '170, 110, 40',
    '255, 250, 200',
    '128, 0, 0',
    '170, 255, 195',
    '128, 128, 0',
    '255, 215, 180',
    '0, 0, 128',
    '128, 128, 128',
    '255, 255, 255'
]

var number_of_month = 8;

function getColor(length, border) {
    barColors = []
    for (i = 0; i < length; i++) {
        if (border) {
            barColors.push('rgba(' + colorList19[i % colorList19.length] + ', 1)')
        } else {
            barColors.push('rgba(' + colorList19[i % colorList19.length] + ', 0.2)')
        }
    }
    return barColors
}

function initChart(data) {
    var ctx = document.getElementById('myChart').getContext('2d')

    var months = data.map(obj => obj._id.year + '/' + obj._id.month)
    var counts = data.map(obj => obj.count)

    var current_year = new Date().getFullYear()
    var current_month = new Date().getMonth()

    today = new Date()
    for (i = 0; i < number_of_month; i++) {
        d = new Date(today.getFullYear(), today.getMonth() - number_of_month + i + 1, 1)

        db_month = months[i].split('/')[1]
        if (db_month != (d.getMonth()+1)) {
            months.splice(i, 0, d.getFullYear() + '/' + (d.getMonth()+1))
            counts.splice(i, 0, 0)
        }
    }

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'number of page visit',
                data: counts,
                backgroundColor: getColor(months.length),
                borderColor: getColor(months.length, true),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Visitor Stats'
            }
        }
    })
}

var formData = new FormData();
formData.append('month_range', number_of_month);

fetch('/public-access-log-get-list', { method: 'POST', body: formData })
    .then(function(res) {
        if(res.ok) {
            return res.json()
        }
        notify_req_failed()
    })
    .then(function(result) {
        var statusCode = result.status_code
        if (statusCode == '100') {
            initChart(result.data)
        } else {
            var errors = result.error;
            if (errors && errors.length > 0) {
                notify_err(errors[0].message)
            }
        }
    })
    .catch(function(err) {
        console.log(err)
        notify_server_err()
    })