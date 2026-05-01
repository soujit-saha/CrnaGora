import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { goBack, navigate } from '../../utils/helper/RootNavigation';

const CHAT_HISTORY = [
    {
        id: '1',
        text: "Hi Jake, how are you? I saw on the app that we've crossed paths several times this week 😊",
        time: '2:55 PM',
        isSender: false,
    },
    {
        id: '2',
        text: 'Haha truly! Nice to meet you Grace! What about a cup of coffee today evening? ☕',
        time: '3:02 PM',
        isSender: true,
        isRead: true,
    },
    {
        id: '3',
        text: "Sure, let's do it! 😋",
        time: '3:10 PM',
        isSender: false,
    },
    {
        id: '4',
        text: 'Great I will write later the exact time and place. See you soon!',
        time: '3:12 PM',
        isSender: true,
        isRead: true,
    },
];

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

const Chat = () => {
    const [message, setMessage] = useState('');
    const [showMenu, setShowMenu] = useState(false);

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
                                source={{
                                    uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                                }}
                                style={styles.avatarImage}
                            />
                        </View>
                    </LinearGradient>
                    <View style={styles.headerTitles}>
                        <Text style={styles.headerName}>Grace</Text>
                        <Text style={styles.headerStatus}>Online</Text>
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
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.bodyWrapper}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Timeline separator */}
                        <View style={styles.timeDividerRow}>
                            <View style={styles.timeDividerLine} />
                            <Text style={styles.timeDividerText}>Today</Text>
                            <View style={styles.timeDividerLine} />
                        </View>

                        {/* Chat Bubbles Map */}
                        {CHAT_HISTORY.map((msg) => {
                            const isMe = msg.isSender;

                            return (
                                <View
                                    key={msg.id}
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
                                        <Text style={styles.messageText}>{msg.text}</Text>
                                    </View>

                                    {/* Meta Row (Time + Read receipt) */}
                                    <View
                                        style={[
                                            styles.metaRow,
                                            isMe ? styles.metaRowSender : styles.metaRowReceiver,
                                        ]}
                                    >
                                        <Text style={styles.timeText}>{msg.time}</Text>
                                        {isMe && msg.isRead && (
                                            <Image source={ICONS.checkSmall} style={styles.readIcon} resizeMode="contain" />
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Options Menu Overlay */}
                    {showMenu && (
                        <View style={styles.menuOverlayContainer}>
                            {/* <TouchableOpacity
                                style={StyleSheet.absoluteFill}
                                activeOpacity={1}
                                onPress={() => setShowMenu(false)}
                            >
                                <View style={styles.menuFadeBackground} />
                            </TouchableOpacity> */}

                            <LinearGradient
                                colors={['#FAFAFA', '#FFE3F6']}
                                // style={StyleSheet.absoluteFill}
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
                    <View style={styles.inputContainer}>
                        <View style={styles.textInputWrapper}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Your message"
                                placeholderTextColor={COLORS.textTertiary}
                                value={message}
                                onChangeText={setMessage}
                            />
                            <TouchableOpacity style={styles.stickerBtn}>
                                <Image source={ICONS.stickers} style={styles.stickerIcon} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.micBtn}>
                            <Text style={{ fontSize: normalize(18) }}>🎤</Text>
                        </TouchableOpacity>
                    </View>
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
        zIndex: 10, // Ensure header is above menu overlay theoretically
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
        borderColor: '#FF99D6', // Active pink border
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
    timeDividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: mvs(20),
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
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: ms(20),
        paddingBottom: mvs(20),
        paddingTop: mvs(10),
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        zIndex: 1,
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

    /* Options Menu Styling */
    menuOverlayContainer: {
        ...StyleSheet.absoluteFill,
        zIndex: 10,
        alignItems: 'center',
        // borderBottomLeftRadius: ms(30),
        // borderBottomRightRadius: ms(30),
    },
    menuFadeBackground: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
    menuOuterBox: {
        position: 'absolute',
        top: 0,
        width: '100%', // Almost full width wrapper
        // backgroundColor: '#FFE3F6', // The thick light pink border ring mapping
        borderBottomLeftRadius: ms(30),
        borderBottomRightRadius: ms(30),
        padding: ms(12), // acts as the border width
        paddingTop: 0, // no top border in mock
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
