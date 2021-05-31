import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux'

// import LoginScreen from './LoginScreen';
// import HomeScreen from './HomeScreen';
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Login from "../screens/Login";
import Register from "../screens/Register";
import UserSurvey from "../screens/UserSurvey";
import Appointment from "../screens/Appointment";
import HearingTestResult from "../screens/HearingTestResult";
import HeadsetSelect from "../screens/HeadsetSelect";
import HearingTestType from "../screens/HearingTestType"


const Stack = createStackNavigator();

export default () => {
  // const isAuthenticated = useSelector(state => state.userInfo.isAuthenticated);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
  console.log('Navigation : '  + JSON.stringify(isAuthenticated));
  return (
    <NavigationContainer>
        <Stack.Navigator headerMode="none" initialRouteName={ isAuthenticated === true ? 'Home' : 'Onboarding'}>
           
            <Stack.Screen name="Onboarding" component={Onboarding} /> 
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen 
              name="Login" 
              component={Login} 
              option={{
                title : "ลงชื่อเข้าใช้งาน",
                headerTransparent: false
              }}
            />
           
            <Stack.Screen
              name="UserSurvey"
              component={UserSurvey}
              options={{
                title : "แบบสอบถาม",
                headerTransparent: false
              }}
            />
            <Stack.Screen 
              name="HearingTestResult" 
              component={HearingTestResult} 
              option={{
                title : "ผลการตรวจ",
                headerTransparent: false
              }}
            />
            <Stack.Screen 
              name="Appointment" 
              component={Appointment} 
              option={{
                title : "ตารางนัดหมาย",
                headerTransparent: false
              }}
            />
            <Stack.Screen
              name="HeadsetSelect"
              component={HeadsetSelect}
              option={{
                title : "Headset",
                headerTransparent: false
              }}
            />
            <Stack.Screen
              name="HearingTestType"
              component={HearingTestType}
              option={{
                title : "Headset",
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
