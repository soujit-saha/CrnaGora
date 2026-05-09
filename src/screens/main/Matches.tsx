import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    StatusBar,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { navigate } from '../../utils/helper/RootNavigation';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../utils/helper/NetInfo';
import ToastAlert from '../../utils/helper/Toast';
import { matchesBlockRequest, matchesListRequest } from '../../redux/reducer/MainReducer';
import Loader from '../../utils/helper/Loader';

const { width } = Dimensions.get('window');

const MATCHES_DATA = [
    {
        title: 'Today',
        data: [
            {
                id: '1',
                name: 'Leilani',
                age: 19,
                image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                showBadge: false,
            },
            {
                id: '2',
                name: 'Annabelle',
                age: 20,
                image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                showBadge: false,
            },
            {
                id: '3',
                name: 'Reagan',
                age: 24,
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                showBadge: false,
            },
            {
                id: '4',
                name: 'Hadley',
                age: 25,
                image: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                showBadge: false,
            },
        ],
    },
    {
        title: 'Yesterday',
        data: [
            {
                id: '5',
                name: 'Leilani',
                age: 19,
                image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                showBadge: true,
            },
            {
                id: '6',
                name: 'Annabelle',
                age: 20,
                image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                showBadge: true,
            },
        ],
    },
];

const Matches = () => {
    const dispatch = useDispatch();
    const { isMainLoading, matchesListRes } = useSelector((state: any) => state.MainReducer);
    const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(matchesListRequest({}));
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const onRemovePress = (item: any) => {
        setSelectedMatch(item);
        setIsRemoveModalVisible(true);
    };

    const confirmRemove = () => {
        if (selectedMatch) {
            dispatch(matchesBlockRequest({ id: selectedMatch.id, type: 1 }));
        }
        // UI Interaction wrap-up
        setIsRemoveModalVisible(false);
        setSelectedMatch(null);
    };


    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(matchesListRequest({}))
            })
            .catch(err => {
                ToastAlert('Please connect To Internet');
            });

    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <Loader visible={isMainLoading} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]} // Android
                        tintColor={COLORS.primary} // iOS
                    />
                }
            >
                {/* Header section */}
                <View style={styles.headerContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.headerTitle}>Matches</Text>
                        {/* <TouchableOpacity style={styles.sortBtn}
                        // onPress={() => setIsRemoveModalVisible(true)}
                        >
                            <Image source={ICONS.sort} style={styles.sortIcon} resizeMode="contain" />
                        </TouchableOpacity> */}
                    </View>
                    <Text style={styles.headerSubtitle}>
                        This is a list of people who have liked you and your matches.
                    </Text>
                </View>

                {/* List Section mapping */}
                {/* {matchesListRes?.map((section:any, sectionIndex:any) => (
                    <View key={section.title} style={styles.sectionContainer}>
                        {/* Divider with Text */}
                {/* <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>{section.title}</Text>
                            <View style={styles.dividerLine} />
                        </View>  */}

                {/* Grid */}
                <View style={styles.gridRow}>
                    {matchesListRes?.map((item: any, index: any) => (
                        <View key={item.id} style={styles.cardWrapper}>
                            <ImageBackground
                                source={{ uri: item?.profile_image }}
                                style={styles.cardBackground}
                                imageStyle={{ borderRadius: ms(15) }}
                            >
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                                    style={styles.cardGradient}
                                >
                                    <Text style={styles.cardNameText}>
                                        {item.name}, {item.age}
                                    </Text>

                                    {/* Action Row */}
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity style={styles.actionButton} onPress={() => onRemovePress(item)}>
                                            <Image
                                                source={ICONS.closeSmall}
                                                style={styles.actionIconBold}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>

                                        <View style={styles.verticalDivider} />

                                        <TouchableOpacity style={styles.actionButton} onPress={() => navigate('ChatPreview', { matchUser: item })}>
                                            <Image
                                                source={ICONS.message}
                                                style={styles.actionIcon}
                                                resizeMode="contain"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>
                            </ImageBackground>

                            {/* Optional Like Badge Overflowing the card */}
                            {item.showBadge && (
                                <View style={styles.badgeContainer}>
                                    <Image source={ICONS.like} style={styles.badgeIcon} resizeMode="contain" />
                                </View>
                            )}
                        </View>
                    ))}
                    {matchesListRes.length == 0 && (
                        <Text style={{ ...styles.headerSubtitle, marginTop: mvs(100), textAlign: 'center', paddingHorizontal: ms(20) }}>
                            No matches yet. Start liking people to see them here!
                        </Text>
                    )}
                </View>
                {/* </View> */}
                {/* ))} */}
            </ScrollView>

            {/* Remove Match Modal */}
            <Modal
                isVisible={isRemoveModalVisible}
                onBackdropPress={() => setIsRemoveModalVisible(false)}
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={0.6}
                style={{ justifyContent: 'center', alignItems: 'center' }}
            >
                <View style={styles.modalContent}>
                    {/* Header: Image & Name */}
                    <View style={styles.modalProfileRow}>
                        <Image source={{ uri: selectedMatch?.profile_image }} style={styles.modalAvatar} />
                        <View style={styles.modalProfileInfo}>
                            <Text style={styles.modalProfileName}>
                                {selectedMatch?.name}, {selectedMatch?.age}
                            </Text>
                            <Text style={styles.modalProfileProfession}>Proffesional model</Text>
                        </View>
                    </View>

                    {/* Faint Divider with Close Badge */}
                    <View style={styles.modalDividerContainer}>
                        <View style={styles.modalDividerLine} />
                        <View style={styles.modalCloseBadge}>
                            <Text style={styles.modalCloseText}>✕</Text>
                        </View>
                    </View>

                    <Text style={styles.modalTitle}>Remove this match?</Text>
                    <Text style={styles.modalSubtitle}>
                        Once you remove, will never be able see this profile again.
                    </Text>

                    <TouchableOpacity style={styles.modalBtnPink} onPress={confirmRemove}>
                        <Text style={styles.modalBtnPinkText}>Remove</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalBtnWhite} onPress={() => setIsRemoveModalVisible(false)}>
                        <Text style={styles.modalBtnWhiteText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default Matches;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: mvs(10),
    },
    scrollContent: {
        paddingHorizontal: ms(30),
        paddingBottom: mvs(100), // padding to clear bottom tab
    },
    headerContainer: {
        marginTop: mvs(20),
        marginBottom: mvs(15),
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: mvs(10),
    },
    headerTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(32),
        color: COLORS.black,
    },
    sortBtn: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    sortIcon: {
        width: ms(20),
        height: ms(20),
        tintColor: COLORS.black,
    },
    headerSubtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,

        // paddingRight: ms(40),
    },
    sectionContainer: {
        marginTop: mvs(15),
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: mvs(20),
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        marginHorizontal: ms(15),
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,
    },
    gridRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: '48%',
        height: mvs(240),
        marginBottom: mvs(15),
        borderRadius: ms(15),
    },
    cardBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    cardGradient: {
        height: '50%',
        justifyContent: 'flex-end',
        borderBottomLeftRadius: ms(15),
        borderBottomRightRadius: ms(15),
        overflow: 'hidden',
    },
    cardNameText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.white,
        paddingHorizontal: ms(12),
        marginBottom: mvs(10),
    },
    actionRow: {
        flexDirection: 'row',
        height: mvs(40),
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderBottomLeftRadius: ms(15),
        borderBottomRightRadius: ms(15),
        alignItems: 'center',
    },
    actionButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    actionIconBold: {
        width: ms(14),
        height: ms(14),
        tintColor: COLORS.white,
    },
    actionIcon: {
        width: ms(16),
        height: ms(16),
        tintColor: COLORS.white,
    },
    verticalDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    badgeContainer: {
        position: 'absolute',
        top: ms(10),
        right: ms(10),
        width: ms(30),
        height: ms(30),
        borderRadius: ms(15),
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    badgeIcon: {
        width: ms(16),
        height: ms(16),
    },
    // Modal Styles
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: ms(22), // Hugely rounded matching mock
        paddingHorizontal: ms(25),
        paddingVertical: mvs(35),
        alignItems: 'center',
        width: '90%',
    },
    modalProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: mvs(10),
        paddingHorizontal: ms(10),
    },
    modalAvatar: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(30),
        marginRight: ms(15),
    },
    modalProfileInfo: {
        flex: 1,
    },
    modalProfileName: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: COLORS.black,
    },
    modalProfileProfession: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,
        marginTop: mvs(2),
    },
    modalDividerContainer: {
        width: '100%',
        height: mvs(40), // Provide space for floating badge
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: mvs(15),
    },
    modalDividerLine: {
        width: '100%',
        height: mvs(1.5),
        backgroundColor: '#F5F5F5', // Extremely faint layout line
    },
    modalCloseBadge: {
        position: 'absolute', // Centers directly over divider
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
    },
    modalCloseText: {
        fontSize: normalize(12),
        color: '#FF9500', // Mock matches a bright orange/pink hybrid here
        fontFamily: FONTS.bold,
    },
    modalTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: '#ff4da6', // Vibrant pink
        marginBottom: mvs(5),
        includeFontPadding: false,
    },
    modalSubtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: '#323755',
        textAlign: 'center',
        paddingHorizontal: ms(10),
        marginBottom: mvs(25),
        includeFontPadding: false,
    },
    modalBtnPink: {
        width: '100%',
        height: mvs(55),
        backgroundColor: '#ffb3e6', // Matches mock light pink
        borderRadius: ms(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: mvs(15),
    },
    modalBtnPinkText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.white,
    },
    modalBtnWhite: {
        width: '100%',
        height: mvs(55),
        backgroundColor: COLORS.white,
        borderRadius: ms(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F3F3', // subtle
        // elevation: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.05,
        // shadowRadius: 3,
    },
    modalBtnWhiteText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: '#ff4da6',
    },
});