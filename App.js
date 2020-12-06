import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import { themeColor } from "./constants";

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <GalioProvider theme={themeColor}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      </NavigationContainer>
    );
  }
}
