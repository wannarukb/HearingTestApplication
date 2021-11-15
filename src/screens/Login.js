import React, {useState} from 'react';
import {connect} from 'react-redux';
import AuthService from '../services/AuthService';
import TestToneService from '../services/TestToneService';
import {CommonActions } from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';

import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView ,KeyboardAvoidingView ,TextInput} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button, Input } from "../components";
const { height, width } = Dimensions.get("screen");

import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      UserEmail:'',
      UserPassword:''
    };
  }

  componentDidMount() {
    // this.props.logout();
    this.getToken();
    
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

  login(){
    const {UserEmail,UserPassword}=this.state
    if(UserEmail == ""){
      alert('กรุณากรอกอีเมล')
    }else if( UserPassword == ""){
      alert('กรุณากรอกรหัสผ่าน')
    }else if(!this.props.network.isConnected){
      alert('No Internet')    
    }else{
      this.UserLoginFunction()
    }
  }

  tryButton(){
    //this.goToUserSurveyPage();
    this.state.UserEmail = 'DefaultUser';
    this.UserLoginFunction();

  }

  goToUserSurveyPage = () =>{ 
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'UserSurvey' },
        ],
      })
    );
  }

  // async storeToken(user) 
  storeToken = async(user) =>{
    try {
      await AsyncStorage.setItem("UserInfo", JSON.stringify(user));
      console.log("storeToken", "information have been store");
    } catch (error) {
      console.log("Something went wrong, store token = ", error);
    }
  }

  // async storeTestToneList(testToneList) 
  storeTestToneList = async(testToneList) =>{
    try {
      await AsyncStorage.setItem("TestToneList", JSON.stringify(testToneList));
      console.log("storeTestToneList", "information have been store");
      this.goToUserSurveyPage();
    } catch (error) {
      console.log("Something went wrong, store token = ", error);
    }
  }
  

  loadTestTone = (userToken) =>{
    try {
      TestToneService.test_tone_api(userToken)
      .then(responseJson => {
        console.log('test_tone_api responseJson = ', responseJson.status);
        if (responseJson.ok) {
          if (responseJson.data != null) {
            var data = responseJson.data;
            // console.log('login load test tone data ' + data);
            this.props.loadTestToneList(data);
            this.storeTestToneList(data);
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

  UserLoginFunction = () => {
    const { UserEmail ,UserPassword}  = this.state ;
    try {
      AuthService.login_api(UserEmail,UserPassword)
      .then(responseJson => {
        console.log('login', responseJson);
        this.setState({loading:false})
        if (responseJson.ok) {
          this.setState({
            loading: false,
          });

          if (responseJson.data != null) {
            var data = responseJson.data;
            console.log('userInfo', data);
            this.storeToken(data);
            this.props.login(data);
            this.loadTestTone(data.token);
            
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
        this.setState({
          loading: false,
        });
      });
      
    } catch (e) {
      console.error(error);
      this.setState({
        loading: false,
      });
    }
  }
  render() {
    const { navigation } = this.props;
    const {loading,UserEmail,UserPassword}=this.state;
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
                        <Block flex middle style={{ paddingVertical: 30}}>
                          <Image source={Images.Ear} style={styles.earImg} />
                          <Text style={styles.title} color={themeColor.COLORS.PRIMARY} >
                            {translate('Login')}
                          </Text>
                        </Block>
                      </Block>
                    </Block>
                    <Block flex middle>
                        <Block style={styles.registerContainer}>
                          <Block flex>
                    
                            <Block flex center>
                              <KeyboardAvoidingView
                                style={{ flex: 1 }}
                                behavior="padding"
                                enabled
                              >
                                <Block  style={{ marginBottom: 15 }}>
                                  <Text style={styles.formLabel} color={themeColor.COLORS.PRIMARY} >
                                    {translate('EmailLabel')}
                                  </Text>
                                  <TextInput
                                    style={styles.inputType}
                                    placeholder="Email"
                                    placeholderTextColor="grey"
                                    returnKeyType="next"
                                    onSubmitEditing={() => this.pass_tn.focus()}
                                    onChangeText={text => this.setState({ UserEmail: text })}
                                    value={UserEmail}
                                  />
                                  </Block>
                                <Block >
                                  <Text style={styles.formLabel} color={themeColor.COLORS.PRIMARY} >
                                    {translate('PasswordLabel')}
                                  </Text>
                                  <TextInput
                                    style={styles.inputType}
                                    ref={(id)=>{this.pass_tn=id}}
                                    placeholder="Password"
                                    placeholderTextColor="grey"
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    onChangeText={text => this.setState({ UserPassword: text })}
                                    value={UserPassword}
                                  />
                                </Block>
                                
                                <Block middle>
                                  <Button style={styles.createButton}
                                   onPress={() => this.login()}>
                                    <Text style={styles.createButtonText}>
                                      {translate('Login')}
                                    </Text>
                                  </Button>
                                </Block>

                                <Block  style={styles.row}>
                                  <Block style={{width: '60%', marginLeft: -5, paddingRight: 5}}>
                                    <Button style={styles.menuButtonRegister} 
                                     onPress={() => this.props.navigation.dispatch(
                                      CommonActions.reset({
                                        index: 0,
                                        routes: [
                                          { name: 'Register' },
                                        ],
                                      })
                                    )}
                                    >
                                      <Text style={styles.createButtonText}>
                                        {translate('RegisterButton')}
                                      </Text>
                                    </Button>
                                  </Block>
                                  <Block style={{width: '40%', paddingLeft: 5}}>
                                    <Button style={styles.menuButtonTry}
                                    onPress={() => this.tryButton()}>
                                      <Text style={styles.createButtonText}>
                                        {translate('LoginAsGuest')}
                                      </Text>
                                    </Button>
                                  </Block>
                                </Block>
                                
                              </KeyboardAvoidingView>
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
    flex: 1
  },
  registerContainer: {
    margin: 10
  },
  createButton:{
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: themeColor.COLORS.PRIMARY_BTN_SUCCESS,
    width: '100%'
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
  },
  inputType:{
    borderColor: themeColor.COLORS.INPUT,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: themeColor.COLORS.WHITE
    // marginTop: 5
  }
});
Login.defaultProps = {
  id: '',
  token: ''
};

const mapStateToProps = state => {
  return {
    network: state.network,
  };
};

const mapDispatchToProps = dispatch => {
  const {actions} = require('../redux/UserRedux');
  const {testToneActions} = require('../redux/TestToneRedux');
  

  return {
    login: customers => dispatch(actions.login(customers)),
    logout: () => dispatch(actions.logout()),
    loadTestToneList: testToneList => dispatch(testToneActions.loadTestToneList(testToneList))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);