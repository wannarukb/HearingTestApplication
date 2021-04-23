import React from "react";
import {  Dimensions } from "react-native";

import { createStackNavigator } from '@react-navigation/stack';


// screens
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Login from "../screens/Login";
import UserSurvey from "../screens/UserSurvey";
import Appointment from "../screens/Appointment";
import HearingTestResult from "../screens/HearingTestResult";
import HeadsetSelect from "../screens/HeadsetSelect";
import HearingTestType from "../screens/HearingTestType"

// header for screens
const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();


// function UserSurveyStack(props) {
//   return (

//     <Stack.Navigator mode="card" headerMode="screen">
//       <Stack.Screen
//         name="UserSurvey"
//         component={UserSurvey}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               title="UserSurvey"
//               back
//               white
//               transparent
//               navigation={navigation}
//               scene={scene}
//             />
//           ),
//           headerTransparent: false
//         }}
//       />
//     </Stack.Navigator>
//   );
// }

function HeadsetSelectStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      
      
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
        name="UserSurvey"
        component={UserSurvey}
        option={{
          title : "แบบสอบถาม",
          headerTransparent: false
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerTransparent: false
        }}
      />
    </Stack.Navigator>
  );
}


function UserSurveyStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      
      <Stack.Screen
        name="UserSurvey"
        component={UserSurvey}
        option={{
          title : "แบบสอบถาม",
          headerTransparent: false
        }}
      />
      <Stack.Screen
        name="HeadsetSelect"
        component={HeadsetSelectStack}
        option={{
          title : "Headset",
          headerTransparent: false
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerTransparent: false
        }}
      />
    </Stack.Navigator>
  );
}



function LoginStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      
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
        component={UserSurveyStack}
        options={{
          title : "แบบสอบถาม",
          headerTransparent: false
        }}
      />

      <Stack.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerTransparent: false
        }}
      />
    </Stack.Navigator>
  );
}


export default function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Home"
        component={Home}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginStack} 
        option={{
          title : "ลงชื่อเข้าใช้งาน",
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
    </Stack.Navigator>
  );
}
function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        option={{
          headerTransparent: true
        }}
      />
      <Stack.Screen name="Home" component={HomeStack} />
    </Stack.Navigator>
  );
}


