import React, { Component } from 'react';

import {CommonActions } from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView , View, NativeModules} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button } from "../components";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
 
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

var gender_radio_props = [
    {label: translate('FemaleLabel'), value: 'Female' },
    {label: translate('MaleLabel'), value: 'Male' }
  ];
   
class TesterSurvey extends Component {

  
    constructor(props) {
        super(props);
        this.state = {
            q1 : false,
            q2 : false,
            q3 : false,
            AnswerGender:'',
            AnswerAge: ''
        };

        console.log('----- User Survey -----');
        console.log(JSON.stringify(this.props));

        this.getDeviceInfo();

        this.getToken().then( response =>{
            if(!this.props.network.isConnected){
                console.log('No Internet');
                this.getTestToneList();
            }else{
                console.log('Internet Connected');
                let userToken = this.state.userInfo.token;
                console.log(this.props.deviceInfo );
                let deviceModel = DeviceInfo.getModel();
                console.log(" deviceModel = " + deviceModel);
                this.loadTestTone(userToken, deviceModel);
            }
        })
    };

    toggleGender  = (gender)=>{
        this.setState({
            AnswerGender: gender,
        })
    }

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


    async getToken() {
        try {
            let userData = await AsyncStorage.getItem("UserInfo");
            let data = JSON.parse(userData);
            console.log('Login get token = ', data);
            this.setState({
                userInfo : data
            });
        } catch (error) {
            console.log("Something went wrong, get token = ", error);
        }
    }

    async getTestToneList() {
        try {
        let testToneListData = await AsyncStorage.getItem("TestToneList");
        let data = JSON.parse(testToneListData);
        console.log('TestToneList = ', data.length);
        this.props.loadTestToneList(data);
        } catch (error) {
        console.log("Something went wrong, get token = ", error);
        }
    }

    // async storeTestToneList(testToneList) 
    storeNewTestToneList = async(testToneList) =>{
        try {
            await AsyncStorage.setItem("TestToneList", JSON.stringify(testToneList));
            console.log("storeTestToneList", "information have been store");
        } catch (error) {
            console.log("Something went wrong, store token = ", error);
        }
    }

    loadTestTone = (userToken, deviceModel) =>{
        try {
        TestToneService.test_tone_api(userToken, deviceModel)
        .then(responseJson => {
            console.log('test_tone_api responseJson = ', responseJson.status);
            if (responseJson.ok) {
            if (responseJson.data != null) {
                var data = responseJson.data;
                this.props.loadTestToneList(data);
                this.storeNewTestToneList(data);
            } else {
                alert('server error no data')
            }
            } else {
            if (responseJson.problem == 'NETWORK_ERROR') {
                alert('server error = NETWORK_ERROR')
                this.setState({
                loading: false,
                });
            } else if (responseJson.problem == 'TIMEOUT_ERROR') {
                alert('server error = TIMEOUT_ERROR')
                this.setState({
                loading: false,
                });
            } else {
                alert('server error responseJson ERROR')
                this.setState({
                loading: false,
                });
            }
            }
        })
        .catch(error => {
            console.error(error);
        });
        
        } catch (e) {
            console.error(error);
            this.setState({
                loading: false,
            });
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
        let testData = this.props.testToneList;
        let parseTestData = [];
        
        if(testData != null && testData != undefined){
            console.log(testData);
            let userID = this.props.userInfo.user.id;
            let translateMenu = {
                "TonePlaySuggestionHeaderLabel": translate('TonePlaySuggestionHeaderLabel'),
                "TonePlaySuggestionDescription": translate('TonePlaySuggestionDescription'),
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
                "CancelButton" : translate('CancelButton')
            }

            console.log(translateMenu);
            // NativeModules.HearingTestModule.GotoActivity(
            //     JSON.stringify(userID),
            //     JSON.stringify(testData),
            //     JSON.stringify(translateMenu)
            // );
        }
        
    }

    onPress(val){
        console.log(val);
        // this.setState({
        //     AnswerGender: val,
        // });
    }
  

    render() {
        const { navigation } = this.props;
        const {loading,  AnswerGender, AnswerAge } = this.state;
        return (
        <Block flex style={styles.container}>
            <Block flex>
            <ImageBackground
                // source={Images.lightBG}
                style={{ height, width, zIndex: 1 , backgroundColor: themeColor.COLORS.WHITE}}
            >
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
                                    <Block style={{width: '100%', alignItems: 'center', marginBottom: 10}}>
                                        <Text  style={styles.pageHeader} >{translate('TesterSurveyHeaderLabel')}</Text>
                                    </Block>
                                </Block>
                                
                                <Block  style={styles.row}>
                                    <Block style={{width: '100%'}}>
                                        <Text  style={styles.mainQuestionText} >{translate('TesterSurveyInfo')}</Text>
                                    </Block>
                                </Block>

                                <Block style={styles.row}>
                                    <Block style={styles.subQuestionBlock}>
                                        <Text  style={styles.subQuestionText} >{translate('GenderLabel')}</Text>
                                    </Block>
                                </Block>
                                <Block style={styles.subQuestion}>
                                    <Block style={styles.row}>
                                        <Block style={{width: '100%'}}>
                                            {/* <RadioForm
                                                radio_props={gender_radio_props}
                                                initial={0}
                                                formHorizontal={true}
                                                onPress={(value) => {this.setState({value:value})}}
                                            /> */}
                                            <RadioForm
                                                formHorizontal={true}
                                                animation={true}
                                            >
                                                {/* To create radio buttons, loop through your array of options */}
                                                {
                                                    gender_radio_props.map((obj, i) => (
                                                        <RadioButton labelHorizontal={true} key={obj.value} >
                                                           
                                                            <RadioButtonInput
                                                                obj={obj}
                                                                index={obj.valuei}
                                                                isSelected={this.state.AnswerGender === obj.value}
                                                                borderWidth={1}
                                                                buttonInnerColor={themeColor.COLORS.BTN_SECONDARY}
                                                                buttonOuterColor={this.state.AnswerGender === obj.value ? themeColor.COLORS.BTN_SECONDARY : '#000'}
                                                                onPress={this.onPress(obj.value)}
                                                            />
                                                            <RadioButtonLabel
                                                                obj={obj}
                                                                index={obj.value}
                                                                labelHorizontal={true}
                                                                onPress={this.onPress(obj.value)}
                                                                labelStyle={{fontSize: 18,
                                                                    fontFamily: 'Sarabun-Medium',
                                                                    color: themeColor.COLORS.PRIMARY,
                                                                    width: 150,
                                                                    backgroundColor: themeColor.COLORS.ALERT_SUCCESS_BG
                                                                }}
                                                                labelWrapStyle={{}}
                                                            />
                                                        </RadioButton>
                                                    ))
                                                }  
                                            </RadioForm>
                                        </Block>
                                        <Block style={styles.checkboxBlock}>
                                            <CheckBox
                                                value = {AnswerGender ==  'female'} 
                                                onValueChange = {()=> this.toggleGender('female')}
                                                style={styles.checkbox}
                                            />
                                        </Block>
                                        <Block style={styles.subQuestionLabel}>
                                            <Text  style={styles.subQuestionText} > {translate('FemaleLabel')}</Text>
                                        </Block>
                                        <Block style={styles.checkboxBlock}>
                                            <CheckBox
                                                value = {AnswerGender ==  'male'} 
                                                onValueChange = {()=> this.toggleGender('male')}
                                                style={styles.checkbox}
                                            />
                                        </Block>
                                        <Block style={styles.subQuestionLabel}>
                                            <Text  style={styles.subQuestionText} > {translate('MaleLabel')}</Text>
                                        </Block>

                                        
                                    </Block>
                                </Block>
                            
                                <Block style={styles.row}>
                                    <Block style={styles.subQuestionBlock}>
                                        <Text  style={styles.subQuestionText} >{translate('TesterSurveyAgeLabel')}</Text>
                                    </Block>
                                </Block>
                                <Block style={styles.subQuestion}>
                                    <Block style={styles.row}>
                                        <Block style={styles.checkboxBlock}>
                                            <CheckBox
                                                value = {AnswerGender ==  'female'} 
                                                onValueChange = {()=> this.toggleGender('female')}
                                                style={styles.checkbox}
                                            />
                                        </Block>
                                        <Block style={styles.subQuestionLabel}>
                                            <Text  style={styles.subQuestionText} > {translate('TesterKidLabel')}</Text>
                                        </Block>
                                        <Block style={styles.checkboxBlock}>
                                            <CheckBox
                                                value = {AnswerGender ==  'male'} 
                                                onValueChange = {()=> this.toggleGender('male')}
                                                style={styles.checkbox}
                                            />
                                        </Block>
                                        <Block style={styles.subQuestionLabel}>
                                            <Text  style={styles.subQuestionText} > {translate('TesterAdultLabel')}</Text>
                                        </Block>
                                    </Block>
                                    <Block style={styles.row}>
                                        <Block style={styles.checkboxBlock}>
                                            <CheckBox
                                                value = {AnswerGender ==  'female'} 
                                                onValueChange = {()=> this.toggleGender('female')}
                                                style={styles.checkbox}
                                            />
                                        </Block>
                                        <Block style={styles.subQuestionLabel}>
                                            <Text  style={styles.subQuestionText} > {translate('TesterChildLabel')}</Text>
                                        </Block>
                                        <Block style={styles.checkboxBlock}>
                                            <CheckBox
                                                value = {AnswerGender ==  'male'} 
                                                onValueChange = {()=> this.toggleGender('male')}
                                                style={styles.checkbox}
                                            />
                                        </Block>
                                        <Block style={styles.subQuestionLabel}>
                                            <Text  style={styles.subQuestionText} > {translate('TesterElderLabel')}</Text>
                                        </Block>
                                    </Block>
                                    <Block style={styles.row}>
                                        <Block style={styles.checkboxBlock}>
                                            <CheckBox
                                                value = {AnswerGender ==  'female'} 
                                                onValueChange = {()=> this.toggleGender('female')}
                                                style={styles.checkbox}
                                            />
                                        </Block>
                                        <Block style={styles.subQuestionLabel}>
                                            <Text  style={styles.subQuestionText} > {translate('TesterTeenLabel')}</Text>
                                        </Block>
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
                                onPress={() => this.nextButton()}
                                >
                                    <Text style={styles.primaryButtonText}>
                                        {translate('NextButton')}
                                    </Text>
                            </Button>
                        </Block>
                    </Block>
                    <Block style={styles.row}>
                        <Block style={{width: '100%', alignItems: 'center'}}>
                            <Button style={styles.backButton}
                                onPress={() => this.backButton()}
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
        zIndex: 2,
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
    container: {
        // marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
        // marginBottom: -HeaderHeight * 2,
        flex: 1
    },
    viewSection :{
        width: '100%',
        alignItems: 'center',
        height: '75%'
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