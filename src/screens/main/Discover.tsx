import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Animated,
    PanResponder,
    Dimensions,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { navigate } from '../../utils/helper/RootNavigation';
import connectionrequest from '../../utils/helper/NetInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileRequest, peopleListRequest, swipeRequest } from '../../redux/reducer/MainReducer';
import ToastAlert from '../../utils/helper/Toast';
import Loader from '../../utils/helper/Loader';
import { Slider } from '@miblanchard/react-native-slider';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

// Placeholder robust mock data imitating the designs exactly
const DATA = [
    {
        id: '1',
        name: 'Camila Snow',
        age: 23,
        profession: 'Professional model',
        distance: '1 Km',
        image:
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '2',
        name: 'Brenda Jackson',
        age: 25,
        profession: 'Photographer',
        distance: '1.5 Km',
        image:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '3',
        name: 'Jessica Parker',
        age: 23,
        profession: 'Professional model',
        distance: '1 Km',
        image:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '4',
        name: 'Jessica Parker',
        age: 23,
        profession: 'Professional model',
        distance: '1 Km',
        image:
            'https://images.unsplash.com/photo-1534528741776-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '5',
        name: 'Jessica Parker',
        age: 23,
        profession: 'Professional model',
        distance: '1 Km',
        image:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '6',
        name: 'Jessica Parker',
        age: 23,
        profession: 'Professional model',
        distance: '1 Km',
        image:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
];

const Discover = () => {
    const dispatch = useDispatch();
    const { isMainLoading, peopleListRes, swipeRes } = useSelector((state: any) => state.MainReducer);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [filterSelect, setFilterSelect] = useState('Women');
    const [Age, setAge] = useState<[number, number]>([20, 28]);
    const [Distance, setDistance] = useState<number>(40);
    const [location, setLocation] = useState('');
    const position = useRef(new Animated.ValueXY()).current;

    const latestIndex = useRef(currentIndex);
    const latestList = useRef(peopleListRes);

    useEffect(() => {
        latestIndex.current = currentIndex;
        latestList.current = peopleListRes;
    });

    function HandleSwipe(type: any, id: any) {
        dispatch(swipeRequest({
            target_id: id,
            type: type
        }));
    }

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // Only hijack the responder if sweeping more than 5px to allow taps!
                return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (evt, gestureState) => {
                position.setValue({ x: gestureState.dx, y: gestureState.dy });
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx > SWIPE_THRESHOLD) {
                    forceSwipe('right');
                } else if (gestureState.dx < -SWIPE_THRESHOLD) {
                    forceSwipe('left');
                } else {
                    resetPosition();
                }
            },
        }),
    ).current;

    const forceSwipe = (direction: 'right' | 'left') => {
        // if (direction === 'right') {
        //     setIsMatchModalVisible(true);
        // }
        const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false,
        }).start(() => onSwipeComplete(direction));
    };

    const onSwipeComplete = (direction: 'right' | 'left') => {
        const item = latestList.current?.[latestIndex.current];
        if (item) {
            HandleSwipe(direction, item.id);
        }

        const nextIndex = latestIndex.current + 1;
        setCurrentIndex(nextIndex);
        position.setValue({ x: 0, y: 0 });

        // Trigger pagination if we are 3 cards away from the end
        if (latestList.current && nextIndex === latestList.current.length - 3) {
            const currentTotal = latestList.current.length;
            // Only fetch if there's exactly a multiple of 10, meaning there might be more data
            if (currentTotal > 0 && currentTotal % 10 === 0) {
                const nextPage = Math.floor(currentTotal / 10) + 1;
                dispatch(peopleListRequest({ page: nextPage, limit: 10 }));
            }
        }
    };

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
        }).start();
    };

    const getCardStyle = () => {
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-20deg', '0deg', '20deg'],
        });

        return {
            transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate },
            ],
        };
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

    const likeOpacity = position.x.interpolate({
        inputRange: [0, SCREEN_WIDTH / 4],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const nopeOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 4, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const renderCards = () => {
        if (currentIndex >= peopleListRes?.length) {
            return (
                <View
                    style={[
                        styles.cardContainer,
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 0,
                            backgroundColor: 'transparent',
                        },
                    ]}
                >
                    <Text style={styles.noMoreCardsText}>No more profiles nearby...</Text>
                </View>
            );
        }

        const visibleCards = peopleListRes?.slice(currentIndex, currentIndex + 2);

        return visibleCards
            .map((item: any, index: any) => {
                if (index === 0) {
                    return (
                        <Animated.View
                            key={index}
                            style={[getCardStyle(), styles.cardContainer, { zIndex: 99 }]}
                            {...panResponder.panHandlers}
                        >
                            <TouchableOpacity
                                activeOpacity={0.95}
                                onPress={() => navigate('UserProfile', item.id)}
                                style={{ flex: 1, borderRadius: ms(20), overflow: 'hidden' }}
                            >
                                <Image source={{
                                    uri: item?.profile_image
                                }} style={styles.cardImage} />


                                {/* Interactive Dynamic Overlays */}
                                <Animated.View
                                    style={[styles.dragOverlayIcon, { opacity: likeOpacity }]}
                                >
                                    <View style={styles.circleBadge}>
                                        <Image
                                            source={ICONS.like}
                                            style={[styles.actionIconColor, { height: ms(35), width: ms(35) }]}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </Animated.View>

                                <Animated.View
                                    style={[styles.dragOverlayIcon, { opacity: nopeOpacity }]}
                                >
                                    <View style={styles.circleBadge}>
                                        <Image
                                            source={ICONS.closeSmall}
                                            style={[styles.actionIconColor, { height: ms(35), width: ms(35) }]}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </Animated.View>

                                {/* Details Overlay */}

                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                                    style={styles.gradientOverlay}
                                >
                                    <Text style={styles.cardName}>
                                        {item.name}, {item.age}
                                    </Text>
                                    <Text style={styles.cardProfession}>{item?.profession}</Text>
                                </LinearGradient>

                                {/* Top Left Distance Chip */}
                                <View style={styles.locationBadge}>
                                    {/* <Text style={styles.locationIcon}>📍</Text> */}
                                    <Image source={ICONS.location} style={styles.locationIcon} />
                                    <Text style={styles.locationText}>{item.distance}</Text>
                                </View>

                                {/* Right Align Dots Scrollbar */}
                                <View style={styles.dotsContainer}>
                                    <View style={[styles.dot, styles.dotActive]} />
                                    <View style={styles.dot} />
                                    <View style={styles.dot} />
                                    <View style={styles.dot} />
                                    <View style={styles.dot} />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                }

                return (
                    <Animated.View
                        key={item.id}
                        style={[
                            styles.cardContainer,
                            {
                                zIndex: 1,
                                top: -mvs(60),
                                transform: [{ scale: 0.80 }],
                            },
                        ]}
                    >
                        <View style={{ flex: 1, borderRadius: ms(20), overflow: 'hidden' }}>
                            <Image source={{ uri: item.image }} style={styles.cardImage} />

                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.85)']}
                                style={styles.gradientOverlay}
                            >
                                <Text style={styles.cardName}>
                                    {item.name}, {item.age}
                                </Text>
                                <Text style={styles.cardProfession}>{item.profession}</Text>
                            </LinearGradient>

                            <View style={styles.locationBadge}>
                                <Image source={ICONS.location} style={styles.locationIcon} />
                                <Text style={styles.locationText}>{item.distance}</Text>
                            </View>

                            <View style={styles.dotsContainer}>
                                <View style={[styles.dot, styles.dotActive]} />
                                <View style={styles.dot} />
                                <View style={styles.dot} />
                                <View style={styles.dot} />
                                <View style={styles.dot} />
                            </View>
                        </View>
                    </Animated.View>
                );
            })
            .reverse();
    };

    useEffect(() => {
        connectionrequest()
            .then(() => {
                dispatch(peopleListRequest({ page: 1, limit: 10 }))
                dispatch(getProfileRequest({}))
            })
            .catch(err => {
                ToastAlert('Please connect To Internet');
            });

    }, []);

    useEffect(() => {
        if (swipeRes && swipeRes.is_match === true) {
            setIsMatchModalVisible(true);
        }
    }, [swipeRes]);



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <Loader visible={isMainLoading} />
            {/* Custom Discover Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBtn}>
                    <Image
                        source={ICONS.back}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Discover</Text>
                    <Text style={styles.headerSubtitle}>Chicago, Il</Text>
                </View>

                <TouchableOpacity style={styles.headerBtn} onPress={() => setIsFilterVisible(true)}>
                    <Image
                        source={ICONS.filter}
                        style={styles.backIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* Swipable Image Deck */}
            <View style={styles.deckContainer}>{renderCards()}</View>

            {/* Swipe Call to Actions Overlay */}
            <View style={styles.bottomActions}>


                <TouchableOpacity style={styles.floatBtnSmall} onPress={() => forceSwipe('left')}>
                    <Image
                        source={ICONS.closeSmall}
                        style={styles.actionIconColor}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={{ ...styles.floatBtnSmall, backgroundColor: COLORS.primaryLight }}>
                    <Image
                        source={ICONS.message}
                        style={styles.actionIconColor}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.floatBtnSmall} onPress={() => forceSwipe('right')}>
                    <Image
                        source={ICONS.like}
                        style={[styles.actionIconColor, { height: ms(33), width: ms(33) }]}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.floatBtnSmall}>
                    <Image
                        source={ICONS.star}
                        style={[styles.actionIconColor]}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* Match Modal */}
            <Modal
                isVisible={isMatchModalVisible}
                style={{ margin: 0 }} // Fills screen perfectly native
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={1}
                backdropColor="#FCFCFC"
            >
                <SafeAreaView style={styles.matchModalContainer}>
                    <View style={styles.matchImagesWrapper}>
                        {/* Underlay Guy Image (Jake) */}
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }}
                            style={[styles.matchImageItem, styles.matchImageRight]}
                        />
                        {/* Overlay Girl Image */}
                        <Image
                            source={DATA[currentIndex] ? { uri: DATA[currentIndex].image } : { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' }}
                            style={[styles.matchImageItem, styles.matchImageLeft]}
                        />

                        {/* Floating elements */}
                        <LinearGradient colors={['#fff', '#ffe6f2']} style={styles.floatingHeartBadge1}>
                            <Text style={styles.floatingHeartText}>♥</Text>
                        </LinearGradient>
                        <LinearGradient colors={['#fff', '#ffe6f2']} style={styles.floatingHeartBadge2}>
                            <Text style={styles.floatingHeartText}>♥</Text>
                        </LinearGradient>
                        <View style={styles.floatingSoftHeart3}>
                            <Text style={styles.floatingSoftHeartText}>♥</Text>
                        </View>
                    </View>

                    <Text style={styles.matchTitle}>It's a match, Jake!</Text>
                    <Text style={styles.matchSubtitle}>Start a conversation now with each other</Text>

                    <View style={styles.matchActionContainer}>
                        <TouchableOpacity
                            style={styles.matchBtnPink}
                            onPress={() => {
                                setIsMatchModalVisible(false);
                                navigate('Chat'); // Hop into Chat flow immediately
                            }}
                        >
                            <Text style={styles.matchBtnPinkText}>Say hello</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.matchBtnWhite}
                            onPress={() => setIsMatchModalVisible(false)}
                        >
                            <Text style={styles.matchBtnWhiteText}>Keep swiping</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* Filters Modal */}
            <Modal
                isVisible={isFilterVisible}
                onBackdropPress={() => setIsFilterVisible(false)}
                onSwipeComplete={() => setIsFilterVisible(false)}
                swipeDirection="down"
                style={styles.modalStyle}
                backdropOpacity={0.4}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHandle} />
                    <View style={styles.modalHeaderRow}>
                        <View style={{ width: ms(40) }} />
                        <Text style={styles.modalTitle}>Filters</Text>
                        <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                            <Text style={styles.clearText}>Clear</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Select Section */}
                    <Text style={styles.filterSectionTitle}>Interested in</Text>
                    <View style={styles.segmentedControl}>
                        {['Women', 'Men', 'Both'].map((option) => {
                            const isActive = option === filterSelect;
                            return (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                                    onPress={() => setFilterSelect(option)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {renderInput('Location', 'Enter location', location, setLocation)}

                    {/* Distance Section */}
                    <View style={styles.sliderTitleRow}>
                        <Text style={styles.filterSectionTitle}>Distance</Text>
                        <Text style={styles.sliderValueText}>{Math.round(Distance)}km</Text>
                    </View>

                    <Slider
                        // style={{ width: '100%', height: mvs(50) }}
                        minimumValue={1}
                        maximumValue={100}
                        step={1}
                        minimumTrackTintColor={COLORS.primaryLight}
                        maximumTrackTintColor="#EAEAEA"
                        thumbTintColor={COLORS.primary}
                        value={Distance}
                        onValueChange={(val: any) => setDistance(val[0])}
                        trackStyle={styles.trackStyle}
                        thumbStyle={styles.thumbStyle}


                    />

                    <View style={{ height: mvs(25) }} />

                    {/* Age Section */}
                    <View style={styles.sliderTitleRow}>
                        <Text style={styles.filterSectionTitle}>Age</Text>
                        <Text style={styles.sliderValueText}>{Math.round(Age[0])}-{Math.round(Age[1])}</Text>
                    </View>


                    <Slider
                        minimumValue={14}
                        maximumValue={100}
                        step={1}
                        minimumTrackTintColor={COLORS.primaryLight}
                        maximumTrackTintColor="#EAEAEA"
                        thumbTintColor={COLORS.primary}
                        value={Age}
                        onValueChange={(val: any) => setAge(val as [number, number])}
                        trackStyle={styles.trackStyle}
                        thumbStyle={styles.thumbStyle}
                    />

                    <View style={{ height: mvs(25) }} />

                    {/* Others Section */}



                    {/* Apply Button */}
                    <TouchableOpacity style={styles.applyBtn} onPress={() => setIsFilterVisible(false)}>
                        <Text style={styles.applyBtnText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </Modal>


        </SafeAreaView>
    );
};

export default Discover;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCFCFC', // Very light grey bg similar to Mock
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: mvs(10),
        paddingBottom: mvs(15),
    },
    headerBtn: {
        width: ms(48),
        height: ms(48),
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    backIcon: {
        width: ms(22),
        height: ms(22),
        tintColor: COLORS.black,
    },
    headerBtnText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(18),
        color: COLORS.black,
    },
    headerBtnTextSmall: {
        fontSize: normalize(16),
        color: COLORS.black,
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(18),
        color: COLORS.black,
        marginBottom: mvs(2),
    },
    headerSubtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(10),
        color: COLORS.textTertiary,
    },
    deckContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: mvs(10),
        marginTop: mvs(20),
    },
    cardContainer: {
        position: 'absolute',
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.6, // Adapts nicely into screen
        borderRadius: ms(20),
        backgroundColor: COLORS.white,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: ms(20),
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: mvs(150),
        justifyContent: 'flex-end',
        padding: ms(20),
        borderBottomLeftRadius: ms(20),
        borderBottomRightRadius: ms(20),
        zIndex: 5,
    },
    cardName: {
        fontFamily: FONTS.bold,
        fontSize: normalize(20),
        color: COLORS.white,
    },
    cardProfession: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: 'rgba(255,255,255,0.85)',
        marginTop: mvs(3),
    },
    locationBadge: {
        position: 'absolute',
        top: ms(20),
        left: ms(20),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: ms(14),
        paddingVertical: ms(8),
        borderRadius: ms(8),
        zIndex: 5,
    },
    locationIcon: {
        width: ms(14),
        height: ms(14),
        marginRight: ms(6),
        tintColor: COLORS.white,
        resizeMode: 'contain',
    },
    locationText: {
        fontFamily: FONTS.medium,
        fontSize: normalize(11),
        color: COLORS.white,
    },
    dotsContainer: {
        position: 'absolute',
        right: ms(15),
        top: '35%',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.35)',
        paddingVertical: mvs(10),
        paddingHorizontal: ms(5),
        borderRadius: ms(10),
        zIndex: 5,
    },
    dot: {
        width: ms(4),
        height: ms(4),
        borderRadius: ms(2),
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginVertical: mvs(3),
    },
    dotActive: {
        backgroundColor: COLORS.white,
        height: ms(12),
    },
    dragOverlayIcon: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    circleBadge: {
        width: ms(70),
        height: ms(70),
        borderRadius: ms(35),
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    heartIcon: {
        fontSize: normalize(38),
        color: '#ff4da6',
    },
    crossIcon: {
        fontSize: normalize(38),
        color: '#FF9500',
    },
    noMoreCardsText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.textTertiary,
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: mvs(80), // Significant spacing to sit above the root bottom tab
    },
    actionBtnSmall: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(22.5),
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginHorizontal: ms(10),
    },
    actionBtnMediumPink: {
        width: ms(55),
        height: ms(55),
        borderRadius: ms(27.5),
        backgroundColor: '#ffb3e6', // Solid light pink fill
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#ffb3e6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        marginHorizontal: ms(10),
    },
    actionBtnMediumWhite: {
        width: ms(55),
        height: ms(55),
        borderRadius: ms(27.5),
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        marginHorizontal: ms(10),
    },
    crossIconSmall: {
        fontSize: normalize(20),
        color: '#FF9500',
    },
    whiteIcon: {
        fontSize: normalize(20),
        color: COLORS.white,
    },
    heartIconMedium: {
        fontSize: normalize(26),
        color: '#ff4da6',
    },
    starIconSmall: {
        fontSize: normalize(20),
        color: '#FF9500',
    },
    // Modal Styles
    matchModalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FCFCFC',
    },
    matchImagesWrapper: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.45,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    matchImageItem: {
        width: SCREEN_WIDTH * 0.45,
        height: SCREEN_HEIGHT * 0.3,
        borderRadius: ms(20),
        position: 'absolute',
        backgroundColor: COLORS.lightGray,
    },
    matchImageRight: {
        transform: [{ rotate: '15deg' }, { translateX: ms(30) }, { translateY: -mvs(20) }],
        zIndex: 1,
    },
    matchImageLeft: {
        transform: [{ rotate: '-10deg' }, { translateX: -ms(40) }, { translateY: mvs(30) }],
        zIndex: 2,
        borderWidth: ms(4),
        borderColor: '#FCFCFC',
    },
    floatingHeartBadge1: {
        position: 'absolute',
        top: '12%',
        left: '25%',
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        elevation: 5,
        shadowColor: '#ffb3e6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    floatingHeartBadge2: {
        position: 'absolute',
        bottom: '8%',
        left: '20%',
        width: ms(65),
        height: ms(65),
        borderRadius: ms(32.5),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        elevation: 5,
        shadowColor: '#ffb3e6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    floatingSoftHeart3: {
        position: 'absolute',
        bottom: '25%',
        right: '20%',
        zIndex: 0,
        opacity: 0.5,
    },
    floatingHeartText: {
        color: '#ff4da6',
        fontSize: normalize(20),
    },
    floatingSoftHeartText: {
        color: '#ffb3e6',
        fontSize: normalize(30),
    },
    matchTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(28),
        color: '#ff4da6',
        marginTop: mvs(30),
        marginBottom: mvs(10),
    },
    matchSubtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,
        marginBottom: mvs(40),
    },
    matchActionContainer: {
        width: '100%',
        paddingHorizontal: ms(40),
    },
    matchBtnPink: {
        width: '100%',
        height: mvs(55),
        backgroundColor: '#ffb3e6', // Matches mock light pink
        borderRadius: ms(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: mvs(20),
    },
    matchBtnPinkText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: COLORS.white,
    },
    matchBtnWhite: {
        width: '100%',
        height: mvs(55),
        backgroundColor: COLORS.white,
        borderRadius: ms(15),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    matchBtnWhiteText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: '#ff4da6',
    },


    floatBtnSmall: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(30),
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        marginHorizontal: ms(10), // Adding gap manually for older rn versions
    },
    floatBtnLarge: {
        width: ms(75),
        height: ms(75),
        borderRadius: ms(37.5),
        backgroundColor: '#FF99D6', // Brighter pink distinct styling
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        marginHorizontal: ms(10),
    },
    actionIconWhite: {
        width: ms(30),
        height: ms(30),
        tintColor: COLORS.white,
    },
    actionIconColor: {
        width: ms(26),
        height: ms(26),
        resizeMode: 'contain'
    },



    modalStyle: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: ms(30),
        borderTopRightRadius: ms(30),
        paddingHorizontal: ms(20),
        paddingBottom: mvs(30),
        paddingTop: mvs(10),
    },
    modalHandle: {
        width: ms(40),
        height: mvs(5),
        backgroundColor: '#EAEAEA',
        borderRadius: ms(3),
        alignSelf: 'center',
        marginBottom: mvs(20),
    },
    modalHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: mvs(25),
    },
    modalTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(18),
        color: COLORS.black,
    },
    clearText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(12),
        color: '#ff4da6', // Pink
        width: ms(40),
        textAlign: 'right',
    },
    filterSectionTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(12),
        color: COLORS.black,
        marginBottom: mvs(15),
    },
    segmentedControl: {
        flexDirection: 'row',
        height: mvs(50),
        backgroundColor: COLORS.white,
        borderRadius: ms(15),
        borderWidth: 1,
        borderColor: '#EAEAEA',
        marginBottom: mvs(25),
        overflow: 'hidden',
    },
    segmentBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#EAEAEA',
    },
    segmentBtnActive: {
        backgroundColor: '#ff4da6',
        borderRightWidth: 0,
    },
    segmentText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.black,
    },
    segmentTextActive: {
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
    segmentedControlOutline: {
        flexDirection: 'row',
        height: mvs(45),
        backgroundColor: COLORS.white,
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: '#EAEAEA',
        marginBottom: mvs(30),
        overflow: 'hidden',
    },
    segmentBtnOutline: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#EAEAEA',
    },
    segmentBtnOutlineActive: {
        backgroundColor: '#FAFAFA', // Slight grey
    },
    segmentTextOutline: {
        fontFamily: FONTS.regular,
        fontSize: normalize(10),
        color: COLORS.textTertiary,
    },
    segmentTextOutlineActive: {
        fontFamily: FONTS.bold,
        color: COLORS.black,
    },
    sliderTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sliderValueText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(11),
        color: COLORS.textTertiary,
    },
    sliderTrackContainer: {
        height: mvs(30),
        justifyContent: 'center',
        position: 'relative',
        marginTop: mvs(5),
    },
    sliderTrackBackground: {
        width: '100%',
        height: mvs(4),
        backgroundColor: '#EAEAEA',
        borderRadius: ms(2),
        position: 'absolute',
    },
    sliderTrackActive: {
        height: mvs(4),
        backgroundColor: '#ffb3e6', // Soft pink track
        borderRadius: ms(2),
        position: 'absolute',
    },
    sliderThumb: {
        position: 'absolute',
        width: ms(24),
        height: ms(24),
        borderRadius: ms(12),
        backgroundColor: '#ff4da6', // Vibrant pink thumb
        top: '50%',
        marginTop: -ms(12),
        marginLeft: -ms(12),
        borderWidth: 3,
        borderColor: '#FFF0F8', // subtle halo
    },
    applyBtn: {
        height: mvs(55),
        width: '100%',
        backgroundColor: '#ffb3e6',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: ms(16),
    },
    applyBtnText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: COLORS.white,
    },

    trackStyle: {
        height: mvs(6),
        borderRadius: ms(10),

    },
    thumbStyle: {
        height: mvs(33), width: mvs(33), borderRadius: ms(20), borderWidth: ms(3.5), borderColor: COLORS.white,
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
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

});
