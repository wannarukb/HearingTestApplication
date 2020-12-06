import React from 'react';
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView , KeyboardAvoidingView } from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";


const { height, width } = Dimensions.get("screen");

class Appointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      q1 : false,
      q2 : false,
      q3 : false
    };
  };

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
                    ตารางนัดหมาย
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
                    <Block style={styles.row}>
                        <Block style={{width: '100%', paddingHorizontal: 10, marginBottom: 10,  justifyContent: 'center'}}>
                            <Text  style={styles.headingText} >
                                การนัดหมายที่กำลังจะถึง
                            </Text>
                        </Block>
                    </Block>
                    <Block style={styles.appointmentBlockActive}>
                        <Block style={styles.row}>
                            <Block style={{width: '25%',height: 100, justifyContent: 'center'}}>
                            <Text  style={styles.monthTextActive} >
                                อังคาร
                            </Text>
                            <Text  style={styles.dateTextActive} >
                                10
                            </Text>
                            <Text  style={styles.monthTextActive} >
                                เม.ย.
                            </Text>
                            </Block>
                            <Block style={{width: '75%',height: 100, paddingVertical: 7, paddingHorizontal: 15}}>
                                <Text  style={styles.timeTextActive} >
                                    {/* <Icon
                                        name="clock"
                                        family="Feather"
                                        size={16}
                                        color={themeColor.COLORS.WHITE}
                                        />  */}
                                    11.00 น.
                                </Text>
                                <Text  style={styles.headingTextActive} >
                                    นพ. ศิริชัย สวัสดี
                                </Text>
                                <Text  style={styles.descTextActive} >
                                    ตรวจความสามารถการได้ยิน
                                </Text>
                            </Block>
                        </Block>
                    </Block>

                    <Block style={styles.row}>
                        <Block style={{width: '100%', marginTop: 30, paddingHorizontal: 10, marginBottom: 10,  justifyContent: 'center'}}>
                            <Text  style={styles.headingText} >
                                การนัดหมายทั้งหมด
                            </Text>
                        </Block>
                    </Block>
                    <Block style={styles.appointmentBlock}>
                        <Block style={styles.row}>
                            <Block style={{width: '25%',height: 100, justifyContent: 'center'}}>
                            <Text  style={styles.monthText} >
                                อังคาร
                            </Text>
                            <Text  style={styles.dateText} >
                                10
                            </Text>
                            <Text  style={styles.monthText} >
                                เม.ย.
                            </Text>
                            </Block>
                            <Block style={{width: '75%',height: 100, paddingVertical: 7, paddingHorizontal: 15}}>
                                <Text  style={styles.timeText} >
                                    {/* <Icon
                                        name="clock"
                                        family="Feather"
                                        size={16}
                                        color={themeColor.COLORS.SECONDARY}
                                        />  */}
                                    11.00 น.
                                </Text>
                                <Text  style={styles.headingText} >
                                    นพ. ศิริชัย สวัสดี
                                </Text>
                                <Text  style={styles.descText} >
                                    ตรวจความสามารถการได้ยิน
                                </Text>
                            </Block>
                        </Block>
                    </Block>

                </Block>
            </ScrollView>
            
          </ImageBackground>
        </Block>
      </Block>
        
    );
  }
}

const styles = StyleSheet.create({
    headingText: {
        fontSize: 20,
        fontFamily: 'Sarabun-SemiBold',
        color: themeColor.COLORS.PRIMARY,
        textAlign: "left",
        marginVertical: -2
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
        fontSize: 14,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.PRIMARY_BTN_SUCCESS,
        textAlign: "center"
    },
    dateText : {
        fontSize: 28,
        fontFamily: 'Sarabun-Bold',
        color: themeColor.COLORS.PRIMARY_BTN_SUCCESS,
        textAlign: "center",
        marginVertical: -10
    },
    appointmentBlock: {
        backgroundColor: themeColor.COLORS.WHITE,
        height: 100,
        marginHorizontal: 10,
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

    /* ACTIVE */
    headingTextActive: {
        fontSize: 20,
        fontFamily: 'Sarabun-SemiBold',
        color: themeColor.COLORS.WHITE,
        textAlign: "left",
        marginVertical: -2
    },
    descTextActive : {
        fontSize: 14,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.WHITE,
        textAlign: "left"
    },
    timeTextActive : {
        fontSize: 14,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.WHITE,
        textAlign: "left"
    },
    monthTextActive : {
        fontSize: 14,
        fontFamily: 'Sarabun-Regular',
        color: themeColor.COLORS.WHITE,
        textAlign: "center"
    },
    dateTextActive : {
        fontSize: 28,
        fontFamily: 'Sarabun-Bold',
        color: themeColor.COLORS.WHITE,
        textAlign: "center",
        marginVertical: -10
    },
    appointmentBlockActive: {
        backgroundColor: themeColor.COLORS.PRIMARY_BTN_SUCCESS,
        height: 100,
        marginHorizontal: 10,
        width: '95%',
        borderRadius: 4,
        shadowColor: themeColor.COLORS.PRIMARY_BTN_SUCCESS,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.62,
        elevation: 8,
    },
    //
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

export default Appointment;
