import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import colors from '../constants/colors';
import Splash from '../screens/onboarding/Splash';
import LetsYouIn from '../screens/onboarding/LetsYouIn';
import SigninPhone from '../screens/onboarding/SigninPhone';
import Signup from '../screens/onboarding/Signup';
import OtpVerification from '../screens/onboarding/OtpVerification';
import FillProfile from '../screens/onboarding/FillProfile';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LetsYouIn"
        component={LetsYouIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignInPhone"
        component={SigninPhone}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FillProfile"
        component={FillProfile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
