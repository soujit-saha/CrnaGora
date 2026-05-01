import React, { useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { goBack } from '../../utils/helper/RootNavigation';
import { useSelector } from 'react-redux';

const LOREM_TEXT =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra condimentum eget purus in. Consectetur eget id morbi amet amet, in. Ipsum viverra pretium tellus neque. Ullamcorper suspendisse aenean leo pharetra in sit semper et. Amet quam placerat sem.";

const TermsofUse = () => {
    const scrollViewRef = useRef<ScrollView>(null);
    const { isReqLoading, settingRes } = useSelector((state: any) => state.AuthReducer);
    const handleScrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Container */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => goBack()}>
                    <Image source={ICONS.back} style={styles.headerIcon} resizeMode="contain" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: ms(45) }} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.clauseParagraph}>{settingRes?.term_and_condition} </Text>
                {/* <View style={styles.clauseBlock}>
                <Text style={styles.clauseTitle}>1. Clause 1</Text>
                    <Text style={styles.clauseParagraph}>{LOREM_TEXT}</Text>
                </View>

                <View style={styles.clauseBlock}>
                    <Text style={styles.clauseTitle}>2. Clause 2</Text>
                    <Text style={styles.clauseParagraph}>{LOREM_TEXT}</Text>

                    <Text style={[styles.clauseParagraph, { marginTop: mvs(20) }]}>{LOREM_TEXT}</Text>
                    <Text style={[styles.clauseParagraph, { marginTop: mvs(20) }]}>{LOREM_TEXT}</Text>
                    <Text style={[styles.clauseParagraph, { marginTop: mvs(20) }]}>{LOREM_TEXT}</Text>
                </View> */}
            </ScrollView>

            {/* Floating Bottom Fade Gradient & Button overlay */}
            <View style={styles.bottomOverlay}>
                <LinearGradient
                    colors={['rgba(250,250,250,0)', '#FAFAFA', '#FAFAFA']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />
                <TouchableOpacity
                    style={styles.floatingButton}
                    activeOpacity={0.8}
                    onPress={handleScrollToBottom}
                >
                    <Text style={styles.floatingButtonText}>Scroll to Bottom</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default TermsofUse;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: mvs(10),
        paddingBottom: mvs(20),
    },
    headerBtn: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    headerIcon: {
        width: ms(20),
        height: ms(20),
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(18),
        color: COLORS.black,
    },
    scrollContent: {
        paddingHorizontal: ms(25),
        paddingTop: mvs(10),
        paddingBottom: mvs(150), // Heavy padding to ensure text clears under the large overlay
    },
    clauseBlock: {
        marginBottom: mvs(30),
    },
    clauseTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: COLORS.black,
        marginBottom: mvs(12),
    },
    clauseParagraph: {
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.textTertiary,
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: mvs(120),
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: mvs(30), // Padding pushes btn up from safe bottom
    },
    floatingButton: {
        paddingHorizontal: ms(30),
        paddingVertical: mvs(15),
        backgroundColor: COLORS.white,
        borderRadius: ms(30),
        borderWidth: 1.5,
        borderColor: '#FF99D6', // Pink outline from mock
        elevation: 6,
        shadowColor: '#FF99D6', // Matching pink glow layer
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        zIndex: 10,
    },
    floatingButtonText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.primary, // Bright pink
    },
});
