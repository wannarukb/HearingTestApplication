import React, { Component } from 'react';
import {  I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)


const translationGetters = {
    // lazy requires (metro bundler does not support symlinks)
    en: () => require('../translations/en.json'),
    th: () => require('../translations/th.json'),
};


// export default LanguageService;
export class LanguageService extends Component {
    static myInstance = null;

    static getInstance() {  
        return new LanguageService();
    }

    getDeviceLang(){
        return RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters));
    }
    
    changeLanguage(lang) {
        // fallback if no available language fits

        console.log("----- Change Language -----");
        console.log("RNLocalize");
        console.log(RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)));
        
        const fallback = { languageTag: (lang) ? lang : 'en', isRTL: false };
        var languageTag, isRTL;

        console.log('changeLanguage = ' + lang);
        if(lang){
            languageTag = fallback.languageTag;
            isRTL       = fallback.isRTL;
        }else{
            var RNLocal = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters));
            languageTag = RNLocal.languageTag;
            isRTL       = RNLocal.isRTL; 
        }

        console.log('changeLanguage = languageTag before convert = ' + languageTag);

        if(languageTag != 'en' && languageTag != 'th'){
            languageTag = 'en'
        }

        console.log('changeLanguage = languageTag = ' + languageTag);

        // clear translation cache
        translate.cache.clear();
        // update layout direction
        I18nManager.forceRTL(isRTL);
        // set i18n-js config
        i18n.translations = { [languageTag]: translationGetters[languageTag]() };
        i18n.locale = languageTag;
    }
}
export default LanguageService;
