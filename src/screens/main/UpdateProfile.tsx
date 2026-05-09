import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    StatusBar,
    TextInput,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import BackButtonHeader from '../../component/BackButtonHeader';
import CustomButton from '../../component/CustomButton';
import { navigate } from '../../utils/helper/RootNavigation';
import ImagePickerModal from '../../component/ImagePickerModal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ToastAlert from '../../utils/helper/Toast';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import LocationPickerModal from '../../component/LocationPickerModal';

import { useSelector } from 'react-redux';

const UpdateProfile = ({ navigation, route }: any) => {
    const { getProfileRes } = useSelector((state: any) => state.MainReducer);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profession, setProfession] = useState('');
    const [location, setLocation] = useState('');
    const [isImagePickerVis, setIsImagePickerVis] = useState(false);
    const [profileImage, setProfileImage] = useState<any | null>(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birthdayText, setBirthdayText] = useState('Choose birthday date');
    const [selectedLocationLatLng, setSelectedLocationLatLng] = useState<{ lat: number, lng: number } | null>(null);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

    useEffect(() => {
        if (getProfileRes?.data) {
            const profileData = getProfileRes.data;
            if (profileData.name) {
                const nameParts = profileData.name.split(' ');
                setFirstName(nameParts[0] || '');
                setLastName(nameParts.slice(1).join(' ') || '');
            }
            if (profileData.profession) {
                setProfession(profileData.profession);
            }
            if (profileData.location) {
                setLocation(profileData.location);
            }
            if (profileData.profile_image) {
                setProfileImage({ uri: profileData.profile_image });
            }
            if (profileData.dob) {
                const dobDate = new Date(profileData.dob);
                setDate(dobDate);
                setBirthdayText(moment(dobDate).format('DD/MM/YYYY'));
            }
        }
    }, [getProfileRes]);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            setBirthdayText(moment(selectedDate).format('DD/MM/YYYY'));
        }
    };

    const handleConfirm = () => {
        if (!profileImage) {
            ToastAlert('Please select a profile image');
            return;
        }
        if (!firstName.trim()) {
            ToastAlert('Please enter your first name');
            return;
        }
        if (!lastName.trim()) {
            ToastAlert('Please enter your last name');
            return;
        }
        if (birthdayText === 'Choose birthday date') {
            ToastAlert('Please choose your birthday date');
            return;
        }
        if (!profession.trim()) {
            ToastAlert('Please enter your profession');
            return;
        }
        if (!location.trim()) {
            ToastAlert('Please enter your location');
            return;
        }

        let data = {
            name: `${firstName.trim()} ${lastName.trim()}`,
            dob: moment(date).format('YYYY-MM-DD'),
            profession: profession.trim(),
            location: location.trim(),
            profile_image: profileImage,
            ...(route?.params || {})
        };

        navigate('UpdateGender', data);
    };


    const handleCameraPress = async () => {
        setIsImagePickerVis(false);
        setTimeout(async () => {
            const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
            // if (result.assets && result.assets.length > 0) {
            //     setProfileImage(result.assets[0].uri || null);
            // }
            if (result.assets && result.assets.length > 0) {
                let imgObj: any = {};
                imgObj.name =
                    result.assets[0].fileName || `profile_${Date.now()}.jpg`;
                imgObj.type = result.assets[0].type || 'image/jpeg';
                imgObj.uri = result.assets[0].uri || '';
                setProfileImage(imgObj);
            }
        }, 500);
    };

    const handleGalleryPress = async () => {
        setIsImagePickerVis(false);
        setTimeout(async () => {
            const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
            // if (result.assets && result.assets.length > 0) {
            //     setProfileImage(result.assets[0].uri || null);
            // }
            if (result.assets && result.assets.length > 0) {
                let imgObj: any = {};
                imgObj.name =
                    result.assets[0].fileName || `profile_${Date.now()}.jpg`;
                imgObj.type = result.assets[0].type || 'image/jpeg';
                imgObj.uri = result.assets[0].uri || '';
                setProfileImage(imgObj);
            }
        }, 500);
    };

    const renderInput = (label: string, placeholder: string, value: string, setValue: (val: string) => void) => (
        <View style={styles.inputWrapper}>
            <Text style={styles.floatingLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={COLORS.gray}
                value={value}
                onChangeText={setValue}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Header */}
            <View style={{ paddingHorizontal: ms(8) }}>

                <BackButtonHeader
                // rightComponent={
                //     <TouchableOpacity activeOpacity={0.7}>
                //         <Text style={styles.skipText}>Skip</Text>
                //     </TouchableOpacity>
                // }
                />
            </View>

            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === 'ios' ? 20 : 20}
                keyboardShouldPersistTaps="handled"
            >
                {/* Title */}
                <Text style={styles.title}>Update Profile</Text>

                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarPlaceholder}>
                        {/* Assuming gray placeholder temporarily, normally IMAGES.profile would go here */}
                        <Image
                            source={profileImage ? { uri: profileImage?.uri } : ICONS.peopleInactive}
                            style={styles.avatarImage}
                        />
                    </View>
                    <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8} onPress={() => setIsImagePickerVis(true)}>
                        <Image source={ICONS.cameraProfile} style={styles.cameraIcon} />
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {renderInput('First name', 'Enter first name', firstName, setFirstName)}
                    {renderInput('Last name', 'Enter last name', lastName, setLastName)}

                    {/* Birthday Picker */}
                    <TouchableOpacity
                        style={styles.birthdayPicker}
                        activeOpacity={0.7}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Image source={ICONS.calendar} style={styles.calendarIcon} />
                        <Text style={styles.birthdayText}>{birthdayText}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    {renderInput('Profession', 'Enter profession', profession, setProfession)}

                    <TouchableOpacity activeOpacity={0.8} onPress={() => setIsLocationModalVisible(true)}>
                        <View pointerEvents="none">
                            {renderInput('Location', 'Enter location', location, setLocation)}
                        </View>
                    </TouchableOpacity>

                    {/* {renderInput('Location', 'Enter location', location, setLocation)} */}
                </View>

                {/* Confirm Button */}
                <CustomButton
                    title="Confirm"
                    onPress={handleConfirm}
                    containerStyle={{ marginTop: mvs(10), marginBottom: mvs(40) }}
                />
            </KeyboardAwareScrollView>

            <ImagePickerModal
                isVisible={isImagePickerVis}
                onClose={() => setIsImagePickerVis(false)}
                onCameraPress={handleCameraPress}
                onGalleryPress={handleGalleryPress}
            />

            {/* Location Picker Modal */}
            <LocationPickerModal
                isVisible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                onSelectLocation={(data, details) => {
                    if (data && data.description) {
                        setLocation(data.description);
                    }
                    if (details && details.geometry && details.geometry.location) {
                        setSelectedLocationLatLng({
                            lat: details.geometry.location.lat,
                            lng: details.geometry.location.lng
                        });
                    }
                }}
            />
        </SafeAreaView>
    );
};

export default UpdateProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    skipText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.primary, // Pinkish text matching the mockup
    },
    cameraIcon: {
        height: ms(16),
        width: ms(16),
        resizeMode: 'contain',
    },
    calendarIcon: {
        height: ms(20),
        width: ms(20),
        resizeMode: 'contain',
        marginRight: ms(10),
    },
    scrollContent: {
        paddingHorizontal: ms(30),
        paddingTop: mvs(20),
        paddingBottom: mvs(20),
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: normalize(28),
        color: COLORS.black,
        marginBottom: mvs(30),
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: mvs(40),
        position: 'relative',
    },
    avatarPlaceholder: {
        width: ms(100),
        height: ms(100),
        borderRadius: ms(30), // Squircle matching Figma mock
        backgroundColor: COLORS.lightGray,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    cameraButton: {
        position: 'absolute',
        right: -ms(5),
        bottom: -ms(5),
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: '#ffb3e6',
        borderWidth: 3,
        borderColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        width: '100%',
        marginBottom: mvs(20),
    },
    inputWrapper: {
        width: '100%',
        height: mvs(60),
        borderWidth: 1,
        borderColor: '#E8E6EA',
        borderRadius: ms(15),
        paddingHorizontal: ms(20),
        justifyContent: 'center',
        marginBottom: mvs(25), // Increased margin for floating label overhead
    },
    floatingLabel: {
        position: 'absolute',
        top: -mvs(10),
        left: ms(20),
        backgroundColor: COLORS.background,
        paddingHorizontal: ms(5),
        fontFamily: FONTS.regular,
        fontSize: normalize(11),
        color: 'rgba(0, 0, 0, 0.4)',
    },
    input: {
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.black,
        padding: 0,

    },
    birthdayPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: mvs(56),
        backgroundColor: 'rgba(254, 163, 224, 0.1)', // Very light pink background
        borderRadius: ms(15),
        paddingHorizontal: ms(20),
        marginBottom: mvs(25),
    },
    birthdayIcon: {
        fontSize: normalize(18),
        marginRight: ms(10),
        marginTop: -mvs(2),
    },
    birthdayText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.primary, // matching the bold pink text
        includeFontPadding: false,
    },
});
