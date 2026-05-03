import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  startChatRequest,
  sendMessageRequest,
} from '../../redux/reducer/MainReducer';

const OPENERS = [
  { id: '1', text: 'Hello!' },
  { id: '2', text: 'Hi!' },
  { id: '3', text: 'You caught my eye' },
  { id: '4', text: "I'm curious—what made you join this app?" },
  { id: '5', text: 'Loved your vibe ✨' },
  { id: '6', text: 'Tell me something you value' },
  { id: '7', text: 'Should we talk? 😁' },
  { id: '8', text: "What's up?" },
  { id: '9', text: 'Your smile... wow 😍' },
  { id: '10', text: "What's your mood today? 🎧" },
  { id: '11', text: "So... what's the cutest thing about you?" },
  { id: '12', text: 'Your turn to say hi 😄' },
  { id: '13', text: 'Match made right? 💘' },
];

const ChatPreview = ({ route }: any) => {
  const matchUser = route?.params?.matchUser;
  const [selectedOpener, setSelectedOpener] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const dispatch = useDispatch();
  const { startChatRes, status } = useSelector((state: any) => state.MainReducer);

  // Listen for startChat success to navigate
  useEffect(() => {
    if (status === 'Main/startChatSuccess' && startChatRes?.id && isStarting) {
      const chatId = startChatRes.id;
      setIsStarting(false);

      // If we had a selected opener, send it as the first message
      const openerText = OPENERS.find(o => o.id === selectedOpener)?.text;
      if (openerText) {
        dispatch(sendMessageRequest({
          chatId,
          type: 'text',
          message: openerText,
        }));
      }

      // Navigate to Chat screen
      navigate('Chat', {
        chatId,
        userId: matchUser?.id,
        userName: matchUser?.name,
        userImage: matchUser?.profile_image,
      });
    }
  }, [status, startChatRes]);

  const handleContinue = () => {
    if (!matchUser?.id || !selectedOpener) return;
    setIsStarting(true);
    dispatch(startChatRequest({ user_id: matchUser.id }));
  };

  const handleCustomMessage = () => {
    if (!matchUser?.id) return;
    setIsStarting(true);
    dispatch(startChatRequest({ user_id: matchUser.id }));
  };

  // Handle custom message flow — navigate to Chat without sending opener
  useEffect(() => {
    if (status === 'Main/startChatSuccess' && startChatRes?.id && isStarting && !selectedOpener) {
      const chatId = startChatRes.id;
      setIsStarting(false);
      navigate('Chat', {
        chatId,
        userId: matchUser?.id,
        userName: matchUser?.name,
        userImage: matchUser?.profile_image,
      });
    }
  }, [status, startChatRes, selectedOpener, isStarting]);

  const userName = matchUser?.name || 'User';
  const userAge = matchUser?.age || '';
  const userImage = matchUser?.profile_image || 'https://via.placeholder.com/100';
  const userProfession = matchUser?.profession || '';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Container */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => goBack()}>
          <Image source={ICONS.back} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.headerProfile}>
          <Image
            source={{ uri: userImage }}
            style={styles.avatarImage}
          />
          <View style={styles.headerTextCol}>
            <Text style={styles.headerName}>{userName}{userAge ? `, ${userAge}` : ''}</Text>
            {userProfession ? (
              <Text style={styles.headerSubtitle}>{userProfession}</Text>
            ) : null}
          </View>
        </View>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardContainer}>
          <Text style={styles.titleText}>Say Hello!</Text>
          <Text style={styles.subtitleText}>Pick your opener</Text>

          <View style={styles.chipsWrapper}>
            {OPENERS.map((opener) => {
              const isSelected = selectedOpener === opener.id;
              return (
                <TouchableOpacity
                  key={opener.id}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setSelectedOpener(opener.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {opener.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Footer Actions */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={[styles.footerBtn, styles.btnContinue, !selectedOpener && { opacity: 0.5 }]}
          onPress={handleContinue}
          disabled={!selectedOpener || isStarting}
        >
          {isStarting && selectedOpener ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.btnContinueText}>Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerBtn, styles.btnCustom]}
          onPress={handleCustomMessage}
          disabled={isStarting}
        >
          {isStarting && !selectedOpener ? (
            <ActivityIndicator color="#FF1493" />
          ) : (
            <Text style={styles.btnCustomText}>Custom Message</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingTop: mvs(10),
    paddingBottom: mvs(15),
  },
  backBtn: {
    width: ms(45),
    height: ms(45),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginRight: ms(15),
  },
  backIcon: {
    width: ms(18),
    height: ms(18),
    tintColor: COLORS.black,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 3,
  },
  avatarImage: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    marginRight: ms(12),
  },
  headerTextCol: {
    justifyContent: 'center',
  },
  headerName: {
    fontFamily: FONTS.bold,
    fontSize: normalize(15),
    color: COLORS.black,
    marginBottom: mvs(2),
  },
  headerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: normalize(11),
    color: COLORS.textTertiary,
  },
  scrollContent: {
    paddingHorizontal: ms(15),
    paddingBottom: mvs(100),
  },
  cardContainer: {
    backgroundColor: '#FFFAFD',
    borderRadius: ms(25),
    paddingVertical: mvs(30),
    paddingHorizontal: ms(10),
    alignItems: 'center',
    minHeight: mvs(500),
    marginTop: mvs(15),
  },
  titleText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(18),
    color: '#FF1493',
    marginBottom: mvs(6),
  },
  subtitleText: {
    fontFamily: FONTS.regular,
    fontSize: normalize(12),
    color: COLORS.textTertiary,
    marginBottom: mvs(25),
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: ms(16),
    paddingVertical: mvs(10),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginHorizontal: ms(5),
    marginBottom: mvs(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  chipSelected: {
    borderColor: '#FF1493',
    backgroundColor: '#FFF0F8',
  },
  chipText: {
    fontFamily: FONTS.medium,
    fontSize: normalize(12),
    color: COLORS.black,
  },
  chipTextSelected: {
    color: '#FF1493',
    fontFamily: FONTS.bold,
  },
  footerRow: {
    position: 'absolute',
    bottom: mvs(30),
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: ms(20),
    justifyContent: 'space-between',
  },
  footerBtn: {
    flex: 1,
    height: mvs(50),
    borderRadius: ms(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContinue: {
    backgroundColor: '#FF99D6',
    marginRight: ms(10),
  },
  btnContinueText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(14),
    color: COLORS.white,
  },
  btnCustom: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginLeft: ms(10),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  btnCustomText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(14),
    color: '#FF1493',
  },
});
