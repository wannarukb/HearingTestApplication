import React, { Component } from 'react';

import {CommonActions } from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView , NativeModules} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button } from "../components";
import CheckBox from '@react-native-community/checkbox';
import {connect} from 'react-redux';
import {LanguageService} from "../services/LanguageService";
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)

const { height, width } = Dimensions.get("screen");

class Consent extends Component {

  
    constructor(props) {
        super(props);

        console.log('----- User Survey -----');
        console.log(JSON.stringify(this.props));

        this.getDeviceInfo();
    };

    setDeviceLanguage(lang){
        console.log("SET DEVICE Language = " + lang);
        translate.cache.clear();
        LanguageService.getInstance().changeLanguage(lang);
        
    }
    
    
    getDeviceInfo = async() =>{
        var defaultLanguage = 'en';
        try {
            let data = await AsyncStorage.getItem("DeviceInfo");
            
            if(data){
                let deviceData = JSON.parse(data);
                console.log('device data = ', deviceData);
                this.setState({
                    DeviceInfo : deviceData
                });
                
                console.log(deviceData);
                defaultLanguage = (deviceData.language != undefined) ? deviceData.language : 'en';
            }
            this.setDeviceLanguage(defaultLanguage);
        } catch (error) {
            
            console.log("Something went getDeviceInfo = ", error);
            this.setDeviceLanguage(defaultLanguage);
        }
    }

   


    notAcceptButton(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Home' },
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
                                        <Text  style={styles.consentText} >{translate('ConsentInfo')}</Text>
                                    </Block>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                </ScrollView>
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
                            <Button style={styles.backButton}
                                onPress={() => this.notAcceptButton()}
                                >
                                    <Text style={styles.backButtonText}>
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

const styles = StyleSheet.create({
    homeContainer: {
        position: "relative",
        padding: 10,
        marginHorizontal: 5,
        marginTop: 25,
        zIndex: 2
    },
    contentContainer : {
        flex: 1,
        paddingVertical: 20,
        position: 'relative'
    },
    pageHeader : {
        fontSize: 24,
        fontFamily: 'Sarabun-Bold',
        color: themeColor.COLORS.PRIMARY
    },
    row: {
        flex: 1, 
        flexDirection: 'row'
    },
    consentText:{
        justifyContent: "center",
        fontSize: 16,
        fontFamily: 'Sarabun-Light',
        color: themeColor.COLORS.PRIMARY
    },
    container: {
        // marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
        // marginBottom: -HeaderHeight * 2,
        flex: 1
    },
    buttonSection : {
        flex: 1, 
        bottom: '10%',
        position: "absolute",
        paddingHorizontal: 20
    },
    primaryButton:{
        width: '100%',
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: themeColor.COLORS.PRIMARY_BTN_SUCCESS
    },
    backButton:{
        width: '100%',
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: themeColor.COLORS.WHITE
    },
    primaryButtonText:{
        fontSize: 18,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.WHITE
    },
    backButtonText:{
        fontSize: 18,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.PRIMARY_BTN_SUCCESS
    },

    logo: {
        width: '100%',
        height: 60,
        position: 'relative',
        marginTop: '0%',
        marginHorizontal : 'auto'
    },
    titleBlock:{
        marginTop:'5%'
    },
    title: {
        fontFamily:'Sarabun-SemiBold',
        fontSize: 20
    },
    subTitle: {
        fontFamily:'Sarabun-Medium',
        fontSize: 14,
    },
    formLabel:{
        fontFamily:'Sarabun-Medium',
        fontSize: 14,
    }
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