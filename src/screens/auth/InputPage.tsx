
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    TextInput,
    // Modal,
    FlatList,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, FONTS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import BackButtonHeader from '../../component/BackButtonHeader';
import CustomButton from '../../component/CustomButton';
import { navigate } from '../../utils/helper/RootNavigation'
import { countries } from '../../utils/constants';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../utils/helper/Toast';
import { sendOtpRequest } from '../../redux/reducer/AuthReducer';
import connectionrequest from '../../utils/helper/NetInfo';
import Loader from '../../utils/helper/Loader';

const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return '';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

const InputPage = ({ navigation, route }: any) => {

    const type = route?.params;
    const dispatch = useDispatch();
    const { isReqLoading } = useSelector((state: any) => state.AuthReducer);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.sortname === 'US') || countries[0]);

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendCode = () => {
        if (type == 2 && phoneNumber.length < 10) {
            ToastAlert('Please enter a valid phone number');

        }
        else if (type == 1 && !emailRegex.test(email)) {
            ToastAlert('Please enter a valid email');

        }
        else {

            let data = {
                "identifier": type == 2 ? phoneNumber : email,
                "country_code": type == 2 ? ("+" + String(selectedCountry.phoneCode)) : "",
                // "password": "password123"
            }

            connectionrequest()
                .then(() => {
                    dispatch(sendOtpRequest(data))
                })
                .catch(err => {
                    ToastAlert('Please connect To Internet');
                });


        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <Loader visible={isReqLoading} />
            {/* Header / Back Button */}
            <BackButtonHeader />

            {/* Content Body */}
            <View style={styles.content}>

                {/* Title */}
                <Text style={styles.title}>My {type == 2 ? "mobile" : "email"}</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Please enter your valid {type == 2 ? "phone number" : "email address"}. We will send you a 4-digit code to verify your account.
                </Text>

                {/* Phone Input Field */}
                {type == 2 && <View style={styles.phoneInputContainer}>
                    <TouchableOpacity
                        style={styles.countryCodeSelector}
                        activeOpacity={0.7}
                        onPress={() => setIsCountryModalVisible(true)}
                    >
                        <Text style={styles.flagEmoji}>{getFlagEmoji(selectedCountry.sortname)}</Text>
                        <Text style={styles.countryCodeText}>(+{selectedCountry.phoneCode})</Text>
                        <Text style={styles.chevronIcon}>⌄</Text>
                    </TouchableOpacity>

                    <View style={styles.verticalDivider} />

                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor={COLORS.gray}
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        returnKeyType="done"
                        maxLength={15}
                    />
                </View>}


                {/* Email Input Field */}
                {type == 1 && <View style={styles.phoneInputContainer}>


                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={COLORS.gray}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        returnKeyType="done"
                    />
                </View>}

                {/* Primary Button */}
                <CustomButton
                    title="Continue"
                    onPress={() => handleSendCode()}
                    containerStyle={{ marginTop: mvs(30) }}
                />
            </View>

            {/* Country Selection Modal */}
            <Modal
                isVisible={isCountryModalVisible}
                // visible={isCountryModalVisible}
                // animationType="slide"
                // transparent={true}
                // onRequestClose={() => setIsCountryModalVisible(false)}
                style={{ margin: 0 }} // Fills screen perfectly native
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={1}
                backdropColor="#FCFCFC"
                onBackButtonPress={() => setIsCountryModalVisible(false)}
                onBackdropPress={() => setIsCountryModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country</Text>
                            <TouchableOpacity onPress={() => setIsCountryModalVisible(false)}>
                                <Text style={styles.closeText}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search country..."
                            placeholderTextColor={COLORS.gray}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        <FlatList
                            data={filteredCountries}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.countryRow}
                                    onPress={() => {
                                        setSelectedCountry(item);
                                        setIsCountryModalVisible(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <Text style={styles.rowFlag}>{getFlagEmoji(item.sortname)}</Text>
                                    <Text style={styles.countryRowName}>{item.name}</Text>
                                    <Text style={styles.countryRowCode}>(+{item.phoneCode})</Text>
                                </TouchableOpacity>
                            )}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.listContent}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

export default InputPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: ms(30),
        paddingTop: mvs(30),
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: normalize(24),
        color: '#000000',
        marginBottom: mvs(10),
    },
    subtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,
        marginBottom: mvs(40),
        includeFontPadding: false,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: mvs(60),
        borderRadius: ms(15),
        borderWidth: 1,
        borderColor: '#E8E6EA',
        backgroundColor: COLORS.white,
    },
    countryCodeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(15),
        height: '100%',
    },
    flagEmoji: {
        fontSize: normalize(16),
        marginRight: ms(5),
    },
    countryCodeText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.black,
        marginRight: ms(5),
        includeFontPadding: false,
    },
    chevronIcon: {
        fontFamily: FONTS.regular,
        fontSize: normalize(16),
        color: COLORS.textTertiary,
        marginTop: -mvs(10),
    },
    verticalDivider: {
        width: 1,
        height: '45%',
        backgroundColor: COLORS.lightGray,
        marginHorizontal: ms(5),
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: ms(10),
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.black,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: ms(20),
        borderTopRightRadius: ms(20),
        height: '80%',
        paddingTop: mvs(20),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        marginBottom: mvs(15),
    },
    modalTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(18),
        color: COLORS.black,
    },
    closeText: {
        fontFamily: FONTS.semiBold,
        fontSize: normalize(14),
        color: COLORS.primary,
        padding: ms(5),
    },
    searchInput: {
        marginHorizontal: ms(20),
        height: mvs(45),
        borderRadius: ms(10),
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: ms(15),
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.black,
        marginBottom: mvs(10),
    },
    listContent: {
        paddingBottom: mvs(30),
    },
    countryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: mvs(15),
        paddingHorizontal: ms(20),
    },
    rowFlag: {
        fontSize: normalize(20),
        marginRight: ms(15),
    },
    countryRowName: {
        flex: 1,
        fontFamily: FONTS.regular,
        fontSize: normalize(16),
        color: COLORS.black,
    },
    countryRowCode: {
        fontFamily: FONTS.semiBold,
        fontSize: normalize(14),
        color: COLORS.gray,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.lightGray,
        marginHorizontal: ms(20),
    },
});