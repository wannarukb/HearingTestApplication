import Config from '../constants/Config';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {CommonActions } from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView , View, ActivityIndicator, Alert, NativeModules} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button } from "../components";
import { RadioButton } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import TestToneService from '../services/TestToneService';

import {LanguageService} from "../services/LanguageService";
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

import mainStyle  from "../constants/mainStyle";

var postTestToneResultURL = Config.CONNECTIONS.server_url + Config.CONNECTIONS.post_testToneResult;
var postContactInfoURL    = Config.CONNECTIONS.server_url + Config.CONNECTIONS.post_userContactInfo;

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)

const { height, width } = Dimensions.get("screen");
const styles = mainStyle.styles;

class TesterSurvey extends Component {

    constructor(props) {
        super(props);
        this.state = {
            AnswerGender:'',
            AnswerAge: ''
        };

        console.log('----- Tester Survey -----');
        console.log(JSON.stringify(this.props));

        var lang = this.props.deviceInfo.language;
        this.setDeviceLanguage(lang);
    };
    
    setDeviceLanguage(lang){
        console.log("SET DEVICE Language = " + lang);
        translate.cache.clear();
        LanguageService.getInstance().changeLanguage(lang);
        
    }

    async getTestToneList() {
        try {
            let testToneListData = await AsyncStorage.getItem("TestToneList");
            let data = JSON.parse(testToneListData);
            console.log('TestToneList = ', data.length);
            this.props.loadTestToneList(data);
            this.startHearingTest(data);
        } catch (error) {
            console.log("Something went wrong, get token = ", error);
        }
    }

      // async storeTestToneList(testToneList) 
    storeTestToneList = async(testToneList) =>{
        try {
            await AsyncStorage.setItem("TestToneList", JSON.stringify(testToneList));
            console.log("storeTestToneList", "information have been store");
        } catch (error) {
            var alertTitle = translate('AlertTitleError');
            var alertMessage = 'storeTestToneList = ' + error;
            this.showAlert(alertTitle, alertMessage);
        }
    }

    loadTestTone = async(userID, brandModel) =>{
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';
        try {

            var testToneResult = await TestToneService.test_tone_api(userID, brandModel);
            console.log(testToneResult);
            this.setState({loading:false});
            if(testToneResult){
                if (testToneResult.ok) {
                    if (testToneResult.data != undefined && testToneResult.data != null) {
                        var data = testToneResult.data;
                        console.log('Tester Survey, load test tone data ' + JSON.stringify(data));
                        if(data && data.length != 0){
                            this.props.loadTestToneList(data);
                            let storeTestTone =  await this.storeTestToneList(data);
                        }else{
                            data = [{"testToneID":21,"protocolID":3,"orderNo":1,"frequency":125.0,"dbHL":"25 ","dbSPL":70.0,"amplitude":0.32,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":22,"protocolID":3,"orderNo":2,"frequency":250.0,"dbHL":"45 ","dbSPL":70.5,"amplitude":0.1,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":23,"protocolID":3,"orderNo":3,"frequency":500.0,"dbHL":"60 ","dbSPL":71.5,"amplitude":0.7,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""},{"testToneID":24,"protocolID":3,"orderNo":4,"frequency":750.0,"dbHL":"65 ","dbSPL":73.0,"amplitude":0.3,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":25,"protocolID":3,"orderNo":5,"frequency":1000.0,"dbHL":"65 ","dbSPL":72.0,"amplitude":0.48,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":26,"protocolID":3,"orderNo":6,"frequency":1500.0,"dbHL":"65 ","dbSPL":71.5,"amplitude":0.5,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""}];
                            let storeTestTone =  await this.storeTestToneList(data);
                        }
                        this.startHearingTest(data);
                    } else {
                        alertMessage = 'Server error no data return.';
                        //this.showAlert(alertTitle, alertMessage);
                        let mockTestData = [{"testToneID":21,"protocolID":3,"orderNo":1,"frequency":125.0,"dbHL":"25 ","dbSPL":70.0,"amplitude":0.32,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":22,"protocolID":3,"orderNo":2,"frequency":250.0,"dbHL":"45 ","dbSPL":70.5,"amplitude":0.1,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":23,"protocolID":3,"orderNo":3,"frequency":500.0,"dbHL":"60 ","dbSPL":71.5,"amplitude":0.7,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""},{"testToneID":24,"protocolID":3,"orderNo":4,"frequency":750.0,"dbHL":"65 ","dbSPL":73.0,"amplitude":0.3,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":25,"protocolID":3,"orderNo":5,"frequency":1000.0,"dbHL":"65 ","dbSPL":72.0,"amplitude":0.48,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":26,"protocolID":3,"orderNo":6,"frequency":1500.0,"dbHL":"65 ","dbSPL":71.5,"amplitude":0.5,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""}];
                        this.startHearingTest(mockTestData);
                    }
                } else {
                    var problem = testToneResult.problem;
                    var status  = testToneResult.status;
                    alertMessage = 'Server status: ' + status + ' error: ' + problem;
                    // this.showAlert(alertTitle, alertMessage);
                    let mockTestData = [{"testToneID":21,"protocolID":3,"orderNo":1,"frequency":125.0,"dbHL":"25 ","dbSPL":70.0,"amplitude":0.32,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":22,"protocolID":3,"orderNo":2,"frequency":250.0,"dbHL":"45 ","dbSPL":70.5,"amplitude":0.1,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":23,"protocolID":3,"orderNo":3,"frequency":500.0,"dbHL":"60 ","dbSPL":71.5,"amplitude":0.7,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""},{"testToneID":24,"protocolID":3,"orderNo":4,"frequency":750.0,"dbHL":"65 ","dbSPL":73.0,"amplitude":0.3,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":25,"protocolID":3,"orderNo":5,"frequency":1000.0,"dbHL":"65 ","dbSPL":72.0,"amplitude":0.48,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":26,"protocolID":3,"orderNo":6,"frequency":1500.0,"dbHL":"65 ","dbSPL":71.5,"amplitude":0.5,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""}];
                    this.startHearingTest(mockTestData);
                }
            }else{
                alertMessage = 'Server error no result return.';
                //this.showAlert(alertTitle, alertMessage);
                let mockTestData = [{"testToneID":21,"protocolID":3,"orderNo":1,"frequency":125.0,"dbHL":"25 ","dbSPL":70.0,"amplitude":0.32,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":22,"protocolID":3,"orderNo":2,"frequency":250.0,"dbHL":"45 ","dbSPL":70.5,"amplitude":0.1,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":23,"protocolID":3,"orderNo":3,"frequency":500.0,"dbHL":"60 ","dbSPL":71.5,"amplitude":0.7,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""},{"testToneID":24,"protocolID":3,"orderNo":4,"frequency":750.0,"dbHL":"65 ","dbSPL":73.0,"amplitude":0.3,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":25,"protocolID":3,"orderNo":5,"frequency":1000.0,"dbHL":"65 ","dbSPL":72.0,"amplitude":0.48,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":26,"protocolID":3,"orderNo":6,"frequency":1500.0,"dbHL":"65 ","dbSPL":71.5,"amplitude":0.5,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""}];
                this.startHearingTest(mockTestData);
            }
        
        } catch (error) {
            console.log(error);
            this.setState({ loading: false, });
            alertMessage = JSON.stringify(error);
            // this.showAlert(alertTitle, alertMessage);
            let mockTestData = [{"testToneID":21,"protocolID":3,"orderNo":1,"frequency":125.0,"dbHL":"25 ","dbSPL":70.0,"amplitude":0.32,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":22,"protocolID":3,"orderNo":2,"frequency":250.0,"dbHL":"45 ","dbSPL":70.5,"amplitude":0.1,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":23,"protocolID":3,"orderNo":3,"frequency":500.0,"dbHL":"60 ","dbSPL":71.5,"amplitude":0.7,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""},{"testToneID":24,"protocolID":3,"orderNo":4,"frequency":750.0,"dbHL":"65 ","dbSPL":73.0,"amplitude":0.3,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":25,"protocolID":3,"orderNo":5,"frequency":1000.0,"dbHL":"65 ","dbSPL":72.0,"amplitude":0.48,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":26,"protocolID":3,"orderNo":6,"frequency":1500.0,"dbHL":"65 ","dbSPL":71.5,"amplitude":0.5,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""}];
            this.startHearingTest(mockTestData);
        }
    }

    backButton(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Consent' },
                ],
            })
        );
    }

    nextButton(){
        this.setState({ loading: true, });
        console.log(this.state);

        var userID          = (this.props.userInfo.isGuest) ? this.props.userInfo.user.userId : this.props.userInfo.user.id;
        var brandModel      = (this.props.deviceInfo.model) ? this.props.deviceInfo.model : DeviceInfo.getModel();

        if(!this.props.network.isConnected){
            console.log('No Internet');
            this.getTestToneList();
        }else{
            console.log('Internet Connected');
            this.loadTestTone(userID, brandModel);
        }
        
    }

    startHearingTest(testToneData){

        let userID      = (this.props.userInfo.isGuest) ? this.props.userInfo.user.userId : this.props.userInfo.user.id;
        var brandModel  = (this.props.deviceInfo.model) ? this.props.deviceInfo.model : DeviceInfo.getModel();

        let gender      = this.state.AnswerGender;
        let ageRange    = this.state.AnswerAge;
        
        var alertTitle = translate('AlertTitleError');
        if(testToneData.length == 0){
           
            var alertMessage = translate('ErrorNoTestData');
            alertMessage += "\n\nuser: " + userID + "\nmodel: " + brandModel;
            this.showAlert(alertTitle, alertMessage);
        }else{
            let testData = this.props.testToneList;
            let parseTestData = [];

            console.log(testData);
            //testData = [{"testToneID":21,"protocolID":3,"orderNo":1,"frequency":125.0,"dbHL":"25 ","dbSPL":70.0,"amplitude":0.32,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":22,"protocolID":3,"orderNo":2,"frequency":250.0,"dbHL":"45 ","dbSPL":70.5,"amplitude":0.1,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":23,"protocolID":3,"orderNo":3,"frequency":500.0,"dbHL":"60 ","dbSPL":71.5,"amplitude":0.7,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""},{"testToneID":24,"protocolID":3,"orderNo":4,"frequency":750.0,"dbHL":"65 ","dbSPL":73.0,"amplitude":0.3,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"Both","roundRandom":""},{"testToneID":25,"protocolID":3,"orderNo":5,"frequency":1000.0,"dbHL":"65 ","dbSPL":72.0,"amplitude":0.48,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"L","roundRandom":""},{"testToneID":26,"protocolID":3,"orderNo":6,"frequency":1500.0,"dbHL":"65 ","dbSPL":71.5,"amplitude":0.5,"durationMin":3.0,"durationMax":3.0,"upDB":null,"downDB":null,"intervalMin":2.0,"intervalMax":2.0,"testRoundMin":1.0,"testRoundMax":1.0,"testSide":"R","roundRandom":""}];
             
            try{
                if(testData != null && testData != undefined){
                    console.log(testData);
                    console.log("User ID : " + userID);
                    console.log("Gender : " + gender);
                    console.log("Age : " + ageRange);

                    let userInformation   = {
                        userID  : userID,
                        firstName : this.props.userInfo.user.fn,
                        lastName  : this.props.userInfo.user.ln,
                        gender    : gender,
                        ageRange : ageRange
                    }

                    let translateMenu = {
                        "StartHeaderLabel": translate('StartHeaderLabel'),
                        "SuggestionLine1": translate('SuggestionLine1'),
                        "SuggestionLine2": translate('SuggestionLine2'),
                        "WarningLabel": translate('WarningLabel'),
                        "WarningDescription": translate('WarningDescription'),
                        "StartPlayToneButton": translate('StartPlayToneButton'),
                        "TonePlayHeaderLabel": translate('TonePlayHeaderLabel'),
                        "TonePlayDescription": translate('TonePlayDescription'),
                        "HearToneButton": translate('HearToneButton'),
                        "ToneResultIntro": translate('ToneResultIntro'),
                        "ToneResultLabel": translate('ToneResultLabel'),
                        "ToneResultInfo_Good": translate('ToneResultInfo_Good'),
                        "ToneResultInfo_GoodSuggestion": translate('ToneResultInfo_GoodSuggestion'),
                        "ToneResultInfo_Bad": translate('ToneResultInfo_Bad'),
                        "ToneResultInfo_BadSuggestion": translate('ToneResultInfo_BadSuggestion'),
                        "GoBackToHomePageButton": translate('GoBackToHomePageButton'),
                        "CancelButton" : translate('CancelButton'),
                        "NextButton"   : translate('NextButton'),

                        "UserSurveyHeaderLabel" : translate('UserSurveyHeaderLabel'),
                        "MainPageQuestion" : translate('MainPageQuestion'),
                        "FirstQuestion": translate('FirstQuestion'),
                        "SecondQuestion": translate('SecondQuestion'),
                        "ThirdQuestion": translate('ThirdQuestion'),
                        "CheckResultButton" : translate('CheckResultButton'),
                        "YesLabel"     : translate('YesLabel'),
                        "TryAgainButton" : translate('TryAgainButton'),
                        "UserContactButton" : translate('UserContactButton'),
                        "ConfirmButton": translate('ConfirmButton'),

                        "UserContactHeader": translate('UserContactHeader'),
                        "UserContactSubHeader": translate('UserContactSubHeader'),
                        "UserContactNameLabel": translate('UserContactNameLabel'),
                        "UserContactNoLabel": translate('UserContactNoLabel'),
                        "UserContactRefCodeLabel": translate('UserContactRefCodeLabel'),
                        "SuccessReceiveContact": translate('SuccessReceiveContact'),
                        "SuccessReceiveContactDetail": translate('SuccessReceiveContactDetail'),
                        "FailedReceiveContact": translate('FailedReceiveContact'),
                        "RequireFieldMissing" : translate('RequireFieldMissing'),


                        "PostTestToneResult" : postTestToneResultURL,
                        "PostUserContactInfo" : postContactInfoURL
                    }

                    console.log(translateMenu);

                    NativeModules.HearingTestModule.GotoActivity(
                        JSON.stringify(userID),
                        JSON.stringify(userInformation),
                        JSON.stringify(testData),
                        JSON.stringify(translateMenu)
                    );
                }
                
                
                // NativeModules.HearingTestModule.GotoActivity(
                //     JSON.stringify(userInformation),
                //     JSON.stringify(testData),
                //     JSON.stringify(translateMenu)
                // );
                
            }catch(error){
                console.log(error);
                this.setState({ loading: false, });
                alertMessage = JSON.stringify(error);
                this.showAlert(alertTitle, alertMessage);
            }
        }
    }

    onSelectGender = ( item ) => {
        console.log(item);
        this.setState({
            AnswerGender: item,
        });
    };

    onSelectAge = ( item ) => {
        console.log(item);
        this.setState({
            AnswerAge: item,
        });
    };

    showAlert(alertTitle, alertMessage){
        console.log(alertMessage);
        Alert.alert(
            alertTitle,
            alertMessage,
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }


    render() {
        const {loading,  AnswerGender, AnswerAge } = this.state;
        return (
            <Block flex style={styles.container}>
                <Block flex>
                <ImageBackground
                    // source={Images.lightBG}
                    style={{ height, width, zIndex: 1 , backgroundColor: themeColor.COLORS.WHITE}}
                >
                    {loading && <Block  style={styles.loadingBox}><ActivityIndicator size="large"  color={themeColor.COLORS.PRIMARY_BTN_SUCCESS} /></Block>}
                    
                    <View style={styles.viewSection}> 
                    <ScrollView
                        showsVerticalScrollIndicator={true}
                        style={{ width, marginTop: '0%' }}
                    >
                        <Block style={styles.homeContainer}>
                            <Image source={Images.logoFaculty} style={styles.logo} />
                            <Block  space="around">
                                <Block  style={styles.contentContainer}>
                                    <Block  style={styles.row}>
                                        <Block style={{width: '100%',  marginBottom: 10}}>
                                            <Text  style={styles.pageHeader} >{translate('TesterSurveyHeaderLabel')}</Text>
                                        </Block>
                                    </Block>
                                    
                                    <Block  style={styles.row}>
                                        <Block style={{width: '100%'}}>
                                            <Text  style={customStyles.mainQuestionText} >{translate('TesterSurveyInfo')}</Text>
                                        </Block>
                                    </Block>

                                    <Block style={styles.row}>
                                        <Block style={customStyles.subQuestionBlock}>
                                            <Text  style={customStyles.subQuestionText} >
                                                {translate('GenderLabel')}
                                                <Text style={styles.formRequireLabel}  > * </Text>    
                                            </Text>
                                        </Block>
                                    </Block>
                                    
                                    <Block style={customStyles.subQuestion}>
                                        <Block style={styles.row}>
                                            <Block style={customStyles.checkboxBlock}>
                                                <RadioButton
                                                    value="male"
                                                    status={ AnswerGender === 'male' ? 'checked' : 'unchecked' }
                                                    onPress={() => this.onSelectGender('male')}
                                                    color={themeColor.COLORS.PRIMARY_BTN_SUCCESS}
                                                />
                                            </Block>
                                            <Block style={customStyles.subQuestionLabel}>
                                                <Text  style={customStyles.subQuestionText} > {translate('MaleLabel')}</Text>
                                            </Block>
                                            <Block style={customStyles.checkboxBlock}>
                                                <RadioButton
                                                    value="female"
                                                    status={ AnswerGender  === 'female' ? 'checked' : 'unchecked' }
                                                    onPress={() => this.onSelectGender('female')}
                                                    color={themeColor.COLORS.PRIMARY_BTN_SUCCESS}
                                                />
                                            </Block>
                                            <Block style={customStyles.subQuestionLabel}>
                                                <Text  style={customStyles.subQuestionText} > {translate('FemaleLabel')}</Text>
                                            </Block>
                                        </Block>
                                    </Block>
                                
                                    <Block style={styles.row}>
                                        <Block style={customStyles.subQuestionBlock}>
                                            <Text  style={customStyles.subQuestionText} >
                                                {translate('TesterSurveyAgeLabel')}
                                                <Text style={styles.formRequireLabel}  > * </Text>
                                            </Text>
                                        </Block>
                                    </Block>
                                    <Block style={customStyles.subQuestion}>
                                        <Block style={styles.row}>
                                            <Block style={customStyles.checkboxBlock}>
                                                <RadioButton
                                                    value="0-5"
                                                    status={ AnswerAge === '0-5' ? 'checked' : 'unchecked' }
                                                    onPress={() => this.onSelectAge('0-5')}
                                                    color={themeColor.COLORS.PRIMARY_BTN_SUCCESS}
                                                />
                                            </Block>
                                            <Block style={customStyles.subQuestionLabel}>
                                                <Text  style={customStyles.subQuestionText} > {translate('TesterKidLabel')}</Text>
                                            </Block>
                                            <Block style={customStyles.checkboxBlock}>
                                                <RadioButton
                                                    value="21-59"
                                                    status={ AnswerAge  === '21-59' ? 'checked' : 'unchecked' }
                                                    onPress={() => this.onSelectAge('21-59')}
                                                    color={themeColor.COLORS.PRIMARY_BTN_SUCCESS}
                                                />
                                            </Block>
                                            <Block style={customStyles.subQuestionLabel}>
                                                <Text  style={customStyles.subQuestionText} > {translate('TesterAdultLabel')}</Text>
                                            </Block>
                                        </Block>
                                        <Block style={styles.row}>
                                            <Block style={customStyles.checkboxBlock}>
                                                <RadioButton
                                                    value="5-14"
                                                    status={ AnswerAge === '5-14' ? 'checked' : 'unchecked' }
                                                    onPress={() => this.onSelectAge('5-14')}
                                                    color={themeColor.COLORS.PRIMARY_BTN_SUCCESS}
                                                />
                                            </Block>
                                            <Block style={customStyles.subQuestionLabel}>
                                                <Text  style={customStyles.subQuestionText} > {translate('TesterChildLabel')}</Text>
                                            </Block>
                                            <Block style={customStyles.checkboxBlock}>
                                                <RadioButton
                                                    value="60up"
                                                    status={ AnswerAge  === '60up' ? 'checked' : 'unchecked' }
                                                    onPress={() => this.onSelectAge('60up')}
                                                    color={themeColor.COLORS.PRIMARY_BTN_SUCCESS}
                                                />
                                            </Block>
                                            <Block style={customStyles.subQuestionLabel}>
                                                <Text  style={customStyles.subQuestionText} > {translate('TesterElderLabel')}</Text>
                                            </Block>
                                        </Block>
                                        <Block style={styles.row}>
                                            <Block style={customStyles.checkboxBlock}>
                                                <RadioButton
                                                    value="15-20"
                                                    status={ AnswerAge === '15-20' ? 'checked' : 'unchecked' }
                                                    onPress={() => this.onSelectAge('15-20')}
                                                    color={themeColor.COLORS.PRIMARY_BTN_SUCCESS}
                                                />
                                            </Block>
                                            <Block style={customStyles.subQuestionLabel}>
                                                <Text  style={customStyles.subQuestionText} > {translate('TesterTeenLabel')}</Text>
                                            </Block>
                                        </Block>
                                    </Block>
                                </Block>
                            </Block>
                        </Block>
                    </ScrollView>
                    </View>
                    <Block style={styles.buttonSection}>

                        {(this.state.AnswerAge == '' || this.state.AnswerGender == '') ? 
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
                                <Button style={styles.secondaryButton}
                                    onPress={() => this.backButton()}
                                    >
                                        <Text style={styles.secondaryButtonText}>
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

const customStyles = StyleSheet.create({
    
   
    
    mainQuestionText : {
        fontSize: 18,
        fontFamily: 'Sarabun-Light',
        color: themeColor.COLORS.PRIMARY,
        marginBottom: 10
    },
    
    questionRow: {
        flex: 1, 
        flexDirection: 'row',
    },
    radioButton : {
        width: 300, 
        color: themeColor.COLORS.PRIMARY, 
        fontSize: 16,
        fontFamily: 'Sarabun-Medium'
    },
    subQuestionBlock:{
        paddingVertical: 5,
        paddingLeft: 10,
        width: '100%',
        height: 50,
        justifyContent: "center",
    },
    subQuestion:{
        paddingVertical: 5,
        paddingLeft: 10,
        width: '100%',
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: themeColor.COLORS.BORDER_COLOR,
    },
    checkboxBlock:{
        paddingVertical: 5,
        width: '15%',
        height: 50,
        justifyContent: "center",
    },
    subQuestionLabel:{
        paddingVertical: 5,
        paddingLeft: 5,
        width: '35%',
        height: 50,
        justifyContent: "center",
    },
    checkbox: {
        alignSelf: "center",
        borderRadius: 50
    },
    subQuestionText:{
        fontSize: 18,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.PRIMARY
    },
    
});

// export default TesterSurvey;
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
export default connect(mapStateToProps, mapDispatchToProps)(TesterSurvey);