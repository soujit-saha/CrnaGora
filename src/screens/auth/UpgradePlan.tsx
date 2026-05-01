import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, FONTS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import CustomButton from '../../component/CustomButton';
import { goBack, navigate } from '../../utils/helper/RootNavigation'; // or navigate somewhere else
import LinearGradient from 'react-native-linear-gradient';
import { plansRequest, saveTokenToLogin } from '../../redux/reducer/AuthReducer';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../utils/helper/NetInfo';
import ToastAlert from '../../utils/helper/Toast';
import { confirmPaymentRequest } from '../../redux/reducer/MainReducer';
import Loader from '../../utils/helper/Loader';

const PLANS = [
    {
        id: '1',
        title: 'Crna Plus',
        titleColor: '#ff4da6', // Vibrant pink
        desc: 'No more guessing. Just matching',
        price: '$12.29',
        bgColor: '#fff0f5', // Very light pink background
        borderColor: '#ff4da6', // Pink active border
        features: [
            "Unlimited chat messages",
            "See who liked you",
            "5 Super Likes daily",
            "1 Boost every week",
            "Advanced filters (religion, city, relationship goals)",
            "Rewind — undo accidental swipe"
        ],
        featureTitle: 'Plus Features',
    },
    {
        id: '2',
        title: 'Crna Gold',
        titleColor: '#FF9500', // Gold/Orange 
        desc: 'When love becomes effortless.',
        price: '$24.29',
        bgColor: '#FFF9F2', // Very light orange background
        borderColor: '#FF9500', // Orange active border
        features: [
            "Everything in Plus",
            "Priority likes over standard users",
            "See read receipts on messages",
            "Global passport to swipe anywhere",
            "Incognito mode for privacy"
        ],
        featureTitle: 'Gold Features',
    }
];

const UpgradePlan = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { plansRes, getTokenResponse, verifyOTPRes, isReqLoading } = useSelector((state: any) => state.AuthReducer);
    const { isMainLoading } = useSelector((state: any) => state.MainReducer);
    // Start with "Crna Plus" selected
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [loading, setLoading] = useState(false);

    const selectedPlan = plansRes?.find((p: any) => p.id === selectedPlanId) || plansRes?.[0];

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const openStripeSDK = async () => {
        setLoading(true)
        try {
            // WARNING: Creating a PaymentIntent directly from the app is ONLY for testing.
            // In production, your SECRET KEY should NEVER be in the app. This must be moved to your backend.
            const secretKey = "sk_test_51NdpkRBuHqQNZg72VM5ngF17FUi5lff7whLJdPy4IlFn6ZoymSeIvnOWVqB5NfaTHat6yHTCpJIPMCYHcp0HmxUm00I84mXZRh";

            // Convert price to cents (Stripe requires smallest currency unit)
            const price = parseFloat(selectedPlan?.monthly_price || selectedPlan?.price?.replace('$', '') || '10.00');
            const amountInCents = Math.round(price * 100);

            // https://api.stripe.com/v1/payment_intents
            // Fetch PaymentIntent from Stripe API directly
            const response = await fetch('https://tinder.swastechinfo.in/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${verifyOTPRes?.token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                // body: `amount=${amountInCents}&currency=usd`
                body: JSON.stringify({
                    plan_uuid: selectedPlan.uuid
                })
            });


            const data = await response.json();
            console.log("data", data)

            if (data.error || data.status === false || data.status === 400 || data.status === 500) {
                ToastAlert(data.message || data.error?.message || 'PaymentIntent Error')
                return;
            }



            const clientSecret = data?.data?.client_secret;

            if (!clientSecret) {
                Alert.alert('Error', 'Unable to retrieve client secret from server. ' + JSON.stringify(data));
                return;
            }

            const { error: initError } = await initPaymentSheet({
                merchantDisplayName: 'CrnaGora',
                paymentIntentClientSecret: clientSecret,
                allowsDelayedPaymentMethods: true,
                defaultBillingDetails: {
                    name: 'CrnaGora',
                }
            });
            console.log('check 123')
            if (initError) {
                Alert.alert('Error initializing payment', initError.message);
                return;
            }

            const { error: presentError, paymentOption, } = await presentPaymentSheet();
            console.log("paymentOption", paymentOption)
            if (presentError) {
                if (presentError.code === 'Canceled') {
                    console.log('Payment sheet was canceled by the user');
                } else {
                    Alert.alert('Payment Error', presentError.message);
                }
            } else {
                dispatch(confirmPaymentRequest({
                    "payment_intent_id": data?.data?.intent_id,
                    "payment_status": "succeeded",
                    // "card_last4": "string",
                    // "card_brand": "string",
                    // "error_message": "string"
                }))
                setLoading(false)
                // Alert.alert('Success', 'Your payment is confirmed!');
                // Handle successful payment, maybe navigate or update user state
            }
        } catch (error) {
            console.log('Error', error)
            // console.error(error);
            // Alert.alert('Error', 'Something went wrong while opening Stripe SDK');
        }
    };

    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(plansRequest('paid'));
            })
            .catch(err => {
                ToastAlert('Please connect To Internet');
            });

    }, []);

    useEffect(() => {
        if (plansRes) {
            setSelectedPlanId(plansRes?.[0].id);
        }
    }, [plansRes]);



    return (
        <SafeAreaView style={styles.container}>
            <Loader visible={isReqLoading || isMainLoading || loading} />
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <LinearGradient
                colors={['rgba(254, 163, 224, 0.2)', '#FAFAFA']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0.0 }}
                end={{ x: 0, y: 0.2 }}
            />
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={0.7} style={styles.skipButton} onPress={() => { dispatch(saveTokenToLogin({})) }}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Headers */}
                <Text style={styles.title}>Upgrade your{'\n'}experience</Text>
                <Text style={styles.subtitle}>
                    Be seen by the love that's searching for you
                </Text>

                {/* Plan Selector */}
                <Text style={styles.sectionTitle}>Select Plan</Text>

                <View style={styles.plansRow}>
                    {plansRes?.map((plan: any, index: any) => {
                        const isSelected = selectedPlanId === plan.id;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.planCard,
                                    { backgroundColor: index == 0 ? '#fff0f5' : '#FFF9F2' },
                                    isSelected ? { borderWidth: 1, borderColor: index == 0 ? '#FF4DA6' : '#FF9500' }
                                        : { borderWidth: 1, borderColor: 'transparent' }
                                ]}
                                activeOpacity={0.8}
                                onPress={() => setSelectedPlanId(plan.id)}
                            >
                                <Text style={[styles.planCardTitle, { color: plan.titleColor }]}>
                                    {plan?.name}
                                </Text>
                                <Text style={styles.planCardDesc}>{plan?.description}</Text>
                                <Text style={styles.planCardPrice}>${plan?.monthly_price}<Text style={styles.planCardPriceSuffix}>/m</Text></Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Features List Section */}
                <Text style={styles.sectionTitle}>Plan features</Text>

                <View style={styles.featuresList}>
                    {/* The highlight bar should match the selected plan's tint color! */}
                    {/* <View style={[styles.bulletLine, { backgroundColor: selectedPlan.bgColor }]} /> */}
                    <LinearGradient
                        colors={['rgba(254, 163, 224, 1)', '#FAFAFA']}
                        style={styles.bulletLine}
                        start={{ x: 0, y: 0.0 }}
                        end={{ x: 0, y: 0.5 }}
                    />

                    {selectedPlan?.features.map((feature: any, index: any) => (
                        <View key={index} style={styles.featureItem}>
                            <View style={[styles.bulletDot, { backgroundColor: COLORS.textTertiary }]} />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Disclaimer & Action Footer */}
            <View style={styles.footerContainer}>
                <View style={styles.separator} />
                <Text style={styles.disclaimerText}>
                    By tapping Continue, you confirm your purchase and authorize recurring charges for the selected plan. Auto-renewal may be turned off in your account settings. No refunds for partial billing periods.
                </Text>

                <CustomButton
                    title={`Continue for $${selectedPlan?.monthly_price || selectedPlan?.price}`}
                    onPress={() => {
                        if (!selectedPlanId) {
                            ToastAlert('Please select a plan')
                        } else {
                            openStripeSDK()
                        }
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default UpgradePlan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        width: '100%',
        alignItems: 'flex-end',
        paddingHorizontal: ms(20),
        paddingTop: mvs(10),
    },
    skipButton: {
        paddingVertical: ms(5),
    },
    skipText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.primary
    },
    scrollContent: {
        paddingHorizontal: ms(35),
        paddingTop: mvs(15),
        paddingBottom: mvs(20),
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: normalize(32),
        color: COLORS.black,
        marginBottom: mvs(10),
    },
    subtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,
        marginBottom: mvs(30),
    },
    sectionTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.black,
        marginBottom: mvs(15),
    },
    plansRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: mvs(30),
    },
    planCard: {
        width: '48%',
        borderRadius: ms(15),
        paddingHorizontal: ms(15),
        paddingVertical: mvs(15),
    },
    planCardTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        marginBottom: mvs(4),
    },
    planCardDesc: {
        fontFamily: FONTS.regular,
        fontSize: normalize(9),
        color: COLORS.textTertiary,
        marginBottom: mvs(5),
        includeFontPadding: false,
    },
    planCardPrice: {
        fontFamily: FONTS.bold,
        fontSize: normalize(20),
        color: COLORS.black,
    },
    planCardPriceSuffix: {
        fontSize: normalize(14),
    },
    featuresList: {
        position: 'relative',
        marginBottom: mvs(20),
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
        marginBottom: mvs(10),
    },
    bulletDot: {
        width: ms(3),
        height: ms(3),
        borderRadius: ms(1.5),
        marginRight: ms(10),
        marginLeft: ms(4.5), // Centers perfectly over the ms(12) line
        marginTop: mvs(8), // Aligns with text visually
    },
    featureText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,
        paddingRight: ms(15),
    },
    footerContainer: {
        width: '100%',
        paddingHorizontal: ms(35),
        paddingBottom: mvs(30),
    },
    separator: {
        width: '100%',
        height: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.lightGray,
        marginBottom: mvs(15),
    },
    disclaimerText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(9),
        color: COLORS.textTertiary,
        textAlign: 'center',
        marginBottom: mvs(20),
        includeFontPadding: false,
    },
});