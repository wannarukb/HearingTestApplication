import React from 'react';
import { StyleSheet, Dimensions, ImageBackground,  ScrollView , NativeModules } from 'react-native';
import { Block, Text, theme, Radio } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button } from "../components";
import {Picker} from '@react-native-community/picker';

const { height, width } = Dimensions.get("screen");

class HeadsetSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        deviceType: 'ไม่แน่ใจ',
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
                <Block style={{width: '25%',marginHorizontal: 2, background: '#ff0000' , paddingLeft: 10, justifyContent: 'center'}}>
                  {/* <Button style={styles.backBtn}  onPress={() => navigation.navigate("Home")}>
                    
                  </Button> */}
                  <Text style={styles.backText}  onPress={() => navigation.navigate("UserSurvey")}>
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
                    Headset
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
                <Block  style={{ paddingVertical: 15, justifyContent: "space-around", height: 30,alignItems: "center", marginBottom: 30}}>
                  <Text  style={styles.mainQuestionText} >กรุณาเลือกอุปกรณ์ที่ใช้ในการทดสอบ</Text>
                </Block>
                <Block style={styles.questionRow}>
                  <Block style={styles.subQuestion}>
                    <Radio label="ลำโพงจากโทรศัพท์โดยตรง" initialValue />
                  </Block>
                </Block>

                <Block style={styles.questionRow}>
                  <Block style={styles.subQuestion}>
                    <Radio label="ต่อหูฟัง" />
                  </Block>
                </Block>

                <Block style={styles.questionRow}>
                  <Block style={styles.subQuestion}>
                    <Radio label="ไม่แน่ใจ" />
                  </Block>
                </Block>
                    
                <Block  style={{ paddingVertical: 15, justifyContent: "space-around", height: 30,alignItems: "center", marginTop: 20, marginBottom: 30}}>
                  <Text  style={styles.mainQuestionText} >กรุณาเลือกชนิดยี่ห้อหรือโมเดลของหูฟัง</Text>
                </Block>
                <Block style={styles.questionRow}>
                <Picker
                    selectedValue={this.state.deviceType}
                    style={styles.selectList}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({deviceType: itemValue})
                    }>
                    <Picker.Item label="AirPods" value="AirPods" />
                    <Picker.Item label="Beats" value="Beats" />
                    <Picker.Item label="Sony" value="Sony" />
                    <Picker.Item label="ไม่แน่ใจ" value="ไม่แน่ใจ" />
                </Picker>
                </Block>
              </Block>
              {(this.state.q1 || this.state.q2 || this.state.q3)
                ? (<Block flex middle>
                  <Block style={styles.alertBox}>
                    
                    <Text style={styles.alertTextHead}>
                      {/* <Icon
                        name="md-alert"
                        family="Ionicon"
                        size={20}
                        color={themeColor.COLORS.ALERT_TEXT}
                      />  */}
                      สภาพร่างกายของคุณไม่พร้อมที่จะทำการทดสอบ
                    </Text>
                    <Text style={styles.alertText}>
                      โปรดทำการทดสอบในวันอื่น หากท่านทดสอบ 
                    </Text>
                    <Text style={styles.alertText}>
                      อาจทำให้ผลลัพธ์ที่ได้ จะไม่สมบูรณ์ถูกต้อง
                    </Text>
                  </Block>
                </Block>)
                :(
                  <Block middle>
                    <Button style={styles.createButton}
                      onPress={() => navigation.navigate("HearingTestType")}>
                      <Text style={styles.createButtonText}>
                      ถัดไป
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
  selectList : {
    height: 50, 
    width: '100%',
    fontSize: 18,
    fontFamily: 'Sarabun-Regular',
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

export default HeadsetSelect;
