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

const MyPreferences = () => {
  const [interestedIn, setInterestedIn] = useState('Women');

  // Custom visual static slider component to guarantee pixel perfection without foreign npm packages
  const renderVisualSlider = (progressPercent: number) => (
    <View style={styles.sliderTrackContainer}>
      <View style={styles.sliderTrackBackground} />
      <View style={[styles.sliderTrackActive, { width: `${progressPercent}%` }]} />
      {/* Thumb positioned exactly at the end of the active track */}
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
      {/* Thumb 1 */}
      <View style={[styles.sliderThumb, { left: `${startPercent}%` }]} />
      {/* Thumb 2 */}
      <View style={[styles.sliderThumb, { left: `${endPercent}%` }]} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
            {['Women', 'Men', 'Both'].map((option) => {
              const isActive = option === interestedIn;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                  onPress={() => setInterestedIn(option)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      isActive && styles.segmentTextActive,
                    ]}
                  >
                    {option}
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
            <Text style={styles.sliderValueText}>40km</Text>
          </View>
          {renderVisualSlider(45)}
        </View>

        {/* Age Section */}
        <View style={styles.sectionBlock}>
          <View style={styles.sliderTitleRow}>
            <Text style={styles.sectionTitle}>Age</Text>
            <Text style={styles.sliderValueText}>20-28</Text>
          </View>
          {renderVisualRangeSlider(15, 35)}
        </View>
      </ScrollView>

      {/* Floating Save Footer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
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
    height: mvs(55),
    backgroundColor: COLORS.white,
    borderRadius: ms(15),
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden', // clips inner segments
  },
  segmentBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1, // Only visual if not active, wait, dividing logic:
    borderRightColor: '#FAFAFA', // Soft border between them
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primary,
    // Active doesn't show border
    borderRightWidth: 0,
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
  sliderTrackContainer: {
    height: mvs(30),
    justifyContent: 'center',
    position: 'relative',
    marginTop: mvs(10), // Padding above
  },
  sliderTrackBackground: {
    width: '100%',
    height: mvs(4),
    backgroundColor: COLORS.lightGray,
    borderRadius: ms(2),
    position: 'absolute',
  },
  sliderTrackActive: {
    height: mvs(4),
    backgroundColor: '#FF99D6', // Using the bright pink specified in mocks
    borderRadius: ms(2),
    position: 'absolute',
  },
  sliderThumb: {
    position: 'absolute',
    width: ms(26),
    height: ms(26),
    borderRadius: ms(13),
    backgroundColor: COLORS.primary,
    top: '50%',
    marginTop: -ms(13),
    marginLeft: -ms(13), // Center origin point
    // Halo glow border replication
    borderWidth: 4,
    borderColor: '#FFF0F8', // very light pink glow
  },
  footerContainer: {
    position: 'absolute',
    bottom: mvs(30),
    left: 0,
    right: 0,
    paddingHorizontal: ms(20),
  },
  saveBtn: {
    height: mvs(55),
    width: '100%',
    backgroundColor: '#FF99D6', // Pink specified in layout
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
