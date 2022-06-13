import React, { Component } from 'react';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { Block, Button, Text, theme } from "galio-framework";
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView, TouchableOpacity, View, LogBox , Alert,ActivityIndicator } from 'react-native';
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
const { height, width } = Dimensions.get("screen");
import {connect} from 'react-redux';
import {CommonActions } from '@react-navigation/native';
import Modal from "react-native-simple-modal";
import TestToneService from '../services/TestToneService';

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
class Home extends Component {

constructor(props) {
    super(props);

    this.state = {
        openModal: false 
    };

    console.log('----- Home -----');

    console.log(JSON.stringify(this.props));

    var defaultLang = (this.props.deviceInfo && this.props.deviceInfo.language)  ? this.props.deviceInfo.language : '';
    this.setDeviceLanguage(defaultLang);
    

    //this.getToken();
    //this.getDeviceInfo();
    this.readResultJSONFile();
    
    console.log(this.props.userInfo);
}

postTestToneResult = async (testToneResult) => {

    this.setState({loading:true});
    var alertTitle = translate('AlertTitleError');
    var alertMessage = '';

    try {

        var postToneResult = await TestToneService.post_testTone_result_api(testToneResult);
        console.log(postToneResult);
        this.setState({loading:false});
        if(postToneResult){
            if (postToneResult.ok) {
                if (postToneResult.data != null) {
                    var data = postToneResult.data;
                    console.log("post_testTone_result_api Success ! " + JSON.stringify(data));
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
        }

    } catch (error) {
        console.log(error);
        this.setState({ loading: false, });
        alertMessage = 'Post Test Tone Result : ' + JSON.stringify(error);
        this.showAlert(alertTitle, alertMessage);
    }
}

readResultJSONFile = async() =>{
    console.log("---- readResultJSONFile ----");
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
    } catch (error) {
        console.log("Something went wrong, get token = ", error);
    }
}

onClickStartTesting(){
    if(this.props.userInfo != null && this.props.userInfo.isAuthenticated){    
        this.props.navigation.dispatch(
            CommonActions.reset({
            index: 0,
            routes: [
                { name: 'Consent' },
            ],
            })
        );
    }else{
        this.props.navigation.dispatch(
            CommonActions.reset({
            index: 0,
            routes: [
                { name: 'Login' },
            ],
            })
        );
    }
}

modalDidOpen = () => console.log("Modal did open.");

modalDidClose = () => {
    this.setState({ openModal: false });
    console.log("Modal did close.");
};


openModal = () => this.setState({ openModal: true });

closeModal = () => this.setState({ openModal: false });

onClickLogOut = ()=> { 
    var alertTitle = translate('AlertTitleError');
    var alertMessage = '';
    
    console.log("LOGOUT");
    try{
        this.props.logout();
        this.props.removeTone();
       
        this.resetToken();
        var path = RNFS.DocumentDirectoryPath + '/HearingTestResult.txt';
        var data = {};
        AsyncStorage.setItem("TestResults", JSON.stringify(data));

        RNFS.unlink(path).then(() => {
            console.log('FILE DELETED');
            this.closeModal();
            this.props.navigation.dispatch(
                CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'HomeGuest' },
                ],
                })
            );
        }).catch((err) => {
            // `unlink` will throw an error, if the item to unlink does not exist
            console.log(err.message);
        });
        
    }catch (error) {
        console.error(error);
        alertMessage = JSON.stringify(error);
        this.showAlert(alertTitle, alertMessage);
    }
    
    
}

// async storeToken(user) 
resetToken = async() =>{
    try {
        await AsyncStorage.setItem("UserInfo", "");
        console.log("reset Token", "Token have been reset to undefined");
    } catch (error) {
        console.log("Something went wrong, store token = ", error);
    }
}
 
storeDeviceInfo = async(deviceInfo) =>{
    try {
        await AsyncStorage.setItem("DeviceInfo", JSON.stringify(deviceInfo));
        console.log("reset Token", "Token have been reset to undefined");
    } catch (error) {
        console.log("Something went wrong, store DeviceInfo = ", error);
    }
}


onClickChangeLanguage = (lang) => {
    this.setDeviceLanguage(lang);
    this.closeModal();
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
    const {loading}=this.state;
    return (
    
    <Block flex style={customStyles.container}>
        <Block flex>
        <ImageBackground
            // source={Images.lightBG}
            style={{ height, width, zIndex: 1 , backgroundColor: themeColor.COLORS.WHITE}}
        >
        {loading && <Block  style={styles.loadingBox}><ActivityIndicator size="large"  color={themeColor.COLORS.PRIMARY_BTN_SUCCESS} /></Block>}
        <View style={styles.viewSection}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ width, marginTop: '0%' }}
            >
                <Block flex style={styles.homeContainer}>
                    <Image source={Images.logoFaculty} style={styles.logo} />
                    <Block flex space="around">
                        <Block style={styles.welcomeBlock}>
                            <Block  style={styles.row}>
                                <Block style={customStyles.welcomeInfoBlock}>
                                    <Text style={customStyles.subTitleDesc}  >
                                        {translate('Introduction')}
                                    </Text>
                                    <Text style={customStyles.subTitle}>
                                        {this.props.userInfo.user.fn}
                                    </Text>
                                </Block>
                                <Block style={{width: '22%'}}>
                                    <Button style={customStyles.menuButtonTry} onPress={this.openModal} >
                                        <Text style={styles.tridaryButtonText}>
                                        {translate('SetupButton')}
                                        </Text>
                                    </Button>
                                </Block>
                            </Block>
                        </Block>
                        <Block style={customStyles.menuSet}>
                            <Block style={styles.row}>
                                <Block style={{width: '100%'}}>
                                    <Button style={customStyles.menuBlockMain} onPress={() => this.onClickStartTesting()}>
                                    <ImageBackground
                                        source={Images.EarTestMain}
                                        style={{ height : 100, width: '100%', zIndex: 1 }}
                                    >
                                        <Text style={customStyles.menuTextMain}  >
                                        {translate('TestingButton')}
                                        </Text>
                                        <Text style={customStyles.menuSubTextMain}>
                                        {translate('TestingButtonDesc')}
                                        </Text>
                                    </ImageBackground>
                                    
                                    </Button>
                                </Block>
                            </Block>
                            <Block style={styles.row}>
                                <Block style={{width: '100%'}}>
                                    <Button style={customStyles.menuBlockMain} 
                                    onPress={() => this.props.navigation.dispatch(
                                        CommonActions.reset({
                                        index: 0,
                                        routes: [
                                            { name: 'HearingTestResult' },
                                        ],
                                        })
                                    )}
                                    >
                                    <ImageBackground
                                        source={Images.HearingResult}
                                        style={{ height : 100, width: '100%', zIndex: 1 }}
                                    >
                                        <Text style={customStyles.menuTextMain}  >
                                        {translate('ResultButton')}
                                        </Text>
                                        <Text style={customStyles.menuSubTextMain}>
                                        {translate('ResultButtonDesc')}
                                        </Text>
                                    </ImageBackground>
                                    
                                    </Button>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
        </View>
    
        <Modal
            offset={this.state.offset}
            open={this.state.openModal}
            modalDidOpen={this.modalDidOpen}
            modalDidClose={this.modalDidClose}
            style={{ alignItems: "center" }}
            
        >
            <View style={{ alignItems: "center" }}>
            
            <TouchableOpacity style={{ margin: 5 }} onPress={() => this.onClickChangeLanguage('en')}>
                <Text>{translate('EnglishLabel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ margin: 5 }} onPress={() => this.onClickChangeLanguage('th')}>
                <Text>{translate('ThaiLabel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ margin: 5 }} onPress={this.onClickLogOut}>
                <Text>{translate('Logout')}</Text>
            </TouchableOpacity>
            </View>
        </Modal>
        </ImageBackground>
        </Block>
    </Block>
        
    );
}
}

const customStyles = StyleSheet.create({
    subTitle: {
        fontFamily:'Sarabun-SemiBold',
        fontSize: 20,
        color: themeColor.COLORS.PRIMARY,
        textAlign : 'left'
    },
    subTitleDesc: {
        fontFamily:'Sarabun',
        fontSize: 16,
        color: themeColor.COLORS.PRIMARY,
        textAlign : 'left'
    },
    container: {
        // marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
        // marginBottom: -HeaderHeight * 2,
        flex: 1,
        marginBottom : 10
    },
    menuButtonTry:{
        width: '100%', 
        alignItems:'center', 
        justifyContent: 'center',
        marginVertical: 20,
        borderRadius: 20,
        backgroundColor: themeColor.COLORS.BTN_SECONDARY,
    },
    welcomeInfoBlock: {
        width: '75%', 
        paddingTop: 20,
        marginLeft: 0,
        textAlign: "left",
    },
    menuSet:{
        marginTop: 0,
        paddingVertical: 10,
        position: "relative",
        width: "100%",
    },
    menuBlockMain:{
        width: '100%', 
        alignItems:'center', 
        justifyContent: 'center',
        height: 100, 
        backgroundColor: '#E5E5E5',
        marginTop: 6,
        borderRadius: 4,
        marginLeft: 0
    },
    
    menuBlock:{
        width: '100%', 
        alignItems:'center', 
        justifyContent: 'center',
        height: 100, 
        backgroundColor: '#E5E5E5',
        marginTop: 6,
        borderRadius: 4,
        marginLeft: 0
    },

    menuTextMain:{
        paddingHorizontal: 20,
        paddingTop: 20,
        fontSize: 22,
        fontFamily: 'Sarabun-SemiBold',
        textAlign: 'left',
        color: themeColor.COLORS.PRIMARY
    },
    menuSubTextMain:{
        paddingHorizontal: 20,
        paddingTop: 5,
        marginTop: -10,
        fontSize: 12,
        fontFamily: 'Sarabun-Light',
        textAlign: 'left',
        color: themeColor.COLORS.PRIMARY
    },
    menuText:{
        fontSize: 14,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.PRIMARY
    }
});

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
    const {deviceInfoActions} = require('../redux/DeviceRedux');
    const {testToneActions} = require('../redux/TestToneRedux');

    return {
        logout: () => dispatch(actions.logout()),
        setupDeviceInfo: deviceInfo => dispatch(deviceInfoActions.setupDeviceInfo(deviceInfo)),
        removeTone: () => dispatch(testToneActions.logout()),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
