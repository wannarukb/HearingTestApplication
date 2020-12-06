import React, { Component } from 'react';
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");
import themeColor from "../constants/Theme";
import Images from "../constants/Images";

class Onboarding extends Component{
  static navigationOptions = {
    title: 'Onboarding'
  };

  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar hidden />
        <Block flex center>
          <ImageBackground
              source={Images.lightBG}
              style={{ height, width, zIndex: 1 }}
            />
        </Block>
        <Block center>
          <Image source={Images.MULOGO} style={styles.logo} />
        </Block>
        <Block flex>
            <Block flex space="around" style={{ zIndex: 2 }}>
              <Block center>
                <Image source={Images.Onboarding} style={styles.onboarding} />
              </Block>
              <Block style={styles.title} style={{marginTop: 20}}>
                <Block middle>
                  <Text style={styles.heading} color={themeColor.COLORS.PRIMARY} size={18} bold>
                    Hearing test by yourself
                  </Text>
                </Block>
                <Block middle> 
                  <Text style={styles.heading} color={themeColor.COLORS.PRIMARY} size={14} >
                  ทดสอบประสิทธิภาพทางการได้ยินด้วยตัวคุณเองทุกที่ทุกเวลา
                  </Text>
                </Block>
              </Block>
              <Block center>
                <Button
                  style={styles.createButton}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={styles.createButtonText}>เริ่มต้นใช้งาน</Text>
                </Button>
              </Block>
          </Block>
        </Block>
      </Block>
    );
  };
  
};

const styles = StyleSheet.create({
  createButton:{
    marginVertical: 20,
    borderRadius: 20,
    backgroundColor: themeColor.COLORS.PRIMARY_BTN_SUCCESS
  },
  createButtonText:{
    fontSize: 16,
    fontFamily: 'Sarabun-Medium',
    color: themeColor.COLORS.WHITE
  },
  onboarding:{
    width: width,
    height: 600,
    marginTop: '-100%'
  },
  heading:{
    fontFamily: 'Sarabun-Medium'
  },
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  logo: {
    width: 250,
    height: 250,
    zIndex: 2,
    position: 'relative',
    marginTop: '-95%'
  },
  title: {
    marginTop:'-5%'
  },
  subTitle: {
    marginTop: 20
  }
});


export default Onboarding;
