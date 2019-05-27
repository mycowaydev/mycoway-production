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
                        info.text(getStringById('string_no_file_chosen'));
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

$('.focus_center').focus(function(){
    var center = $(window).height()/2;
    var top = $(this).offset().top ;
    if (top > center){
        $(window).scrollTop(top-center);
    }
});

/****** emergency phone number validation ******/

function validatePhoneNumber(element){
    if (phone_number.value == emergency_phone_number.value) {
        $('#emergency_phone_number')[0].setCustomValidity(getStringById('validation_emergency_phone_number'));
    } else {
        $('#emergency_phone_number')[0].setCustomValidity('');
    }
}

function clearError(){
    var formElements = $('#order_detail_form')[0].elements;
    for (var index = 0, len = formElements.length; index < len; index++) {
        var element = formElements[index];
        element.setCustomValidity('');
    }
}

$('#phone_number').change(validatePhoneNumber);
$('#emergency_phone_number').keyup(validatePhoneNumber);
$('#order_detail_form').keydown(clearError);

$(document).ready(function() {
    
    /****** file validation ******/
    $('#upload').bind("click",function() {
        if ($('#file_ic').val()=='') {
            alert(getStringById('alert_empty_ic'));
            return false;
        }
        if ($('#file_card').val()=='') {
            alert(getStringById('alert_empty_card'));
            return false;
        }
        if ($('#file_sig').val()=='') {
            alert(getStringById('alert_empty_signature'));
            return false;
        }
        var formElements = $('#order_detail_form')[0].elements;

        for (var index = 0, len = formElements.length; index < len; index++) {
            var element = formElements[index];
            if (element.validity.valid !== true){
                var errorMsg = element.validationMessage;
                if (element.validity.valueMissing === true){
                    errorMsg = getStringById('validation_require_field');
                } else if (element.validity.patternMismatch === true) {
                    if (element.id == 'postcode'){
                        errorMsg = getStringById('validation_postcode');
                    } else if (element.id == 'phone_number'){
                        errorMsg = getStringById('validation_phone_number');
                    } else if (element.id == 'emergency_phone_number'){
                        errorMsg = getStringById('validation_phone_number');
                    }
                } else if (element.validity.typeMismatch === true) {
                    if (element.nodeName == 'INPUT' && element.type === 'email') {
                        errorMsg = getStringById('validation_email')
                    } else if (element.nodeName == 'INPUT' && element.type === 'tel') {
                        errorMsg = getStringById('validation_phone_number');
                    }
                }
                element.setCustomValidity(errorMsg);
            }
        }
    });

    //** tooltips content **//
    $( "#ic_tooltips" ).tooltip({ content: '<img src="res/sample_ic.jpg" />' });
    $( "#card_tooltips" ).tooltip({ content: '<img src="res/sample_card.jpg" />' });

    //** load cart item **//
    if (!sessionStorage.cart) {
        $( "#cart-detail" ).text(getStringById('string_cart_is_empty'));
        window.location.href = '/cart'
    } else {
        var cart_list = JSON.parse(sessionStorage.cart);
        for (var cart_item of cart_list) {
            var order_line = "<li>" + cart_item.product_name + " <span class=\"middle\">x " +  cart_item.quantity
                + "</span> <span class=\"middle\">" + cart_item.payment_type_value  + "</span> <span class=\"last\">RM "
                + (cart_item.payment * cart_item.quantity) + "</span></li>"
            $( "#order_box_ul" ).append(order_line);
        }
    }

    /***** form submit *****/
    $( "#order_detail_form" ).submit(function( event ) {
        event.preventDefault();
        $("#pageloader").fadeIn();
        addOrder();
    });
});

function setProductOrder(formData, key, value) {
    if (value){
        formData.set(key, value);
    }
    return formData;
}

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
        setProductOrder(formData, 'order_product[' + index + '][product_id]', order_item.product_id);
        setProductOrder(formData, 'order_product[' + index + '][product_name]', order_item.product_name);
        setProductOrder(formData, 'order_product[' + index + '][quantity]', order_item.quantity);
        setProductOrder(formData, 'order_product[' + index + '][desc]', order_item.desc);
        $.each( order_item.image , function( imageIndex, imageUrl ){
            setProductOrder(formData, 'order_product[' + index + '][image][' + imageIndex + ']', imageUrl);
        });
        setProductOrder(formData, 'order_product[' + index + '][price]', order_item.price);
        setProductOrder(formData, 'order_product[' + index + '][payment]', order_item.payment);
        setProductOrder(formData, 'order_product[' + index + '][payment_type]', order_item.payment_type);
        $.each( order_item.service , function( serviceIndex, orderService ){
            setProductOrder(formData, 'order_product[' + index + '][service][' + serviceIndex + '][name]', orderService.name);
            setProductOrder(formData, 'order_product[' + index + '][service][' + serviceIndex + '][value]', orderService.value);
            setProductOrder(formData, 'order_product[' + index + '][service][' + serviceIndex + '][unit]', orderService.unit);
            setProductOrder(formData, 'order_product[' + index + '][service][' + serviceIndex + '][per_order_charge]', orderService.per_order_charge);
            setProductOrder(formData, 'order_product[' + index + '][service][' + serviceIndex + '][remarks]', orderService.remarks);
        });
        setProductOrder(formData, 'order_product[' + index + '][remarks]', order_item.remarks);
    });

    return formData;
}

function addOrder(testing) {
    var formData = new FormData();
    var apiUrl = '/user-order-add';
    if (testing){
        apiUrl = '/user-order-add-test';
        formData = getModalFormDataTesting()
    } else {
        formData = getModalFormData()
    }

    fetch(apiUrl, { method: 'POST', body: formData })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            notify_req_failed();
            alert(getStringById('alert_submit_order_fail'));
        })
        .then(function (result) {
            if (result.status_code == '100') {
                notify_success('request successfully.');
                sessionStorage.order_submitted = JSON.stringify(result.data);
                sessionStorage.removeItem("cart");
                window.location = '/order-confirmation';
            } else {
                if (result.error && result.error.length > 0) {
                    notify_err(errors[0].message);
                    alert( getStringById('alert_submit_order_fail') + errors[0].message );
                } else {
                    notify_server_err();
                    alert( getStringById('alert_submit_order_fail') );
                }
            }
        })
        .catch(function (err) {
            notify_server_err();
            alert( getStringById('alert_submit_order_fail') );
        })
        .finally(function () {
            $("#pageloader").fadeOut();
        });
}

/** testing purpose **/
function getModalFormDataTesting() {
    var addressFormData = new FormData();

    var formData = new FormData();

    formData.set('email', 'squareq.test1@gmail.com');
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
    formData.set('remarks', 'remark');

    formData.set('order_product[0][product_id]', 'product_id1');
    formData.set('order_product[0][product_name]', 'product_name1');
    formData.set('order_product[0][quantity]', 1);
    formData.set('order_product[0][desc]', 'desc1');
    formData.set('order_product[0][image][0]', 'url1');
    formData.set('order_product[0][image][1]', 'url2');
    formData.set('order_product[0][price]', 1200);
    formData.set('order_product[0][payment]', 1200);
    formData.set('order_product[0][payment_type]', 'P');
//    formData.set('order_product[0][service][0][name]', 'service1');
//    formData.set('order_product[0][service][0][value]', 10);
//    formData.set('order_product[0][service][0][unit]', 'RM');
//    formData.set('order_product[0][service][0][sum_up]', true);
//    formData.set('order_product[0][service][0][remarks]', 'service.remark');
//    formData.set('order_product[0][service][1][name]', 'service1');
//    formData.set('order_product[0][service][1][value]', 10);
//    formData.set('order_product[0][service][1][unit]', 'RM');
//    formData.set('order_product[0][service][1][sum_up]', true);
//    formData.set('order_product[0][service][1][remarks]', 'service.remark');
    formData.set('order_product[0][remarks]', 'remark1');

    formData.set('order_product[1][product_id]', 'product_id2');
    formData.set('order_product[1][product_name]', 'product_name2');
    formData.set('order_product[1][quantity]', 2);
    formData.set('order_product[0][price]', 22200);
    formData.set('order_product[1][payment]', 22200);
    formData.set('order_product[1][payment_type]', 'R');

    return formData;
}