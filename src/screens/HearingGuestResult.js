import React, {useState} from 'react';
import {connect} from 'react-redux';
import AuthService from '../services/AuthService';
import TestToneService from '../services/TestToneService';
import {CommonActions } from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

import { ActivityIndicator, StyleSheet, Dimensions, ImageBackground, Image, ScrollView , View,KeyboardAvoidingView , TouchableWithoutFeedback, Keyboard,TextInput, Alert} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button, Input } from "../components";
const { height, width } = Dimensions.get("screen");

import {LanguageService} from "../services/LanguageService";
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import mainStyle  from "../constants/mainStyle";

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)

const styles = mainStyle.styles;

class HearingGuestResult extends React.Component {
    constructor(props) {
        super(props);
        console.log("----- HearingGuestResult -----");
        console.log(JSON.stringify(this.props));
        this.state = {
            loading:false,
            UserEmail:'',
            UserPassword:''
        };

         
        var lang = this.props.deviceInfo.language;
        this.setDeviceLanguage(lang);
    }

    setDeviceLanguage(lang){
        console.log("SET DEVICE Language = " + lang);
        translate.cache.clear();
        LanguageService.getInstance().changeLanguage(lang);
        
    }
    
    login(){
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';

        const {UserEmail,UserPassword}=this.state
        var isError = false;
        var MissingRequireFieldMessage = translate('RequireField');
        var fieldList = [];
        if(!this.props.network.isConnected){
            isError = true;
            alertMessage = translate('InternetRequire');
        }else{
            if(UserEmail == "" || UserEmail == null || UserEmail == undefined) fieldList.push(translate('EmailLabel'));
            if(UserPassword == "" || UserPassword == null || UserPassword == undefined) fieldList.push(translate('PasswordLabel'));

            if(fieldList.length > 0){
                isError = true;
                alertMessage = MissingRequireFieldMessage + '\n';
                for(let index = 0; index < fieldList.length; index++){
                    if(index > 0) alertMessage += '\n';
                    alertMessage += '  - ' + fieldList[index];
                }
            }
            
        }
        
        if(isError){
            this.showAlert(alertTitle, alertMessage);
        }else{
            this.UserLoginFunction();
        }
    }

    // async storeUserInformation(user) 
    storeUserInformation = async(user) =>{
        try {
            await AsyncStorage.setItem("UserInfo", JSON.stringify(user));
            console.log("storeUserInformation", "information have been store");
        } catch (error) {
            var alertTitle = translate('AlertTitleError');
            var alertMessage = 'storeUserInformation = ' + error;
            this.showAlert(alertTitle, alertMessage);
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
    

    loadTestTone = async(userId, brandModel) =>{
        this.setState({loading:true});
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';
        try {

            var testToneResult = await TestToneService.test_tone_api(userId, brandModel);
            // console.log(testToneResult);
            this.setState({loading:false});
            if(testToneResult){
                if (testToneResult.ok) {
                    if (testToneResult.data != undefined && testToneResult.data != null) {
                        var data = testToneResult.data;
                        console.log('login load test tone data ' + JSON.stringify(data));
                        this.props.loadTestToneList(data);
                        let storeTestTone =  await this.storeTestToneList(data);
                        this.gotoHomeUser();
                    } else {
                        alertMessage = 'Server error no data return.';
                        this.showAlert(alertTitle, alertMessage);
                    }
                } else {
                    var problem = testToneResult.problem;
                    var status  = testToneResult.status;
                    alertMessage = 'Server status: ' + status + ' error: ' + problem;
                    this.showAlert(alertTitle, alertMessage);
                }
            }else{
                alertMessage = 'Server error no result return.';
                this.showAlert(alertTitle, alertMessage);
            }
        
        } catch (error) {
            console.log(error);
            this.setState({ loading: false, });
            alertMessage = JSON.stringify(error);
            this.showAlert(alertTitle, alertMessage);
        }
    }

    UserLoginFunction = async() => {
        this.setState({loading:true});
        const { UserEmail ,UserPassword}  = this.state ;
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';
        try {

            var userResult = await AuthService.login_api(UserEmail,UserPassword);
            console.log(userResult);
            this.setState({loading:false});

            if(userResult){
                if (userResult.ok) {
                    if (userResult.data != undefined && userResult.data != null) {
                        var data = userResult.data;
                        console.log('userInfo', data);
                        var storeUserInfo = await this.storeUserInformation(data);
                        this.props.login(data);
                        var userId      = data.id;
                        var brandModel  = this.props.deviceInfo.model;
                        var loadTestTone= await this.loadTestTone(userId, brandModel);
                    } else {
                        alertMessage = 'Server error no data return.';
                        this.showAlert(alertTitle, alertMessage);
                    }
                } else {
                    var problem = userResult.problem;
                    var status  = userResult.status;
                    if (problem == 'CLIENT_ERROR') {
                        alertMessage = translate('LoginError');
                    } else {
                        alertMessage = 'Server status: ' + status + ' error: ' + problem;
                    }
                    this.showAlert(alertTitle, alertMessage);
                }  
            }else{
                alertMessage = 'Server error no result return.';
                this.showAlert(alertTitle, alertMessage);
            }
        
        } catch (error) {
            console.log(error);
            this.setState({ loading: false, });
            alertMessage = JSON.stringify(error);
            this.showAlert(alertTitle, alertMessage);
        }

        
    }

    goToRegister(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Register' },
                ],
            })
        );
    }

    backToHomeGuest(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'HomeGuest' },
                ],
            })
        );
    }

    gotoHomeUser(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Home' },
                ],
            })
        );
    }

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
        const {loading,UserEmail,UserPassword}=this.state;
        return (
        <Block flex style={styles.container}>
            <Block flex>
                <ImageBackground
                    // source={Images.lightBG}
                    style={{ height, width, zIndex: 1 , backgroundColor: themeColor.COLORS.WHITE}}
                >
                    {loading && <Block  style={styles.loadingBox}><ActivityIndicator size="large"  color={themeColor.COLORS.PRIMARY_BTN_SUCCESS} /></Block>}
                                      
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        enabled
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={customStyles.viewSection}> 
                                <ScrollView
                                showsVerticalScrollIndicator={true}
                                style={{ width, marginTop: '0%' }}
                                >
                                     
                                    <Block style={styles.homeContainer}>
                                        <Image source={Images.logoFaculty} style={styles.logo} />
                                        <Block space="around">
                                            <Block flex space="around">
                                                <Block  style={styles.contentContainer}>
                                                    <Block  style={styles.row}>
                                                        <Block style={{width: '100%',alignItems: 'center', marginBottom: 10}}>
                                                            <Text  style={styles.pageHeader} >{translate('ToneAllResultHeaderLabel')}</Text>
                                                        </Block>
                                                    </Block>
                                                    
                                                    <Block  style={styles.row}>
                                                        <Block style={{width: '100%', alignItems: 'center'}}>
                                                            <Text  style={customStyles.dateText} >
                                                                {this.props.guestResultInfo.startDate}
                                                            </Text>
                                                        </Block>
                                                    </Block>

                                                
                                                    {(this.props.guestResultInfo.resultSum == 'Good') ? 
                                                        (
                                                            <Block>
                                                                <Block  style={styles.row}>
                                                                    <Block style={{width: '100%', alignItems: 'center', marginBottom: 10}}>
                                                                        <Text  style={customStyles.resultSummaryText} >{translate('ToneResultInfo_Good')}</Text>
                                                                    </Block>
                                                                </Block>
                                                                <Block center>
                                                                    <Image source={Images.BannerResult_Good} style={customStyles.resultImage} />
                                                                </Block>
                                                                <Block  style={styles.row}>
                                                                    <Block style={{width: '100%', alignItems: 'center', marginBottom: 10}}>
                                                                        <Text  style={customStyles.refCode} >
                                                                        Ref. Code :  {this.props.guestResultInfo.hearingTestId}
                                                                        </Text>
                                                                    </Block>
                                                                </Block>
                                                            </Block>
                                                        )
                                                        :(
                                                            <Block>
                                                                <Block  style={styles.row}>
                                                                    <Block style={{width: '100%', alignItems: 'center', marginBottom: 10}}>
                                                                        <Text  style={customStyles.resultSummaryText} >{translate('ToneResultInfo_Bad')}</Text>
                                                                    </Block>
                                                                </Block>
                                                                <Block center>
                                                                    <Image source={Images.BannerResult_Bad} style={customStyles.resultImage} />
                                                                </Block>
                                                                <Block  style={styles.row}>
                                                                    <Block style={{width: '100%', alignItems: 'center', marginBottom: 10}}>
                                                                        <Text  style={customStyles.refCode} >
                                                                        Ref. Code :  {this.props.guestResultInfo.hearingTestId}
                                                                        </Text>
                                                                    </Block>
                                                                </Block>
                                                                <Block  style={styles.row}>
                                                                    <Block style={{width: '100%', alignItems: 'center', marginBottom: 10}}>
                                                                        <Text  style={customStyles.suggestionText} >{translate('ToneResultInfo_BadSuggestion')}</Text>
                                                                    </Block>
                                                                </Block>
                                                            </Block>
                                                        )
                                                    }   
                                                </Block>                           
                                            </Block>
                                        </Block>
                                    </Block>
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                    <Block style={styles.buttonSection}>
                        <Block style={styles.row}>
                            <Block style={{width: '100%', alignItems: 'center'}}>
                                <Button style={styles.primaryButton}
                                    onPress={() => this.login()}
                                    >
                                        <Text style={styles.primaryButtonText}>
                                            {translate('Login')}
                                        </Text>
                                </Button>
                            </Block>
                        </Block>
                        <Block style={styles.row}>
                            <Block style={{width: '100%', alignItems: 'center'}}>
                                <Button style={styles.secondaryButton}
                                    onPress={() => this.goToRegister()}
                                    >
                                        <Text style={styles.secondaryButtonText}>
                                            {translate('RegisterButton')}
                                        </Text>
                                </Button>
                            </Block>
                        </Block>
                        <Block style={styles.row}>
                            <Block style={{width: '100%', alignItems: 'center'}}>
                                <Button style={styles.tridaryButton}
                                    onPress={() => this.backToHomeGuest()}
                                    >
                                        <Text style={styles.tridaryButtonText}>
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
    mainText :{
        fontSize: 22,
        fontFamily: 'Sarabun-Bold',
        color: themeColor.COLORS.PRIMARY,
    },
    dateText : {
        fontSize: 16,
        fontFamily: 'Sarabun-Light',
        color: themeColor.COLORS.PRIMARY,
        marginBottom: 10
    },
    resultSummaryText:{
        fontSize: 22,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.PRIMARY,
        marginBottom: 10
    },
    refCode:{
        fontSize: 18,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.PRIMARY,
        marginVertical: 10
    },
    suggestionText : {
        fontSize: 16,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.PRIMARY,
        marginBottom: 10,
        paddingHorizontal: 20,
        textAlign: 'center'
    },
    viewSection :{
        width: '100%',
        alignItems: 'center',
        height: '70%',
       
    },
    resultImage: {
        width: 120,
        height: 100
    },
    registerContainer: {
        margin: 10
    },
});
HearingGuestResult.defaultProps = {
    id: '',
    token: ''
};

const mapStateToProps = state => {
    return {
        network: state.network,
        userInfo : state.user,
        ...state.deviceInfo,
        ...state.testToneList,
        ...state.guestTestResult
    };
};

const mapDispatchToProps = dispatch => {
    const {actions} = require('../redux/UserRedux');
    const {testToneActions} = require('../redux/TestToneRedux');
    

    return {
        login: customers => dispatch(actions.login(customers)),
        logout: () => dispatch(actions.logout()),
        loadTestToneList: testToneList => dispatch(testToneActions.loadTestToneList(testToneList))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HearingGuestResult);