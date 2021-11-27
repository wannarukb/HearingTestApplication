import React, { Component } from 'react';

import {CommonActions } from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { StyleSheet, Dimensions, ImageBackground,  ScrollView , NativeModules} from 'react-native';
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
        let testData = this.props.testToneList;
        let parseTestData = [];
        
        if(testData != null && testData != undefined){
            console.log(testData);
            let userID = this.props.userInfo.user.id;
            let translateMenu = {
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
                "GoBackToHomePageButton": translate('GoBackToHomePageButton')
            }

            console.log(translateMenu);
            // NativeModules.HearingTestModule.GotoActivity(
            //     JSON.stringify(userID),
            //     JSON.stringify(testData),
            //     JSON.stringify(translateMenu)
            // );
        }
        
    }
  

    render() {
        const { navigation } = this.props;
        return (
        <Block flex style={styles.container}>
            <Block flex>
            <ImageBackground
                source={Images.lightBG}
                style={{ height, width, zIndex: 1 }}
            >
                <Block  style={styles.navbar}>
                <Block style={styles.row}>
                    <Block style={{width: '25%',marginHorizontal: 2, background: '#ff0000' , paddingLeft: 10, justifyContent: 'center'}}>
                    {/* <Button style={styles.backBtn}  onPress={() => navigation.navigate("Home")}>
                        
                    </Button> */}
                    <Text style={styles.backText}  onPress={() => this.backHome()}>
                        {/* <Icon
                        name="chevron-left"
                        family="entypo"
                        size={20}
                        color={themeColor.COLORS.BTN_SECONDARY}
                        style={{marginRight: 5}}
                        />  */}
                        {translate('BackButton')} {this.props.token}
                    </Text>
                    </Block>
                    <Block style={{width: '50%',marginHorizontal: 2, justifyContent: 'center'}}>
                    <Text  style={styles.navbarText} >
                        {translate('UserSurveyHeaderLabel')}
                    </Text>
                    </Block>
                    <Block style={{width: '25%',marginHorizontal: 2}}></Block>
                </Block>
                </Block>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ width, marginTop: '0%', paddingHorizontal: 20 }}
                >
                <Block  style={styles.contentContainer}>
                    <Block  style={{ paddingVertical: 15, justifyContent: "space-around", height: 30,alignItems: "center", marginBottom: 30}}>
                        <Text  style={styles.mainQuestionText} >{translate('MainPageQuestion')}</Text>
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
                    <Block flex middle>
                        <Block style={styles.alertBox}>
                        
                        <Text style={styles.alertTextHead}>
                            {translate('SurveyResult')}
                        </Text>
                        <Text style={styles.alertText}>
                            {translate('SurveySuggest')}
                        </Text>
                        </Block>
                        <Block middle>
                        <Button style={styles.backButton}
                            onPress={() => this.backHome()}>
                            <Text style={styles.createButtonText}>
                            {translate('BackButton')}
                            </Text>
                        </Button>
                        </Block>
                    </Block>
                    )
                    :(
                    <Block middle>
                        <Button style={styles.createButton}
                        onPress={() => this.nextButton()}
                        >
                        <Text style={styles.createButtonText}>
                        {translate('NextButton')}
                        </Text>
                        </Button>
                    </Block>
                    )
                }

                

                
            
                </ScrollView>
                
            </ImageBackground>
            </Block>
        </Block>
            
        );
    }
}

const styles = StyleSheet.create({
  // backBtn :{
  //   width: '100%',
  //   backgroundColor: themeColor.COLORS.WHITE,
  //   borderColor: theme.COLORS.TRANSPARENT,
  //   shad
  // },
  backText : {
    fontSize: 14,
    fontFamily: 'Sarabun-Regular',
    color: themeColor.COLORS.BTN_SECONDARY,
    textAlign: "left"
  },

  alertBox : {
    backgroundColor: themeColor.COLORS.ALERT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: themeColor.COLORS.ALERT_BORDER,
    padding: 10,
    marginHorizontal: 20,
    width: '90%',
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
  navbar:{
    paddingTop: 10,
    backgroundColor: themeColor.COLORS.WHITE,
    zIndex : 2,
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f3"
  },
  navbarText:{
    fontSize: 18,
    fontFamily: 'Sarabun-Medium',
    color: themeColor.COLORS.PRIMARY,
    textAlign: 'center'
  },
  contentContainer : {
    flex: 1,
    paddingVertical: 40,
    position: 'relative'
  },
  mainQuestionText : {
    fontSize: 22,
    fontFamily: 'Sarabun-Medium',
    color: themeColor.COLORS.PRIMARY
  },
  row: {
    flex: 1, 
    flexDirection: 'row'
  },
  questionRow: {
    flex: 1, 
    flexDirection: 'row',
    marginHorizontal: 20
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
    fontFamily: 'Sarabun-Regular',
    color: themeColor.COLORS.PRIMARY
  },
  container: {
    // marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  createButton:{
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: themeColor.COLORS.BTN_SECONDARY
  },
  backButton:{
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: themeColor.COLORS.SECONDARY
  },
  createButtonText:{
    fontSize: 16,
    fontFamily: 'Sarabun-Medium',
    color: themeColor.COLORS.WHITE
  },
  avatar: {
    width: 60,
    height: 60,
    alignItems: 'flex-end'
  },
  
  menuSet:{
    marginTop: 10,
    paddingVertical: 10,
    position: "relative",
    width: "100%",
  },
  menuButtonRegister:{
    width: '100%', 
    alignItems:'center', 
    justifyContent: 'center',
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: themeColor.COLORS.BTN_REGISTER
  },
  menuButtonTry:{
    width: '100%', 
    alignItems:'center', 
    justifyContent: 'center',
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: themeColor.COLORS.BTN_SECONDARY
  },
  menuText:{
    fontSize: 14,
    fontFamily: 'Sarabun-Medium'
  },

  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  earImg: {
    width: 66,
    height: 76.09
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