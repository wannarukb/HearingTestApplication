/* eslint-disable prettier/prettier */
import React from 'react';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {ImageBackground,Image,StyleSheet,View,Dimensions,ScrollView, LogBox, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import Modal from "react-native-simple-modal";

import AuthService from '../services/AuthService';
import TestToneService from '../services/TestToneService';
import UtilityService from '../services/UtilityService';

const { height, width } = Dimensions.get("screen");
import themeColor from "../constants/Theme";
import Images from "../constants/Images";

import {CommonActions } from '@react-navigation/native';
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


LogBox.ignoreAllLogs(true);

class HomeGuest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            loading: false
        };
        console.log("----- Home Guest -----");
        console.log(JSON.stringify(this.props));

        var defaultLang = (this.props.deviceInfo && this.props.deviceInfo.language)  ? this.props.deviceInfo.language : '';
        this.setDeviceLanguage(defaultLang);


       this.readResultJSONFile();
    }

    postTestToneResult = async (testToneResult) => {

        this.setState({loading:true});
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';
    
        try {
            this.setState({loading:false});
            let hearingCode = testToneResult.hearingTestId;
            let hearingShowCode =  UtilityService.leftPad(hearingCode, 8, '0');
            console.log("Hearing Code = " + hearingShowCode);
            var guestResultInfo =  {
                hearingTestId : hearingShowCode,
                userId        : testToneResult.userId,
                startDate     : testToneResult.startDateTime,
                resultSum     : testToneResult.resultSum,
                isSync        : true
            }
            console.log("store result");
            console.log(guestResultInfo);

            this.props.setTestToneGuest(guestResultInfo);
            var path = RNFS.DocumentDirectoryPath + '/HearingTestResult.txt';
            RNFS.unlink(path).then(() => {
                console.log('FILE DELETED');
            }).catch((err) => {
                // `unlink` will throw an error, if the item to unlink does not exist
                console.log(err.message);
            });

          /*  var postToneResult = await TestToneService.post_testTone_result_api(testToneResult);
            console.log(postToneResult);
            this.setState({loading:false});
            if(postToneResult){
                if (postToneResult.ok) {
                    if (postToneResult.data != null) {
                        var data = postToneResult.data;


                        console.log("post_testTone_result_api Success ! " + JSON.stringify(data));
                        //store result

                        let hearingCode = data.hearingTestId;
                        let hearingShowCode =  UtilityService.leftPad(hearingCode, 8, '0');
                        console.log("Hearing Code = " + hearingShowCode);
                        var guestResultInfo =  {
                            hearingTestId : hearingShowCode,
                            userId        : data.userId,
                            startDate     : data.startDateTime,
                            resultSum     : data.resultSum,
                            isSync        : true
                        }
                        console.log("store result");
                        console.log(guestResultInfo);

                        this.props.setTestToneGuest(guestResultInfo);


                        
                        var path = RNFS.DocumentDirectoryPath + '/HearingTestResult.txt';
                        RNFS.unlink(path).then(() => {
                            console.log('FILE DELETED');
                        }).catch((err) => {
                            // `unlink` will throw an error, if the item to unlink does not exist
                            console.log(err.message);
                        });
                    } else {
                        alertMessage = 'Server error no data return.';
                        this.showAlert(alertTitle, alertMessage);
                    }
                } else {
                    var problem = testToneResult.problem;
                    var status  = testToneResult.status;
                    alertMessage = 'Post Test Tone Result, status: ' + status + ' error: ' + problem;
                    this.showAlert(alertTitle, alertMessage);
                }
            }else{
                alertMessage = 'Server error no result return.';
                this.showAlert(alertTitle, alertMessage);
            }*/
    
        } catch (error) {
            console.log(error);
            this.setState({ loading: false, });
            alertMessage = 'Post Test Tone Result : ' + JSON.stringify(error);
            this.showAlert(alertTitle, alertMessage);
        }
    }
    
    readResultJSONFile = async() =>{
    
        this.setState({ loading: true});
        
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';
        try {
            var path = RNFS.DocumentDirectoryPath + '/HearingTestResult.txt';
            
            if(path != null && path != undefined){
                console.log(path)
                const fileContent = await RNFS.readFile(path, 'utf8');
                console.log('my save data');
                console.log(fileContent);
                if(fileContent != null && fileContent != undefined){
                    let data = JSON.parse(fileContent);
                    let isSyncData = JSON.stringify(data) === JSON.stringify({});
                    if(isSyncData === false){
                        await AsyncStorage.setItem("TestResults", JSON.stringify(data));
                        this.postTestToneResult(data);
                    }else{
                    }
                }
            }
        } catch (error) {
            console.log(error);
            this.setState({ loading: false});
            var errorMessage = JSON.stringify(error);
            if(!errorMessage.includes('No such file or directory')){
                alertMessage = 'Something went wrong, readResultJSONFile ='  + JSON.stringify(error);
                this.showAlert(alertTitle, alertMessage);
            }
        }
    }

    getDeviceInfo = async() =>{
        var defaultLanguage = '';
        try {
            let data = await AsyncStorage.getItem("DeviceInfo");
            if(data){
                let deviceData = JSON.parse(data);
                console.log('getDeviceInfo = device data = ', deviceData);
                this.props.setupDeviceInfo(deviceData);
                defaultLanguage = (deviceData.language != undefined) ? deviceData.language : '';
                this.setDeviceLanguage(defaultLanguage);
            }else{
                console.log("getDeviceInfo : No Data");
                this.setDeviceLanguage('');
            }
            
        } catch (error) {
            console.log("Something went getDeviceInfo = ", error);
            this.setDeviceLanguage(defaultLanguage);
        }
    }

    //Login as Guest
    startHearingTest(){
        console.log('----- startHearingTest -----');
        console.log(JSON.stringify(this.props));
        var isGuest = (this.props.userInfo.isGuest) ? this.props.userInfo.isGuest : true;
        var isAuthenticated = (this.props.userInfo.isAuthenticated) ? this.props.userInfo.isAuthenticated : false;

        console.log('isAuthenticated = ' + isAuthenticated);
        console.log('isGuest = ' + isGuest);
        if(!isAuthenticated){
            console.log("loginAsGuest");
            this.loginAsGuest();
        }else{
            console.log("gotoUserSurveyPage");
            this.gotoUserSurveyPage();
        }
        
    }

    loginAsGuest = async() => {
        this.setState({loading:true});
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';
        try {
            var deviceInfo       = this.props.deviceInfo;
            var loginAsGuestBody = {
                status          : "A",
                systemName      : deviceInfo.systemName,
                systemVersion   : "" + deviceInfo.systemVersion,
                istablet        : "" + deviceInfo.isTablet,
                brandmodel      : deviceInfo.model,
                deviceType      : deviceInfo.deviceType
            }
            console.log(loginAsGuestBody);
            var userResult = await AuthService.login_guest_api(loginAsGuestBody);
            console.log(userResult);
            this.setState({loading:false});

            if(userResult){
                if (userResult.ok) {
                    if (userResult.data != null) {
                        var data = userResult.data;
                        console.log('userInfo', data);
                        var storeUserInfo = await this.storeUserInformation(data);
                        this.props.loginGuest(data);
                        var userId      = data.userId;
                        var brandModel  = this.props.deviceInfo.model;
                        var loadTestResult = await this.loadTestTone(userId, brandModel);
                        
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
            console.error(error);
            this.setState({ loading: false });
            alertMessage = 'Login as Guest : ' +  JSON.stringify(error);
            this.showAlert(alertTitle, alertMessage);
        }

        
    }

    loadTestTone = async(userId, brandModel) =>{
        this.setState({loading:true});
        var alertTitle = translate('AlertTitleError');
        var alertMessage = '';
        try {

            var testToneResult = await TestToneService.test_tone_api(userId, brandModel);
            console.log(testToneResult);
            this.setState({loading:false});
            if(testToneResult){
                if (testToneResult.ok) {
                    if (testToneResult.data != null) {
                        var data = testToneResult.data;
                        console.log('login load test tone data ' + JSON.stringify(data));
                        this.props.loadTestToneList(data);
                        let storeTestTone =  await this.storeTestToneList(data);
                        this.gotoUserSurveyPage();
                    } else {
                        alertMessage = 'Server error no data return.';
                        this.showAlert(alertTitle, alertMessage);
                    }
                } else {
                    var problem = testToneResult.problem;
                    var status  = testToneResult.status;
                    alertMessage = 'Get Test Tone,  status: ' + status + ' error: ' + problem;
                    this.showAlert(alertTitle, alertMessage);
                }
            }else{
                alertMessage = 'Server error no result return.';
                this.showAlert(alertTitle, alertMessage);
            }
        
        } catch (error) {
            console.log(error);
            this.setState({ loading: false, });
            alertMessage = 'Get Test Tone : ' + JSON.stringify(error);
            this.showAlert(alertTitle, alertMessage);
        }
    }

    gotoUserSurveyPage = () =>{ 
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                { name: 'Consent' },
                ],
            })
        );
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
    


    //Login as User/Member
    gotoLogin(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Login' },
                ],
            })
        );
    };

    gotoResultDetail(){
        console.log('-------------- GO TO RESULT DETAIL --------------')
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'HearingGuestResult' },
                ],
            })
        );
    };

    //Change Language

    openModal = () => this.setState({ openModal: true });

    modalDidOpen = () => console.log("Modal did open.");

    modalDidClose = () => {
        this.setState({ openModal: false });
        
    };

    onClickChangeLanguage = (lang) => {
        this.setDeviceLanguage(lang);
        this.modalDidClose();
    };

    setDeviceLanguage(lang){
        console.log("setDeviceLanguage = " + lang);
        let deviceJSON = {};
        deviceJSON.uniqueId = DeviceInfo.getUniqueId();
        deviceJSON.systemName = DeviceInfo.getSystemName();
        deviceJSON.systemVersion = DeviceInfo.getSystemVersion();
        deviceJSON.isTablet = DeviceInfo.isTablet();
        deviceJSON.brand = DeviceInfo.getBrand();
        deviceJSON.model = DeviceInfo.getModel();
        deviceJSON.deviceType = DeviceInfo.getDeviceType();
        var RNLocal = LanguageService.getInstance().getDeviceLang();
        var languageTag = RNLocal.languageTag;
        deviceJSON.language = (lang) ? lang : languageTag;
        console.log("deviceJSON = " + deviceJSON);
        this.props.setupDeviceInfo(deviceJSON);
        this.storeDeviceInfo(deviceJSON);
    
        console.log('HOME Guest Redux deviceInfo : ' + JSON.stringify(this.props.deviceInfo));
        translate.cache.clear();
        LanguageService.getInstance().changeLanguage(lang);
    }

    storeDeviceInfo = async(deviceInfo) =>{
        try {
            await AsyncStorage.setItem("DeviceInfo", JSON.stringify(deviceInfo));
            console.log("storeDeviceInfo", "storeDeviceInfo has been stored.");
        } catch (error) {
            console.log("Something went wrong, store DeviceInfo = ", error);
        }
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
        const {loading}=this.state;
        return (
            <Block flex style={styles.container}>
                <Block flex>
                    <ImageBackground
                        // source={Images.lightBG}
                        style={{ height, width, zIndex: 1 , backgroundColor: themeColor.COLORS.WHITE}}
                    >
                        {loading && <Block  style={styles.loadingBox}><ActivityIndicator size="large"  color={themeColor.COLORS.PRIMARY_BTN_SUCCESS} /></Block>}
                    
                        <View style={customStyles.viewSection}> 
                            <ScrollView
                                showsVerticalScrollIndicator={true}
                                style={{ width, marginTop: '0%' }}
                            >
                                <Block style={styles.homeContainer}>
                                    <Image source={Images.logoFaculty} style={styles.logo} />
                                    <Block center>
                                        <Image source={Images.GuestHeader} style={customStyles.onboarding} />
                                    </Block>
                                    <Block  space="around">
                                        <Block  style={styles.contentContainer}>
                                            <Block  style={styles.row}>
                                                <Block style={{width: '100%', alignItems: 'center', marginBottom: 0}}>
                                                    <Text  style={styles.title} >{translate('GuestLabel')}</Text>
                                                </Block>
                                            </Block>
                                            
                                            {
                                                (this.props.guestResultInfo && this.props.guestResultInfo.isSync == true) ? 
                                                (
                                                    <Block  style={styles.row}>
                                                        <Block style={{width: '100%', alignItems: 'center',}}>
                                                            <Block style={styles.row}>
                                                                <Block style={{width: '100%' }}>
                                                                    <Text style={styles.subTitleDesc}>
                                                                        {translate('GuestRefCodeLabel')}
                                                                    </Text>
                                                                </Block>
                                                            </Block>

                                                            <Block  style={styles.row}>
                                                                <Block style={{width: '100%', alignItems: 'center',}}>
                                                                    <Text style={customStyles.refCode}
                                                                        onPress={() => this.gotoResultDetail()}
                                                                    >
                                                                        {this.props.guestResultInfo.hearingTestId}
                                                                    </Text>
                                                                </Block>
                                                            </Block>
                                                        </Block>
                                                    </Block>
                                                ) :
                                                (
                                                    <Block  style={styles.row}>
                                                        <Block style={{width: '100%', alignItems: 'center',}}>
                                                            <Block  style={styles.row}>
                                                                <Block style={{width: '100%', alignItems: 'center',}}>
                                                                    <Text style={styles.subTitle}>
                                                                        {translate('AppConcept')}
                                                                    </Text>
                                                                </Block>
                                                            </Block>
                                                            <Block style={styles.row}>
                                                                <Block style={{width: '100%'}}>
                                                                    <Text style={styles.subTitleDesc}>
                                                                        {translate('AppConceptSubDesc')}
                                                                    </Text>
                                                                </Block>
                                                            </Block>
                                                        </Block>
                                                    </Block>
                                                )
                                            }
                                            
                                            
                                        </Block>
                                    </Block>
                                </Block>
                            </ScrollView>
                        </View>
                        <Block style={styles.buttonSection}>
                            <Block style={styles.row}>
                                <Block style={{width: '100%', alignItems: 'center'}}>
                                    <Button style={styles.primaryButton}
                                        onPress={() => this.startHearingTest()}
                                        >
                                            <Text style={styles.primaryButtonText}>
                                                {translate('TestingButton')}
                                            </Text>
                                    </Button>
                                </Block>
                            </Block>
                            <Block style={styles.row}>
                                <Block style={{width: '100%', alignItems: 'center'}}>
                                    <Button style={styles.secondaryButton}
                                        onPress={() => this.gotoLogin()}
                                        >
                                            <Text style={styles.secondaryButtonText}>
                                                {translate('Login')}
                                            </Text>
                                    </Button>
                                </Block>
                            </Block>
                            <Block style={styles.row}>
                                <Block style={{width: '100%', alignItems: 'center'}}>
                                    <Button style={styles.tridaryButton}
                                        onPress={this.openModal} 
                                        >
                                            <Text style={styles.tridaryButtonText}>
                                                {translate('ChangeLanguageLabel')}
                                            </Text>
                                    </Button>
                                </Block>
                            </Block>
                            
                        </Block>
                        <Modal
                            offset={this.state.offset}
                            open={this.state.openModal}
                            modalDidOpen={this.modalDidOpen}
                            modalDidClose={this.modalDidClose}
                            style={{ alignItems: "center" }}
                            
                        >
                            <View style={{ alignItems: "center" }}>
                                <TouchableOpacity style={{ margin: 5}} onPress={() => this.onClickChangeLanguage('en')}>
                                    <Text style={styles.subTitleDesc}>{translate('EnglishLabel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ margin: 5 }} onPress={() => this.onClickChangeLanguage('th')}>
                                    <Text style={styles.subTitleDesc}>{translate('ThaiLabel')}</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </ImageBackground>
                </Block>
            </Block>
        );
    };
};

const customStyles = StyleSheet.create({
    onboarding:{
        marginVertical: 20,
        width: width,
        height: 215
    },

    viewSection :{
        width: '100%',
        alignItems: 'center',
        height: '70%',
       
    },

    refCode: {
        fontFamily:'Sarabun-Bold',
        fontSize: 24,
        color: themeColor.COLORS.PRIMARY_BTN_SUCCESS,
        textAlign : 'center'
    },
});


HomeGuest.defaultProps = {
    token: '',
    id:''
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
    const {deviceInfoActions} = require('../redux/DeviceRedux');
    const {testToneActions} = require('../redux/TestToneRedux');
    const {guestResultActions}   = require('../redux/GuestResultRedux');

    return {
        logout: () => dispatch(actions.logout()),
        setupDeviceInfo: deviceInfo => dispatch(deviceInfoActions.setupDeviceInfo(deviceInfo)),
        loginGuest: user => dispatch(actions.loginGuest(user)),
        loadTestToneList: testToneList => dispatch(testToneActions.loadTestToneList(testToneList)),
        setTestToneGuest : guestResultInfo => dispatch(guestResultActions.setTestToneGuest(guestResultInfo))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(HomeGuest);