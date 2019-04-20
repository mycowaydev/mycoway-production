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
    $( "#ic_tooltips" ).tooltip({ content: '<img src="res/sample_ic.jpg" />' });
    $( "#card_tooltips" ).tooltip({ content: '<img src="res/sample_card.jpg" />' });

    if (!sessionStorage.cart) {
        $( "#cart-detail" ).text('cart is empty');
        window.location.href = '/cart'
    } else {
        var cart_text = "";
        var cart_list = JSON.parse(sessionStorage.cart);
        for (var cart_item of cart_list) {
            var cart_line = "<p><b>" + cart_item.name + "</b> x " +  cart_item.quantity + " = RM " + (cart_item.price * cart_item.quantity) + "</p>";
            $( "#cart-detail" ).append(cart_line);
        }
    }
});