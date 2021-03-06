var faq_json_url = 'res/faq-en.json';
if (window.sessionStorage.getItem("language") == "cn") {
    faq_json_url = 'res/faq-cn.json';
} else {
    faq_json_url = 'res/faq-en.json';
}

/** load json into accordion **/

var faqJson = (function() {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': faq_json_url,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

var panelIndex = 0;
$.each( faqJson, function( key, obj ){
    $("#faq_area").append('<h4>' + obj.title + '</h4>');
    $.each( obj.qa, function( key, obj ){
        $("#faq_area").append('<button class="accordion">' + obj.question + '</button>');
        $("#faq_area").append('<div class="panel" id="panel' + panelIndex + '"></div>');
        $("#panel" + panelIndex).append('<p></p>');
        $("#panel" + panelIndex).append('<p><b>Answer:</b></p>');
        $.each( obj.answer, function( key, obj ){
            $("#panel" + panelIndex).append('<p>' + obj.line + '</p>');
        });
        panelIndex++;
    });
});

/** animation for accordion **/

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

// for tel phone number
if(typeof const_array !== 'undefined'){
    if (typeof const_array.const_phone_number !== 'undefined') {
        $('.call-us').attr("href", 'tel:' + const_array.const_phone_number)
    }
}