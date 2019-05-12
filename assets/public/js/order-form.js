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

    /***** form submit *****/
    $( "#order_detail_form" ).submit(function( event ) {
        event.preventDefault();
        $("#pageloader").fadeIn();
        addOrder();
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
            var order_line = "<li>" + cart_item.product_name + " <span class=\"middle\">x " +  cart_item.quantity
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
    formData.set('address[second_line]', $("#second_line").val());
    formData.set('address[third_line]', $("#third_line").val());
    formData.set('address[city]', $("#city").val());
    formData.set('address[postcode]', $("#postcode").val());
    formData.set('address[state]', $("#state").val());
    formData.set('address[country]', $("#country").val());
    formData.set('remarks', '');

    var file_ic = $('#file_ic')[0].files[0];
    formData.set('image_ic', file_ic, file_ic.name);

    var file_card = $('#file_card')[0].files[0];
    formData.set('image_card', file_card, file_card.name);

    var file_sig = $('#file_sig')[0].files[0];
    formData.set('image_signature', file_sig, file_sig.name);

    var cart_list = JSON.parse(sessionStorage.cart);
    $.each( cart_list , function( index, order_item ){
        formData.set('order_product[' + index + '][product_id]', order_item.product_id);
        formData.set('order_product[' + index + '][product_name]', order_item.product_name);
        formData.set('order_product[' + index + '][quantity]', order_item.quantity);
        formData.set('order_product[' + index + '][desc]', order_item.desc);
        $.each( order_item.image , function( imageIndex, imageUrl ){
            formData.set('order_product[' + index + '][image][' + imageIndex + ']', imageUrl);
        });
        formData.set('order_product[' + index + '][payment]', order_item.payment);
        formData.set('order_product[' + index + '][payment_type]', order_item.payment_type);
        $.each( order_item.service , function( serviceIndex, orderService ){
            formData.set('order_product[' + index + '][service][' + serviceIndex + '][name]', orderService.name);
            formData.set('order_product[' + index + '][service][' + serviceIndex + '][value]', orderService.value);
            formData.set('order_product[' + index + '][service][' + serviceIndex + '][unit]', orderService.unit);
            formData.set('order_product[' + index + '][service][' + serviceIndex + '][per_order_charge]', orderService.per_order_charge);
            formData.set('order_product[' + index + '][service][' + serviceIndex + '][remarks]', orderService.remarks);
        });
        formData.set('order_product[' + index + '][remarks]', order_item.remarks);
    });

    return formData;
}

/** testing purpose **/
function getModalFormDataTesting() {
    var addressFormData = new FormData();

    var formData = new FormData();

    formData.set('email', 'hello@email.com');
    formData.set('status', 'P');
    formData.set('image_ic', 'url');
    formData.set('image_card', 'url');
    formData.set('image_signature', 'url');
    formData.set('phone_no', '0123334444');
    formData.set('emergency_no', '0123334444');
    formData.set('address[first_line]', 'first_line' );
//    formData.set('address[second_line]', 'second_line' );
//    formData.set('address[third_line]', 'third_line' );
    formData.set('address[city]', 'city' );
    formData.set('address[postcode]', 'postcode' );
    formData.set('address[state]', 'state' );
    formData.set('address[country]', 'country' );
//    formData.set('order_product', JSON.stringify(sessionStorage.cart));
    formData.set('remarks', 'remark');

    formData.set('order_product[0][product_id]', 'product_id1');
    formData.set('order_product[0][product_name]', 'product_name1');
    formData.set('order_product[0][quantity]', 1);
    formData.set('order_product[0][desc]', 'desc1');
    formData.set('order_product[0][image][0]', 'url1');
    formData.set('order_product[0][image][1]', 'url2');
    formData.set('order_product[0][payment]', 1200);
    formData.set('order_product[0][payment_type]', 'rental');
    formData.set('order_product[0][service][0][name]', 'service1');
    formData.set('order_product[0][service][0][value]', 10);
    formData.set('order_product[0][service][0][unit]', 'RM');
    formData.set('order_product[0][service][0][sum_up]', true);
    formData.set('order_product[0][service][0][remarks]', 'service.remark');
    formData.set('order_product[0][service][1][name]', 'service1');
    formData.set('order_product[0][service][1][value]', 10);
    formData.set('order_product[0][service][1][unit]', 'RM');
    formData.set('order_product[0][service][1][sum_up]', true);
    formData.set('order_product[0][service][1][remarks]', 'service.remark');
    formData.set('order_product[0][remarks]', 'remark1');

    formData.set('order_product[1][product_id]', 'product_id2');

    formData.set('order_product[2][product_id]', 'product_id3');

    return formData;
}

function addOrder() {
    fetch('/user-order-add', { method: 'POST', body: getModalFormData() })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            notify_req_failed();
            alert( "Submit order failed. Please try again." );
        })
        .then(function (result) {
            if (result.status_code == '100') {
                notify_success('request successfully.');
                sessionStorage.order_submitted = JSON.stringify(result.data);
                window.location = '/order-confirmation';
            } else {
                if (result.error && result.error.length > 0) {
                    notify_err(errors[0].message);
                    alert( "Submit order failed. Please try again." + errors[0].message );
                } else {
                    notify_server_err();
                    alert( "Submit order failed. Please try again." );
                }
            }
        })
        .catch(function (err) {
            notify_server_err();
            alert( "Submit order failed. Please try again." );
        })
        .finally(function () {
            $("#pageloader").fadeOut();
        });
}