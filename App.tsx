import { LogBox, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import StackNav from './src/navigators/StackNav';
import Passions from './src/screens/auth/Passions';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { useDispatch } from 'react-redux';
import { storeFcmToken } from './src/redux/reducer/MainReducer';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await messaging().getToken();
        if (token) {
          dispatch(storeFcmToken(token));
        }
      } catch (error) {
        console.log('Error fetching FCM token:', error);
      }
    };

    const checkInitialNotification = async () => {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification) {
        console.log('App opened from QUIT state by notification', initialNotification.notification);
        // You can add navigation or state updates here based on initialNotification.notification.data
      }
    };

    fetchToken();
    checkInitialNotification();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      await notifee.requestPermission();
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || '',
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    });

    const unsubscribeForegroundEvent = notifee.onForegroundEvent(({ type, detail }) => {
      // You can import EventType from '@notifee/react-native' if needed, or use the integer value (1 for PRESS)
      // Here 1 represents EventType.PRESS
      if (type === 1) {
        console.log('User pressed notification in foreground', detail.notification);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeForegroundEvent();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StackNav />
      {/* <Passions /> */}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
