import React, {useState} from 'react';
import {connect} from 'react-redux';
import {CommonActions } from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import AuthService from '../services/AuthService';
import TestToneService from '../services/TestToneService';

import { StyleSheet, Dimensions, ActivityIndicator,Platform, TouchableWithoutFeedback, Keyboard, ImageBackground, Image, ScrollView, View ,KeyboardAvoidingView ,TextInput, Alert} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button } from "../components";
import { RadioButton } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';

import DeviceInfo from 'react-native-device-info';


import {LanguageService} from "../services/LanguageService";
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import mainStyle  from "../constants/mainStyle";

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)

const styles = mainStyle.styles;
const { height, width } = Dimensions.get("screen");

class Register extends React.Component {
    constructor(props) {
        super(props);
        console.log("----- Register -----");
        console.log(JSON.stringify(this.props));

        var currentDate = new Date();
        var yearValue   = currentDate.getFullYear();
        var startYear   = yearValue - 100;

        var lang = this.props.deviceInfo.language;
        var yearPickerList = [];
        for(let year = startYear; year <= yearValue; year++){
            var yearLabel = (lang == 'th') ? year + 543 : year ;
            var yearObj = {
                value : ""+year,
                label : ""+yearLabel
            }

            yearPickerList.push(yearObj);
        }
        
        this.state = {
            loading:false,
            yearList : yearPickerList
        };

       
        this.setDeviceLanguage(lang)
    }

    setDeviceLanguage(lang){
        console.log("SET DEVICE Language = " + lang);
        translate.cache.clear();
        LanguageService.getInstance().changeLanguage(lang);
    }

    onSubmitRegister(){

        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';

        const {UserEmail, UserPassword, UserFirstName, UserLastName, UserBirthYear, UserGender}=this.state
        var isError = false;
        var MissingRequireFieldMessage = translate('RequireField');
        var fieldList = [];
        if(!this.props.network.isConnected){
            isError = true;
            alertMessage = translate('InternetRequire');
        }else{
            if(UserEmail == "" || UserEmail == null  || UserEmail == undefined) fieldList.push(translate('EmailLabel'));
            else{
                let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                if (reg.test(UserEmail) === false) {
                    fieldList.push(translate('EmailFormatError'));
                }
            }
            if(UserPassword == ""  || UserPassword == null || UserPassword == undefined) fieldList.push(translate('PasswordLabel'));
            else{
                if (UserPassword.length < 6 || UserPassword.length > 10) {
                    fieldList.push(translate('PasswordLengthError'));
                }
            }
            if(UserFirstName == ""  || UserFirstName == null || UserFirstName == undefined) fieldList.push(translate('FirstNameLabel'));
            if(UserLastName == ""  || UserLastName == null || UserLastName == undefined) fieldList.push(translate('LastNameLabel'));
            if(UserBirthYear == ""  || UserBirthYear == null || UserBirthYear == undefined) fieldList.push(translate('YearOfBirthLabel'));
            if(UserGender == ""  || UserGender == null || UserGender == undefined) fieldList.push(translate('GenderLabel'));

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

            var isGuest = (this.props.userInfo.isGuest) ? this.props.userInfo.isGuest : true;
            var isAuthenticated = (this.props.userInfo.isAuthenticated) ? this.props.userInfo.isAuthenticated : false;

            if(isAuthenticated && isGuest){
                console.log("GuestRegisterFunction");
                this.GuestRegisterFunction();
            }else{
                console.log("UserRegisterFunction");
                this.UserRegisterFunction();
            }
        }
    }

    GuestRegisterFunction = async() =>{
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';
        const { UserEmail ,UserPassword, UserFirstName, UserLastName, UserBirthYear, UserGender }  = this.state ;
        this.setState({loading:true});
        try {

            console.log( this.props.userInfo);
            let registerInfo = {
                userId      : this.props.userInfo.user.userId,
                email       : UserEmail,
                password    : UserPassword,
                firstName   : UserFirstName,
                lastName    : UserLastName,
                gender      : UserGender,
                yearOfBirth : UserBirthYear + "-01-01T00:00:00.000Z"
            }
            
            console.log(registerInfo);
            var registerResult = await AuthService.register_guest_post(registerInfo);
            console.log(registerResult);
            this.setState({loading:false});

            if(registerResult){
                if (registerResult.ok) {
                    if (registerResult.data != undefined && registerResult.data != null) {
                        var data = registerResult.data;
                        console.log('RegisterResult', data);
                        this.UserLoginFunction(UserEmail, UserPassword);
                    } else {
                        alertMessage = 'Register, Server error no data return.';
                        this.showAlert(alertTitle, alertMessage);
                    }
                } else {
                    var problem = registerResult.problem;
                    var status  = registerResult.status;
                    alertMessage = 'Register, Server status: ' + status + ' error: ' + problem;
                    this.showAlert(alertTitle, alertMessage);
                }  
            }else{
                alertMessage = 'Register, Server error no result return.';
                this.showAlert(alertTitle, alertMessage);
            }
        
        } catch (error) {
            console.log(error);
            this.setState({ loading: false, });
            alertMessage = JSON.stringify(error);
            this.showAlert(alertTitle, alertMessage);
        }
    }

    UserRegisterFunction = async() => {
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';
        const { UserEmail ,UserPassword, UserFirstName, UserLastName, UserBirthYear, UserGender }  = this.state ;
        this.setState({loading:true});
        try {

            var deviceInfo       = this.props.deviceInfo;
            let registerInfo = {
                status          : "A",
                systemName      : deviceInfo.systemName,
                systemVersion   : "" + deviceInfo.systemVersion,
                istablet        : "" + deviceInfo.isTablet,
                brandmodel      : deviceInfo.model,
                deviceType      : deviceInfo.deviceType,
                users : [
                    {
                        email       : UserEmail,
                        password    : UserPassword,
                        firstName   : UserFirstName,
                        lastName    : UserLastName,
                        gender      : UserGender,
                        yearOfBirth : UserBirthYear + "-01-01T00:00:00.000Z"
                    }
                ]
            }
            console.log(registerInfo);
            var registerResult = await AuthService.register_api(registerInfo);
            console.log(registerResult);
            this.setState({loading:false});

            if(registerResult){
                if (registerResult.ok) {
                    if (registerResult.data != undefined && registerResult.data != null) {
                        var data = registerResult.data;
                        console.log('RegisterResult', data);
                        this.UserLoginFunction(UserEmail, UserPassword);
                    } else {
                        alertMessage = 'Register, Server error no data return.';
                        this.showAlert(alertTitle, alertMessage);
                    }
                } else {
                    var problem = registerResult.problem;
                    var status  = registerResult.status;
                    alertMessage = 'Register, Server status: ' + status + ' error: ' + problem;
                    this.showAlert(alertTitle, alertMessage);
                }  
            }else{
                alertMessage = 'Register, Server error no result return.';
                this.showAlert(alertTitle, alertMessage);
            }
        
        } catch (error) {
            console.log(error);
            this.setState({ loading: false, });
            alertMessage = JSON.stringify(error);
            this.showAlert(alertTitle, alertMessage);
        }
    }

    UserLoginFunction = async(loginEmail, loginPassword) => {
        this.setState({loading:true});
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';
        try {

            var userResult = await AuthService.login_api(loginEmail,loginPassword);
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

    async getToken() {
        try {
            let userData = await AsyncStorage.getItem("UserInfo");
            let data = JSON.parse(userData);
            console.log('Login get token = ', data);
        } catch (error) {
            console.log("Something went wrong, get token = ", error);
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
  

    goBackToLogin(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Login' },
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

    onSelectGender = ( item ) => {
        console.log(item);
        this.setState({
            UserGender: item,
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
        const { navigation } = this.props;
        const {loading,  UserEmail ,UserPassword, UserFirstName, UserLastName, UserBirthYear, UserGender, yearList } = this.state;

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
                            <View style={styles.viewSection}> 
                                <ScrollView
                                showsVerticalScrollIndicator={true}
                                style={{ width, marginTop: '0%' }}
                                >
                                     
                                    <Block style={styles.homeContainer}>
                                        <Image source={Images.logoFaculty} style={styles.logo} />
                                        <Block space="around">
                                            <Block  style={styles.row}>
                                                <Block style={{width: '100%', alignItems: 'center', marginBottom: 0, paddingVertical: 30}}>
                                                    <Image source={Images.Ear} style={customStyles.earImg} />
                                                    <Text style={styles.title}>
                                                        {translate('RegisterHeaderLabel')}
                                                    </Text>
                                                </Block>
                                            </Block>
                                            <Block   style={styles.row} style={{ marginBottom: 15 }}>
                                                <Block style={{width: '100%', marginBottom: 0}}>
                                                    <Text style={styles.formLabel}  >
                                                        {translate('EmailLabel')}
                                                        <Text style={styles.formRequireLabel}  > * </Text>
                                                    </Text>
                                                    
                                                    <TextInput
                                                        style={styles.inputType}
                                                        placeholderTextColor="grey"
                                                        returnKeyType="next"
                                                        keyboardType="email-address"
                                                        onChangeText={text => this.setState({ UserEmail: text })}
                                                        value={UserEmail}
                                                    />
                                                </Block>
                                            </Block>

                                            <Block   style={styles.row} style={{ marginBottom: 15 }}>
                                                <Block style={{width: '100%', marginBottom: 0}}>
                                                    <Text style={styles.formLabel}  >
                                                        {translate('PasswordLabel')}
                                                        <Text style={styles.formRequireLabel}  > * </Text>
                                                    </Text>
                                                    <TextInput
                                                        style={styles.inputType}
                                                        ref={(id)=>{this.pass_tn=id}}
                                                        placeholderTextColor="grey"
                                                        secureTextEntry={true}
                                                        autoCapitalize="none"
                                                        returnKeyType="next"
                                                        maxLength={10}
                                                        onChangeText={text => this.setState({ UserPassword: text })}
                                                        value={UserPassword}
                                                    />
                                                </Block>
                                            </Block>
                                            <Block   style={styles.row} style={{ marginBottom: 15 }}>
                                                <Block style={{width: '100%', marginBottom: 0}}>
                                                    <Text style={styles.formLabel}  >
                                                        {translate('FirstNameLabel')}
                                                        <Text style={styles.formRequireLabel}  > * </Text>
                                                    </Text>
                                                    <TextInput
                                                        style={styles.inputType}
                                                        placeholderTextColor="grey"
                                                        returnKeyType="next"
                                                        onChangeText={text => this.setState({ UserFirstName: text })}
                                                        value={UserFirstName}
                                                    />
                                                </Block>
                                            </Block>
                                            <Block   style={styles.row} style={{ marginBottom: 15 }}>
                                                <Block style={{width: '100%', marginBottom: 0}}>
                                                    <Text style={styles.formLabel}  >
                                                        {translate('LastNameLabel')}
                                                        <Text style={styles.formRequireLabel}  > * </Text>
                                                    </Text>
                                                    <TextInput
                                                        style={styles.inputType}
                                                        placeholderTextColor="grey"
                                                        returnKeyType="next"
                                                        onChangeText={text => this.setState({ UserLastName: text })}
                                                        value={UserLastName}
                                                    />
                                                </Block>
                                            </Block>
                                            <Block   style={styles.row} style={{ marginBottom: 15 }}>
                                                <Block style={{width: '100%', marginBottom: 0}}>
                                                    <Text style={styles.formLabel}  >
                                                        {translate('YearOfBirthLabel')}
                                                        <Text style={styles.formRequireLabel}  > * </Text>
                                                    </Text>
                                                    {/* <TextInput
                                                        style={styles.inputType}
                                                        placeholderTextColor="grey"
                                                        returnKeyType="next"
                                                        onChangeText={text => this.setState({ UserBirthYear: text })}
                                                        value={UserBirthYear}
                                                    /> */}
                                                    <Picker
                                                        
                                                        selectedValue={UserBirthYear}
                                                        onValueChange={(itemValue, itemIndex) =>this.setState({ UserBirthYear: itemValue }) }
                                                        style={{
                                                            color: themeColor.COLORS.PRIMARY,
                                                            backgroundColor: themeColor.COLORS.BTN_SECONDARY,
                                                            width: '100%',
                                                        }}    
                                                        fontSize={20}
                                                    >
                                                        {
                                                            yearList.map(year => <Picker.Item key={year.value} label={year.label} value={year.value}/>)
                                                        }
                                                    </Picker>
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
                                            <Block style={styles.row}>
                                                
                                                <Block style={customStyles.checkboxBlock}>
                                                    <RadioButton
                                                        value="M"
                                                        status={ UserGender === 'M' ? 'checked' : 'unchecked' }
                                                        onPress={() => this.onSelectGender('M')}
                                                        color={themeColor.COLORS.PRIMARY_BTN_SUCCESS}
                                                    />
                                                </Block>
                                                <Block style={customStyles.subQuestionLabel}>
                                                    <Text  style={customStyles.subQuestionText} > {translate('MaleLabel')}</Text>
                                                </Block>
                                                <Block style={customStyles.checkboxBlock}>
                                                    <RadioButton
                                                        value="F"
                                                        status={ UserGender  === 'F' ? 'checked' : 'unchecked' }
                                                        onPress={() => this.onSelectGender('F')}
                                                        color={themeColor.COLORS.PRIMARY_BTN_SUCCESS}
                                                    />
                                                </Block>
                                                <Block style={customStyles.subQuestionLabel}>
                                                    <Text  style={customStyles.subQuestionText} > {translate('FemaleLabel')}</Text>
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
                                    onPress={() => this.onSubmitRegister()}
                                    >
                                        <Text style={styles.primaryButtonText}>
                                            {translate('ConfirmRegisterButton')}
                                        </Text>
                                </Button>
                            </Block>
                        </Block>
                        <Block style={styles.row}>
                            <Block style={{width: '100%', alignItems: 'center'}}>
                                <Button style={styles.secondaryButton}
                                    onPress={() => this.goBackToLogin()}
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

    earImg: {
        width: 66,
        height: 76.09
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

Register.defaultProps = {
  id: '',
  token: ''
};

const mapStateToProps = state => {
    return {
        network: state.network,
        userInfo : state.user,
        ...state.deviceInfo,
        ...state.testToneList,
    };
};

const mapDispatchToProps = dispatch => {
    const {actions} = require('../redux/UserRedux');
    const {testToneActions} = require('../redux/TestToneRedux');

    return {
        login: customers => dispatch(actions.login(customers)),
        logout: () => dispatch(actions.logout()),
        register: users => dispatch(actions.register(users)),
        registerGuest: users => dispatch(actions.registerGuest(users)),
        loadTestToneList: userToken => dispatch(testToneActions.loadTestToneList(userToken))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);