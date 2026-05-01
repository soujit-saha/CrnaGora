import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { goBack } from '../../utils/helper/RootNavigation';

const Stories = () => {
  const [message, setMessage] = useState('');

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} // Full-size story image
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Story Progress Bars */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, styles.progressBarActive]} />
          <View style={styles.progressBar} />
        </View>

        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }}
              style={styles.avatarImage}
            />
            <Text style={styles.headerName}>Grace</Text>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={() => goBack()}>
            <Image source={ICONS.closeSmall} style={styles.closeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* Spacer to push input to bottom */}
        <View style={{ flex: 1 }} />

        {/* Bottom Input Section */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.bottomRow}>
            {/* Transparent Text Input container */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Your message"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity style={styles.stickerBtn}>
                <Image source={ICONS.stickers} style={styles.stickerIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>

            {/* Translucent Send Button */}
            <TouchableOpacity style={styles.sendBtn}>
              <Image source={ICONS.send} style={styles.sendIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Stories;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: ms(20),
    paddingBottom: mvs(10), // slight padding from bottom bounds
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: mvs(15),
    marginBottom: mvs(20),
  },
  progressBar: {
    flex: 1,
    height: mvs(3),
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: ms(2),
    marginHorizontal: ms(2), // tiny gap between bars
  },
  progressBarActive: {
    backgroundColor: '#FF99D6', // the bright pink specific to stories mock
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
  },
  headerName: {
    fontFamily: FONTS.bold,
    fontSize: normalize(16),
    color: COLORS.white, // Text sits on darker images usually
    marginLeft: ms(12),
    // Text shadow to ensure readable over light image backgrounds just in case
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  closeBtn: {
    width: ms(45),
    height: ms(45),
    borderRadius: ms(14),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: ms(14),
    height: ms(14),
    tintColor: COLORS.white,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(10),
  },
  inputContainer: {
    flex: 1,
    height: mvs(50),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ms(25),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingLeft: ms(20),
    paddingRight: ms(10),
    marginRight: ms(15),
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: normalize(14),
    color: COLORS.white,
    height: '100%',
  },
  stickerBtn: {
    padding: ms(5),
  },
  stickerIcon: {
    width: ms(20),
    height: ms(20),
    tintColor: COLORS.white,
  },
  sendBtn: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(15), // Rounded square like close button but larger
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: ms(20),
    height: ms(20),
    tintColor: COLORS.white,
    // Add tiny translation to center the paper plane properly if needed natively
    transform: [{ translateX: ms(2) }, { translateY: ms(-1) }],
  },
});
