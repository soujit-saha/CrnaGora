import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    Image,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import BackButtonHeader from '../../component/BackButtonHeader';
import CustomButton from '../../component/CustomButton';
import { navigate } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../utils/helper/Toast';

const UpdateInterested = ({ route }: any) => {
    const [selectedGender, setSelectedGender] = useState<any>(null);
    const { isReqLoading, masterdropdownRes } = useSelector((state: any) => state.AuthReducer);
    const { getProfileRes } = useSelector((state: any) => state.MainReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        if (getProfileRes?.data?.dating_preferences && masterdropdownRes?.dating_preferences) {
            const userPref = getProfileRes.data.dating_preferences;
            const matchedPref = masterdropdownRes.dating_preferences.find((g: any) =>
                g.id === userPref || g.name === userPref || g.name?.toLowerCase() === userPref?.toString()?.toLowerCase()
            );
            if (matchedPref) {
                setSelectedGender(matchedPref);
            }
        }
    }, [getProfileRes, masterdropdownRes]);

    const renderOption = (item: any) => {
        const isSelected = selectedGender?.id === item?.id;
        return (
            <TouchableOpacity
                style={[
                    styles.optionBox,
                    isSelected ? styles.optionSelected : styles.optionUnselected
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedGender(item)}
            >
                <Text style={[
                    styles.optionText,
                    isSelected ? styles.textSelected : styles.textUnselected
                ]}>
                    {item?.name}
                </Text>

                <Image source={ICONS.checkSmall} style={{ ...styles.checkIcon, tintColor: isSelected ? COLORS.white : '#ADAFBB' }} />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <BackButtonHeader
            // rightComponent={
            //     <TouchableOpacity activeOpacity={0.7}>
            //         <Text style={styles.skipText}>Skip</Text>
            //     </TouchableOpacity>
            // 
            />

            <View style={styles.inner}>
                <View>
                    <Text style={styles.title}>Looking For?</Text>

                    <View style={styles.optionsContainer}>
                        <FlatList
                            keyExtractor={(item, index) => `${index}`}
                            showsVerticalScrollIndicator={false}
                            data={masterdropdownRes?.dating_preferences
                            }
                            renderItem={({ item }) => <>{renderOption(item)}</>} />

                    </View>
                </View>

                <View style={styles.footer}>
                    <CustomButton
                        title="Continue"
                        onPress={() => {
                            if (!selectedGender) {
                                ToastAlert("Please select who you are interested in...")

                            } else {

                                navigate('UpdatePassion', { interested: selectedGender?.id, ...route?.params })
                            }
                        }
                        }

                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default UpdateInterested;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    inner: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: ms(30),
        paddingTop: mvs(20),
        paddingBottom: mvs(20),
    },
    skipText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.primary,
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: normalize(28),
        color: COLORS.black,
        marginBottom: mvs(40),
    },
    optionsContainer: {
        width: '100%',
        height: "75%"
    },
    optionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: mvs(56),
        borderRadius: ms(15),
        paddingHorizontal: ms(20),
        marginBottom: mvs(15),
    },
    optionUnselected: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    optionSelected: {
        backgroundColor: '#ffb3e6',
        borderWidth: 0,
    },
    optionText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(16),
    },
    textUnselected: {
        color: COLORS.black,
    },
    textSelected: {
        color: COLORS.white,
        fontFamily: FONTS.bold,
    },
    checkIcon: {
        height: mvs(20),
        width: ms(20),
        resizeMode: 'contain',
    },
    checkUnselected: {
        color: COLORS.lightGray,
    },
    checkSelected: {
        color: COLORS.white,
    },
    chooseAnotherBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: mvs(58),
        borderRadius: ms(15),
        paddingHorizontal: ms(20),
        borderWidth: 2,
        borderColor: '#0084FF', // High visibility blue border from mock
        backgroundColor: COLORS.white,
        marginBottom: mvs(15),
    },
    chooseAnotherText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(16),
        color: COLORS.black,
    },
    chevronIcon: {
        fontFamily: FONTS.regular,
        fontSize: normalize(24),
        color: COLORS.lightGray,
        marginTop: -mvs(2),
    },
    footer: {
        width: '100%',
    },
});