import React, { Component } from 'react';
import {  I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';


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
    changeLanguage(lang) {
        // fallback if no available language fits
        const fallback = { languageTag: lang, isRTL: false };

        var { languageTag, isRTL } =  fallback || RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters));

        console.log('LEKK = ' + lang);
        if(lang){
            languageTag = fallback.languageTag;
            isRTL       = fallback.isRTL;
        }

        console.log('LEKK = languageTag = ' + languageTag);

        // clear translation cache
        // translate.cache.clear();
        // update layout direction
        I18nManager.forceRTL(isRTL);
        // set i18n-js config
        i18n.translations = { [languageTag]: translationGetters[languageTag]() };
        i18n.locale = languageTag;
    }
}
export default LanguageService;
