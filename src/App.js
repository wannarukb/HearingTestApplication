import React, { Component } from 'react';
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";
import store from "./store/configureStore";
import Router from "./Router";
import { ReduxNetworkProvider } from 'react-native-offline';
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import { themeColor } from "./constants";

export default class App extends Component {

  render() {
      const per = persistStore(store);
  
      return (
        <Provider store={store}>
          <PersistGate persistor={per}>
            <ReduxNetworkProvider>
              <Router/>
            </ReduxNetworkProvider>
           </PersistGate>
        </Provider>
      );
    }
  }
  

/*export default class App extends Component {
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
*/