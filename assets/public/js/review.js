function updateUserRatingStar(num){
    $("#reviewer_rate").val(Number(num))
    var starNum = Number(num);
    for (i = 1; i < starNum+1; i++) {
        $("." + i + "-star").removeClass('far fa-star');
        $("." + i + "-star").addClass('fas fa-star');
    }
    for (i = starNum+1; i < 6; i++) {
        $("." + i + "-star").removeClass('fas fa-star');
        $("." + i + "-star").addClass('far fa-star');
    }
}

function getRating(){
    var active_star_count = 0;
    for (i = 1; i < 6; i++) {
        if ($("." + i + "-star").hasClass('fas fa-star')){
            active_star_count = active_star_count + 1;
        }
    }
    return active_star_count;
}

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


function getReviewImage(images){
    var image_content = '';
    images.forEach(image => {
        image_content = image_content.concat('<a href="' + image + '" data-toggle="lightbox" data-gallery="reviewGalleryImage" class="col-sm-1"><img class="img-fluid review-img" src="' + image + '" /></a>')
    });
    return image_content
}

function getReviewItem(obj){
    return "<div class=\"review_item\">" +
        "<div class=\"media\">" +
            "<div class=\"d-flex\">" +
                "<img src=\"https://ui-avatars.com/api/?name=" + obj.name + "&rounded=true\" alt=\"\">" +
            "</div>" +
            "<div class=\"media-body\">" +
                "<h4>" + name + "</h4>" +
                getStar(Number(obj.rate)) +
                "<h5>" + getDateFormattedString(obj.review_date) + "</h5>" +
            "</div>" +
        "</div>" +
        "<p>" + obj.desc + "</p>" +
        "<p>" + getReviewImage(obj.images) + "</p>" +
    "</div>";
}

function getReviews() {
    var formData = new FormData();

    fetch('/public-reviews-get', { method: 'POST', body: formData })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            notify_req_failed();
            alert(getStringById('alert_request_review_fail'));
        })
        .then(function (result) {
            if (result.status_code == '100') {
                notify_success('request successfully.');

                var totalRating = 0;
                var fiveStarCount = 0;
                var fourStarCount = 0;
                var threeStarCount = 0;
                var twoStarCount = 0;
                var oneStarCount = 0;

                $('.review_count').html(result.data.length);
                $.each( result.data , function( index, obj ){
                    $('#review_list').append(getReviewItem(obj));
                    totalRating = totalRating + Number(obj.rate);
                    switch(Number(obj.rate)) {
                        case 5:
                            fiveStarCount = fiveStarCount + 1;
                            break;
                        case 4:
                            fourStarCount = fourStarCount + 1;
                            break;
                        case 3:
                            threeStarCount = threeStarCount + 1;
                            break;
                        case 2:
                            twoStarCount = twoStarCount + 1;
                            break;
                        case 1:
                            oneStarCount = oneStarCount + 1;
                            break;
                    }
                });
                if (totalRating>0){
                    $("#overall_rating").html(Number(totalRating/Number(result.data.length)).toFixed(1));
                }
                $("#5_star_count").html(fiveStarCount);
                $("#4_star_count").html(fourStarCount);
                $("#3_star_count").html(threeStarCount);
                $("#2_star_count").html(twoStarCount);
                $("#1_star_count").html(oneStarCount);
            } else {
                notify_err(errors[0].message);
                alert( getStringById('alert_request_review_fail') + errors[0].message );
            }
        })
        .catch(function (err) {
            notify_server_err();
            alert( getStringById('alert_request_review_fail'));
        })
        .finally(function () {
            $("#pageloader").fadeOut();
        })
}

function addReview(){
    $("#pageloader").fadeIn();

    var formData = new FormData();
    formData.append('name', $("#reviewer_name").val());
    formData.append('status', 'P');
    formData.append('email_address', $("#reviewer_email").val());
    formData.append('rate', $("#reviewer_rate").val());
    formData.append('desc', $("#reviewer_desc").val());
    formData.append('remarks', '');

    fetch('/user-review-add', { method: 'POST', body: formData })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            notify_req_failed();
            alert( getStringById('alert_submit_review_fail'));
        })
        .then(function (result) {
            if (result.status_code == '100') {
                notify_success('request successfully.');
                alert(getStringById('alert_submit_review_success'));
                $('#review_form').trigger("reset");
                updateUserRatingStar(0);
            } else {
                if (result.error && result.error.length > 0) {
                    notify_err(errors[0].message);
                    alert( getStringById('alert_submit_review_fail') + errors[0].message );
                } else {
                    notify_server_err();
                    alert( getStringById('alert_submit_review_fail') );
                }
            }
        })
        .catch(function (err) {
            notify_server_err();
            alert( getStringById('alert_submit_review_fail') );
        })
        .finally(function () {
            $("#pageloader").fadeOut();
        });
}

function clear(){
    clearError($('#review_form')[0])
}

$('#review_form').keydown(clear);
$('#review_form')[0].noValidate = true;
$('#review_form')[0].addEventListener('submit', validateForm);

$( "#review_form" ).submit(function( event ) {
    event.preventDefault();
    if (getRating()==0){
        alert(getStringById('string_minimum_rating'));
    } else {
        addReview();
    }
});

$("#pageloader").fadeIn();
updateUserRatingStar(0);
getReviews();

$(document).on('click', '[data-toggle="lightbox"]', function (event) {
    event.preventDefault();
    $(this).ekkoLightbox({
        alwaysShowClose: true,
    });
    $('.arrows').show();  //show your previous and next buttons
});
