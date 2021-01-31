import React, { Component } from 'react';
import { Block, Button, Text, theme } from "galio-framework";
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView,NativeModules } from 'react-native';
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
const { height, width } = Dimensions.get("screen");
// import SQLite from 'react-native-sqlite-storage';

// let db;

class Home extends Component {
  // constructor(props){
  //   super(props);
  //   SQLite.openDatabase({
  //     name : 'deviceDB.db',
  //     createFromLocation: 2},
  //     this.successToOpenDB,
  //     this.failToOpenDB
  //   );
  // }
  // successToOpenDB(){
  //   // alert('Success');
  //   console.log('Open Database Success');
  // }
  // failToOpenDB(err){
  //   console.log(err);
  // }
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
            <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ width, marginTop: '0%' }}
            >
              <Block flex style={styles.homeContainer}>
                <Image source={Images.logoFaculty} style={styles.logo} />
                <Block flex space="around">
                    <Block style={styles.titleBlock}>
                      <Block  style={styles.row}>
                        <Block style={{width: '80%', marginLeft: 0}}>
                          <Text style={styles.title} color={themeColor.COLORS.PRIMARY} >
                            ยินดีต้อนรับ
                          </Text>
                          <Text style={styles.subTitle} color={themeColor.COLORS.TEXT_SECONDARY} >
                          วันนี้คุณได้ทำการทดสอบการได้ยินหรือยัง ?
                          </Text>
                        </Block>
                        <Block style={{width: 60}}>
                          <Image source={Images.avatarGirl} style={styles.avatar} />
                        </Block>
                      </Block>
                      <Block style={styles.row}>
                        <Block style={{width: '33%', borderRadius: 4, marginHorizontal: 2, height: 80, backgroundColor: '#E5E5E5'}}></Block>
                        <Block style={{width: '33%', borderRadius: 4, marginHorizontal: 2, height: 80, backgroundColor: '#E5E5E5'}}></Block>
                        <Block style={{width: '33%', borderRadius: 4, marginHorizontal: 2, height: 80, backgroundColor: '#E5E5E5'}}></Block>
                      </Block>
                      <Block style={styles.menuSet}>
                        <Block style={styles.row}>
                          <Block style={{width: '100%'}}>
                            <Button style={styles.menuBlockMain} 
                               //onPress={() => navigation.navigate("Login")}
                               onPress={() => pureToneModule.GotoActivity()}
                            >
                              <ImageBackground
                                  source={Images.EarTestMain}
                                  style={{ height : 100, width: '100%', zIndex: 1 }}
                              >
                                <Text style={styles.menuTextMain} color={themeColor.COLORS.PRIMARY} >
                                  ทดสอบการได้ยิน
                                </Text>
                                <Text style={styles.menuSubTextMain} color={themeColor.COLORS.PRIMARY} >
                                  ด้วยการฟังโทนเสียงแบบสุ่ม
                                </Text>
                              </ImageBackground>
                              
                            </Button>
                          </Block>
                        </Block>
                        <Block style={styles.row}>
                          <Block style={{width: '50%', paddingRight: 2}}>
                            <Button style={styles.menuBlock} 
                               onPress={() => navigation.navigate("HearingTestResult")}
                            >
                              <Text style={styles.menuText} color={themeColor.COLORS.PRIMARY} >
                                ผลการตรวจ
                              </Text>
                            </Button>
                          </Block>
                          <Block style={{width: '50%', paddingLeft: 2}}>
                            <Button style={styles.menuBlock} 
                               onPress={() => navigation.navigate("Appointment")}
                            >
                              <Text style={styles.menuText} color={themeColor.COLORS.PRIMARY} >
                                ตารางนัดหมาย
                              </Text>
                            </Button>
                          </Block>
                        </Block>
                        <Block style={styles.row}>
                          <Block style={{width: '33.33%', paddingRight: 2}}>
                            <Block style={styles.menuBlock}>
                              <Text style={styles.menuText} color={themeColor.COLORS.PRIMARY} >
                                เรื่องหูที่ควรรู้
                              </Text>
                            </Block>
                          </Block>
                          <Block style={{width: '33.33%', paddingLeft: 2, paddingRight: 2}}>
                            <Block style={styles.menuBlock}>
                              <Text style={styles.menuText} color={themeColor.COLORS.PRIMARY} >
                                คู่มือการใช้งาน
                              </Text>
                            </Block>
                          </Block>
                          <Block style={{width: '33.33%', paddingLeft: 2}}>
                            <Block style={styles.menuBlock}>
                              <Text style={styles.menuText} color={themeColor.COLORS.PRIMARY} >
                                บริการของเรา
                              </Text>
                            </Block>
                          </Block>
                        </Block>
                        <Block style={styles.row}>
                          <Block style={{width: '33.33%', paddingRight: 2}}>
                            <Block style={styles.menuBlock}>
                              <Text style={styles.menuText} color={themeColor.COLORS.PRIMARY} >
                                ข้อเสนอแนะ
                              </Text>
                            </Block>
                          </Block>
                          <Block style={{width: '33.33%', paddingLeft: 2, paddingRight: 2}}>
                            <Block style={styles.menuBlock}>
                              <Text style={styles.menuText} color={themeColor.COLORS.PRIMARY} >
                                ตั้งค่าอุปกรณ์
                              </Text>
                            </Block>
                          </Block>
                          <Block style={{width: '33.33%', paddingLeft: 2}}>
                            <Block style={styles.menuBlock}>
                              <Text style={styles.menuText} color={themeColor.COLORS.PRIMARY} >
                                เกี่ยวกับเรา
                              </Text>
                            </Block>
                          </Block>
                        </Block>
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
  container: {
    // marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
    marginBottom : 10
  },
  avatar: {
    width: 60,
    height: 60,
    alignItems: 'flex-end'
  },
  row: {
    flex: 1, 
    flexDirection: 'row'
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
  },
  homeContainer: {
    position: "relative",
    padding: 10,
    marginHorizontal: 5,
    marginTop: 25,
    zIndex: 2
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  logo: {
    width: '100%',
    height: 80,
    // backgroundColor: '#000000',
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
  }
});

export default Home;
