import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import BackButtonHeader from '../../component/BackButtonHeader';
import CustomButton from '../../component/CustomButton';
import Loader from '../../utils/helper/Loader';
import { navigate } from '../../utils/helper/RootNavigation';
import connectionrequest from '../../utils/helper/NetInfo';
import { hobbiesRequest, profileSetUpRequest } from '../../redux/reducer/AuthReducer';
import ToastAlert from '../../utils/helper/Toast';
import { useDispatch, useSelector } from 'react-redux';

const PASSION_ITEMS = [
    { id: '1', label: 'Photography', icon: ICONS.photography },
    { id: '2', label: 'Shopping', icon: ICONS.shopping },
    { id: '3', label: 'Karaoke', icon: ICONS.karaoke },
    { id: '4', label: 'Yoga', icon: ICONS.yoga },
    { id: '5', label: 'Cooking', icon: ICONS.cooking },
    { id: '6', label: 'Tennis', icon: ICONS.tennis },
    { id: '7', label: 'Run', icon: ICONS.run },
    { id: '8', label: 'Swimming', icon: ICONS.swimming },
    { id: '9', label: 'Art', icon: ICONS.art },
    { id: '10', label: 'Traveling', icon: ICONS.traveling },
    { id: '11', label: 'Extreme', icon: ICONS.extreme },
    { id: '12', label: 'Music', icon: ICONS.music },
    { id: '13', label: 'Drink', icon: ICONS.drink },
    { id: '14', label: 'Video games', icon: ICONS.videoGames },
];

const Passions = ({ route }: any) => {
    // console.log("route", route?.params)
    const dispatch = useDispatch();
    const { hobbiesRes, isReqLoading } = useSelector(
        (state: any) => state.AuthReducer,
    );

    // Defaulting matching exactly to the mockup selections!
    const [selectedPassions, setSelectedPassions] = useState<string[]>([]);

    const togglePassion = (label: string) => {
        if (selectedPassions.includes(label)) {
            setSelectedPassions((prev) => prev.filter((p) => p !== label));
        } else {
            setSelectedPassions((prev) => [...prev, label]);
        }
    };

    const renderChip = (item: any) => {
        const isSelected = selectedPassions.includes(item.id);

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.chipContainer,
                    isSelected ? styles.chipSelected : styles.chipUnselected
                ]}
                activeOpacity={0.7}
                onPress={() => togglePassion(item.id)}
            >
                {/* <Text style={styles.chipIcon}>{item.icon}</Text> */}
                {/* <Image source={item.icon} style={{ ...styles.chipIcon, tintColor: isSelected ? COLORS.white : COLORS.primaryLight }} /> */}
                <Text style={[
                    styles.chipText,
                    isSelected ? styles.chipTextSelected : styles.chipTextUnselected
                ]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    const onSetupProfile = () => {
        if (selectedPassions.length == 0) {
            ToastAlert('Please select at least one passion');

        } else {


            let data = {
                name: route?.params?.name,
                profile_image: route?.params?.gallery,
                dob: route?.params?.dob,
                profession: route?.params?.profession,
                gender: route?.params?.gender == 'Man' ? 1 : route?.params?.gender == 'Woman' ? 2 : 3,
                dating_preferences: route?.params?.interested == 'Man' ? 1 : route?.params?.interested == 'Woman' ? 2 : 3,
                hobbies: selectedPassions
            }

            connectionrequest()
                .then(() => {
                    dispatch(profileSetUpRequest(data))
                })
                .catch(err => {
                    ToastAlert('Please connect To Internet');
                });
        }
    }




    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(hobbiesRequest({}))
            })
            .catch(err => {
                ToastAlert('Please connect To Internet');
            });

    }, [])


    // console.log("hobbiesRes", selectedPassions)

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <Loader visible={isReqLoading} />
            <BackButtonHeader
            // rightComponent={
            //     <TouchableOpacity activeOpacity={0.7}>
            //         <Text style={styles.skipText}>Skip</Text>
            //     </TouchableOpacity>
            // }
            />

            <View style={styles.inner}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={styles.title}>Your interests</Text>
                    <Text style={styles.subtitle}>
                        Select a few of your interests and let everyone know what you're passionate about.
                    </Text>

                    <View style={styles.gridContainer}>
                        {hobbiesRes?.map((item: any) => renderChip(item))}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <CustomButton
                        title="Continue"
                        onPress={() => onSetupProfile()}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Passions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    inner: {
        flex: 1,
        justifyContent: 'space-between',
    },
    scrollContent: {
        paddingHorizontal: ms(30),
        paddingTop: mvs(10),
        paddingBottom: mvs(40),
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
        marginVertical: mvs(10),
    },
    subtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,
        marginBottom: mvs(30),
        includeFontPadding: false,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    chipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%', // Just under half so they sit side by side natively with space-between
        height: mvs(50),
        borderRadius: ms(15),
        paddingHorizontal: ms(10),
        marginBottom: mvs(15),
    },
    chipUnselected: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    chipSelected: {
        backgroundColor: '#ffb3e6',
        borderWidth: 0,
        // Optional subtle shadow on the colored pills
        shadowColor: '#ffb3e6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
    },
    chipIcon: {
        width: ms(18),
        height: ms(18),
        resizeMode: 'contain',
        marginRight: ms(8),
    },
    chipText: {
        fontFamily: FONTS.medium,
        fontSize: normalize(13),
    },
    chipTextUnselected: {
        color: COLORS.black,
    },
    chipTextSelected: {
        color: COLORS.white,
        fontFamily: FONTS.bold,
    },
    footer: {
        width: '100%',
        paddingHorizontal: ms(30),
        paddingBottom: mvs(20),
    },
});