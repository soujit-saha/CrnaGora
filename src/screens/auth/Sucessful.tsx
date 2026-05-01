import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, FONTS, GIFS, IMAGES } from '../../utils/constants'; // Update this import if the success image is in ICONS instead
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import CustomButton from '../../component/CustomButton';
import { navigate } from '../../utils/helper/RootNavigation';

const Sucessful = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <View style={styles.imageContainer}>

                {/* <Image
                    source={GIFS.main}
                    style={styles.image}
                    resizeMode="contain"
                /> */}
                <Image
                    source={IMAGES.reg}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Account Created{'\n'}Successfully</Text>

                <Text style={styles.subtitle}>
                    You're all set! Welcome to CRNA.{'\n'}Let's find your Balkan love.
                </Text>
            </View>

            <View style={styles.footer}>
                <CustomButton
                    title="Start Exploring"
                    onPress={() => { navigate('Notification') }}
                />
            </View>
        </SafeAreaView>
    );
};

export default Sucessful;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: mvs(40),
    },
    image: {
        width: ms(280),
        height: ms(280),
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: ms(40),
        paddingBottom: mvs(60),
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: normalize(20),
        color: COLORS.primary, // Bright pink matching the UI map
        textAlign: 'center',
        marginBottom: mvs(15),
        includeFontPadding: false,
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