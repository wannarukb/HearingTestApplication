import React from 'react';
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  I18nManager
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");
import themeColor from "../constants/Theme";
import Images from "../constants/Images";

import {connect} from 'react-redux';
import {CommonActions } from '@react-navigation/native';



import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('../translations/en.json'),
  th: () => require('../translations/th.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = (lang) => {
  // fallback if no available language fits
  const fallback = { languageTag: lang, isRTL: false };

  var { languageTag, isRTL } =  fallback || RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters));

  if(lang){
    languageTag = fallback.languageTag;
    isRTL       = fallback.isRTL;
  }

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};




class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    setI18nConfig('en');
    this.state = {
     
    };
  }

  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar hidden />
        <Block flex center>
          <ImageBackground
              source={Images.lightBG}
              style={{ height, width, zIndex: 1 }}
            />
        </Block>
        <Block center>
          <Image source={Images.MULOGO} style={styles.logo} />
        </Block>
        <Block flex>
            <Block flex space="around" style={{ zIndex: 2 }}>
              <Block center>
                <Image source={Images.Onboarding} style={styles.onboarding} />
              </Block>
              <Block style={styles.title} style={{marginTop: 20}}>
                <Block middle>
                  <Text style={styles.heading} color={themeColor.COLORS.PRIMARY} size={18} bold>
                    {translate('AppConcept')}
                  </Text>
                </Block>
                <Block middle> 
                  <Text style={styles.heading} color={themeColor.COLORS.PRIMARY} size={14} >
                    {translate('AppConceptSubDesc')}
                  </Text>
                </Block>
              </Block>
              <Block center>
                <Button
                  style={styles.createButton}
                  // onPress={() => navigation.navigate("Home")}
                  onPress={() => { 
                    this.props.navigation.dispatch(
                     CommonActions.reset({
                       index: 0,
                       routes: [
                         { name: 'Home' },
                        ],
                     })
                   );}}
                >
                  <Text style={styles.createButtonText}>
                    {translate('StartOnBoardingButton')}
                  </Text>
                </Button>
              </Block>
          </Block>
        </Block>
      </Block>
    );
  };
};

const styles = StyleSheet.create({
  createButton:{
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: themeColor.COLORS.PRIMARY_BTN_SUCCESS
  },
  createButtonText:{
    fontSize: 16,
    fontFamily: 'Sarabun-Medium',
    color: themeColor.COLORS.WHITE
  },
  onboarding:{
    width: width,
    height: 600,
    marginTop: '-100%'
  },
  heading:{
    fontFamily: 'Sarabun-Medium'
  },
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  logo: {
    width: 250,
    height: 250,
    zIndex: 2,
    position: 'relative',
    marginTop: '-95%'
  },
  title: {
    marginTop:'-5%'
  },
  subTitle: {
    marginTop: 20
  }
});


Onboarding.defaultProps = {
  token: '',
  id:''
};

const mapStateToProps = state => {
  return {
    token: state.user.token,
    id: state.user.id,
    network: state.network,
  };
};

export default connect(mapStateToProps, null)(Onboarding);