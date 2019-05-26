$(function() {
    "use strict";

    //------- Parallax -------//
//    skrollr.init({
//        forceHeight: false
//    });

    //------- Active Nice Select --------//
    $('select').niceSelect();

    //------- hero carousel -------//
    $(".hero-carousel").owlCarousel({
        items:3,
        margin: 10,
        autoplay:false,
        autoplayTimeout: 5000,
        loop:true,
        nav:false,
        dots:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items: 2
            },
            810:{
                items:3
            }
        }
    });

    //------- fixed navbar --------//
    $(window).scroll(function(){
        var sticky = $('.header_area'),
        scroll = $(window).scrollTop();

        if (scroll >= 100) sticky.addClass('fixed');
        else sticky.removeClass('fixed');
    });
});

$(document).ready(function() {
    if (typeof selected_tab !== 'undefined') {
        if (selected_tab) {
            console.log("selected_tab: " + selected_tab);
            $('#' + selected_tab).addClass("active");
        }
    } else {
        console.log("selected_tab: none");
    }
});

function refreshCartNumber(){
    var quantity = Number(0);
    if (sessionStorage.cart){
        var cart_list = JSON.parse(sessionStorage.cart);
        $.each( cart_list , function( index, obj ){
            quantity = quantity + Number(obj.quantity);
        })
    }
    $('#cart_quantity').html(quantity);
}

function getDateFormattedString(epouch){
    var convertedDate = new Date(epouch);
    return convertedDate.getFullYear() + "/" + convertedDate.getMonth() + "/" + convertedDate.getDate()
           + " " + convertedDate.getHours() + ":" + convertedDate.getMinutes();
}

refreshCartNumber();
