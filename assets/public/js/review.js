function getStar(num){
    var starHtml = "";
    for (i = 0; i < num; i++) {
        starHtml += "<i class=\"fas fa-star\"></i>";
    }
    for (i = num; i < 5; i++) {
        starHtml += "<i class=\"far fa-star\"></i>";
    }
    return starHtml;
}

function getReviewItem(name, star, comment){
    return "<div class=\"review_item\">" +
        "<div class=\"media\">" +
            "<div class=\"d-flex\">" +
                "<img src=\"img/product/review-2.png\" alt=\"\">" +
            "</div>" +
            "<div class=\"media-body\">" +
                "<h4>" + name + "</h4>" +
                getStar(star) +
            "</div>" +
        "</div>" +
        "<p>" + comment + "</p>" +
    "</div>";
}

function getReviews() {
    var formData = new FormData();

    fetch('/public-get-reviews', { method: 'POST', body: formData })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            notify_req_failed();
            alert( "Request Failed.");
        })
        .then(function (result) {
            if (result.status_code == '100') {
                notify_success('request successfully.');

                $.each( result.data , function( index, obj ){
                    var string = getReviewItem(obj.name, Number(obj.rate), obj.desc);
                    console.log(string)
                    $('#review_list').append(string);
                });
            } else {
                notify_err(errors[0].message);
                alert( "Request Failed. " + errors[0].message );
            }
        })
        .catch(function (err) {
            notify_server_err();
            alert( "Request Failed.");
        })
        .finally(function () {
        })
}

getReviews();