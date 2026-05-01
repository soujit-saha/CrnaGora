import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../utils/constants';
import Discover from '../screens/main/Discover';
import Matches from '../screens/main/Matches';
import Messages from '../screens/main/Messages';
import Profile from '../screens/main/Profile';
import { ms } from '../utils/helper/metric';


const Tab = createBottomTabNavigator();

const width = Dimensions.get('window').width * 0.2;

const BottomTab = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Discover"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          height: ms(60) + insets.bottom,
          borderTopWidth: ms(1),
          borderTopColor: 'rgba(255,255,255,0.15)',
          backgroundColor: '#F3F3F3',
          overflow: 'hidden',
          paddingTop: ms(12),
          paddingBottom: insets.bottom,
          elevation: 0,
          shadowOpacity: 0,
        },

      }}
    >
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.con}>
              <Image
                source={focused ? ICONS.cardActive : ICONS.cardInactive}
                style={{
                  height: ms(24),
                  width: ms(24),
                  resizeMode: 'contain',
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Matches"
        component={Matches}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.con}>
              <Image
                source={focused ? ICONS.matchesActive : ICONS.matchesInactive}
                style={{
                  height: ms(24),
                  width: ms(24),
                  resizeMode: 'contain',
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.con}>
              <Image
                source={focused ? ICONS.messageActive : ICONS.messageInactive}
                style={{
                  height: ms(24),
                  width: ms(24),
                  resizeMode: 'contain',
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          // tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.con}>
              <Image
                source={focused ? ICONS.peopleActive : ICONS.peopleInactive}
                style={{
                  height: ms(24),
                  width: ms(24),
                  resizeMode: 'contain',
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabBarBackground: {
    flex: 1,
    overflow: 'hidden',
  },
  tabBarBlur: {
    flex: 1,
  },
  con: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
