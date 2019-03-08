
const lang = require('./lang.json');
const langCode = require('./lang-code.json');

var localizeKey;

class Localize {

    constructor(localizeKey) {
        this.localizeKey = localizeKey;
    }

    setLocalize(localizeKey) {
    	this.localizeKey = localizeKey;
    }

    translate(langKey, localizeKey) {
		var langList = lang[localizeKey ? localizeKey : this.localizeKey];
		var langValue;
		if (langList) {
			langValue = langList[langKey];
		}
		if (!langValue) {
			langValue = '';
		}
		return langValue;
    }

    translateCode(langKey, localizeKey) {
		var langList = langCode[localizeKey ? localizeKey : this.localizeKey];
		var langValue;
		if (langList) {
			langValue = langList[langKey];
		}
		if (!langValue) {
			langValue = '';
		}
		return langValue;
    }

}

module.exports = Localize;
