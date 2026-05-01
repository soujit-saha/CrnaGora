import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, FONTS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { navigate } from '../../utils/helper/RootNavigation';
import LinearGradient from 'react-native-linear-gradient';
import connectionrequest from '../../utils/helper/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { plansRequest, saveTokenToLogin } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';
import Loader from '../../utils/helper/Loader';

const Plan = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { plansRes, isReqLoading } = useSelector((state: any) => state.AuthReducer);

    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(plansRequest('free'));
            })
            .catch(err => {
                ToastAlert('Please connect To Internet');
            });

    }, []);

    const features = [
        "Create profile & upload photos",
        "Like & pass unlimited profiles",
        "Basic search filters (age, location,\nlanguage)",
        "Send 3 ice-breaker messages per day",
        "View who matched back after both like\neach other",
        '1 daily "Super Like"',
        "Limited access to chat themes"
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Loader visible={isReqLoading} />
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <LinearGradient
                colors={['rgba(254, 163, 224, 0.2)', '#FAFAFA']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0.0 }}
                end={{ x: 0, y: 0.2 }}
            />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Prompts */}
                <Text style={styles.planBadge}>{plansRes?.[0]?.name}</Text>
                <Text style={styles.title}>{plansRes?.[0]?.description}</Text>
                <Text style={styles.subtitle}>
                    Find love across the Balkans — completely free{'\n'}to start.
                </Text>

                {/* Features Section */}
                <Text style={styles.featuresHeading}>Free features</Text>

                <View style={styles.featuresList}>
                    {/* Vertical decorative background highlight for bullets */}
                    {/* <View style={styles.bulletLine} /> */}

                    <LinearGradient
                        colors={['rgba(254, 163, 224, 1)', '#FAFAFA']}
                        style={styles.bulletLine}
                        start={{ x: 0, y: 0.0 }}
                        end={{ x: 0, y: 0.5 }}
                    />

                    {
                        plansRes?.[0]?.features?.map((feature: any, index: any) => (
                            <View key={index} style={styles.featureItem}>
                                <View style={styles.bulletDot} />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                </View>

                {/* FOMO Upsell Box */}
                <View style={styles.fomoBox}>
                    <Text style={styles.fomoTitle}>Don't want to have FOMO?</Text>
                    <Text style={styles.fomoText}>
                        Messages are limited, and matches{'\n'}take longer. Don't wait for love to{'\n'}notice you. With <Text style={styles.fomoTextHighlight}>Premium, love{'\n'}notices first.</Text>
                    </Text>
                </View>

            </ScrollView>

            {/* Split Action Footer */}
            <View style={styles.footerRow}>
                <TouchableOpacity
                    style={styles.continueButton}
                    activeOpacity={0.7}
                    onPress={() => dispatch(saveTokenToLogin({}))}
                >
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.upgradeButton} activeOpacity={0.8} onPress={() => navigate('UpgradePlan')}>
                    <Text style={styles.upgradeText}>Upgrade</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Plan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingHorizontal: ms(35),
        paddingTop: mvs(30),
        paddingBottom: mvs(40),
    },
    planBadge: {
        fontFamily: FONTS.bold,
        fontSize: normalize(20),
        color: COLORS.primary, // Vibrant pink
        marginBottom: mvs(5),
        includeFontPadding: false,
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: normalize(30),
        color: COLORS.black,
        marginBottom: mvs(15),
        includeFontPadding: false,
    },
    subtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        // color: COLORS.textTertiary
        marginBottom: mvs(25),
    },
    featuresHeading: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.black,
        marginBottom: mvs(15),
    },
    featuresList: {
        position: 'relative',
        marginBottom: mvs(30),
    },
    bulletLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: ms(12),
        borderRadius: ms(10),
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: mvs(8),
    },
    bulletDot: {
        width: ms(3),
        height: ms(3),
        borderRadius: ms(1.5),
        backgroundColor: COLORS.textTertiary, // Darker pink dot
        marginRight: ms(10),
        marginLeft: ms(4.5), // Centers perfectly over the ms(12) line
        marginTop: mvs(8), // Aligns with text visually
    },
    featureText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,
    },
    fomoBox: {
        width: '100%',
        backgroundColor: 'rgba(254, 163, 224, 0.13)',
        borderRadius: ms(15),
        padding: ms(20),
        marginTop: mvs(10),
    },
    fomoTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(13),
        color: COLORS.black,
        marginBottom: mvs(5),
    },
    fomoText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,
    },
    fomoTextHighlight: {
        color: '#ff4da6',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: ms(30),
        paddingBottom: mvs(30),
        paddingTop: mvs(10),
    },
    continueButton: {
        width: '47%',
        height: mvs(56),
        borderRadius: ms(15),
        borderWidth: 1,
        borderColor: '#fff0f5', // faint pink outline
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: '#ff4da6',
    },
    upgradeButton: {
        width: '47%',
        height: mvs(56),
        borderRadius: ms(15),
        backgroundColor: '#ffb3e6', // Solid light pink
        alignItems: 'center',
        justifyContent: 'center',
    },
    upgradeText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.white,
    },
});