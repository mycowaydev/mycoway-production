function getArray(lang){
    if (lang){
        if (lang == "my"){
            return language_my
        } else if (lang == "cn") {
            return language_cn
        } else {
            return language_en
        }
    }
    return language_en
}

function showStringByArray(lang_array){
    for (k in lang_array) {
        element = $('.'+k)
        if (lang_array[k]){
            if (element){
                if (k.startsWith("string_") || k.startsWith("validation_") || k.startsWith("alert_")){
                    element.html(lang_array[k])
                } else if (k.startsWith("placeholder_")){
                    element.attr("placeholder", lang_array[k]);
                }
            }
        }
    }
}

function showString(){
    var lang = "en"
    if (window.sessionStorage.getItem("language") != null){
        lang = window.sessionStorage.getItem("language")
    }
    showStringByArray(getArray(lang))
}

function refreshFaq(){
     if (typeof selected_tab !== 'undefined') {
         if (selected_tab == 'tab-faq') {
             document.location.reload();
         }
     }
 }

function changeLanguage(lang) {
    if (lang){
        $('#selected_language').removeClass('flag-icon-gb')
        $('#selected_language').removeClass('flag-icon-cn')
        $('#selected_language').removeClass('flag-icon-my')
        if (lang == "my"){
            sessionStorage.setItem("language", "my");
            $('#selected_language').addClass('flag-icon-my')
        } else if (lang == "cn") {
            sessionStorage.setItem("language", "cn");
            $('#selected_language').addClass('flag-icon-cn')
        } else {
            sessionStorage.setItem("language", "en");
            $('#selected_language').addClass('flag-icon-gb')
        }
    }
    showString()
    refreshFaq()
}

function toggleNav(){
    $('#nav-toggler-button-min').trigger('click');
}

$(document).ready(function(){
    showString();
});