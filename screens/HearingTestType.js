import React from 'react';
import { StyleSheet, Dimensions, ImageBackground,  ScrollView, NativeModules } from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button } from "../components";


const { height, width } = Dimensions.get("screen");

class HearingTestType extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    const { navigation } = this.props;
    const pureToneModule = NativeModules.HearingTestModule;
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
                    วิธีการทดสอบ
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
                    <Block  style={{ paddingVertical: 15, justifyContent: "space-around", height: 30,alignItems: "center", marginBottom: 10}}>
                        <Text  style={styles.mainQuestionText} >กรุณาเลือกชนิดการทดสอบ</Text>
                    </Block><Block  style={{ paddingVertical: 15, justifyContent: "space-around", height: 30,alignItems: "center", marginBottom: 30}}>
                        <Text  style={styles.mainQuestionText} >เพื่อเริ่มการทดสอบ</Text>
                    </Block>
                    <Block style={styles.questionRow}>
                        <Block style={styles.subQuestion}>
                            <Button style={styles.createButton}
                                onPress={() => pureToneModule.GotoActivity()}>
                                <Text style={styles.createButtonText}>
                                Pure Tone Audio Meter
                                </Text>
                            </Button>
                        </Block>
                    </Block>

                    <Block style={styles.questionRow}>
                        <Block style={styles.subQuestion}>
                            <Button style={styles.createButton}
                                onPress={() => navigation.navigate("UserSurvey")}>
                                <Text style={styles.createButtonText}>
                                Speech In Noise
                                </Text>
                            </Button>
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
    marginHorizontal: 20,
    marginLeft: 0,
    marginBottom: 10
  },
  subQuestion:{
    paddingVertical: 5,
    paddingLeft: 10,
    width: '100%',
    height: 50,
    justifyContent: "center",
  },
  container: {
    // marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  

  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
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
  },
  createButton:{
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: themeColor.COLORS.BTN_SECONDARY,
    width: '100%'
  },
  createButtonText:{
    fontSize: 16,
    fontFamily: 'Sarabun-Medium',
    color: themeColor.COLORS.WHITE
  },
});

export default HearingTestType;
