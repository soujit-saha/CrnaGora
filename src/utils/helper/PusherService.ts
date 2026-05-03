const Pusher = require('pusher-js/react-native');
import { constants } from '../constants';

let pusherInstance: any = null;

/**
 * Get or create a singleton Pusher instance.
 * @param token - The user's auth token for private channel authentication.
 */
export function getPusherInstance(token?: string): any {
    if (pusherInstance) {
        // Update auth token if provided
        if (token) {
            pusherInstance.config.auth = {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
        }
        return pusherInstance;
    }

    const PusherClass = Pusher.default || Pusher.Pusher || Pusher;

    // Enable logging in dev
    if (PusherClass) {
        PusherClass.logToConsole = true; // Force logging
    }

    const baseDomain = constants.BASE_URL.replace('/api', '');

    pusherInstance = new PusherClass(constants.PUSHER_APP_KEY, {
        cluster: constants.PUSHER_APP_CLUSTER,
        forceTLS: true,
        // Use the API broadcasting auth endpoint
        authEndpoint: `${constants.BASE_URL}/broadcasting/auth`,
        auth: {
            headers: {
                Accept: 'application/json',
                Authorization: token ? `Bearer ${token}` : '',
                // The backend Saga uses 'accesstoken' header, so we include it here too
                accesstoken: token || '',
            },
        },
    });

    console.log(`[Pusher] Initialized`);
    console.log(`[Pusher] App Key: ${constants.PUSHER_APP_KEY}`);
    console.log(`[Pusher] Cluster: ${constants.PUSHER_APP_CLUSTER}`);
    console.log(`[Pusher] Auth Endpoint: ${constants.BASE_URL}/broadcasting/auth`);
    console.log(`[Pusher] Token present: ${!!token}`);

    // Connection state logging
    pusherInstance.connection.bind('state_change', (states: any) => {
        console.log(`[Pusher] 🔌 Connection State: ${states.current}`);
    });

    pusherInstance.connection.bind('connected', () => {
        console.log('[Pusher] ✅ Connected to Pusher server');
    });

    pusherInstance.connection.bind('error', (err: any) => {
        console.log('[Pusher] ❌ Connection error:', JSON.stringify(err));
    });

    return pusherInstance;
}

/**
 * Subscribe to a chat channel and listen for messages.
 */
export function subscribeToChatChannel(
    chatId: string | number,
    token: string,
    onMessage: (msg: any) => void,
): () => void {
    const pusher = getPusherInstance(token);

    // Also bind globally to the pusher instance for things like pusher:pong or any event
    const globalHandler = (eventName: string, data: any) => {
        if (eventName === 'pusher:pong' || eventName.includes('message')) {
            console.log(`[Pusher Global Activity] ${eventName}`);
            onMessage(data || { event: eventName });
        }
    };
    pusher.bind_global(globalHandler);

    const channelNames = [
        `private-chat.${chatId}`,
        `private-chats.${chatId}`,
        `chat.${chatId}`,
        `chats.${chatId}`,
    ];

    const channels: any[] = [];

    channelNames.forEach(name => {
        console.log(`[Pusher] Subscribing to ${name}`);
        const channel = pusher.subscribe(name);

        channel.bind('pusher:subscription_succeeded', () => {
            console.log(`[Pusher] ✅ Subscribed to ${name}`);
            onMessage({ type: 'subscription_succeeded' });
        });

        channel.bind('pusher:subscription_error', (error: any) => {
            console.log(`[Pusher] ❌ Subscription error on ${name}:`, JSON.stringify(error));
        });

        // Bind events
        const events = ['message.sent', '.MessageSent', 'App\\Events\\MessageSent', 'MessageSent'];
        events.forEach(event => {
            channel.bind(event, (data: any) => {
                console.log(`[Pusher] 🔔 Event "${event}" on "${name}":`, JSON.stringify(data)?.substring(0, 300));
                handleIncomingMessage(data, onMessage);
            });
        });

        channel.bind_global((eventName: string, data: any) => {
            console.log(`[Pusher] 🔔 Event "${eventName}" on "${name}":`, JSON.stringify(data)?.substring(0, 300));
            handleIncomingMessage(data, onMessage);
        });

        channels.push({ name, channel });
    });

    // Return unsubscribe function
    return () => {
        pusher.unbind_global(globalHandler);
        channels.forEach(({ name, channel }) => {
            console.log(`[Pusher] Unsubscribing from ${name}`);
            channel.unbind_all();
            pusher.unsubscribe(name);
        });
    };
}

/**
 * Handle incoming message data — normalize different payload shapes.
 */
function handleIncomingMessage(data: any, onMessage: (msg: any) => void) {
    if (data?.message) {
        onMessage(data.message);
    } else if (data?.data) {
        onMessage(data.data);
    } else {
        onMessage(data);
    }
}

/**
 * Disconnect Pusher entirely (e.g., on logout).
 */
export function disconnectPusher(): void {
    if (pusherInstance) {
        pusherInstance.disconnect();
        pusherInstance = null;
    }
}
