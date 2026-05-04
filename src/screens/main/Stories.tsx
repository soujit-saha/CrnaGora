import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { goBack } from '../../utils/helper/RootNavigation';
import { clearChatMessages, deleteStatusRequest, markAsReadRequest } from '../../redux/reducer/MainReducer';

const Stories = ({ route }: any) => {
  const dispatch = useDispatch();
  const { getProfileRes } = useSelector((state: any) => state.MainReducer);
  const [message, setMessage] = useState('');
  const { data, type } = route?.params;
  const initialStatuses = type == 2 ? data?.statuses : data;
  const [statuses, setStatuses] = useState<any[]>(Array.isArray(initialStatuses) ? initialStatuses : (initialStatuses ? [initialStatuses] : []));
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  console.log("data", statuses);

  // Mark status as read whenever the current status changes
  useEffect(() => {
    const currentStatus = statuses[currentIndex];
    if (currentStatus?.id) {
      console.log('Marking status as read:', currentStatus.id);
      dispatch(markAsReadRequest(currentStatus.id));
    }
  }, [currentIndex, statuses]);

  useEffect(() => {
    if (statuses.length > 0) {
      startAnimation();
    } else {
      // If no statuses, go back
      const timer = setTimeout(() => goBack(), 100);
      return () => clearTimeout(timer);
    }
    return () => progress.stopAnimation();
  }, [currentIndex]);

  const startAnimation = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 30000, // 30 seconds as requested
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });
  };

  const handlePrevious = () => {
    progress.stopAnimation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    progress.stopAnimation();
    if (currentIndex < statuses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      goBack();
    }
  };

  const onDeleteStatus = () => {
    Alert.alert(
      "Delete Status",
      "Are you sure you want to delete this status?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            const currentStatusId = statuses[currentIndex].id;
            dispatch(deleteStatusRequest(currentStatusId));

            // Remove locally
            progress.stopAnimation();
            const newStatuses = [...statuses];
            newStatuses.splice(currentIndex, 1);
            setStatuses(newStatuses);

            if (newStatuses.length === 0) {
              goBack();
            } else if (currentIndex >= newStatuses.length) {
              setCurrentIndex(newStatuses.length - 1);
            } else {
              startAnimation();
            }
          },
          style: "destructive"
        }
      ]
    );
  }

  const currentStatus = statuses[currentIndex];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* Background Layer */}
      {currentStatus?.type === 'image' ? (
        <Image
          source={{ uri: currentStatus.content }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: currentStatus?.background_color || COLORS.primary }
          ]}
        />
      )}

      {/* Tap Regions Layer */}
      <View style={[StyleSheet.absoluteFill, { flexDirection: 'row' }]}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={handlePrevious}
        />
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={handleNext}
        />
      </View>

      {/* UI Overlay Layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <SafeAreaView style={styles.container} pointerEvents="box-none">
          {/* Story Progress Bars */}
          <View style={styles.progressContainer} pointerEvents="none">
            {statuses.map((item: any, index: number) => {
              return (
                <View key={index} style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: index < currentIndex
                          ? '100%'
                          : index === currentIndex
                            ? progress.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            })
                            : '0%'
                      }
                    ]}
                  />
                </View>
              );
            })}
          </View>

          {/* Top Header Row */}
          <View style={styles.headerRow} pointerEvents="box-none">
            <View style={styles.headerLeft} pointerEvents="none">
              <Image
                source={{ uri: type == 1 ? getProfileRes?.data?.profile_image : data?.image_path }}
                style={styles.avatarImage}
              />
              <Text style={styles.headerName}>{type == 1 ? getProfileRes?.data?.name : data?.name}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ms(10) }}>

              {type == 1 && <TouchableOpacity style={styles.closeBtn} onPress={() => onDeleteStatus()}>
                <Image source={ICONS.delete} style={styles.closeIcon} resizeMode="contain" />
              </TouchableOpacity>}
              <TouchableOpacity style={styles.closeBtn} onPress={() => goBack()}>
                <Image source={ICONS.closeSmall} style={styles.closeIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Centered Text Content (within available space) */}
          <View style={styles.middleContent} pointerEvents="none">
            {currentStatus?.type === 'text' && (
              <Text style={styles.storyText}>{currentStatus.content}</Text>
            )}
          </View>

          {/* Bottom Input Section */}
          {type == 2 && <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            pointerEvents="box-none"
          >
            <View style={styles.bottomRow} pointerEvents="box-none">
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Your message"
                  placeholderTextColor="rgba(255,255,255,1)"
                  value={message}
                  onChangeText={setMessage}
                />
                {/* <TouchableOpacity style={styles.stickerBtn}>
                  <Image source={ICONS.stickers} style={styles.stickerIcon} resizeMode="contain" />
                </TouchableOpacity> */}
              </View>

              <TouchableOpacity style={styles.sendBtn}>
                <Image source={ICONS.send} style={styles.sendIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>}
        </SafeAreaView>
      </View>
    </View>
  );
};

export default Stories;

const styles = StyleSheet.create({
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
  progressBarBackground: {
    flex: 1,
    height: mvs(3),
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: ms(2),
    marginHorizontal: ms(2),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF99D6',
  },
  middleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(10),
  },
  storyText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(24),
    color: COLORS.white,
    textAlign: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: ms(25),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
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
