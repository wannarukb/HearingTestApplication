import React, {Component} from 'react';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView, View ,ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Block, Icon, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import moment from 'moment';
//import { Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';

import TestToneService from '../services/TestToneService';


import {connect} from 'react-redux';
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

class HearingTestResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hearingTestHeader : [],
            loading: false
        };

        console.log('----- HearingTestResult -----');
        console.log(JSON.stringify(this.props));

        var lang = this.props.deviceInfo.language;
        this.setDeviceLanguage(lang);

        this.getToken().then( response =>{
            if(!this.props.network.isConnected){
                console.log('No Internet');
                this.getTestResult();
            }else{
                console.log('Internet Connected');
                console.log("User = ");
                console.log(this.state.userInfo);
                console.log(this.state.userInfo);
                // let userToken = this.state.userInfo.token;
                let userId    = this.state.userInfo.id;
                this.loadToneHeaderList(userId);
                // this.getTestResult();
            }
        })
       
        
    }
    
    setDeviceLanguage(lang){
        console.log("SET DEVICE Language = " + lang);
        translate.cache.clear();
        LanguageService.getInstance().changeLanguage(lang);
        
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


    async getTestResult() {
        console.log("GET TEST RESULT");
        try {
            let testResultData = await AsyncStorage.getItem("testToneResultTemp");
            let data = JSON.parse(testResultData);
            this.showHearingTest(data);

          
        } catch (error) {
          console.log("Something went wrong, get token = ", error);
        }
    }

    loadToneHeaderList = (userId) =>{
        try {
            TestToneService.get_test_tone_header_api(userId)
            .then(responseJson => {
                console.log('get_test_tone_header_api Response JSON = ', responseJson.status);
                console.log(JSON.stringify(responseJson));
                if (responseJson.ok) {
                    if (responseJson.data != null) {
                        var data = responseJson.data;
                        console.log(data);
                        this.showHearingTest(data);
                        this.props.loadTestToneResultHeader(data);
                        this.storeTestToneResultHeader(data);
                        this.forceUpdate();
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

    // async storeTestToneResultHeader(testToneList) 
    storeTestToneResultHeader = async(testToneResultHeader) =>{
        try {
            await AsyncStorage.setItem("testToneResultTemp", JSON.stringify(testToneResultHeader));
            console.log("testToneResultTemp", "information have been store");
        } catch (error) {
            console.log("Something went wrong, store token = ", error);
        }
    }

    showHearingTest(hearingTestList){
        this.state.hearingTestHeader = hearingTestList;
    }

    renderHearingList(){
        console.log('renderHearingList');
        console.log(this.state.hearingTestHeader);
        return this.state.hearingTestHeader.map((item) => {
            // console.log(item);
            var dateString = item.startDateTime;
            var dateObj = new Date(dateString);
            var momentObj = moment(dateObj);
            var momentString = momentObj.format('DD/MM/YYYY');
            var resultSum = item.resultSum;
            var isGood    = resultSum.includes("Good");
            return (
                <Block key={item.hearingTestId} style={customStyles.resultBlock}>
                    <Block style={styles.row}>
                        <Block style={customStyles.resultImageBox} >
                        {(isGood===true) ? <Image source={Images.HearingResult_Good} style={customStyles.resultImage} />: <Image source={Images.HearingResult_Bad} style={customStyles.resultImage} /> }
                            
                        </Block>
                        <Block style={customStyles.resultDescBox} >
                            <Text  style={customStyles.descText} >
                                {momentString}
                            </Text>
                            <Text  style={customStyles.resultText} >
                                {(isGood===true) ? translate('ToneResultInfo_Good') : translate('ToneResultInfo_Bad') }
                            </Text>
                        </Block>
                    </Block>
                </Block>
            );
        });
    }

    render() {
        const { navigation } = this.props;
        const {loading}=this.state;
        return (
            <Block flex style={styles.container}>
                <Block flex>
                    <ImageBackground
                        // source={Images.lightBG}
                        style={{ height, width, zIndex: 1 , backgroundColor: themeColor.COLORS.WHITE}}
                    >
                        {loading && <Block  style={styles.loadingBox}><ActivityIndicator size="large"  color={themeColor.COLORS.PRIMARY_BTN_SUCCESS} /></Block>}
        
                        <Block  style={customStyles.navbar}>
                            <Block style={styles.row}>
                                <Block style={{width: '25%',marginHorizontal: 2, paddingLeft: 10, justifyContent: 'center'}}>
                                    <Text style={customStyles.backText}  onPress={() => navigation.navigate("Home")}>
                                        {translate('BackButton')}
                                    </Text>
                                </Block>
                                <Block style={{width: '50%',marginHorizontal: 2, justifyContent: 'center'}}>
                                    <Text  style={customStyles.navbarText} >
                                        {translate('TestResultInfoLabel')}
                                    </Text>
                                </Block>
                                <Block style={{width: '25%',marginHorizontal: 2}}></Block>
                            </Block>
                        </Block>
                        <View style={styles.viewSection}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={customStyles.dataWrapper}
                            >
                                {this.renderHearingList()}
                            </ScrollView>
                        </View>
                
                    </ImageBackground>
                </Block>
            </Block>
            
        );
    }
}

const customStyles = StyleSheet.create({
    dataWrapper :{
        width : width,
        marginTop: '0%' ,
        alignSelf:'baseline',
        paddingBottom: 140,
        marginBottom: 70
    },
    resultBlock: {
        backgroundColor: themeColor.COLORS.WHITE,
        height: 80,
        marginHorizontal: 10,
        marginVertical: 5,
        width: '95%',
        borderRadius: 4,
        shadowColor: themeColor.COLORS.SHADOW,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.62,
        elevation: 8,
    },
    resultImageBox : {
        width: '23%',
        paddingHorizontal: 5,
        paddingVertical: 12,
        alignItems: 'center',
    },
    resultDescBox :{
        width: '70%',
        justifyContent: 'center',
        padding: 5,
    },
    resultImage : {
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
        
    resultText: {
        fontSize: 18,
        fontFamily: 'Sarabun-SemiBold',
        color: themeColor.COLORS.PRIMARY,
        textAlign: "left"
    },
    descText : {
        fontSize: 14,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.SECONDARY,
        textAlign: "left"
    },
    monthText : {
        fontSize: 12,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.SECONDARY,
        textAlign: "center"
    },
    dateText : {
        fontSize: 20,
        fontFamily: 'Sarabun-Bold',
        color: themeColor.COLORS.SECONDARY,
        textAlign: "center",
        marginVertical: -10
    },
    
    backText : {
        fontSize: 14,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.PRIMARY_BTN_SUCCESS,
        textAlign: "left"
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
});


// export default UserSurvey;
const mapStateToProps = state => {
    return {
      userInfo: state.user,
      network: state.network,
      ...state.testToneResultTemp,
      ...state.deviceInfo
    };
  };
  
const mapDispatchToProps = dispatch => {
    const {testToneActions} = require('../redux/TestToneResultRedux');
    
  
    return {
      loadTestToneResultHeader: testToneResultHeader => dispatch(testToneActions.loadTestToneResult(testToneResultHeader))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HearingTestResult);