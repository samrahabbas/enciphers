import React from 'react';
import {Provider} from 'react-redux';
import {Text, View} from 'react-native';
import ContactCard from './src/components/ContactCard';
import Authentication from './src/navigation/Authentication';
import MainNavigator from './src/navigation/MainNavigator';
import CameraScreen from './src/screens/main/CameraScreen';
import Chat from './src/screens/main/Chat';
import Home from './src/screens/main/Home';
import SelectContacts from './src/screens/main/SelectContacts';
import VideoCall from './src/screens/main/VideoCall';
import FillProfile from './src/screens/onboarding/FillProfile';
import LetsYouIn from './src/screens/onboarding/LetsYouIn';
import OtpVerification from './src/screens/onboarding/OtpVerification';
import SigninPhone from './src/screens/onboarding/SigninPhone';
import Signup from './src/screens/onboarding/Signup';
import Splash from './src/screens/onboarding/Splash';
import WelcomeScreen from './src/screens/onboarding/WelcomeScreen';
import {store} from './src/redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <Authentication />
    </Provider>
  );
};

export default App;
