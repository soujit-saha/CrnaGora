import React, { useEffect, useState } from 'react';
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
import { navigate } from '../../utils/helper/RootNavigation'
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../utils/helper/NetInfo';
import ToastAlert from '../../utils/helper/Toast';
import { masterdropdownRequest } from '../../redux/reducer/AuthReducer';

const UpdateGender = ({ route }: any) => {
    const [selectedGender, setSelectedGender] = useState<any>(null);
    const { isReqLoading, masterdropdownRes } = useSelector((state: any) => state.AuthReducer);
    const dispatch = useDispatch();

    const { getProfileRes } = useSelector((state: any) => state.MainReducer);

    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(masterdropdownRequest({}));
            })
            .catch(err => {
                ToastAlert('Please connect To Internet');
            });

    }, []);

    useEffect(() => {
        if (getProfileRes?.data?.gender && masterdropdownRes?.genders) {
            const userGender = getProfileRes.data.gender;
            const matchedGender = masterdropdownRes.genders.find((g: any) =>
                g.id === userGender || g.name === userGender || g.name?.toLowerCase() === userGender?.toString()?.toLowerCase()
            );
            if (matchedGender) {
                setSelectedGender(matchedGender);
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

    // console.log('masterdropdownRes', selectedGender
    // );


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <BackButtonHeader
            // rightComponent={
            //     <TouchableOpacity activeOpacity={0.7}>
            //         <Text style={styles.skipText}>Skip</Text>
            //     </TouchableOpacity>
            // }
            />

            <View style={styles.inner}>
                <View>
                    <Text style={styles.title}>I am a</Text>

                    <View style={styles.optionsContainer}>
                        {/* {renderOption('Woman')}
                        {renderOption('Man')}
                        {renderOption('Other')} */}
                        <FlatList
                            keyExtractor={(item, index) => `${index}`}
                            showsVerticalScrollIndicator={false}
                            data={masterdropdownRes?.genders}
                            renderItem={({ item }) => <>{renderOption(item)}</>} />



                    </View>
                </View>

                <View style={styles.footer}>
                    <CustomButton
                        title="Continue"
                        onPress={() => {
                            if (!selectedGender) {
                                ToastAlert('Please select gender')

                            } else {

                                navigate('UpdateInterested', { gender: selectedGender?.id, ...route?.params })
                            }
                        }
                        }
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default UpdateGender;

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
        height: '75%'
    },
    optionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: mvs(58),
        borderRadius: ms(15),
        paddingHorizontal: ms(20),
        marginBottom: mvs(15),
    },
    optionUnselected: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#E8E6EA',
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
        height: mvs(56),
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