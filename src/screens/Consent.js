import React, { Component } from 'react';
import {connect} from 'react-redux';
import {CommonActions } from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView , View} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button } from "../components";

import {LanguageService} from "../services/LanguageService";
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

import mainStyle  from "../constants/mainStyle";

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)

const { height, width } = Dimensions.get("screen");
const styles = mainStyle.styles;

class Consent extends Component {

  
    constructor(props) {
        super(props);

        console.log('----- Consent Page -----');
        console.log(JSON.stringify(this.props));

        var lang = this.props.deviceInfo.language;
        this.setDeviceLanguage(lang);
    }

    setDeviceLanguage(lang){
        console.log("SET DEVICE Language = " + lang);
        translate.cache.clear();
        LanguageService.getInstance().changeLanguage(lang);
        
    }
    



    notAcceptButton(){
        var homePage = (this.props.userInfo.isGuest) ? 'HomeGuest' : 'Home';
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: homePage },
                ],
            })
        );
    }

    acceptButton(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'TesterSurvey' },
                ],
            })
        );
    }
  

    render() {
        const { navigation } = this.props;
        return (
        <Block flex style={styles.container}>
            <Block flex>
            <ImageBackground
                // source={Images.lightBG}
                style={{ height, width, zIndex: 1 , backgroundColor: themeColor.COLORS.WHITE}}
            >
                <View style={styles.viewSection}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ width, marginTop: '0%' }}
                    >
                        <Block flex style={styles.homeContainer}>
                            <Image source={Images.logoFaculty} style={styles.logo} />
                            <Block flex space="around">
                                <Block  style={styles.contentContainer}>
                                    <Block  style={styles.row}>
                                        <Block style={{width: '100%', alignItems: 'center', marginBottom: 10}}>
                                            <Text  style={styles.pageHeader} >{translate('ConsentHeaderLabel')}</Text>
                                        </Block>
                                    </Block>
                                    
                                    <Block  style={styles.row}>
                                        <Block style={{width: '100%'}}>
                                            <Text  style={customStyles.consentText} >{translate('ConsentInfo')}</Text>
                                        </Block>
                                    </Block>
                                </Block>
                            </Block>
                        </Block>
                    </ScrollView>
                </View>
                <Block style={styles.buttonSection}>
                    <Block style={styles.row}>
                        <Block style={{width: '100%', alignItems: 'center'}}>
                            <Button style={styles.primaryButton}
                            onPress={() => this.acceptButton()}
                            >
                                <Text style={styles.primaryButtonText}>
                                    {translate('ConsentAcceptLabel')}
                                </Text>
                            </Button>
                        </Block>
                    </Block>
                    <Block style={styles.row}>
                        <Block style={{width: '100%', alignItems: 'center'}}>
                            <Button style={styles.secondaryButton}
                                onPress={() => this.notAcceptButton()}
                                >
                                    <Text style={styles.secondaryButtonText}>
                                        {translate('ConsentNotAcceptLabel')}
                                    </Text>
                            </Button>
                        </Block>
                    </Block>
                    
                </Block>
            </ImageBackground>
            </Block>
        </Block>
            
        );
    }
}

const customStyles = StyleSheet.create({
    consentText:{
        justifyContent: "center",
        fontSize: 16,
        fontFamily: 'Sarabun-Light',
        color: themeColor.COLORS.PRIMARY
    },
});

// export default Consent;
const mapStateToProps = state => {
  return {
    userInfo: state.user,
    network: state.network,
    ...state.testToneList,
    ...state.deviceInfo
  };
};

const mapDispatchToProps = dispatch => {
  const {testToneActions} = require('../redux/TestToneRedux');
  

  return {
    loadTestToneList: testToneList => dispatch(testToneActions.loadTestToneList(testToneList))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Consent);