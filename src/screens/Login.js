import React from 'react';
import {connect} from 'react-redux';
import Api from '../services/Api';
import {CommonActions } from '@react-navigation/native';

import { StyleSheet, Dimensions, ImageBackground, Image, ScrollView ,KeyboardAvoidingView ,TextInput} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button, Input } from "../components";
const { height, width } = Dimensions.get("screen");

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
    this.props.logout();
  }

  login(){
    const {UserEmail,UserPassword}=this.state
    if(UserEmail==""){
      alert('enter UserEmail')
    }else if(UserPassword==''){
      alert('enter UserPassword')
    }else if(!this.props.network.isConnected){
      alert('No Internet')    
    }else{
      this.UserLoginFunction()
    }
  }

  UserLoginFunction = () =>{
    const { UserEmail ,UserPassword}  = this.state ;
    Api.login_api(UserEmail,UserPassword)
    .then(responseJson => {
      console.log('login', responseJson);
      this.setState({loading:false})
      if (responseJson.ok) {
        this.setState({
          loading: false,
        });

        if (responseJson.data != null) {
          var data = responseJson.data;
          console.log(data);
          console.log(data.token);
          console.log(data.id);
          this.props.login(data);
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'UserSurvey' },
              ],
            })
          );
        //   if (responseJson.data.hasOwnProperty('status')) {
        //     if (responseJson.data.status == 200) {
        //       if (responseJson.data.hasOwnProperty('message')) {
          
        //         alert(responseJson.data.message)

        //         if(responseJson.data.hasOwnProperty("data")){
        //           if(responseJson.data.data.length>0){

        //         console.log(responseJson.data.data[0]);
        //             this.props.login(responseJson.data.data[0]);
        //             this.props.navigation.dispatch(
        //                 CommonActions.reset({
        //                   index: 0,
        //                   routes: [
        //                     { name: 'UserSurvey' },
        //                   ],
        //                 })
        //               );
        //           }
        //         }

        //       }
        //     } else {
        //       alert('server error ' + responseJson.data.status)
        //       if (responseJson.data.hasOwnProperty('message')) {
        //         alert(responseJson.data.message)
        //       }
        //     }
        //   } else {
        //     alert('server error status')
        //   }
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
                          เข้าสู่ระบบ
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
                                  ชื่อผู้ใช้งาน (Username)
                                  </Text>
                                  <TextInput
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
                                  รหัสผ่าน (Password)
                                  </Text>
                                  <TextInput
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
                                    เข้าสู่ระบบ
                                    </Text>
                                  </Button>
                                </Block>

                                <Block  style={styles.row}>
                                  <Block style={{width: '60%', marginLeft: -5, paddingRight: 5}}>
                                    <Button style={styles.menuButtonRegister} >
                                      <Text style={styles.createButtonText}>
                                      สมัครเลย !
                                      </Text>
                                    </Button>
                                  </Block>
                                  <Block style={{width: '40%', paddingLeft: 5}}>
                                    <Button style={styles.menuButtonTry}>
                                      <Text style={styles.createButtonText}>
                                        ทดลองใช้งาน
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
    height: 80,
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

  return {
    login: customers => dispatch(actions.login(customers)),
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);