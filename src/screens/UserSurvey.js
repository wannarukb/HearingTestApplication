import React, { Component } from 'react';

import {CommonActions } from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { StyleSheet, Dimensions, ImageBackground, Image,  ScrollView , NativeModules} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button } from "../components";
import CheckBox from '@react-native-community/checkbox';
import DeviceInfo from 'react-native-device-info';

import TestToneService from '../services/TestToneService';

import {connect} from 'react-redux';
import {LanguageService} from "../services/LanguageService";
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)

const { height, width } = Dimensions.get("screen");

class UserSurvey extends Component {

  
    constructor(props) {
        super(props);
        this.state = {
            q1 : false,
            q2 : false,
            q3 : false
        };

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

    
    

    backHome(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Home' },
                ],
            })
        );
    }

    nextButton(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Consent' },
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
                                        <Text  style={styles.pageHeader} >{translate('UserSurveyHeaderLabel')}</Text>
                                    </Block>
                                </Block>
                                
                                <Block  style={styles.row}>
                                    <Block style={{width: '100%'}}>
                                        <Text  style={styles.mainQuestionText} >{translate('MainPageQuestion')}</Text>
                                    </Block>
                                </Block>

                                <Block style={styles.questionRow}>
                                    <Block style={styles.subQuestion}>
                                        <Text  style={styles.subQuestionText} >{translate('FirstQuestion')}</Text>
                                    </Block>
                                    <Block style={styles.checkboxBlock}>
                                        <CheckBox
                                        disabled={false}
                                        value={this.state.q1}
                                        onValueChange={(newValue) => this.setState({ q1: newValue})}
                                        style={styles.checkbox}
                                        />
                                    </Block>
                                    <Block style={styles.subQuestionLabel}>
                                        <Text  style={styles.subQuestionText} > {translate('YesLabel')}</Text>
                                    </Block>
                                </Block>

                                <Block style={styles.questionRow}>
                                    <Block style={styles.subQuestion}>
                                        <Text  style={styles.subQuestionText} >{translate('SecondQuestion')}</Text>
                                    </Block>
                                    <Block style={styles.checkboxBlock}>
                                        <CheckBox
                                        disabled={false}
                                        value={this.state.q2}
                                        onValueChange={(newValue) => this.setState({ q2: newValue})}
                                        style={styles.checkbox}
                                        />
                                    </Block>
                                    <Block style={styles.subQuestionLabel}>
                                        <Text  style={styles.subQuestionText} > {translate('YesLabel')}</Text>
                                    </Block>
                                </Block>

                                <Block style={styles.questionRow}>
                                    <Block style={styles.subQuestion}>
                                        <Text  style={styles.subQuestionText} >{translate('ThirdQuestion')}</Text>
                                    </Block>
                                    <Block style={styles.checkboxBlock}>
                                        <CheckBox
                                        disabled={false}
                                        value={this.state.q3}
                                        onValueChange={(newValue) => this.setState({ q3: newValue})}
                                        style={styles.checkbox}
                                        />
                                    </Block>
                                    <Block style={styles.subQuestionLabel}>
                                        <Text  style={styles.subQuestionText} > {translate('YesLabel')}</Text>
                                    </Block>
                                </Block>
                            </Block>

                            {(this.state.q1 || this.state.q2 || this.state.q3) ? 
                                (
                                    <Block style={styles.row}>
                                        <Block style={styles.alertBox}>
                                            <Text style={styles.alertTextHead}>
                                                {translate('SurveyResult')}
                                            </Text>
                                            <Text style={styles.alertText}>
                                                {translate('SurveySuggest')}
                                            </Text>
                                        </Block>
                                    </Block>
                                )
                                :(
                                    <Block middle>
                                       
                                    </Block>
                                )
                            }

                            
        
                            
                        </Block>
                    </Block>
                </ScrollView>
                <Block style={styles.buttonSection}>
                    {(this.state.q1 || this.state.q2 || this.state.q3) ? 
                        (
                            <Block style={styles.row}>
                            </Block>
                        )
                        :(
                            <Block style={styles.row}>
                                <Block style={{width: '100%', alignItems: 'center'}}>
                                    <Button style={styles.primaryButton}
                                        onPress={() => this.nextButton()}
                                    >
                                        <Text style={styles.primaryButtonText}>
                                            {translate('NextButton')}
                                        </Text>
                                    </Button>
                                </Block>
                            </Block>
                        )
                    }
                    <Block style={styles.row}>
                        <Block style={{width: '100%', alignItems: 'center'}}>
                            <Button style={styles.backButton}
                            onPress={() => this.backHome()}
                            >
                                <Text style={styles.backButtonText}>
                                    {translate('BackButton')}
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
    alertBox : {
        backgroundColor: themeColor.COLORS.ALERT,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: themeColor.COLORS.ALERT_BORDER,
        padding: 10,
        marginBottom: 20,
        width: '100%',
    },
    alertTextHead : {
        fontSize: 16,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.ALERT_TEXT,
        textAlign: "center"
    },
    alertText : {
        fontSize: 14,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.ALERT_TEXT,
        textAlign: "center"
    },

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
        position: 'relative',
        marginBottom: 20,
    },
    pageHeader : {
        fontSize: 24,
        fontFamily: 'Sarabun-Bold',
        color: themeColor.COLORS.PRIMARY
    },
    
    mainQuestionText : {
        fontSize: 18,
        fontFamily: 'Sarabun-Light',
        color: themeColor.COLORS.PRIMARY,
        marginBottom: 10
    },
    row: {
        flex: 1, 
        flexDirection: 'row'
    },
    questionRow: {
        flex: 1, 
        flexDirection: 'row',
    },
    subQuestion:{
        paddingVertical: 5,
        paddingLeft: 10,
        width: '70%',
        height: 50,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: themeColor.COLORS.BORDER_COLOR,
    },
    checkboxBlock:{
        paddingVertical: 5,
        width: '15%',
        height: 50,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: themeColor.COLORS.BORDER_COLOR,
    },
    subQuestionLabel:{
        paddingVertical: 5,
        paddingLeft: 5,
        width: '15%',
        height: 50,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: themeColor.COLORS.BORDER_COLOR,
    },
    checkbox: {
        alignSelf: "center",
    },
    subQuestionText:{
        fontSize: 18,
        fontFamily: 'Sarabun-Medium',
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
        flex: 1, 
        width: '100%',
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: themeColor.COLORS.PRIMARY_BTN_SUCCESS,
    },
    backButton:{
        width: '100%',
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: themeColor.COLORS.WHITE,
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

// export default UserSurvey;
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
export default connect(mapStateToProps, mapDispatchToProps)(UserSurvey);