import React, {Component} from 'react';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView , KeyboardAvoidingView } from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import Moment from 'moment';



import {connect} from 'react-redux';

const { height, width } = Dimensions.get("screen");

class HearingTestResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testResults : []
        };

        // import DeviceInfo from 'react-native-device-info'
        // const deviceLocale = DeviceInfo.getDeviceLocale()
        // moment.locale([deviceLocale, 'en'])
        
        
        this.getTestResult();

        console.log("Init = " + this.state.testResults);
    }

    async getTestResult() {
        console.log("GET TEST RESULT");
        try {
          let testResultData = await AsyncStorage.getItem("TestResults");
          let data = JSON.parse(testResultData);
          console.log("1 " + data[0].endDate);
          this.setState({
            testResults : data
          });
          console.log('TestResults = ', this.state);
        } catch (error) {
          console.log("Something went wrong, get token = ", error);
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
                                <Block style={{width: '25%',marginHorizontal: 2, paddingLeft: 10, justifyContent: 'center'}}>
                                    <Text style={styles.backText}  onPress={() => navigation.navigate("Home")}>
                                        {/* <Icon
                                        name="chevron-left"
                                        family="entypo"
                                        size={20}
                                        color={themeColor.COLORS.BTN_SECONDARY}
                                        style={{marginRight: 5}}
                                        />  */}
                                        ย้อนกลับ
                                    </Text>
                                </Block>
                                <Block style={{width: '50%',marginHorizontal: 2, justifyContent: 'center'}}>
                                    <Text  style={styles.navbarText} >
                                        ผลการตรวจ
                                    </Text>
                                </Block>
                                <Block style={{width: '25%',marginHorizontal: 2}}></Block>
                            </Block>
                        </Block>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ width, marginTop: '0%' }}
                        >
                            <Block  style={styles.contentContainer}>
                                {
                                    this.state.testResults.map((item) => {
                                        return (
                                            <Block style={styles.appointmentBlock}>
                                                <Block style={styles.row}>
                                                    <Block style={{width: '20%',height: 80, justifyContent: 'center', borderRightWidth: 1, borderColor: themeColor.COLORS.BORDER_COLOR}}>
                                                        
                                                        {/* <Text  style={styles.monthText} >
                                                            ศุกร์
                                                        </Text> */}
                                                        <Text  style={styles.dateText} >
                                                            {Moment(item.saveDate).format('DD')}
                                                        </Text>
                                                        <Text  style={styles.monthText} >
                                                            {Moment(item.saveDate).format('MMM')}
                                                        </Text>
                                                    </Block>
                                                    <Block style={{width: '40%',height: 80, paddingVertical: 7, paddingLeft: 15, paddingRight: 10}}>
                                                        <Block style={styles.row}>
                                                            <Block style={{width: '60%'}}>
                                                                <Text  style={styles.headingText} >
                                                                    ความถี่ (Hz)
                                                                </Text>
                                                            </Block>
                                                            <Block style={{width: '40%'}}>
                                                                <Text  style={styles.resultText} >
                                                                    {item.frequency}
                                                                </Text>
                                                            </Block>
                                                        </Block>
                                                        <Block style={styles.row}>
                                                            <Block style={{width: '60%'}}>
                                                                <Text  style={styles.headingText} >
                                                                    ความดัง (dB)
                                                                </Text>
                                                            </Block>
                                                            <Block style={{width: '40%'}}>
                                                                <Text  style={styles.resultText} >
                                                                    {item.hearDB}
                                                                </Text>
                                                            </Block>
                                                        </Block>
                                                    </Block>
                                                    <Block style={{width: '40%',height: 80, paddingVertical: 7, paddingRight: 15}}>
                                                        <Block style={styles.row}>
                                                            <Block style={{width: '100%',height: 80}}>
                                                                <Text  style={styles.headingResultText} >
                                                                    หูข้างที่ทดสอบ
                                                                </Text>
                                                                <Block style={styles.resultVeryGood}>
                                                                    <Text  style={styles.resultLabel}  color={themeColor.COLORS.ALERT_SUCCESS_TEXT}>
                                                                        {item.testSite=="Both" ? "ทั้งสองข้าง" : (item.testSite == "L" ? "ซ้าย" : "ขวา")}
                                                                    </Text>
                                                                </Block>
                                                            </Block>
                                                        </Block>
                                                    </Block>
                                                </Block>
                                            </Block>
                                        );
                                    })
                                }
                                


                            </Block>
                        </ScrollView>
                
                    </ImageBackground>
                </Block>
            </Block>
            
        );
    }
}

const styles = StyleSheet.create({
    resultVeryGood : {
        width: '90%',
        borderWidth: 1,
        borderColor: themeColor.COLORS.ALERT_SUCCESS_BORDER,
        borderRadius: 25,
        marginTop: 3,
        backgroundColor: themeColor.COLORS.ALERT_SUCCESS_BG
    },

    resultNormal: {
        width: '90%',
        borderWidth: 1,
        borderColor: themeColor.COLORS.ALERT_INFO_BORDER,
        borderRadius: 25,
        marginTop: 3,
        backgroundColor: themeColor.COLORS.ALERT_INFO_BG
    },

    resultOrange : {
        width: '90%',
        borderWidth: 1,
        borderColor: themeColor.COLORS.ALERT_ORANGE_BORDER,
        borderRadius: 25,
        marginTop: 3,
        backgroundColor: themeColor.COLORS.ALERT_ORANGE_BG
    },

    resultAbnormal : {
        width: '90%',
        borderWidth: 1,
        borderColor: themeColor.COLORS.ALERT_BORDER,
        borderRadius: 25,
        marginTop: 3,
        backgroundColor: themeColor.COLORS.ALERT
    },


    resultWarning : {
        width: '90%',
        borderWidth: 1,
        borderColor: themeColor.COLORS.ALERT_WARNING_BORDER,
        borderRadius: 25,
        marginTop: 3,
        backgroundColor: themeColor.COLORS.ALERT_WARNING_BG
    },
    resultLabel : {
        fontSize: 12,
        fontFamily: 'Sarabun-Regular',
        textAlign: "center",
    },
    resultText : {
        fontSize: 16,
        fontFamily: 'Sarabun-Bold',
        color: themeColor.COLORS.PRIMARY,
        textAlign: "left",
    },
    headingText: {
        fontSize: 12,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.PRIMARY,
        textAlign: "left",
        marginTop: 4
    },
    headingResultText: {
        fontSize: 12,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.PRIMARY,
        textAlign: "left",
        marginTop: 4
    },
    descText : {
        fontSize: 14,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.SECONDARY,
        textAlign: "left"
    },
    timeText : {
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
    appointmentBlock: {
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
        width: '80%',
        height: 50,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: themeColor.COLORS.BORDER_COLOR,
    },
    checkboxBlock:{
        paddingVertical: 5,
        width: '10%',
        height: 50,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: themeColor.COLORS.BORDER_COLOR,
    },
    subQuestionLabel:{
        paddingVertical: 5,
        paddingLeft: 5,
        width: '10%',
        height: 50,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: themeColor.COLORS.BORDER_COLOR,
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

// export default HearingTestResult;
const mapStateToProps = state => {
    return {
    //   Name: state.user.Name,
    //   image: state.user.image,
      network: state.network,
    };
  };
  
  
  
  export default connect(mapStateToProps, null)(HearingTestResult);
