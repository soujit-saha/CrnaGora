import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    StatusBar,
    Platform,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import BackButtonHeader from '../../component/BackButtonHeader';
import CustomButton from '../../component/CustomButton';
import { navigate } from '../../utils/helper/RootNavigation';
import connectionrequest from '../../utils/helper/NetInfo';
import { settingRequest, socialAuthRequest } from '../../redux/reducer/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../utils/helper/Toast';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

const Signup = ({ route }: any) => {
    const type = route.params;

    const dispatch = useDispatch()
    const { isReqLoading, settingRes } = useSelector((state: any) => state.AuthReducer);
    const { fcmToken } = useSelector((state: any) => state.MainReducer);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');

    useEffect(() => {
        // Configure Google Signin
        GoogleSignin.configure({
            webClientId: '660803418047-bv0rd72nj6t3mc5p12cmfj5clu3fqc80.apps.googleusercontent.com', // TODO: Add Google Web Client ID
        });

        connectionrequest()
            .then(() => {
                dispatch(settingRequest({}))
            })
            .catch(err => {
                ToastAlert('Please connect To Internet');
            });
    }, [])

    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            // const tokens = await GoogleSignin.getTokens();

            console.log("userInfo", userInfo);
            // console.log("tokens", tokens);
            // Using tokens.idToken, fallback to userInfo.data?.idToken if required based on version
            // const token = tokens.idToken || (userInfo as any)?.data?.idToken;
            if (userInfo) {
                dispatch(socialAuthRequest({
                    email: userInfo?.data?.user?.email,
                    name: userInfo?.data?.user?.name,
                    provider: 'google',
                    fcm_token: fcmToken
                }));
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                ToastAlert('Play services not available or outdated');
            } else {
                ToastAlert('Google Sign-In Failed');
            }
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
            if (result.isCancelled) {
                // user cancelled the login flow
            } else {
                const data = await AccessToken.getCurrentAccessToken();
                if (data) {
                    dispatch(socialAuthRequest({ provider: 'facebook', token: data.accessToken.toString() }));
                }
            }
        } catch (error) {
            ToastAlert('Facebook Login Failed');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Header / Back Button */}
            <BackButtonHeader />

            {/* Content Body */}
            <View style={styles.content}>
                {/* Logo */}
                <Image
                    source={ICONS.logo}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Title */}
                <Text style={styles.title}>Sign {type == 1 ? 'up' : 'in'} to continue</Text>

                {/* Primary Email Button */}
                <CustomButton
                    title="Continue with email"
                    onPress={() => { navigate('InputPage', 1) }}
                    containerStyle={{ marginBottom: mvs(20) }}
                />

                {/* Secondary Phone Button */}
                <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7} onPress={() => navigate('InputPage', 2)}>
                    <Text style={styles.secondaryButtonText}>Use phone number</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or sign {type == 1 ? "up" : "in"} with</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Login Buttons */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} onPress={handleFacebookLogin}>
                        <Image
                            source={ICONS.facebook}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.7} onPress={handleGoogleLogin}>
                        <Image
                            source={ICONS.google}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    {Platform.OS == 'ios' && <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                        <Image
                            source={ICONS.apple}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>}
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    setModalTitle('Terms of Use');
                    setModalContent(settingRes?.term_and_condition || 'Loading...');
                    setIsModalVisible(true);
                }}>
                    <Text style={styles.footerLink}>Terms of use</Text>
                </TouchableOpacity>
                <Text style={styles.footerSpacing}>     </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => {
                    setModalTitle('Privacy Policy');
                    setModalContent(settingRes?.privacy_policy || 'Loading...');
                    setIsModalVisible(true);
                }}>
                    <Text style={styles.footerLink}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
                onBackButtonPress={() => setIsModalVisible(false)}
                style={styles.modal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{modalTitle}</Text>
                        <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.policyText}>{modalContent}</Text>
                    </ScrollView>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: ms(40),
        // paddingTop: mvs(40),
    },
    logo: {
        width: ms(180),
        height: ms(130),
        marginBottom: mvs(30),
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: '#000000', // Black title text to match "Sign up to continue"
        marginVertical: mvs(30),
    },
    secondaryButton: {
        width: '100%',
        height: mvs(56),
        borderRadius: ms(15),
        borderWidth: 1,
        borderColor: '#E8E6EA', // Assuming very faint border
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: mvs(40),
    },
    secondaryButtonText: {
        fontFamily: FONTS.semiBold,
        fontSize: normalize(14),
        color: COLORS.primary,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: mvs(20),
        marginTop: mvs(10),
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.lightGray,
    },
    dividerText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: '#000000', // Matches the design "or sign up with"
        paddingHorizontal: ms(15),
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // width: '70%',
        marginBottom: mvs(40),
        gap: ms(10),
    },
    socialButton: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(15),
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialIcon: {
        width: ms(24),
        height: ms(24),
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: mvs(30),
    },
    footerLink: {
        fontFamily: FONTS.bold,
        fontSize: normalize(12),
        color: COLORS.primary,
    },
    footerSpacing: {
        width: ms(30),
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: ms(25),
        borderTopRightRadius: ms(25),
        height: '80%',
        paddingBottom: mvs(20),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: ms(20),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(18),
        color: COLORS.black,
    },
    closeText: {
        fontSize: normalize(20),
        color: COLORS.primary,
        fontFamily: FONTS.bold,
    },
    modalContent: {
        padding: ms(20),
    },
    policyText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.textSecondary,
        lineHeight: mvs(22),
    },
});
