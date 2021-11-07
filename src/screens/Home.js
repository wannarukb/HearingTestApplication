import React, { Component } from 'react';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

import { Block, Button, Text, theme } from "galio-framework";
import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView, TouchableOpacity, View, LogBox , I18nManager } from 'react-native';
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
const { height, width } = Dimensions.get("screen");
import {connect} from 'react-redux';
import {CommonActions } from '@react-navigation/native';
import Modal from "react-native-simple-modal";
import TestToneService from '../services/TestToneService';

import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  en: () => require('../translations/en.json'),
  th: () => require('../translations/th.json'),
};

const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);

const setI18nConfig = (lang) => {
  // fallback if no available language fits
  const fallback = { languageTag: lang, isRTL: false };

  var { languageTag, isRTL } =  fallback || RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters));

  if(lang){
    languageTag = fallback.languageTag;
    isRTL       = fallback.isRTL;
  }

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};


LogBox.ignoreAllLogs(true);
class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      openModal: false 
    };

    this.readLanguage();
   
    this.getToken();
    this.readResultJSONFile();

    console.log("Home information")
    console.log(this.props.userInfo);
    
  }
  
  postTestToneResult = (testToneResult) => {
    try {
        TestToneService.post_testTone_result_api(testToneResult).then(responseJson => {
          console.log('Post Test Tone API', responseJson);
          this.setState({loading:false})
          if (responseJson.ok) {
              this.setState({
                  loading: false,
              });
  
              if (responseJson.data != null) {
                  var data = responseJson.data;
                  console.log("post_testTone_result_api Success ! " + data);

                  var path = RNFS.DocumentDirectoryPath + '/HearingTestResult.txt';
                  // write the file
                  RNFS.writeFile(path, '{}', 'utf8')
                  .then((Writesuccess) => {
                    console.log('FILE WRITTEN!');
                  })
                  .catch((err) => {
                    console.log(err.message);
                  });

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
        }).catch(error => {
            console.error(error);
            this.setState({
                loading: false,
            });
        });
      
    } catch (e) {
      console.error(e);
    }
  }
  
  

  async readLanguage(){
    var lang = 'en';
    try {
      let languageInfo = await AsyncStorage.getItem("Language");
      let data = JSON.parse(languageInfo);
      lang = data.applicationLanguage;
      console.log('readLanguage get token = ', data);
      setI18nConfig(lang);
    } catch (error) {
      console.log("Something went wrong, get token = ", error);
      
    }


    
  }

  async readResultJSONFile(){
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
      console.log("Something went wrong, readResultJSONFile = ", error);
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
            { name: 'UserSurvey' },
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
    // if(this.props.userInfo.user.fn == 'DefaultUser'){
    //   this.props.navigation.dispatch(
    //     CommonActions.reset({
    //       index: 0,
    //       routes: [
    //         { name: 'Login' },
    //       ],
    //     })
    //   );
    // }else{
      console.log("LOGOUT");
      this.props.logout();
      this.resetToken();
      var path = RNFS.DocumentDirectoryPath + '/HearingTestResult.txt';
      var data = {};
      AsyncStorage.setItem("TestResults", JSON.stringify(data));
      // write the file
      RNFS.writeFile(path, '{}', 'utf8')
      .then((Writesuccess) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
      this.closeModal();
    // }
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


  onClickChangeLanguage = () => {
    
    
    this.handleLocalizationChange('en');
    this.closeModal();
  };

  handleLocalizationChange = async(lang) =>{
    try {
      var langInfo = {
        applicationLanguage : lang,
      }
      await AsyncStorage.setItem("Language", JSON.stringify(langInfo));
  
      console.log("handleLocalizationChange", "language change to = " + langInfo.applicationLanguage);
      setI18nConfig(lang);
      this.forceUpdate();
    } catch (error) {
      console.log("Something went wrong, store token = ", error);
    }
  }

  renderWelcomeBlock(){
    if(this.props.userInfo != null && this.props.userInfo.isAuthenticated == true){
      if(this.props.userInfo.user.fn == 'DefaultUser'){
        return (
          <Block  style={styles.row}>
            <Block style={styles.welcomeInfoBlock}>
              <Text style={styles.subTitle} color={themeColor.COLORS.PRIMARY} >
                {translate('Introduction')}
              </Text>
              <Text style={styles.title} color={themeColor.COLORS.PRIMARY} >
                Guest
              </Text>
            </Block>
            <Block style={{width: '22%'}}>
              <Button style={styles.menuButtonTry} onPress={this.openModal} >
                <Text style={styles.createButtonText}>
                  {translate('SetupButton')}
                </Text>
              </Button>
              
              
            </Block>
          </Block>
        )
      }else{
        return (
          <Block  style={styles.row}>
            <Block style={styles.welcomeInfoBlock}>
              <Text style={styles.subTitle} color={themeColor.COLORS.PRIMARY} >
                {translate('Introduction')}
              </Text>
              <Text style={styles.title} color={themeColor.COLORS.PRIMARY} >
                {this.props.userInfo.user.fn}
              </Text>
            </Block>
            <Block style={{width: '22%'}}>
              <Button style={styles.menuButtonTry} onPress={this.openModal} >
                <Text style={styles.createButtonText}>
                  {translate('SetupButton')}
                </Text>
              </Button>
              
              
            </Block>
          </Block>
        )
      }
    }else{
      return (
        <Block  style={styles.row}>
          <Block style={styles.welcomeInfoBlock}>
            <Text style={styles.title} color={themeColor.COLORS.PRIMARY} >
              {translate('Welcome')}
            </Text>
            <Text style={styles.subTitle} color={themeColor.COLORS.TEXT_SECONDARY} >
              {translate('WelcomeSubInfo')}
            </Text>
          </Block>
          <Block style={{width: '22%'}}>
          </Block>
        </Block>
      )
    }
      
  }

  
  render() {
    // const { navigation } = this.props;
    // const pureToneModule = NativeModules.HearingTestModule;
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
                      <Block style={styles.welcomeBlock}>
                      {this.renderWelcomeBlock()}  
                      </Block>
                      <Block style={styles.menuSet}>
                        <Block style={styles.row}>
                          <Block style={{width: '100%'}}>
                            <Button style={styles.menuBlockMain} 
                              onPress={() => this.onClickStartTesting()}
                            >
                              <ImageBackground
                                  source={Images.EarTestMain}
                                  style={{ height : 100, width: '100%', zIndex: 1 }}
                              >
                                <Text style={styles.menuTextMain} color={themeColor.COLORS.PRIMARY} >
                                  {translate('TestingButton')}
                                </Text>
                                <Text style={styles.menuSubTextMain} color={themeColor.COLORS.PRIMARY} >
                                  {translate('TestingButtonDesc')}
                                </Text>
                              </ImageBackground>
                              
                            </Button>
                          </Block>
                        </Block>
                        <Block style={styles.row}>
                          <Block style={{width: '100%'}}>
                            <Button style={styles.menuBlockMain} 
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
                                <Text style={styles.menuTextMain} color={themeColor.COLORS.PRIMARY} >
                                  {translate('ResultButton')}
                                </Text>
                                <Text style={styles.menuSubTextMain} color={themeColor.COLORS.PRIMARY} >
                                  {translate('ResultButtonDesc')}
                                </Text>
                              </ImageBackground>
                              
                            </Button>
                          </Block>
                        </Block>
                        {/* <Block style={styles.row}>
                          <Block style={{width: '50%', paddingRight: 2}}>
                            <Button style={styles.menuBlock} 
                              //  onPress={() => navigation.navigate("HearingTestResult")}
                              onPress={() => 
                                this.props.navigation.dispatch(
                                  CommonActions.reset({
                                    index: 0,
                                    routes: [
                                      { name: 'HearingTestResult' },
                                    ],
                                  })
                                )}
                            >
                              <Text style={styles.menuText} color={themeColor.COLORS.PRIMARY} >
                                ผลการตรวจ
                              </Text>
                            </Button>
                          </Block>
                          <Block style={{width: '50%', paddingLeft: 2}}>
                            <Button style={styles.menuBlock} 
                              //  onPress={() => navigation.navigate("Appointment")}
                            >
                              <Text style={styles.menuText} color={themeColor.COLORS.PRIMARY} >
                                ตารางนัดหมาย
                              </Text>
                            </Button>
                          </Block>
                        </Block> */}
                        {/* <Block style={styles.row}>
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
                        </Block> */}
                      </Block>
                    </Block>
                </Block>
              </Block>
            </ScrollView>
          <Modal
            offset={this.state.offset}
            open={this.state.openModal}
            modalDidOpen={this.modalDidOpen}
            modalDidClose={this.modalDidClose}
            style={{ alignItems: "center" }}
            
          >
            <View style={{ alignItems: "center" }}>
              
              <TouchableOpacity style={{ margin: 5 }} onPress={this.onClickChangeLanguage}>
                <Text>{translate('EnglishLabel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ margin: 5 }} onPress={this.onClickChangeLanguage}>
                <Text>{translate('ThaiLabel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ margin: 5 }} onPress={this.onClickLogOut}>
                <Text>{ (this.props.userInfo.user.fn != 'DefaultUser') ? translate('Logout'): translate('Logout')}</Text>
              </TouchableOpacity>
            </View>
          </Modal>
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
  menuButtonTry:{
    width: '100%', 
    alignItems:'center', 
    justifyContent: 'center',
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
  row: {
    flex: 1, 
    flexDirection: 'row'
  },
  welcomeBlock: {
    // marginHorizontal : 0,
    // backgroundColor: '#14468A'
  },
  welcomeInfoBlock: {
    width: '75%', 
    marginLeft: 0,
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
    height: 60,
    // backgroundColor: '#000000',
    position: 'relative',
    marginTop: '0%',
    marginHorizontal : 'auto'
  },
  titleBlock:{
    marginTop:'5%',
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

const mapStateToProps = state => {
  return {
    // Name: state.user.Name,
    // image: state.user.image,
    userInfo: state.user,
    network: state.network,
  };
};

const mapDispatchToProps = dispatch => {
  const {actions} = require('../redux/UserRedux');

  return {
    logout: () => dispatch(actions.logout()),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);
