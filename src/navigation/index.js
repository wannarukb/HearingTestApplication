import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux'

import Home from "../screens/Home";
import HomeGuest from "../screens/HomeGuest";
import Login from "../screens/Login";
import Register from "../screens/Register";
import UserSurvey from "../screens/UserSurvey";
import HearingTestResult from "../screens/HearingTestResult";

import TesterSurvey from "../screens/TesterSurvey";
import Consent from "../screens/Consent";


const Stack = createStackNavigator();

export default () => {
  console.log("LEK => " + JSON.stringify(useSelector(state => state)));
  const isGuest = useSelector(state => state.user.isGuest)
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  console.log('Navigation, Is Guest : '  + JSON.stringify(isGuest));
  return (
    <NavigationContainer>
        {/* <Stack.Navigator headerMode="none" initialRouteName={ isGuest === true ? 'Home' : 'HomeGuest'}> */}
        <Stack.Navigator headerMode="none" initialRouteName={ isAuthenticated === true && isGuest === false ? 'Home' : 'HomeGuest'}>   
            <Stack.Screen name="HomeGuest" component={HomeGuest} /> 
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen 
              name="Login" 
              component={Login} 
              option={{
                title : "ลงชื่อเข้าใช้งาน",
                headerTransparent: false
              }}
            />
            <Stack.Screen name="UserSurvey" component={UserSurvey}/>
            <Stack.Screen name="Consent" component={Consent}/>
            <Stack.Screen name="TesterSurvey" component={TesterSurvey}/>
            <Stack.Screen 
              name="HearingTestResult" 
              component={HearingTestResult} 
              option={{
                title : "ผลการตรวจ",
                headerTransparent: false
              }}
            />
             <Stack.Screen 
              name="Register" 
              component={Register} 
              option={{
                title : "สมัครใช้งาน",
                headerTransparent: false
              }}
            />
       </Stack.Navigator>
    </NavigationContainer>
  );
}
