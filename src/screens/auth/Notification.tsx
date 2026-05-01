import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, FONTS, ICONS, IMAGES } from '../../utils/constants'; // Update this if the graphic is in ICONS
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import CustomButton from '../../component/CustomButton';
import { navigate } from '../../utils/helper/RootNavigation';
import connectionrequest from '../../utils/helper/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { notificationSetUpRequest } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';
import Loader from '../../utils/helper/Loader';

const Notification = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { isReqLoading } = useSelector((state: any) => state.AuthReducer);

    const onNotifiedPress = () => {
        let data = {
            enable_notification: true
        }

        connectionrequest()
            .then(() => {
                dispatch(notificationSetUpRequest(data))
            })
            .catch(err => {
                ToastAlert('Please connect To Internet');
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Loader visible={isReqLoading} />
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Custom Header: Only Skip button on the right */}
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('Plan')}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
                {/* 
                  Drop your "Orange Chat Bubble" image right here! 
                  Assuming IMAGES.notification is properly mapped in constants.
                */}
                <Image
                    source={ICONS.chat}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Enable notification's</Text>

                <Text style={styles.subtitle}>
                    Get push-notification when you get the match{'\n'}or receive a message.
                </Text>
            </View>

            <View style={styles.footer}>
                <CustomButton
                    title="I want to be notified"
                    onPress={() => onNotifiedPress()}
                />
            </View>
        </SafeAreaView>
    );
};

export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        width: '100%',
        alignItems: 'flex-end',
        paddingHorizontal: ms(20),
        paddingTop: mvs(15),
    },
    skipText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.primary,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: ms(220),
        height: ms(220),
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: ms(40),
        paddingBottom: mvs(60),
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: normalize(20),
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: mvs(15),
    },
    subtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(10),
        color: COLORS.black,
        textAlign: 'center',
        includeFontPadding: false,
    },
    footer: {
        width: '100%',
        paddingHorizontal: ms(30),
        paddingBottom: mvs(20),
    },
});