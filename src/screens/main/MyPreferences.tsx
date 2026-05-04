import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { goBack } from '../../utils/helper/RootNavigation';
import { Slider } from '@miblanchard/react-native-slider';
import { useDispatch, useSelector } from 'react-redux';
import connectionrequest from '../../utils/helper/NetInfo';
import ToastAlert from '../../utils/helper/Toast';
import { notificationSetUpRequest } from '../../redux/reducer/AuthReducer';
import Loader from '../../utils/helper/Loader';

const MyPreferences = () => {
  const dispatch = useDispatch();
  const [interestedIn, setInterestedIn] = useState('');
  const { isReqLoading, masterdropdownRes } = useSelector((state: any) => state.AuthReducer);
  const [Age, setAge] = useState<[number, number]>([20, 28]);
  const [Distance, setDistance] = useState<number>(40);

  // console.log('interestedIn', interestedIn)




  const onSave = () => {
    const data = {
      dating_preferences: interestedIn,
      distance_range: Distance,
      age_range_end: Age[1],
      age_range_start: Age[0],
    }


    connectionrequest()
      .then(() => {
        dispatch(notificationSetUpRequest(data))
      })
      .catch(err => {
        ToastAlert('Please connect To Internet');
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={isReqLoading} />
      {/* Header Container */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => goBack()}>
          <Image source={ICONS.back} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Preferences</Text>
        <View style={{ width: ms(45) }} /> {/* Empty right block for perfect centering */}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Interested In Section */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Interested In</Text>

          {/* Segmented Control */}
          <View style={styles.segmentedControl}>
            {masterdropdownRes?.dating_preferences?.map((option: any, index: any) => {
              return (
                <TouchableOpacity
                  key={`${index}`}
                  style={[styles.segmentBtn, option.id == interestedIn && styles.segmentBtnActive]}
                  onPress={() => setInterestedIn(option?.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{ ...styles.segmentText, color: option.id == interestedIn ? COLORS.white : COLORS.black }}
                  >
                    {option?.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Distance Section */}
        <View style={styles.sectionBlock}>
          <View style={styles.sliderTitleRow}>
            <Text style={styles.sectionTitle}>Distance</Text>
            <Text style={styles.sliderValueText}>{Math.round(Distance)}km</Text>
          </View>
          <Slider
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
        </View>

        {/* Age Section */}
        <View style={styles.sectionBlock}>
          <View style={styles.sliderTitleRow}>
            <Text style={styles.sectionTitle}>Age</Text>
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
        </View>
      </ScrollView>

      {/* Floating Save Footer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={1} onPress={() => onSave()}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyPreferences;

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
    paddingHorizontal: ms(20),
    paddingBottom: mvs(100), // Safety padding behind footer
  },
  sectionBlock: {
    marginBottom: mvs(35),
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: normalize(14),
    color: COLORS.black,
    marginBottom: mvs(15),
  },
  segmentedControl: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: mvs(55),
    backgroundColor: COLORS.white,
    borderRadius: ms(15),
    // borderWidth: 1,
    // borderColor: COLORS.borderLight,
    overflow: 'hidden',
    justifyContent: "space-between"
  },
  segmentBtn: {
    width: '32%',
    height: mvs(55),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(15),
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    marginBottom: mvs(5)
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primary,
    // Active doesn't show border
    // borderRightWidth: 0,
  },
  segmentText: {
    fontFamily: FONTS.medium,
    fontSize: normalize(13),
    color: COLORS.black,
  },
  segmentTextActive: {
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  sliderTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(15), // Re-setting block margin locally
  },
  sliderValueText: {
    fontFamily: FONTS.regular,
    fontSize: normalize(12),
    color: COLORS.textTertiary,
  },
  /* Slider visuals */
  trackStyle: {
    height: mvs(6),
    borderRadius: ms(10),
  },
  thumbStyle: {
    height: mvs(30),
    width: mvs(30),
    borderRadius: ms(20),
    borderWidth: ms(3.5),
    borderColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  footerContainer: {
    position: 'absolute',
    bottom: mvs(30),
    left: 0,
    right: 0,
    paddingHorizontal: ms(20),
  },
  saveBtn: {
    height: mvs(50),
    width: '100%',
    backgroundColor: COLORS.primary, // Pink specified in layout
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(16),
  },
  saveText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(16),
    color: COLORS.white,
  },
});
