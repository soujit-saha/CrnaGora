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