function getArray(lang){
    if (lang){
        if (lang == "my"){
            return language_my
        } else if (lang == "en") {
            return language_en
        } else {
            return language_cn
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

function changeFlag(lang){
    $('#selected_language').removeClass('flag-icon-gb')
    $('#selected_language').removeClass('flag-icon-cn')
    $('#selected_language').removeClass('flag-icon-my')

    if (lang == "en"){
        $('#selected_language').addClass('flag-icon-gb')
    } else if (lang == "my") {
        $('#selected_language').addClass('flag-icon-my')
    } else {
        $('#selected_language').addClass('flag-icon-cn')
    }
}

function showString(){
    var lang = "cn"
    if (window.sessionStorage.getItem("language") != null){
        lang = window.sessionStorage.getItem("language")
    }
    changeFlag(lang)
    showStringByArray(getArray(lang))
}

function refreshFaq(){
     if (typeof selected_tab !== 'undefined') {
         if (selected_tab == 'tab-faq') {
             document.location.reload();
         }
     }
 }

function changeLanguage(in_lang) {
    var lang = 'cn'
    if (in_lang){
        if (in_lang == "my" || in_lang == "cn" || in_lang == "en"){
            lang = in_lang
        }
    }
    sessionStorage.setItem("language", lang)
    showString()
    refreshFaq()
}

function toggleNav(){
    $('#nav-toggler-button-min').trigger('click');
}

$(document).ready(function(){
    showString();
});