import React, {Component} from 'react';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView, View , KeyboardAvoidingView } from 'react-native';
import { Block, Icon, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import moment from 'moment';
//import { Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';

import TestToneService from '../services/TestToneService';


import {connect} from 'react-redux';

import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)


const { height, width } = Dimensions.get("screen");

class HearingTestResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // testResults : [],
            // HeadTable: ['Frequency', 'DB (HL)', 'Side', 'Is Heard'],
            // DataTable: [],
            hearingTestHeader : []

        };


        this.getToken().then( response =>{
            if(!this.props.network.isConnected){
                console.log('No Internet');
                this.getTestResult();
            }else{
                console.log('Internet Connected');
                console.log("User = ");
                console.log(this.state.userInfo.id);
                let userToken = this.state.userInfo.token;
                let userId    = this.state.userInfo.id;
                this.loadToneHeaderList(userToken, userId);
            }
        })
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

    loadToneHeaderList = (userToken, userId) =>{
        try {
            TestToneService.get_test_tone_header_api(userToken, userId)
            .then(responseJson => {
                console.log('get_test_tone_header_api Response JSON = ', responseJson.status);
                if (responseJson.ok) {
                    if (responseJson.data != null) {
                        var data = responseJson.data;
                        console.log(data);
                        this.showHearingTest(data);
                        this.props.loadTestToneResultHeader(data);
                        this.storeTestToneResultHeader(data);
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
        // console.log(this.state.hearingTestHeader);
        return this.state.hearingTestHeader.map((item) => {
            // console.log(item);
            var dateString = item.startDateTime;
            var dateObj = new Date(dateString);
            var momentObj = moment(dateObj);
            var momentString = momentObj.format('DD/MM/YYYY');
            return (
                <Block key={item.hearingTestId} style={styles.resultBlock}>
                    <Block style={styles.row}>
                        <Block style={styles.resultImageBox} >
                        {(item.resultSum == 'Good') ? <Image source={Images.HearingResult_Good} style={styles.resultImage} />: <Image source={Images.HearingResult_Bad} style={styles.resultImage} /> }
                            
                        </Block>
                        <Block style={styles.resultDescBox} >
                            <Text  style={styles.descText} >
                                {momentString}
                            </Text>
                            <Text  style={styles.resultText} >
                                {(item.resultSum == 'Good') ? translate('ToneResultInfo_Good') : translate('ToneResultInfo_Bad') }
                            </Text>
                        </Block>
                    </Block>
                </Block>
            );
        });
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
                                <Block style={{width: '25%',marginHorizontal: 2, paddingLeft: 10, justifyContent: 'center'}}>
                                    <Text style={styles.backText}  onPress={() => navigation.navigate("Home")}>
                                        {translate('BackButton')}
                                    </Text>
                                </Block>
                                <Block style={{width: '50%',marginHorizontal: 2, justifyContent: 'center'}}>
                                    <Text  style={styles.navbarText} >
                                        {translate('TestResultInfoLabel')}
                                    </Text>
                                </Block>
                                <Block style={{width: '25%',marginHorizontal: 2}}></Block>
                            </Block>
                        </Block>
                        <View>
                            <ScrollView style={styles.dataWrapper}>
                                {/* <Block style={styles.resultBlock}>
                                    <Block style={styles.row}>
                                        <Block style={styles.resultImageBox} >
                                            <Image source={Images.HearingResult_Good} style={styles.resultImage} />
                                        </Block>
                                        <Block style={styles.resultDescBox} >
                                            <Text  style={styles.descText} >
                                                11.00 น.
                                            </Text>
                                            <Text  style={styles.resultText} >
                                                นพ. ศิริชัย สวัสดี
                                            </Text>
                                        </Block>
                                    </Block>
                                </Block> */}
                                {this.renderHearingList()}
                            </ScrollView>
                        </View>
                
                    </ImageBackground>
                </Block>
            </Block>
            
        );
    }
}

const styles = StyleSheet.create({
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
    row: {
        flex: 1, 
        flexDirection: 'row',
        flexWrap: "wrap",
    },
    
    resultImageBox : {
        width: '24%',
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
    head: { 
        height: 50, 
        backgroundColor: themeColor.COLORS.BTN_SECONDARY
    },
    headText:{
        fontSize: 14,
        fontFamily: 'Sarabun-Bold',
        textAlign: "center",
        color: themeColor.COLORS.WHITE,
    },
    text: { 
        textAlign: 'center', 
        fontWeight: '200' 
    },
    tableRow : {
        height: 40, 
        backgroundColor: '#F7F8FA' 
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
        paddingVertical: 20,
        justifyContent: "space-around",
        alignItems: "center",
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
        height: 80,
        backgroundColor: '#ff0000',
        position: 'relative',
        marginTop: '0%',
        marginHorizontal : 'auto'
    },
    titleBlock:{
        marginTop:'5%'
    },
    title: {
        fontFamily:'SarabunSemiBold',
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
      ...state.testToneResultTemp
    };
  };
  
const mapDispatchToProps = dispatch => {
    const {testToneActions} = require('../redux/TestToneResultRedux');
    
  
    return {
      loadTestToneResultHeader: testToneResultHeader => dispatch(testToneActions.loadTestToneResult(testToneResultHeader))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HearingTestResult);