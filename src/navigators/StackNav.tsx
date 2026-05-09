import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Platform, Easing } from 'react-native';
import { navigationRef } from '../utils/helper/RootNavigation';
import BottomTab from './BottomTab';
import { useSelector } from 'react-redux';
import SplashScreen from '../screens/auth/SplashScreen';
import Onboarding from '../screens/auth/Onboarding';
import Signup from '../screens/auth/Signup';
import Login from '../screens/auth/Login';
import Otp from '../screens/auth/Otp';
import InputPage from '../screens/auth/InputPage';
import ProfileDetails from '../screens/auth/ProfileDetails';
import Gender from '../screens/auth/Gender';
import Passions from '../screens/auth/Passions';
import Interested from '../screens/auth/Interested';
import Sucessful from '../screens/auth/Sucessful';
import Notification from '../screens/auth/Notification';
import Plan from '../screens/auth/Plan';
import UpgradePlan from '../screens/auth/UpgradePlan';
import UserProfile from '../screens/main/UserProfile';
import Gallery from '../screens/main/Gallery';
import TermsofUse from '../screens/main/TermsofUse';
import PrivacyPolicy from '../screens/main/PrivacyPolicy';
import MyPreferences from '../screens/main/MyPreferences';
import MyProfile from '../screens/main/MyProfile';
import Chat from '../screens/main/Chat';
import Stories from '../screens/main/Stories';
import ChatPreview from '../screens/main/ChatPreview';
import Subscription from '../screens/main/Subscription';
import UpdateProfile from '../screens/main/UpdateProfile';
import UpdateInterested from '../screens/main/UpdateInterested';
import UpdateGender from '../screens/main/UpdateGender';
import UpdatePassion from '../screens/main/UpdatePassion';

type RootStackParamList = {
  SplashScreen: undefined;
  Onboarding: undefined;
  Signup: undefined;
  Login: undefined;
  Otp: undefined;
  InputPage: undefined;
  ProfileDetails: undefined;
  Gender: undefined;
  Passions: undefined;
  Interested: undefined;
  Sucessful: undefined;
  Notification: undefined;
  Plan: undefined;
  UpgradePlan: undefined;
  BottomTab: undefined;
  UserProfile: undefined;
  Gallery: undefined;
  TermsofUse: undefined;
  PrivacyPolicy: undefined;
  MyPreferences: undefined;
  MyProfile: undefined;
  Chat: { chatId?: number; userId?: number; userName?: string; userImage?: string };
  Stories: undefined;
  ChatPreview: { matchUser?: any };
  Subscription: undefined;
  UpdateProfile: undefined;
  UpdateInterested: undefined;
  UpdateGender: undefined;
  UpdatePassion: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Enhanced smooth transition configuration
const smoothTransition = {
  // gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 350,
        easing: Easing.out(Easing.poly(4)),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.in(Easing.poly(4)),
      },
    },
  },
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export default function StackNav() {

  const { getTokenResponse, isLoading } = useSelector(
    (state: any) => state.AuthReducer,
  );

  // console.log("getTokenResponse", getTokenResponse);
  const Screens: Partial<{
    [key in keyof RootStackParamList]: React.ComponentType<any>;
  }> = getTokenResponse == null ? {
    // SplashScreen,
    Onboarding,
    Signup,
    Login,
    Otp,
    InputPage,
    ProfileDetails,
    Gender,
    Passions,
    Interested,
    Sucessful,
    Notification,
    Plan,
    UpgradePlan,
  } :
      {
        BottomTab,
        UserProfile,
        Gallery,
        TermsofUse,
        PrivacyPolicy,
        MyPreferences,
        MyProfile,
        Chat,
        Stories,
        ChatPreview,
        Subscription, UpdateProfile,
        UpdateInterested,
        UpdateGender, UpdatePassion
      };

  if (isLoading) {
    return <SplashScreen />;
  } else {
    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...smoothTransition,
          }}
        >
          {Object.entries({
            ...Screens,
          }).map(([name, component], index) => {
            return (
              <Stack.Screen
                key={index}
                name={name as keyof RootStackParamList}
                component={component}
                options={{
                  ...smoothTransition,
                  // gestureEnabled: true,
                  gestureResponseDistance: 50, // Increase swipe sensitivity
                }}
              />
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
