import React, { Component } from 'react';
import {connect} from 'react-redux';
import {CommonActions } from '@react-navigation/native';
import { StyleSheet, Dimensions, ImageBackground, Image,  ScrollView , View} from 'react-native';
import { Block, Text, theme } from "galio-framework";
import themeColor from "../constants/Theme";
import Images from "../constants/Images";
import { Button } from "../components";
import CheckBox from '@react-native-community/checkbox';


import {LanguageService} from "../services/LanguageService";
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';

import mainStyle  from "../constants/mainStyle";

const translate = memoize(
    (key, config) => i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key)
)

const { height, width } = Dimensions.get("screen");
const styles = mainStyle.styles;

class UserSurvey extends Component {

  
    constructor(props) {
        super(props);
        this.state = {
            q1 : false,
            q2 : false,
            q3 : false
        };

        console.log('----- User Survey -----');
        console.log(JSON.stringify(this.props));

        var lang = this.props.deviceInfo.language;
        this.setDeviceLanguage(lang);
    }

    setDeviceLanguage(lang){
        console.log("SET DEVICE Language = " + lang);
        translate.cache.clear();
        LanguageService.getInstance().changeLanguage(lang);
        
    }
    
    

    backHome(){
        var homePage = (this.props.userInfo.isGuest) ? 'HomeGuest' : 'Home';
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: homePage },
                ],
            })
        );
    }

    nextButton(){
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'Consent' },
                ],
            })
        );
    }
  

    render() {
        const { navigation } = this.props;
        return (
        <Block flex style={styles.container}>
            <Block flex>
            <ImageBackground
                // source={Images.lightBG}
                style={{ height, width, zIndex: 1 , backgroundColor: themeColor.COLORS.WHITE}}
            >  
                <View style={styles.viewSection}> 
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ width, marginTop: '0%' }}
                    >
                        <Block flex style={styles.homeContainer}>
                            <Image source={Images.logoFaculty} style={styles.logo} />
                            <Block flex space="around">
                                <Block  style={styles.contentContainer}>
                                    <Block  style={styles.row}>
                                        <Block style={{width: '100%', textAlign : 'left', marginBottom: 10}}>
                                            <Text  style={styles.pageHeader} >{translate('UserSurveyHeaderLabel')}</Text>
                                        </Block>
                                    </Block>
                                    
                                    <Block  style={styles.row}>
                                        <Block style={{width: '100%'}}>
                                            <Text  style={customStyles.mainQuestionText} >{translate('MainPageQuestion')}</Text>
                                        </Block>
                                    </Block>

                                    <Block style={customStyles.questionRow}>
                                        <Block style={customStyles.subQuestion}>
                                            <Text  style={customStyles.subQuestionText} >{translate('FirstQuestion')}</Text>
                                        </Block>
                                        <Block style={customStyles.checkboxBlock}>
                                            <CheckBox
                                            disabled={false}
                                            value={this.state.q1}
                                            onValueChange={(newValue) => this.setState({ q1: newValue})}
                                            style={customStyles.checkbox}
                                            />
                                        </Block>
                                        <Block style={customStyles.subQuestionLabel}>
                                            <Text  style={customStyles.subQuestionText} > {translate('YesLabel')}</Text>
                                        </Block>
                                    </Block>

                                    <Block style={customStyles.questionRow}>
                                        <Block style={customStyles.subQuestion}>
                                            <Text  style={customStyles.subQuestionText} >{translate('SecondQuestion')}</Text>
                                        </Block>
                                        <Block style={customStyles.checkboxBlock}>
                                            <CheckBox
                                            disabled={false}
                                            value={this.state.q2}
                                            onValueChange={(newValue) => this.setState({ q2: newValue})}
                                            style={customStyles.checkbox}
                                            />
                                        </Block>
                                        <Block style={customStyles.subQuestionLabel}>
                                            <Text  style={customStyles.subQuestionText} > {translate('YesLabel')}</Text>
                                        </Block>
                                    </Block>

                                    <Block style={customStyles.questionRow}>
                                        <Block style={customStyles.subQuestion}>
                                            <Text  style={customStyles.subQuestionText} >{translate('ThirdQuestion')}</Text>
                                        </Block>
                                        <Block style={customStyles.checkboxBlock}>
                                            <CheckBox
                                            disabled={false}
                                            value={this.state.q3}
                                            onValueChange={(newValue) => this.setState({ q3: newValue})}
                                            style={customStyles.checkbox}
                                            />
                                        </Block>
                                        <Block style={customStyles.subQuestionLabel}>
                                            <Text  style={customStyles.subQuestionText} > {translate('YesLabel')}</Text>
                                        </Block>
                                    </Block>
                                </Block>

                                {(this.state.q1 || this.state.q2 || this.state.q3) ? 
                                    (
                                        <Block style={styles.row}>
                                            <Block style={customStyles.alertBox}>
                                                <Text style={customStyles.alertTextHead}>
                                                    {translate('SurveyResult')}
                                                </Text>
                                                <Text style={customStyles.alertText}>
                                                    {translate('SurveySuggest')}
                                                </Text>
                                            </Block>
                                        </Block>
                                    )
                                    :(
                                        <Block middle>
                                        
                                        </Block>
                                    )
                                }

                                
            
                                
                            </Block>
                        </Block>
                    </ScrollView>
                </View>    
                <Block style={styles.buttonSection}>
                    {(this.state.q1 || this.state.q2 || this.state.q3) ? 
                        (
                            <Block style={styles.row}>
                            </Block>
                        )
                        :(
                            <Block style={styles.row}>
                                <Block style={{width: '100%', alignItems: 'center'}}>
                                    <Button style={styles.primaryButton}
                                        onPress={() => this.nextButton()}
                                    >
                                        <Text style={styles.primaryButtonText}>
                                            {translate('NextButton')}
                                        </Text>
                                    </Button>
                                </Block>
                            </Block>
                        )
                    }
                    <Block style={styles.row}>
                        <Block style={{width: '100%', alignItems: 'center'}}>
                            <Button style={styles.secondaryButton}
                            onPress={() => this.backHome()}
                            >
                                <Text style={styles.secondaryButtonText}>
                                    {translate('BackButton')}
                                </Text>
                            </Button>
                        </Block>
                    </Block>
                    
                </Block>                    
            </ImageBackground>
            </Block>
        </Block>
            
        );
    }
}

const customStyles = StyleSheet.create({
    alertBox : {
        backgroundColor: themeColor.COLORS.ALERT,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: themeColor.COLORS.ALERT_BORDER,
        padding: 10,
        marginBottom: 20,
        width: '100%',
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
    
    mainQuestionText : {
        fontSize: 18,
        fontFamily: 'Sarabun-Light',
        color: themeColor.COLORS.PRIMARY,
        marginBottom: 10
    },
    
    questionRow: {
        flex: 1, 
        flexDirection: 'row',
    },
    subQuestion:{
        paddingVertical: 5,
        paddingLeft: 10,
        width: '70%',
        height: 50,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: themeColor.COLORS.BORDER_COLOR,
    },
    checkboxBlock:{
        paddingVertical: 5,
        width: '15%',
        height: 50,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: themeColor.COLORS.BORDER_COLOR,
    },
    subQuestionLabel:{
        paddingVertical: 5,
        paddingLeft: 5,
        width: '15%',
        height: 50,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: themeColor.COLORS.BORDER_COLOR,
    },
    checkbox: {
        alignSelf: "center",
    },
    subQuestionText:{
        fontSize: 18,
        fontFamily: 'Sarabun-Medium',
        color: themeColor.COLORS.PRIMARY
    },
});

// export default UserSurvey;
const mapStateToProps = state => {
  return {
    userInfo: state.user,
    network: state.network,
    ...state.testToneList,
    ...state.deviceInfo
  };
};

const mapDispatchToProps = dispatch => {
  const {testToneActions} = require('../redux/TestToneRedux');
  

  return {
    loadTestToneList: testToneList => dispatch(testToneActions.loadTestToneList(testToneList))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserSurvey);