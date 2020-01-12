$(function () {
    "use strict";

    //------- Parallax -------//
    //    skrollr.init({
    //        forceHeight: false
    //    });

    //------- Active Nice Select --------//
    $('select').niceSelect();

    //------- hero carousel -------//
    $(".hero-carousel").owlCarousel({
        items: 3,
        margin: 10,
        autoplay: false,
        autoplayTimeout: 5000,
        loop: true,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            810: {
                items: 3
            }
        }
    });

    //------- fixed navbar --------//
    $(window).scroll(function () {
        var sticky = $('.header_area'),
            scroll = $(window).scrollTop();

        if (scroll >= 100) sticky.addClass('fixed');
        else sticky.removeClass('fixed');
    });
});

function refreshCartNumber() {
    var quantity = Number(0);
    if (sessionStorage.cart) {
        var cart_list = JSON.parse(sessionStorage.cart);
        $.each(cart_list, function (index, obj) {
            quantity = quantity + Number(obj.quantity);
        })
    }
    $('#cart_quantity').html(quantity);
}

function getFormattedNumber(num, slider) {
    return ("0" + num).slice(slider);
}

function getDateFormattedString(epouch) {
    var convertedDate = new Date(epouch * 1000);
    return convertedDate.getFullYear() + "/" + getFormattedNumber(convertedDate.getMonth()+1, -2) + "/" + getFormattedNumber(convertedDate.getDate(), -2)
        + " " + getFormattedNumber(convertedDate.getHours(), -2) + ":" + getFormattedNumber(convertedDate.getMinutes(), -2);
}

function getStringById(id) {
    var lang = 'cn';

    if (window.sessionStorage.getItem("language") != null) {
        lang = window.sessionStorage.getItem("language")
    }

    if (lang == "en") {
        return language_en[id];
    }
    else if (lang == "my") {
        return language_my[id];
    } else {
        return language_cn[id];
    }
}

function clearError(form){
    $('.validation-message').remove();
    var formElements = form.elements;
    for (var index = 0, len = formElements.length; index < len; index++) {
        var element = formElements[index];
        element.setCustomValidity('');
        element.style.borderColor = '#cccccc';
    }
}

function validationMessageIDFor(element) {
    var name = element.nodeName,
        type = element.type,
        id = element.id;

    if (element.validity.patternMismatch === true) {
        if (id == 'postcode') {
            return 'validation_postcode';
        } else if (id == 'phone_number') {
            return 'validation_phone_number';
        } else if (id == 'emergency_phone_number') {
            return 'validation_phone_number';
        }
    } else if (element.validity.typeMismatch === true) {
        if (name == 'INPUT' && type === 'email') {
            return 'validation_email';
        } else if (name == 'INPUT' && type === 'tel') {
            return 'validation_phone_number';
        } else {
            return element.validationMessage;
        }
    } else if (element.validity.valueMissing === true) {
        if (id == 'file_ic') {
            return 'alert_empty_ic';
        } else if (id == 'file_card') {
            return 'alert_empty_card';
        } else if (id == 'file_sig') {
            return 'alert_empty_signature';
        } else if (id == 'tnc') {
            return 'validation_tnc';
        } else if (name == 'INPUT' && type === 'email') {
            return 'validation_email';
        } else {
            return 'validation_require_field';
        }
    } else {
        return element.validationMessage;
    }
};

function addValidationMsg(element, string_classname) {
    var parent  = element.parentNode,
        div     = document.createElement('div');
    div.style.fontSize = '0.8em';
    div.style.color = '#ff0000';
    div.style.width = '100%';
    div.classList.add('validation-message');

    if (getStringById(string_classname)){
        div.classList.add(string_classname);
    } else {
        div.appendChild(document.createTextNode(string_classname));
    }

    if (element.nodeName == 'INPUT' && (element.type === 'file' || element.type === 'checkbox')){
        var grandparent = parent.parentNode;
        grandparent.insertBefore(div, parent.nextSibling);
        parent.focus();
    } else {
        parent.insertBefore(div, element.nextSibling);
        element.focus();
        element.style.borderColor = '#ff0000';
    }
    showString();
}

$(document).ready(function () {
    if (typeof selected_tab !== 'undefined') {
        if (selected_tab) {
            console.log("selected_tab: " + selected_tab);
            $('#' + selected_tab).addClass("active");
        }
    } else {
        console.log("selected_tab: none");
    }
});

refreshCartNumber();

$(".hero-carousel__slide").click(function() {
    window.location = $(this).find("a").attr("href");
    return false;
});

// default language option popout box
function closeDefaultLanguage(){
    modal.style.display = "none";
    if(window.sessionStorage.getItem("language") == null){
        sessionStorage.setItem("language", 'cn')
    }
}
var modal = document.getElementById("defaultLanguageModal");
window.onclick = function(event) {
  if (event.target == modal) {
    closeDefaultLanguage();
  }
}
if (window.sessionStorage.getItem("language") == null){
    modal.style.display = "block";
}
