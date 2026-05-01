import React from 'react';
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
import { useSelector } from 'react-redux';
import moment from 'moment';

const INTERESTS = [
  { id: '1', title: 'Shopping', icon: ICONS.shopping },
  { id: '2', title: 'Run', icon: ICONS.run },
  { id: '3', title: 'Traveling', icon: ICONS.traveling },
];

const PHOTOS = [
  'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
];

const MyProfile = () => {
  const { isMainLoading, peopleListRes, getProfileRes } = useSelector((state: any) => state.MainReducer);
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Container */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => goBack()}>
          <Image source={ICONS.back} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Image source={ICONS.profileEdit} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Identity Block */}
        <View style={styles.identityRow}>
          <Image
            source={{ uri: getProfileRes?.data?.profile_image }}
            style={styles.avatarImage}
          />
          <View style={styles.identityDetails}>
            <Text style={styles.identityName}>{getProfileRes?.data?.name}, {getProfileRes?.data?.age}</Text>
            <Text style={styles.identityDob}>{moment(getProfileRes?.data?.dob).format('DD MMMM,YYYY')}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Location Block */}
        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>My Location</Text>
          <Text style={styles.infoSubtitle}>12, USA, 52100</Text>
        </View>

        <View style={styles.divider} />

        {/* Profession Block */}
        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>My Proffesion</Text>
          <Text style={styles.infoSubtitle}>{getProfileRes?.data?.profession}</Text>
        </View>

        <View style={styles.divider} />

        {/* Interests Block */}
        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>My Interests</Text>
          <View style={styles.interestsContainer}>
            {getProfileRes?.data?.hobbies?.map((interest: any) => (
              <View key={interest.id} style={styles.interestChip}>
                {/* {interest.icon && (
                  <Image source={interest.icon} style={styles.interestIcon} resizeMode="contain" />
                )} */}
                <Text style={styles.interestText}>{interest?.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Photos Block */}
        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>My Photos</Text>
          <View style={styles.photosContainer}>
            {/* {PHOTOS.map((imageUrl, index) => (
              <Image
                key={index.toString()}
                source={{ uri: imageUrl }}
                style={[
                  styles.photoThumbnail,
                  index > 0 && styles.photoThumbnailInactive, // Faded effect for rest
                ]}
              />
            ))} */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfile;

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
    fontSize: normalize(20),
    color: COLORS.black,
  },
  scrollContent: {
    paddingHorizontal: ms(25),
    paddingBottom: mvs(40),
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(15),
    marginTop: mvs(10),
  },
  avatarImage: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
  },
  identityDetails: {
    marginLeft: ms(15),
  },
  identityName: {
    fontFamily: FONTS.bold,
    fontSize: normalize(16),
    color: COLORS.black,
    marginBottom: mvs(2),
  },
  identityDob: {
    fontFamily: FONTS.regular,
    fontSize: normalize(12),
    color: COLORS.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: mvs(15),
  },
  infoBlock: {
    marginBottom: mvs(5),
  },
  infoTitle: {
    fontFamily: FONTS.bold,
    fontSize: normalize(15),
    color: COLORS.black,
    marginBottom: mvs(10),
  },
  infoSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: normalize(14),
    color: COLORS.textTertiary,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: mvs(5),
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF99D6', // Using a solid pink to replicate the gradient/bright color
    paddingHorizontal: ms(16),
    paddingVertical: mvs(10),
    borderRadius: ms(12),
    marginRight: ms(10),
    marginBottom: mvs(10),
    // shadow replicating glow
    elevation: 4,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  interestIcon: {
    width: ms(14),
    height: ms(14),
    tintColor: COLORS.white,
    marginRight: ms(6),
  },
  interestText: {
    fontFamily: FONTS.semiBold,
    fontSize: normalize(13),
    color: COLORS.white,
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: mvs(10),
  },
  photoThumbnail: {
    width: ms(55),
    height: ms(55),
    borderRadius: ms(10),
  },
  photoThumbnailInactive: {
    opacity: 0.5,
  },
});
