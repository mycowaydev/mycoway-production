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