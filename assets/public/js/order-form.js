(function ($) {
    'use strict';

    /****** file selection *******/
    try {
        var file_input_container = $('.js-input-file');
        if (file_input_container[0]) {
            file_input_container.each(function () {
                var that = $(this);
                var fileInput = that.find(".input-file");
                var info = that.find(".input-file__info");

                fileInput.on("change", function () {
                    var fileName;
                    fileName = $(this).val();

                    if (fileName.substring(3,11) == 'fakepath') {
                        fileName = fileName.substring(12);
                    }

                    if(fileName == "") {
                        info.text("No file chosen");
                    } else {
                        info.text(fileName);
                    }
                })
            });
        }
    }
    catch (e) {
        console.log(e);
    }
})(jQuery);

/****** emergency phone number validation ******/
var phone_number = document.getElementById("phone_number")
  , emergency_phone_number = document.getElementById("emergency_phone_number");

function validatePassword(){
  if(phone_number.value == emergency_phone_number.value) {
    emergency_phone_number.setCustomValidity("Emergency phone number should different from phone number.");
  } else {
    emergency_phone_number.setCustomValidity('');
  }
}

phone_number.onchange = validatePassword;
emergency_phone_number.onkeyup = validatePassword;

$(document).ready(function() {
    
    /****** file validation ******/
    $('#upload').bind("click",function() {
        if ($('#file_ic').val()=='') {
            alert("Empty image file for IC.");
            return false;
        }
        if ($('#file_card').val()=='') {
            alert("Empty image file for card");
            return false; 
        }
        if ($('#file_sig').val()=='') {
            alert("Empty image file for signature");
            return false;
        }
    });
});


$(window).load(function(){
    /** tooltips content **/
    $( "#ic_tooltips" ).tooltip({ content: '<img src="res/sample_ic.jpg" />' });
    $( "#card_tooltips" ).tooltip({ content: '<img src="res/sample_card.jpg" />' });

    /** load cart item **/
    if (!sessionStorage.cart) {
        $( "#cart-detail" ).text('cart is empty');
        window.location.href = '/cart'
    } else {
        var cart_list = JSON.parse(sessionStorage.cart);
        for (var cart_item of cart_list) {
            var order_line = "<li>" + cart_item.name + " <span class=\"middle\">x " +  cart_item.quantity
                + "</span> <span class=\"middle\">" + cart_item.payment_type  + "</span> <span class=\"last\">RM " + (cart_item.payment * cart_item.quantity) + "</span></li>"
            $( "#order_box_ul" ).append(order_line);
        }
    }
});

/** call api **/
function getModalFormData() {
    var addressFormData = new FormData();

    var formData = new FormData();
    formData.append('email', $("#email_address").val());
    formData.set('status', 'P');
    formData.append('phone_no', $("#phone_number").val());
    formData.append('emergency_no', $("#emergency_phone_number").val());
    formData.set('address[first_line]', $("#first_line").val());
    formData.set('address[second_line]', $("#second_line").val() );
    formData.set('address[third_line]', $("#third_line").val() );
    formData.set('address[city]', $("#city").val() );
    formData.set('address[postcode]', $("#postcode").val() );
    formData.set('address[state]', $("#state").val() );
    formData.set('address[country]', $("#country").val() );
    formData.set('order_product', JSON.stringify(sessionStorage.cart));
    formData.set('remarks', '');

    var file_ic = $('#file_ic')[0].files[0];
    formData.set('image_ic', file_ic, file_ic.name);

    var file_card = $('#file_card')[0].files[0];
    formData.set('image_card', file_card, file_card.name);

    var file_sig = $('#file_sig')[0].files[0];
    formData.set('image_signature', file_sig, file_sig.name);

    return formData;
}

/** testing purpose **/
function getModalFormDataTesting() {
    var addressFormData = new FormData();

    var formData = new FormData();

    formData.set('email', 'hello@email.com');
    formData.set('status', 'P');
    formData.set('phone_no', '0123334444');
    formData.set('emergency_no', '0123334444');
    formData.set('address[first_line]', 'first_line' );
    formData.set('address[second_line]', 'second_line' );
    formData.set('address[third_line]', 'third_line' );
    formData.set('address[city]', 'city' );
    formData.set('address[postcode]', 'postcode' );
    formData.set('address[state]', 'state' );
    formData.set('address[country]', 'country' );
    formData.set('order_product', JSON.stringify(sessionStorage.cart));
    formData.set('remarks', 'remark');

    var file_ic = $('#file_ic')[0].files[0];
    formData.set('image_ic', file_ic, file_ic.name);

    var file_card = $('#file_card')[0].files[0];
    formData.set('image_card', file_card, file_card.name);

    var file_sig = $('#file_sig')[0].files[0];
    formData.set('image_signature', file_sig, file_sig.name);

    return formData;
}

function addOrder() {
    fetch('/user-order-add', { method: 'POST', body: getModalFormDataTesting() })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            notify_req_failed();
        })
        .then(function (result) {
            if (result.status_code == '100') {
                notify_success('request successfully.');
            } else {
                if (result.error && result.error.length > 0) {
                    notify_err(errors[0].message);
                } else {
                    notify_server_err();
                }
            }
        })
        .catch(function (err) {
            notify_server_err();
        })
        .finally(function () {

        });
}