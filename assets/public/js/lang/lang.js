function changeLanguage(lang) {
    if (lang){
        if (lang == "en"){
            sessionStorage.setItem("language", "en");
            lang_array = language_en
        } else if (lang == "cn") {
            sessionStorage.setItem("language", "cn");
            lang_array = language_cn
        } else {
            sessionStorage.setItem("language", "my");
            lang_array = language_my
        }
        for (k in lang_array) {
            if (document.getElementById(k) != null){
                document.getElementById(k).innerHTML = lang_array[k]
            }
        }
    }
}

$(document).ready(function(){
    var lang = "en"
    if (window.sessionStorage.getItem("language") != null){
        lang = window.sessionStorage.getItem("language")
    }
    changeLanguage(lang)
});