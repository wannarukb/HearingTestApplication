import React, {useState} from 'react';
import {connect} from 'react-redux';
import {CommonActions } from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import AuthService from '../services/AuthService';

import { StyleSheet, Dimensions, SafeAreaView,Platform, TouchableWithoutFeedback, Keyboard, ImageBackground, Image, ScrollView, View ,KeyboardAvoidingView ,TextInput} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button, Input } from "../components";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CheckBox from '@react-native-community/checkbox';


import i18n, { translate } from 'i18n-js';
import memoize from 'lodash.memoize';

translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)

const { height, width } = Dimensions.get("screen");
class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            isMale : false,
            isFemale : false
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

    // async storeToken(user) 
    storeToken = async(user) =>{
        try {
        await AsyncStorage.setItem("UserInfo", JSON.stringify(user));
        console.log("storeToken", "information have been store");
        } catch (error) {
        console.log("Something went wrong, store token = ", error);
        }
    }


    UserLoginFunction = (userData) => {
        try {
            AuthService.login_api(userData.email, userData.password).then(responseJson => {
                console.log('Login API', responseJson);
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
                        this.props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                            { name: 'Home' },
                            ],
                        })
                        );
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
          // saving error
        }
    }

    UserRegisterFunction = () => {
        const { UserEmail ,UserPassword, UserFirstName, UserLastName, UserBirthYear, UserGender }  = this.state ;
        try {
            let userData = {
                "email" : UserEmail,
                "password" : UserPassword,
                "firstName" : UserFirstName,
                "lastName" : UserLastName,
                "gender" : UserGender
            }

            console.log('Register Data : ' + JSON.stringify(userData));
            AuthService.register_api(userData).then(responseJson => {
                console.log('Register API', responseJson);
                this.setState({loading:false})
                if (responseJson.ok) {
                    this.setState({
                        loading: false,
                    });
        
                    if (responseJson.data != null) {
                        var data = responseJson.data;
                        this.UserLoginFunction(data);
                        console.log("Register Success ! " + data);
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
          // saving error
        }
    }

    onSubmitRegister(){
        const {UserEmail, UserPassword, UserFirstName, UserLastName, UserBirthYear, UserGender}=this.state
        if(UserEmail == "" || UserEmail == null || UserEmail == undefined){
          alert('กรุณากรอกอีเมล')
        }else if( UserPassword == "" || UserPassword == null || UserPassword == undefined){
          alert('กรุณากรอกรหัสผ่าน')
        }else if( UserFirstName == "" || UserFirstName == null || UserFirstName == undefined){
            alert('กรุณากรอกชื่อจริง')
        }else if( UserLastName == "" || UserLastName == null || UserLastName == undefined){
            alert('กรุณากรอกนามสกุล')
        }else if( UserGender == "" || UserGender == null || UserGender == undefined){
            alert('กรุณากรอกเพศ')
        }else if(!this.props.network.isConnected){
          alert('No Internet')    
        }else{
          this.UserRegisterFunction();
        }
    }

    toggleGender  = (gender)=>{
        this.setState({
            UserGender: gender,
        })
    }

    render() {
        const { navigation } = this.props;
        const {loading,  UserEmail ,UserPassword, UserFirstName, UserLastName, UserBirthYear, UserGender } = this.state;
        return (
            <KeyboardAwareScrollView
                // behavior={Platform.OS === "ios" ? "padding" : "height"}
                // style={{ flex: 1 }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Block  style={{flex: 1, justifyContent: "flex-end"}}>
                        <ImageBackground
                            source={Images.lightBG}
                            style={{ height, width, zIndex: 1 }}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{ width, marginTop: '0%' }}
                            >
                            <Block flex style={styles.homeContainer} >
                                <Image source={Images.logoFaculty} style={styles.logo}/>
                                <Block flex space="around">
                                    <Block style={styles.titleBlock}>
                                        <Block  style={styles.row}>
                                            <Block flex middle style={{ paddingVertical: 20}}>
                                                <Image source={Images.Ear} style={styles.earImg} />
                                                <Text style={styles.title} color={themeColor.COLORS.PRIMARY} >
                                                    {translate('RegisterHeaderLabel')}
                                                </Text>
                                            </Block>
                                        </Block>
                                    </Block>
                                    <Block flex middle>
                                        <Block flex style={styles.registerContainer}>
                                        <Block flex>
                                            <Block style={{width: '100%'}} >
                                                <Block style={styles.row} style={{ marginBottom: 15}} >
                                                    <Text style={styles.formLabel} color={themeColor.COLORS.PRIMARY} >
                                                        {translate('EmailLabel')}
                                                    </Text>
                                                    <TextInput
                                                        style={styles.inputType}
                                                        placeholder="Email"
                                                        placeholderTextColor="grey"
                                                        returnKeyType="next"
                                                        keyboardType="email-address"
                                                        onSubmitEditing={() => this.pass_tn.focus()}
                                                        onChangeText={text => this.setState({ UserEmail: text })}
                                                        value={UserEmail}
                                                    />
                                                </Block>
                                                <Block style={{ marginBottom: 15 }}>
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
                                                    returnKeyType="next"
                                                    maxLength={10}
                                                    onChangeText={text => this.setState({ UserPassword: text })}
                                                    value={UserPassword}
                                                />
                                                </Block>
                                                <Block  style={{ marginBottom: 15 }}>
                                                <Text style={styles.formLabel} color={themeColor.COLORS.PRIMARY} >
                                                    {translate('FirstNameLabel')}
                                                </Text>
                                                <TextInput
                                                    style={styles.inputType}
                                                    placeholderTextColor="grey"
                                                    returnKeyType="next"
                                                    onSubmitEditing={() => this.pass_tn.focus()}
                                                    onChangeText={text => this.setState({ UserFirstName: text })}
                                                    value={UserFirstName}
                                                />
                                                </Block>
                                                <Block  style={{ marginBottom: 15 }}>
                                                <Text style={styles.formLabel} color={themeColor.COLORS.PRIMARY} >
                                                    {translate('LastNameLabel')}
                                                </Text>
                                                <TextInput
                                                    style={styles.inputType}
                                                    placeholderTextColor="grey"
                                                    returnKeyType="next"
                                                    onSubmitEditing={() => this.pass_tn.focus()}
                                                    onChangeText={text => this.setState({ UserLastName: text })}
                                                    value={UserLastName}
                                                />
                                                </Block>
                                                {/* <Block  style={{ marginBottom: 15 }}>
                                                    <Text style={styles.formLabel} color={themeColor.COLORS.PRIMARY} >
                                                        ปีเกิด (Year of Birth)
                                                    </Text>
                                                    <TextInput
                                                        style={styles.inputType}
                                                        placeholderTextColor="grey"
                                                        returnKeyType="done"
                                                        keyboardType="number-pad"
                                                        maxLength={4}
                                                        onSubmitEditing={() => this.pass_tn.focus()}
                                                        onChangeText={text => this.setState({ UserBirthYear: text })}
                                                        value={UserBirthYear}
                                                    />
                                                </Block> */}
                                                <Block  style={{ marginBottom: 15 }}>
                                                    <Text style={styles.formLabel} color={themeColor.COLORS.PRIMARY} >
                                                        {translate('GenderLabel')}
                                                    </Text>
                                                    <Block style={styles.row}>
                                                        <Block style={styles.checkboxBlock}>
                                                            <CheckBox
                                                                value = {UserGender ==  'female'} 
                                                                onValueChange = {()=> this.toggleGender('female')}
                                                                style={styles.checkbox}
                                                            />
                                                        </Block>
                                                        <Block style={styles.subQuestionLabel}>
                                                            <Text  style={styles.subQuestionText} > {translate('FemaleLabel')}</Text>
                                                        </Block>
                                                        <Block style={styles.checkboxBlock}>
                                                            <CheckBox
                                                                value = {UserGender ==  'male'} 
                                                                onValueChange = {()=> this.toggleGender('male')}
                                                                style={styles.checkbox}
                                                            />
                                                        </Block>
                                                        <Block style={styles.subQuestionLabel}>
                                                            <Text  style={styles.subQuestionText} > {translate('MaleLabel')}</Text>
                                                        </Block>

                                                        
                                                    </Block>
                                                </Block>
                                                <Block style={styles.row} >
                                                    <Block style={{width: '100%'}}>
                                                        <Button style={styles.createButton} onPress={() => this.onSubmitRegister()}>
                                                            <Text style={styles.createButtonText}>
                                                                {translate('ConfirmRegisterButton')}
                                                            </Text>
                                                        </Button>
                                                    </Block>
                                                </Block>
                                            </Block>
                                        </Block>
                                        </Block>
                                    </Block>
                                    
                                
                                </Block>
                            </Block>
                            </ScrollView>
                        </ImageBackground>
                        <View/>
                        </Block>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
            </KeyboardAwareScrollView>
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
    margin: 0,
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
    marginTop: 100,
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
    marginTop:'5%',
    height: 120
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
    backgroundColor: themeColor.COLORS.WHITE,
    // marginTop: 5
    fontSize: 16,
  },
  checkboxBlock:{
    padding: 5,
    width: '10%',
    height: 50,
    justifyContent: "center",
    // borderBottomWidth: 1,
    // borderBottomColor: themeColor.COLORS.BORDER_COLOR,
  },
  subQuestionLabel:{
    paddingVertical: 5,
    paddingLeft: 5,
    width: '40%',
    height: 50,
    justifyContent: "center",
    // borderBottomWidth: 1,
    // borderBottomColor: themeColor.COLORS.BORDER_COLOR,
  },
  subQuestionText:{
    color: themeColor.COLORS.PRIMARY,
    fontFamily:'Sarabun-Medium',
    fontSize: 16,
    width: '40%',
  },
  checkbox: {
    alignSelf: "center",
  },
});

Register.defaultProps = {
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
    register: users => dispatch(actions.register(users)),
    loadTestToneList: userToken => dispatch(testToneActions.loadTestToneList(userToken))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);