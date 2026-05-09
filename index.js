// /**
//  * @format
//  */

// import { AppRegistry } from 'react-native';
// import App from './App';
// import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => App);


/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import Store from './src/redux/Store';
import { StripeProvider } from '@stripe/stripe-react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    if (type === EventType.PRESS) {
        console.log('User pressed notification in background or quit mode', notification);
    }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
    });

    // Only display notification if there is no notification payload
    // If there is a notification payload, Firebase handles it automatically
    if (!remoteMessage.notification) {
        await notifee.displayNotification({
            title: remoteMessage.data?.title || 'New Notification',
            body: remoteMessage.data?.body || '',
            android: {
                channelId,
                pressAction: {
                    id: 'default',
                },
            },
        });
    }
});

const CrnaGora = () => {
    return (
        <Provider store={Store}>
            <StripeProvider publishableKey="pk_test_51NdpkRBuHqQNZg72XOlkNZRZZO9aXVTnGAyzbNP8QXJkZwW5gVY9r3PxjNQ6e9Yz5htDWyIKuMRaAHmS5EZfk4Oz00sCUF6Kvr">
                <App />
            </StripeProvider>
        </Provider>
    );
};

AppRegistry.registerComponent(appName, () => CrnaGora);