import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { navigate } from '../../utils/helper/RootNavigation';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import {
    getStatusesRequest,
    createStatusRequest,
    deleteStatusRequest,
    reactStatusRequest,
    getStatusCommentsRequest,
    addStatusCommentRequest,
    getUserStatusesRequest,
    chatListRequest,
    startChatRequest,
} from '../../redux/reducer/MainReducer';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

const FILTERS = ['All', 'Unread', 'Most Recent', 'Nearest'];

const Messages = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [filterSelect, setFilterSelect] = useState('Women');
    const [filterOthers, setFilterOthers] = useState('New matches');
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    // Story-related state
    const [isAddStoryModalVisible, setIsAddStoryModalVisible] = useState(false);
    const [isTextStoryModalVisible, setIsTextStoryModalVisible] = useState(false);
    const [textStoryContent, setTextStoryContent] = useState('');
    const [textStoryBg, setTextStoryBg] = useState(COLORS.primary);

    const dispatch = useDispatch();
    const { getStatusesRes, chatListRes, isChatLoading, startChatRes, status } = useSelector(
        (state: any) => state.MainReducer,
    );

    const currentUserId = useSelector((state: any) => {
        const profile = state.MainReducer.getProfileRes;
        return profile?.data?.id || profile?.id || null;
    });

    // Fetch data on focus
    useFocusEffect(
        useCallback(() => {
            dispatch(chatListRequest({}));
            dispatch(getStatusesRequest({}));
        }, []),
    );

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(chatListRequest({}));
        dispatch(getStatusesRequest({}));
        setTimeout(() => setRefreshing(false), 1500);
    };

    const handlePickImage = () => {
        setIsAddStoryModalVisible(false);
        launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
            if (response.didCancel || response.errorCode) return;
            const asset = response.assets?.[0];
            if (asset) {
                const formData = new FormData();
                formData.append('type', 'image');
                formData.append('media_file', {
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    name: asset.fileName || `status_${Date.now()}.jpg`,
                } as any);
                dispatch(createStatusRequest(formData));
            }
        });
    };

    const handlePickVideo = () => {
        setIsAddStoryModalVisible(false);
        launchImageLibrary({ mediaType: 'video' }, (response) => {
            if (response.didCancel || response.errorCode) return;
            const asset = response.assets?.[0];
            if (asset) {
                const formData = new FormData();
                formData.append('type', 'video');
                formData.append('media_file', {
                    uri: asset.uri,
                    type: asset.type || 'video/mp4',
                    name: asset.fileName || `status_${Date.now()}.mp4`,
                } as any);
                dispatch(createStatusRequest(formData));
            }
        });
    };

    const handleCreateTextStory = () => {
        if (!textStoryContent.trim()) return;
        const formData = new FormData();
        formData.append('type', 'text');
        formData.append('content', textStoryContent);
        formData.append('background_color', textStoryBg);
        dispatch(createStatusRequest(formData));
        setIsTextStoryModalVisible(false);
        setTextStoryContent('');
    };

    // Parse chat list data
    const chatList = React.useMemo(() => {
        const rawChats = chatListRes?.data || chatListRes || [];
        if (!Array.isArray(rawChats)) return [];

        return rawChats.map((chat: any) => {
            const otherUser = chat.users?.find((u: any) => u.id !== currentUserId) || chat.users?.[0];
            const latestMsg = chat.latest_message || chat.latestMessage;

            return {
                id: chat.id,
                chatId: chat.id,
                name: otherUser?.name || 'User',
                image: otherUser?.profile_image || otherUser?.image_path || 'https://via.placeholder.com/100',
                message: latestMsg?.message || 'No messages yet',
                time: latestMsg?.created_at ? formatTimeAgo(latestMsg.created_at) : '',
                unread: chat.unread_count || 0,
                isStarred: false,
                userId: otherUser?.id,
                userImage: otherUser?.profile_image || otherUser?.image_path,
            };
        });
    }, [chatListRes, currentUserId]);

    const filteredChats = React.useMemo(() => {
        if (!searchTerm) return chatList;
        return chatList.filter((c: any) =>
            c.name?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [chatList, searchTerm]);

    const handleChatPress = (chat: any) => {
        navigate('Chat', {
            chatId: chat.chatId,
            userId: chat.userId,
            userName: chat.name,
            userImage: chat.userImage,
        });
    };

    const renderActivityRing = (item: any) => {
        const allRead = item?.statuses?.length > 0 && item.statuses.every((s: any) => s.is_read);
        const ringColors = allRead ? [COLORS.lightGray, COLORS.lightGray] : ['#FF9D33', COLORS.primary];

        return (
            <TouchableOpacity key={item.id} style={styles.activityColumn} onPress={() => navigate('Stories', item)}>
                <LinearGradient
                    colors={ringColors}
                    style={styles.ringContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.ringInnerSpace}>
                        <Image source={{ uri: item?.image_path || 'https://via.placeholder.com/100' }} style={styles.activityImage} />
                    </View>
                </LinearGradient>
                <Text style={styles.activityName}>{item?.name || 'User'}</Text>
            </TouchableOpacity>
        );
    };

    const renderAddStory = () => {
        const profile = useSelector((state: any) => state.MainReducer.getProfileRes?.data || state.MainReducer.getProfileRes);
        const userImage = profile?.profile_image || profile?.image_path || 'https://via.placeholder.com/100';

        return (
            <View style={styles.activityColumn}>
                <TouchableOpacity
                    style={styles.addStoryContainer}
                    onPress={() => setIsAddStoryModalVisible(true)}
                >
                    <View style={styles.addStoryAvatarWrapper}>
                        <Image source={{ uri: userImage }} style={styles.activityImage} />
                        <View style={styles.plusIconBadge}>
                            <Text style={styles.plusText}>+</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Text style={styles.activityName}>You</Text>
            </View>
        );
    };

    // Custom visual static slider components
    const renderVisualSlider = (progressPercent: number) => (
        <View style={styles.sliderTrackContainer}>
            <View style={styles.sliderTrackBackground} />
            <View style={[styles.sliderTrackActive, { width: `${progressPercent}%` }]} />
            <View style={[styles.sliderThumb, { left: `${progressPercent}%` }]} />
        </View>
    );

    const renderVisualRangeSlider = (startPercent: number, endPercent: number) => (
        <View style={styles.sliderTrackContainer}>
            <View style={styles.sliderTrackBackground} />
            <View
                style={[
                    styles.sliderTrackActive,
                    { left: `${startPercent}%`, width: `${endPercent - startPercent}%` },
                ]}
            />
            <View style={[styles.sliderThumb, { left: `${startPercent}%` }]} />
            <View style={[styles.sliderThumb, { left: `${endPercent}%` }]} />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Messages</Text>
                <View style={styles.headerActionsFixed}>
                    <TouchableOpacity style={styles.headerBtn}>
                        <Image source={ICONS.search} style={styles.headerIcon} resizeMode="contain" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerBtn} onPress={() => setIsFilterVisible(true)}>
                        <Image source={ICONS.filter} style={styles.headerIcon} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Input */}
            <View style={styles.searchSection}>
                <View style={styles.searchInputWrapper}>
                    <Image source={ICONS.search} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for messages"
                        placeholderTextColor={COLORS.textTertiary}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    {searchTerm ? (
                        <TouchableOpacity onPress={() => setSearchTerm('')}>
                            <Text style={styles.clearText}>Clear</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
            >
                {/* Activities Section */}
                <Text style={styles.sectionTitle}>Activities</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.activitiesScroll}
                >
                    {renderAddStory()}
                    {getStatusesRes?.map(renderActivityRing)}
                </ScrollView>

                {/* Filters Section */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersScroll}
                >
                    {FILTERS.map((filter) => {
                        const isActive = activeFilter === filter;
                        return (
                            <TouchableOpacity
                                key={filter}
                                style={[styles.filterChip, isActive && styles.filterChipActive]}
                                onPress={() => setActiveFilter(filter)}
                            >
                                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Messages List */}
                <Text style={styles.sectionTitle}>Messages</Text>
                <View style={styles.messagesList}>
                    {isChatLoading && chatList.length === 0 ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.loadingText}>Loading chats...</Text>
                        </View>
                    ) : filteredChats.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyEmoji}>💬</Text>
                            <Text style={styles.emptyTitle}>No conversations yet</Text>
                            <Text style={styles.emptySubtitle}>
                                Match with someone and start chatting!
                            </Text>
                        </View>
                    ) : (
                        filteredChats.map((msg: any) => (
                            <TouchableOpacity
                                key={msg.id}
                                style={styles.messageRow}
                                activeOpacity={0.7}
                                onPress={() => handleChatPress(msg)}
                            >
                                <View style={styles.msgAvatarWrapper}>
                                    <Image source={{ uri: msg.image }} style={styles.msgAvatar} />
                                </View>

                                <View style={styles.msgDetails}>
                                    <View style={styles.msgTopRow}>
                                        <View style={styles.msgNameRow}>
                                            <Text style={styles.msgName}>{msg.name}</Text>
                                            {msg.isStarred && (
                                                <Image source={ICONS.star} style={styles.starIconSmall} resizeMode="contain" />
                                            )}
                                        </View>
                                        <Text style={styles.msgTime}>{msg.time}</Text>
                                    </View>

                                    <View style={styles.msgBottomRow}>
                                        <Text style={styles.msgText} numberOfLines={1}>
                                            {msg.message}
                                        </Text>
                                        {msg.unread > 0 && (
                                            <View style={styles.unreadBadge}>
                                                <Text style={styles.unreadText}>{msg.unread}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Filter Bottom Sheet Modal */}
            <Modal
                isVisible={isFilterVisible}
                onBackdropPress={() => setIsFilterVisible(false)}
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

                    <Text style={styles.filterSectionTitle}>Select</Text>
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

                    <View style={styles.sliderTitleRow}>
                        <Text style={styles.filterSectionTitle}>Distance</Text>
                        <Text style={styles.sliderValueText}>40km</Text>
                    </View>
                    {renderVisualSlider(45)}

                    <View style={{ height: mvs(25) }} />

                    <View style={styles.sliderTitleRow}>
                        <Text style={styles.filterSectionTitle}>Age</Text>
                        <Text style={styles.sliderValueText}>20-28</Text>
                    </View>
                    {renderVisualRangeSlider(15, 35)}

                    <View style={{ height: mvs(25) }} />

                    <Text style={styles.filterSectionTitle}>Others</Text>
                    <View style={styles.segmentedControlOutline}>
                        {['New matches', 'Online', 'Archived'].map((option) => {
                            const isActive = option === filterOthers;
                            return (
                                <TouchableOpacity
                                    key={option}
                                    style={[styles.segmentBtnOutline, isActive && styles.segmentBtnOutlineActive]}
                                    onPress={() => setFilterOthers(option)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.segmentTextOutline, isActive && styles.segmentTextOutlineActive]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity style={styles.applyBtn} onPress={() => setIsFilterVisible(false)}>
                        <Text style={styles.applyBtnText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Add Story Selection Modal */}
            <Modal
                isVisible={isAddStoryModalVisible}
                onBackdropPress={() => setIsAddStoryModalVisible(false)}
                style={styles.modalStyle}
                backdropOpacity={0.4}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHandle} />
                    <Text style={[styles.modalTitle, { alignSelf: 'center', marginBottom: mvs(20) }]}>Add to Story</Text>
                    <View style={styles.storyOptionRow}>
                        <TouchableOpacity style={styles.storyOptionBtn} onPress={handlePickImage}>
                            <View style={[styles.storyOptionIconBg, { backgroundColor: '#E3F2FD' }]}>
                                <Text style={{ fontSize: normalize(24) }}>🖼️</Text>
                            </View>
                            <Text style={styles.storyOptionText}>Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.storyOptionBtn} onPress={handlePickVideo}>
                            <View style={[styles.storyOptionIconBg, { backgroundColor: '#E1F5FE' }]}>
                                <Text style={{ fontSize: normalize(24) }}>📹</Text>
                            </View>
                            <Text style={styles.storyOptionText}>Video</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.storyOptionBtn} onPress={() => {
                            setIsAddStoryModalVisible(false);
                            setIsTextStoryModalVisible(true);
                        }}>
                            <View style={[styles.storyOptionIconBg, { backgroundColor: '#F3E5F5' }]}>
                                <Text style={{ fontSize: normalize(24) }}>✍️</Text>
                            </View>
                            <Text style={styles.storyOptionText}>Text</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Text Story Creation Modal */}
            <Modal
                isVisible={isTextStoryModalVisible}
                onBackdropPress={() => setIsTextStoryModalVisible(false)}
                style={{ margin: 0 }}
            >
                <View style={[styles.textStoryContainer, { backgroundColor: textStoryBg }]}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={styles.textStoryHeader}>
                            <TouchableOpacity onPress={() => setIsTextStoryModalVisible(false)}>
                                <Text style={styles.textStoryClose}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCreateTextStory}>
                                <View style={styles.textStoryDoneBtn}>
                                    <Text style={styles.textStoryDoneText}>Share</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.textStoryInputWrapper}>
                            <TextInput
                                style={styles.textStoryInput}
                                placeholder="Type something..."
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                multiline
                                value={textStoryContent}
                                onChangeText={setTextStoryContent}
                                autoFocus
                            />
                        </View>

                        <View style={styles.colorPickerContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {['#FF30BB', '#FF9D33', '#007AFF', '#34A853', '#EB001B', '#000000', '#9C27B0', '#607D8B'].map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        style={[styles.colorCircle, { backgroundColor: color }, textStoryBg === color && styles.colorCircleActive]}
                                        onPress={() => setTextStoryBg(color)}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// Helper to format time ago
function formatTimeAgo(dateString: string): string {
    try {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMs / 36000000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'now';
        if (diffMins < 60) return `${diffMins} min`;
        if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''}`;
        if (diffDays < 7) return `${diffDays}d`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
        return '';
    }
}

export default Messages;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: mvs(10),
        paddingBottom: mvs(15),
    },
    headerTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(32),
        color: COLORS.black,
    },
    headerActionsFixed: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerBtn: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        marginLeft: ms(10),
    },
    headerIcon: {
        width: ms(20),
        height: ms(20),
        tintColor: COLORS.black,
    },
    searchSection: {
        paddingHorizontal: ms(20),
        marginBottom: mvs(20),
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: ms(15),
        paddingHorizontal: ms(15),
        height: mvs(50),
    },
    searchIcon: {
        width: ms(18),
        height: ms(18),
        tintColor: COLORS.textTertiary,
    },
    searchInput: {
        flex: 1,
        marginLeft: ms(10),
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.black,
    },
    clearText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(12),
        color: COLORS.primary,
    },
    scrollContent: {
        paddingBottom: mvs(100),
    },
    sectionTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: COLORS.black,
        paddingHorizontal: ms(20),
        marginBottom: mvs(15),
    },
    activitiesScroll: {
        paddingHorizontal: ms(15),
        marginBottom: mvs(25),
    },
    activityColumn: {
        alignItems: 'center',
        marginHorizontal: ms(8),
    },
    ringContainer: {
        width: ms(66),
        height: ms(66),
        borderRadius: ms(33),
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringInnerSpace: {
        width: ms(62),
        height: ms(62),
        borderRadius: ms(31),
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityImage: {
        width: ms(56),
        height: ms(56),
        borderRadius: ms(28),
    },
    activityName: {
        fontFamily: FONTS.semiBold,
        fontSize: normalize(12),
        color: COLORS.black,
        marginTop: mvs(8),
    },
    addStoryContainer: {
        alignItems: 'center',
    },
    addStoryAvatarWrapper: {
        width: ms(66),
        height: ms(66),
        borderRadius: ms(33),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    plusIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: ms(22),
        height: ms(22),
        borderRadius: ms(11),
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    plusText: {
        color: COLORS.white,
        fontSize: normalize(14),
        fontFamily: FONTS.bold,
        marginTop: -ms(2),
    },
    filtersScroll: {
        paddingHorizontal: ms(20),
        marginBottom: mvs(25),
    },
    filterChip: {
        paddingHorizontal: ms(15),
        paddingVertical: mvs(8),
        borderRadius: ms(8),
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        marginRight: ms(12),
        backgroundColor: COLORS.white,
    },
    filterChipActive: {
        borderColor: COLORS.primary,
    },
    filterText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.textTertiary,
    },
    filterTextActive: {
        fontFamily: FONTS.semiBold,
        color: COLORS.primary,
    },
    messagesList: {
        paddingHorizontal: ms(20),
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: mvs(20),
    },
    msgAvatarWrapper: {
        width: ms(55),
        height: ms(55),
        borderRadius: ms(27.5),
        borderWidth: 2,
        borderColor: COLORS.primary,
        padding: ms(2),
    },
    msgAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: ms(25),
    },
    msgDetails: {
        flex: 1,
        marginLeft: ms(15),
    },
    msgTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: mvs(4),
    },
    msgNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    msgName: {
        fontFamily: FONTS.bold,
        fontSize: normalize(15),
        color: COLORS.black,
    },
    starIconSmall: {
        width: ms(12),
        height: ms(12),
        tintColor: '#FF9500',
        marginLeft: ms(5),
    },
    msgTime: {
        fontFamily: FONTS.regular,
        fontSize: normalize(11),
        color: COLORS.textTertiary,
    },
    msgBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    msgText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(13),
        color: COLORS.textTertiary,
        flex: 1,
        marginRight: ms(15),
    },
    unreadBadge: {
        width: ms(20),
        height: ms(20),
        borderRadius: ms(10),
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(10),
        color: COLORS.white,
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
        backgroundColor: COLORS.primary,
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
        backgroundColor: '#FAFAFA',
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
        backgroundColor: COLORS.primary,
        borderRadius: ms(2),
        position: 'absolute',
    },
    sliderThumb: {
        position: 'absolute',
        width: ms(24),
        height: ms(24),
        borderRadius: ms(12),
        backgroundColor: COLORS.white,
        top: '50%',
        marginTop: -ms(12),
        marginLeft: -ms(12),
        borderWidth: 2,
        borderColor: COLORS.primary,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    applyBtn: {
        height: mvs(55),
        width: '100%',
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: ms(16),
    },
    applyBtnText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: COLORS.white,
    },
    storyOptionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: mvs(20),
    },
    storyOptionBtn: {
        alignItems: 'center',
    },
    storyOptionIconBg: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: mvs(10),
    },
    storyOptionText: {
        fontFamily: FONTS.semiBold,
        fontSize: normalize(14),
        color: COLORS.black,
    },
    textStoryContainer: {
        flex: 1,
    },
    textStoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: mvs(20),
    },
    textStoryClose: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: COLORS.white,
    },
    textStoryDoneBtn: {
        paddingHorizontal: ms(20),
        paddingVertical: mvs(8),
        borderRadius: ms(20),
        backgroundColor: COLORS.white,
    },
    textStoryDoneText: {
        fontFamily: FONTS.bold,
        fontSize: normalize(14),
        color: COLORS.black,
    },
    textStoryInputWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ms(40),
    },
    textStoryInput: {
        fontFamily: FONTS.bold,
        fontSize: normalize(32),
        color: COLORS.white,
        textAlign: 'center',
        width: '100%',
    },
    colorPickerContainer: {
        paddingVertical: mvs(30),
        paddingHorizontal: ms(20),
    },
    colorCircle: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        marginHorizontal: ms(8),
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorCircleActive: {
        borderColor: COLORS.white,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: mvs(40),
    },
    loadingText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(13),
        color: COLORS.textTertiary,
        marginTop: mvs(10),
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: mvs(40),
    },
    emptyEmoji: {
        fontSize: normalize(40),
        marginBottom: mvs(10),
    },
    emptyTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(16),
        color: COLORS.black,
        marginBottom: mvs(5),
    },
    emptySubtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(13),
        color: COLORS.textTertiary,
        textAlign: 'center',
        paddingHorizontal: ms(40),
    },
});