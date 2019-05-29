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

function clearError(form){
    $('.validation-message').remove();
    var formElements = form.elements;
    for (var index = 0, len = formElements.length; index < len; index++) {
        var element = formElements[index];
        element.setCustomValidity('');
        element.style.borderColor = '#cccccc';
    }
}

function validationMessageFor(element) {
    var name = element.nodeName,
        type = element.type,
        id = element.id;

    if (element.validity.patternMismatch === true) {
        if (id == 'postcode') {
            return getStringById('validation_postcode');
        } else if (id == 'phone_number') {
            return getStringById('validation_phone_number');
        } else if (id == 'emergency_phone_number') {
            return getStringById('validation_phone_number');
        }
    } else if (element.validity.typeMismatch === true) {
        if (name == 'INPUT' && type === 'email') {
            return getStringById('validation_email');
        } else if (name == 'INPUT' && type === 'tel') {
            return getStringById('validation_phone_number');
        } else {
            return element.validationMessage;
        }
    } else if (element.validity.valueMissing === true) {
        if (id == 'file_ic') {
            return getStringById('alert_empty_ic');
        } else if (id == 'file_card') {
            return getStringById('alert_empty_card');
        } else if (id == 'file_sig') {
            return getStringById('alert_empty_signature');
        } else if (name == 'INPUT' && type === 'email') {
            return getStringById('validation_email');
        } else {
            return getStringById('validation_require_field');;
        }
    } else if (element.validity.rangeOverflow === true || element.validity.rangeUnderflow === true) {
        var max = element.getAttribute('max'),
        min = element.getAttribute('min');
        return "Please input a value between " + min + " and " + max + ".";
    } else {
        return element.validationMessage;
    }
};

function validateForm(submitEvent) {
    clearError(submitEvent.target);
    if (!submitEvent.target.checkValidity()) {
        submitEvent.preventDefault();
        submitEvent.stopImmediatePropagation();
        submitEvent.stopPropagation();

        var form     = submitEvent.target,
            elements = form.elements;

        /* Loop through the elements, looking for an invalid one. */
        for (var index = 0, len = elements.length; index < len; index++) {
            var element = elements[index];

            if (element.willValidate === true && element.validity.valid !== true) {
                var message = validationMessageFor(element),
                    parent  = element.parentNode,
                    div     = document.createElement('div');
                div.appendChild(document.createTextNode(message));
                div.style.fontSize = '0.8em';
                div.style.color = '#ff0000';
                div.style.width = '100%';
                div.classList.add('validation-message');

                if (element.nodeName == 'INPUT' && element.type === 'file'){
                    var grandparent = parent.parentNode;
                    grandparent.insertBefore(div, parent.nextSibling);
                    parent.focus();
                } else {
                    parent.insertBefore(div, element.nextSibling);
                    element.focus();
                    element.style.borderColor = '#ff0000';
                }
                break;
            }
        }
    } else {
        return true;
    }
};

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
    return convertedDate.getFullYear() + "/" + getFormattedNumber(convertedDate.getMonth(), -2) + "/" + getFormattedNumber(convertedDate.getDate(), -2)
        + " " + getFormattedNumber(convertedDate.getHours(), -2) + ":" + getFormattedNumber(convertedDate.getMinutes(), -2);
}

function getStringById(id) {
    var lang = 'en';

    if (window.sessionStorage.getItem("language") != null) {
        lang = window.sessionStorage.getItem("language")
    }

    if (lang == "cn") {
        return language_cn[id];
    }
    else if (lang == "my") {
        return language_my[id];
    } else {
        return language_en[id];
    }
}

refreshCartNumber();
