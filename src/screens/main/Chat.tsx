import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    PermissionsAndroid,
} from 'react-native';
import Sound from 'react-native-nitro-sound';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import {
    chatMessagesRequest,
    sendMessageRequest,
    appendNewMessage,
    clearChatMessages,
    startChatRequest,
} from '../../redux/reducer/MainReducer';
import { launchImageLibrary } from 'react-native-image-picker';
import { subscribeToChatChannel } from '../../utils/helper/PusherService';

const MENU_OPTIONS = [
    'View Profile',
    'Block',
    'Archive',
    'Unmatch',
    'Clear Chat',
    'Mute Notifications',
    'Add to Favorites',
    'Search',
];

const Chat = ({ route }: any) => {
    const { chatId: initialChatId, userId, userName, userImage } = route?.params || {};

    const [message, setMessage] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [chatId, setChatId] = useState(initialChatId);
    const [isSending, setIsSending] = useState(false);

    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [isRecordingPaused, setIsRecordingPaused] = useState(false);
    const [recordTime, setRecordTime] = useState('0:00');
    const [audioPath, setAudioPath] = useState<string | null>(null);

    // Audio playback state
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            try {
                Sound.stopPlayer();
                Sound.removePlaybackEndListener();
            } catch (e) {}
        };
    }, []);

    const handleToggleAudio = useCallback(async (msgId: string, url: string) => {
        try {
            if (playingAudioId === msgId) {
                await Sound.pausePlayer();
                setPlayingAudioId(null);
            } else {
                if (playingAudioId) {
                    await Sound.stopPlayer();
                    Sound.removePlaybackEndListener();
                }
                await Sound.startPlayer(url);
                setPlayingAudioId(msgId);
                Sound.addPlaybackEndListener(() => {
                    setPlayingAudioId(null);
                    Sound.removePlaybackEndListener();
                });
            }
        } catch (error) {
            console.error('Audio playback error:', error);
            setPlayingAudioId(null);
        }
    }, [playingAudioId]);

    const requestMicrophonePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: 'Microphone Permission',
                        message: 'App needs access to your microphone to record audio.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const handleStartRecording = async () => {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) return;
        try {
            const result = await Sound.startRecorder();
            Sound.addRecordBackListener((e: any) => {
                setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
            });
            setAudioPath(result);
            setIsRecording(true);
            setIsRecordingPaused(false);
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    };

    const handleStopRecording = async () => {
        try {
            const result = await Sound.stopRecorder();
            Sound.removeRecordBackListener();
            setIsRecordingPaused(true);
            setAudioPath(result);
        } catch (error) {
            console.error('Failed to stop recording:', error);
        }
    };

    const handleCancelRecording = async () => {
        if (!isRecordingPaused) {
            try { await Sound.stopRecorder(); Sound.removeRecordBackListener(); } catch (err) { }
        }
        setIsRecording(false);
        setIsRecordingPaused(false);
        setRecordTime('0:00');
        setAudioPath(null);
    };

    const handleSendRecording = async () => {
        let finalPath = audioPath;
        if (!isRecordingPaused) {
            try {
                finalPath = await Sound.stopRecorder();
                Sound.removeRecordBackListener();
            } catch (err) { }
        }

        setIsRecording(false);
        setIsRecordingPaused(false);
        setRecordTime('0:00');
        setAudioPath(null);

        if (finalPath && chatId) {
            const uri = Platform.OS === 'android' && !finalPath.startsWith('file://') ? `file://${finalPath}` : finalPath;
            const optimisticMsg = {
                id: `temp_${Date.now()}`,
                chat_id: chatId,
                sender_id: currentUserId,
                type: 'recorded_audio',
                message: '',
                attachment: uri,
                created_at: new Date().toISOString(),
                sender: {
                    id: currentUserId,
                    name: 'You',
                },
            };
            dispatch(appendNewMessage(optimisticMsg));

            dispatch(sendMessageRequest({
                chatId,
                type: 'recorded_audio',
                attachment: {
                    uri: uri,
                    name: `audio_${Date.now()}.mp4`,
                    type: 'audio/mp4',
                },
            }));
        }
    };

    const flatListRef = useRef<FlatList>(null);
    const dispatch = useDispatch();

    const { chatMessagesRes, isChatLoading, sendMessageRes, startChatRes, status } = useSelector(
        (state: any) => state.MainReducer,
    );
    const currentUserId = useSelector((state: any) => {
        const profile = state.MainReducer.getProfileRes;
        return profile?.data?.id || profile?.id || null;
    });
    const authToken = useSelector((state: any) => state.AuthReducer.getTokenResponse);

    // // If no chatId was provided, start a chat first
    // useEffect(() => {
    //     if (!chatId && userId) {
    //         dispatch(startChatRequest({ user_ids: [userId] }));
    //     }
    // }, []);

    // Handle startChat success
    useEffect(() => {
        if (status === 'Main/startChatSuccess' && startChatRes?.id && !chatId) {
            setChatId(startChatRes.id);
        }
    }, [status, startChatRes]);

    // Load messages when chatId is available
    useEffect(() => {
        if (chatId) {
            dispatch(chatMessagesRequest({ chatId }));
        }
        return () => {
            dispatch(clearChatMessages());
        };
    }, [chatId]);

    // Pusher real-time subscription
    useEffect(() => {
        if (!chatId || !authToken) return;

        const unsubscribe = subscribeToChatChannel(
            chatId,
            authToken,
            (newMessage: any) => {
                console.log('[Chat] Pusher message received, refreshing messages');
                // Optional: Alert.alert('New Message', 'Refreshing...');
                // Refresh messages from server to get the latest state
                dispatch(chatMessagesRequest({ chatId }));
            },
        );

        return () => {
            unsubscribe();
        };
    }, [chatId, authToken]);

    // Handle send success — reload messages from server
    useEffect(() => {
        if (status === 'Main/sendMessageSuccess' && sendMessageRes) {
            setIsSending(false);
            // Reload messages after sending to get the server version
            if (chatId) {
                dispatch(chatMessagesRequest({ chatId }));
            }
        }
    }, [status, sendMessageRes]);

    // Parse messages array — handle various API response shapes
    const messages = React.useMemo(() => {
        console.log('chatMessagesRes raw:', JSON.stringify(chatMessagesRes)?.substring(0, 300));

        if (!chatMessagesRes) return [];

        // If it's already an array, use it
        if (Array.isArray(chatMessagesRes)) return chatMessagesRes;

        // If it's { data: [...] }
        if (chatMessagesRes?.data && Array.isArray(chatMessagesRes.data)) {
            return chatMessagesRes.data;
        }

        // If it's { data: { data: [...] } }  (paginated)
        if (chatMessagesRes?.data?.data && Array.isArray(chatMessagesRes.data.data)) {
            return chatMessagesRes.data.data;
        }

        return [];
    }, [chatMessagesRes]);

    const handleSendMessage = () => {
        if (!message.trim() || !chatId) return;

        const msgText = message.trim();
        setMessage('');
        setIsSending(true);

        // Optimistic UI — append message immediately
        const optimisticMsg = {
            id: `temp_${Date.now()}`,
            chat_id: chatId,
            sender_id: currentUserId,
            type: 'text',
            message: msgText,
            attachment: null,
            created_at: new Date().toISOString(),
            sender: {
                id: currentUserId,
                name: 'You',
            },
        };
        dispatch(appendNewMessage(optimisticMsg));

        // Dispatch actual API call
        dispatch(sendMessageRequest({
            chatId,
            type: 'text',
            message: msgText,
        }));
    };

    const handleSendImage = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.8 },
            (response) => {
                if (response.didCancel || response.errorCode) return;
                const asset = response.assets?.[0];
                if (asset && chatId) {
                    // Optimistic update for image
                    const optimisticMsg = {
                        id: `temp_${Date.now()}`,
                        chat_id: chatId,
                        sender_id: currentUserId,
                        type: 'image',
                        message: '',
                        attachment: asset.uri, // Use local URI for immediate display
                        created_at: new Date().toISOString(),
                        sender: {
                            id: currentUserId,
                            name: 'You',
                        },
                    };
                    dispatch(appendNewMessage(optimisticMsg));

                    dispatch(sendMessageRequest({
                        chatId,
                        type: 'image',
                        attachment: {
                            uri: asset.uri,
                            name: asset.fileName || 'image.jpg',
                            type: asset.type || 'image/jpeg',
                        },
                    }));
                }
            },
        );
    };

    const handleSendVideo = () => {
        launchImageLibrary(
            { mediaType: 'video' },
            (response) => {
                if (response.didCancel || response.errorCode) return;
                const asset = response.assets?.[0];
                if (asset && chatId) {
                    // Optimistic update for video
                    const optimisticMsg = {
                        id: `temp_${Date.now()}`,
                        chat_id: chatId,
                        sender_id: currentUserId,
                        type: 'video',
                        message: '',
                        attachment: asset.uri,
                        created_at: new Date().toISOString(),
                        sender: {
                            id: currentUserId,
                            name: 'You',
                        },
                    };
                    dispatch(appendNewMessage(optimisticMsg));

                    dispatch(sendMessageRequest({
                        chatId,
                        type: 'video',
                        attachment: {
                            uri: asset.uri,
                            name: asset.fileName || 'video.mp4',
                            type: asset.type || 'video/mp4',
                        },
                    }));
                }
            },
        );
    };

    // Group messages by date for separators
    const getDateLabel = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === today.toDateString()) return 'Today';
            if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return '';
        }
    };

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    const renderMessage = useCallback(({ item: msg, index }: { item: any; index: number }) => {
        const isMe = msg.sender_id === currentUserId;
        const time = formatTime(msg.created_at);

        // Date separator
        let showDateSeparator = false;
        if (index === 0) {
            showDateSeparator = true;
        } else {
            const prevDate = new Date(messages[index - 1]?.created_at).toDateString();
            const currDate = new Date(msg.created_at).toDateString();
            if (prevDate !== currDate) {
                showDateSeparator = true;
            }
        }

        // Render attachment
        let attachmentEl = null;
        if (msg.attachment) {
            const attachUrl = msg.attachment.startsWith('http')
                ? msg.attachment
                : `https://tinder.swastechinfo.in/storage/${msg.attachment}`;

            if (msg.type === 'image') {
                attachmentEl = (
                    <Image
                        source={{ uri: attachUrl }}
                        style={styles.attachmentImage}
                        resizeMode="cover"
                    />
                );
            } else if (msg.type === 'video') {
                attachmentEl = (
                    <View style={styles.videoPlayerContainer}>
                        <Video
                            source={{ uri: attachUrl }}
                            style={styles.videoPlayer}
                            controls={true}
                            resizeMode="contain"
                            paused={true}
                        />
                    </View>
                );
            } else if (msg.type === 'audio' || msg.type === 'recorded_audio') {
                const isPlaying = playingAudioId === msg.id;
                attachmentEl = (
                    <TouchableOpacity 
                        style={styles.audioActionBtn} 
                        onPress={() => handleToggleAudio(msg.id, attachUrl)}
                    >
                        <Text style={styles.audioActionIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
                        <Text style={styles.audioActionText}>
                            {isPlaying ? 'Playing...' : 'Play Audio'}
                        </Text>
                    </TouchableOpacity>
                );
            }
        }

        return (
            <View>
                {showDateSeparator && (
                    <View style={styles.timeDividerRow}>
                        <View style={styles.timeDividerLine} />
                        <Text style={styles.timeDividerText}>{getDateLabel(msg.created_at)}</Text>
                        <View style={styles.timeDividerLine} />
                    </View>
                )}

                <View
                    style={[
                        styles.messageWrapper,
                        isMe ? styles.messageWrapperSender : styles.messageWrapperReceiver,
                    ]}
                >
                    <View
                        style={[
                            styles.bubble,
                            isMe ? styles.bubbleSender : styles.bubbleReceiver,
                        ]}
                    >
                        {attachmentEl}
                        {msg.message ? (
                            <Text style={styles.messageText}>{msg.message}</Text>
                        ) : null}
                    </View>

                    {/* Meta Row (Time + Read receipt) */}
                    <View
                        style={[
                            styles.metaRow,
                            isMe ? styles.metaRowSender : styles.metaRowReceiver,
                        ]}
                    >
                        <Text style={styles.timeText}>{time}</Text>
                        {isMe && (
                            <Image source={ICONS.checkSmall} style={styles.readIcon} resizeMode="contain" />
                        )}
                    </View>
                </View>
            </View>
        );
    }, [currentUserId, messages, playingAudioId, handleToggleAudio]);

    const displayName = userName || 'Chat';
    const displayImage = userImage || 'https://via.placeholder.com/100';

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Container */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => goBack()}>
                    <Image source={ICONS.back} style={styles.backIcon} resizeMode="contain" />
                </TouchableOpacity>

                {/* Center Profile Block */}
                <View style={styles.headerCenter}>
                    <LinearGradient
                        colors={['#FF9D33', COLORS.primary]}
                        style={styles.avatarRing}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.avatarInner}>
                            <Image
                                source={{ uri: displayImage }}
                                style={styles.avatarImage}
                            />
                        </View>
                    </LinearGradient>
                    <View style={styles.headerTitles}>
                        <Text style={styles.headerName}>{displayName}</Text>
                        {/* <Text style={styles.headerStatus}>Online</Text> */}

                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.moreBtn, showMenu && styles.moreBtnActive]}
                    onPress={() => setShowMenu(!showMenu)}
                    activeOpacity={0.7}
                >
                    <Image source={ICONS.threeDot} style={styles.moreIcon} resizeMode="contain" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? mvs(10) : mvs(10)}
            >
                <View style={styles.bodyWrapper}>
                    {/* Messages List */}
                    {isChatLoading && messages.length === 0 ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : messages.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyEmoji}>👋</Text>
                            <Text style={styles.emptyTitle}>Start the conversation</Text>
                            <Text style={styles.emptySubtitle}>Say hello to {displayName}!</Text>
                        </View>
                    ) : (
                        <FlatList
                            ref={flatListRef}
                            data={[...messages]}
                            inverted
                            renderItem={renderMessage}
                            keyExtractor={(item, index) => item.id?.toString() || `msg_${index}`}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    {/* Options Menu Overlay */}
                    {showMenu && (
                        <View style={styles.menuOverlayContainer}>
                            <LinearGradient
                                colors={['#FAFAFA', '#FFE3F6']}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 0, y: 1 }}
                                style={styles.menuOuterBox}
                            >
                                <View style={styles.menuInnerBox}>
                                    {MENU_OPTIONS.map((opt, index) => (
                                        <View key={opt}>
                                            <TouchableOpacity
                                                style={styles.menuItem}
                                                onPress={() => {
                                                    setShowMenu(false);
                                                    if (opt === 'View Profile') navigate('UserProfile');
                                                }}
                                            >
                                                <Text style={styles.menuItemText}>{opt}</Text>
                                            </TouchableOpacity>
                                            {index < MENU_OPTIONS.length - 1 && <View style={styles.menuDivider} />}
                                        </View>
                                    ))}
                                </View>
                            </LinearGradient>
                        </View>
                    )}

                    {/* Input Area */}
                    {isRecording ? (
                        <View style={styles.recordingWrapper}>
                            <View style={styles.recordingTopRow}>
                                <Text style={styles.recordingTimeText}>{recordTime}</Text>
                                <View style={styles.waveformContainer}>
                                    {[...Array(25)].map((_, i) => (
                                        <View key={i} style={[styles.waveBar, { height: Math.max(4, Math.random() * 24) }]} />
                                    ))}
                                </View>
                            </View>
                            <View style={styles.recordingBottomRow}>
                                <TouchableOpacity onPress={handleCancelRecording} style={styles.recordingActionBtn}>
                                    <Image source={ICONS.delete} style={styles.recordingActionIcon} resizeMode="contain" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={isRecordingPaused ? handleStartRecording : handleStopRecording} style={styles.recordingActionBtn}>
                                    <Text style={{ fontSize: normalize(20), color: '#FF6B6B' }}>{isRecordingPaused ? '▶️' : '⏹️'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSendRecording} style={styles.sendRecordingBtn}>
                                    <Image source={ICONS.send} style={{ ...styles.sendIcon, tintColor: COLORS.white }} resizeMode="contain" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.inputContainer}>
                            {/* Attachment buttons */}
                            {/* <TouchableOpacity style={styles.attachBtn} onPress={handleSendImage}>
                            <Text style={{ fontSize: normalize(18) }}>📷</Text>
                        </TouchableOpacity> */}

                            <View style={styles.textInputWrapper}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Your message"
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={message}
                                    onChangeText={setMessage}
                                    multiline={false}
                                    returnKeyType="send"
                                    onSubmitEditing={handleSendMessage}
                                />
                                <TouchableOpacity style={styles.stickerBtn} onPress={handleSendImage}>
                                    <Image source={ICONS.stickers} style={styles.stickerIcon} resizeMode="contain" />
                                </TouchableOpacity>
                            </View>

                            {message.trim() ? (
                                <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                                    <Image source={ICONS.send} style={{ ...styles.sendIcon, tintColor: COLORS.white }} resizeMode="contain" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.micBtn} onPress={handleStartRecording}>
                                    <Image source={ICONS.karaoke} style={styles.sendIcon} resizeMode="contain" />

                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Chat;

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
        paddingBottom: mvs(15),
        backgroundColor: '#FAFAFA',
        zIndex: 10,
    },
    backBtn: {
        width: ms(30),
        height: mvs(30),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    backIcon: {
        width: ms(22),
        height: ms(22),
        tintColor: COLORS.black,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: ms(10),
    },
    avatarRing: {
        width: ms(48),
        height: ms(48),
        borderRadius: ms(24),
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInner: {
        width: ms(44),
        height: ms(44),
        borderRadius: ms(22),
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
    },
    headerTitles: {
        marginLeft: ms(10),
    },
    headerName: {
        fontFamily: FONTS.bold,
        fontSize: normalize(18),
        color: COLORS.black,
    },
    headerStatus: {
        fontFamily: FONTS.regular,
        fontSize: normalize(11),
        color: COLORS.textTertiary,
    },
    moreBtn: {
        width: ms(45),
        height: ms(45),
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    moreBtnActive: {
        borderColor: '#FF99D6',
    },
    moreIcon: {
        width: ms(20),
        height: ms(20),
        tintColor: COLORS.black,
    },
    bodyWrapper: {
        flex: 1,
        position: 'relative',
    },
    scrollContent: {
        paddingHorizontal: ms(20),
        paddingTop: mvs(15),
        paddingBottom: mvs(20),
    },

    // Loading / Empty
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyEmoji: {
        fontSize: normalize(40),
        marginBottom: mvs(10),
    },
    emptyTitle: {
        fontFamily: FONTS.bold,
        fontSize: normalize(18),
        color: COLORS.black,
        marginBottom: mvs(5),
    },
    emptySubtitle: {
        fontFamily: FONTS.regular,
        fontSize: normalize(13),
        color: COLORS.textTertiary,
    },

    // Date Divider
    timeDividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: mvs(20),
        marginTop: mvs(10),
    },
    timeDividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.borderLight,
    },
    timeDividerText: {
        marginHorizontal: ms(10),
        fontFamily: FONTS.regular,
        fontSize: normalize(12),
        color: COLORS.textTertiary,
    },

    // Messages
    messageWrapper: {
        marginBottom: mvs(20),
        maxWidth: '85%',
    },
    messageWrapperSender: {
        alignSelf: 'flex-end',
    },
    messageWrapperReceiver: {
        alignSelf: 'flex-start',
    },
    bubble: {
        paddingHorizontal: ms(16),
        paddingVertical: mvs(12),
    },
    bubbleSender: {
        backgroundColor: '#F2F2F2',
        borderTopLeftRadius: ms(15),
        borderTopRightRadius: ms(15),
        borderBottomLeftRadius: ms(15),
        borderBottomRightRadius: 0,
    },
    bubbleReceiver: {
        backgroundColor: '#FFF0F8',
        borderTopLeftRadius: ms(15),
        borderTopRightRadius: ms(15),
        borderBottomRightRadius: ms(15),
        borderBottomLeftRadius: 0,
    },
    messageText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.black,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: mvs(5),
    },
    metaRowSender: {
        justifyContent: 'flex-end',
    },
    metaRowReceiver: {
        justifyContent: 'flex-start',
    },
    timeText: {
        fontFamily: FONTS.regular,
        fontSize: normalize(10),
        color: COLORS.textTertiary,
    },
    readIcon: {
        width: ms(12),
        height: ms(12),
        tintColor: '#FF99D6',
        marginLeft: ms(4),
    },

    // Attachments
    attachmentImage: {
        width: ms(200),
        height: ms(200),
        borderRadius: ms(12),
        marginBottom: mvs(5),
    },
    videoPlayerContainer: {
        width: ms(200),
        height: ms(200),
        borderRadius: ms(12),
        backgroundColor: '#000',
        overflow: 'hidden',
        marginBottom: mvs(5),
    },
    videoPlayer: {
        width: '100%',
        height: '100%',
    },
    audioActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: mvs(10),
        paddingHorizontal: ms(15),
        borderRadius: ms(8),
        backgroundColor: '#E8F5E9',
        marginBottom: mvs(5),
        minWidth: ms(140),
    },
    audioActionIcon: {
        fontSize: normalize(16),
        marginRight: ms(8),
    },
    audioActionText: {
        fontFamily: FONTS.medium,
        fontSize: normalize(12),
        color: COLORS.black,
    },

    // Input
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: ms(20),
        paddingBottom: mvs(20),
        paddingTop: mvs(10),
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        zIndex: 1,
    },
    attachBtn: {
        width: ms(40),
        height: ms(40),
        borderRadius: ms(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
    },
    textInputWrapper: {
        flex: 1,
        height: mvs(50),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: ms(25),
        borderWidth: 1,
        borderColor: '#EAEAEA',
        paddingHorizontal: ms(15),
        marginRight: ms(10),
    },
    textInput: {
        flex: 1,
        height: '100%',
        fontFamily: FONTS.regular,
        fontSize: normalize(14),
        color: COLORS.black,
    },
    stickerBtn: {
        padding: ms(5),
    },
    stickerIcon: {
        width: ms(20),
        height: ms(20),
        tintColor: COLORS.textTertiary,
    },
    sendBtn: {
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        // elevation: 4,
        // shadowColor: COLORS.primary,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.3,
        // shadowRadius: 5,
    },
    sendIcon: {
        width: ms(20),
        height: ms(20),
        // tintColor: COLORS.white,
    },
    micBtn: {
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#FF99D6',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#FF99D6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    recordingWrapper: {
        paddingHorizontal: ms(20),
        paddingBottom: mvs(20),
        paddingTop: mvs(15),
        backgroundColor: '#1C1C1C',
        borderTopLeftRadius: ms(20),
        borderTopRightRadius: ms(20),
        zIndex: 1,
    },
    recordingTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: mvs(20),
        paddingHorizontal: ms(10),
    },
    recordingTimeText: {
        color: COLORS.white,
        fontFamily: FONTS.medium,
        fontSize: normalize(16),
        width: ms(50),
    },
    waveformContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: mvs(30),
        marginHorizontal: ms(10),
    },
    waveBar: {
        width: ms(3),
        backgroundColor: '#A0AAB5',
        marginHorizontal: ms(2),
        borderRadius: ms(1.5),
    },
    recordingBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(10),
    },
    recordingActionBtn: {
        padding: ms(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingActionIcon: {
        width: ms(24),
        height: ms(24),
        tintColor: '#A0AAB5',
    },
    sendRecordingBtn: {
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* Options Menu Styling */
    menuOverlayContainer: {
        // ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        alignItems: 'center',
    },
    menuFadeBackground: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
    menuOuterBox: {
        position: 'absolute',
        top: 0,
        width: '100%',
        borderBottomLeftRadius: ms(30),
        borderBottomRightRadius: ms(30),
        padding: ms(12),
        paddingTop: 0,
    },
    menuInnerBox: {
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: ms(22),
        borderBottomRightRadius: ms(22),
        paddingVertical: mvs(5),
        paddingHorizontal: ms(20),
    },
    menuItem: {
        paddingVertical: mvs(15),
    },
    menuItemText: {
        fontFamily: FONTS.medium,
        fontSize: normalize(14),
        color: COLORS.black,
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#EAEAEA',
        width: '100%',
    },
});
