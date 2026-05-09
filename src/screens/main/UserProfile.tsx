import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { navigate, goBack } from '../../utils/helper/RootNavigation';
import connectionrequest from '../../utils/helper/NetInfo';
import { getPeopleDetailsRequest, swipeRequest, startChatRequest } from '../../redux/reducer/MainReducer';
import ToastAlert from '../../utils/helper/Toast';
import { useDispatch, useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const INTERESTS = [
  { id: '1', name: 'Travelling', selected: true },
  { id: '2', name: 'Books', selected: true },
  { id: '3', name: 'Music', selected: false },
  { id: '4', name: 'Dancing', selected: false },
  { id: '5', name: 'Modeling', selected: false },
];

const GALLERY = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
];

const UserProfile = ({ route }: any) => {
  const dispatch = useDispatch();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const { getPeopleDetailsRes, swipeRes, startChatRes, status } = useSelector((state: any) => state.MainReducer);
  const insets = useSafeAreaInsets();
  const item = route.params;

  useEffect(() => {
    if (item) {
      connectionrequest()
        .then(() => {
          dispatch(getPeopleDetailsRequest(item))

        })

        .catch(err => {
          ToastAlert('Please connect To Internet');
        });
    }

  }, [route]);

  console.log(getPeopleDetailsRes, "getPeopleDetailsRes")

  useEffect(() => {
    if (status === 'Main/startChatSuccess' && startChatRes && isStartingChat) {
      setIsStartingChat(false);
      if (getPeopleDetailsRes?.data) {
        navigate('Chat', {
          chatId: startChatRes.data?.id || startChatRes?.id,
          userId: getPeopleDetailsRes.data.id,
          userName: getPeopleDetailsRes.data.name,
          userImage: getPeopleDetailsRes.data.profile_image || getPeopleDetailsRes.data.image_path || 'https://via.placeholder.com/100',
        });
      }
    }
  }, [status, startChatRes, isStartingChat, getPeopleDetailsRes]);

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header Cover Image */}
      <ImageBackground
        source={{
          uri: getPeopleDetailsRes?.data?.profile_image
        }}
        style={styles.coverImage}
        resizeMode="cover"
      >
        <TouchableOpacity onPress={() => goBack()}
          style={[styles.headerBtn, { marginTop: insets.top + mvs(10) }]}
        >
          <Image source={ICONS.back} style={styles.headerIcon} resizeMode="contain" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Overlapping Content Container */}
      <View style={styles.sheetContainer}>

        {/* Floating Actions Strip */}
        <View style={styles.floatingActionsRow}>
          <TouchableOpacity style={styles.floatBtnSmall} onPress={() => {
              if (getPeopleDetailsRes?.data?.id) {
                  dispatch(swipeRequest({ target_id: getPeopleDetailsRes.data.id, type: 'left' }));
                  goBack();
              }
          }}>
            <Image
              source={ICONS.closeSmall}
              style={[styles.actionIconColor]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ ...styles.floatBtnSmall, backgroundColor: COLORS.primaryLight }} onPress={() => {
              if (getPeopleDetailsRes?.data?.id) {
                  setIsStartingChat(true);
                  dispatch(startChatRequest({ user_ids: [getPeopleDetailsRes.data.id] }));
              }
          }}>
            <Image
              source={ICONS.message}
              style={styles.actionIconColor}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.floatBtnSmall} onPress={() => {
              if (getPeopleDetailsRes?.data?.id) {
                  dispatch(swipeRequest({ target_id: getPeopleDetailsRes.data.id, type: 'right' }));
                  goBack();
              }
          }}>
            <Image
              source={ICONS.like}
              style={[styles.actionIconColor, { height: ms(35), width: ms(35) }]}
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

        {/* Profile Identity */}
        <View style={styles.profileHeaderRow}>
          <View>
            <Text style={styles.nameText}>{getPeopleDetailsRes?.data?.name}, 23</Text>
            <Text style={styles.professionText}>{getPeopleDetailsRes?.data?.profession}</Text>
          </View>
          <TouchableOpacity style={styles.sendBtn}>
            <Image
              source={ICONS.send}
              style={styles.sendIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Location Section */}
        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.sectionSubtext}>{getPeopleDetailsRes?.data?.location}</Text>
          </View>
          {/* <TouchableOpacity style={styles.locationBadge}>
            <Image source={ICONS.location} style={styles.locationPin} resizeMode="contain" />
            <Text style={styles.locationBadgeText}>1 km</Text>
          </TouchableOpacity> */}
        </View>

        {/* About Section */}
        {/* <View style={styles.sectionSpacing}>
          <Text style={styles.sectionTitleBase}>About</Text>
          <Text style={styles.aboutText}>
            My name is Jessica Parker and I enjoy meeting new people and finding ways
            to help them have an uplifting experience. I enjoy reading..{' '}
            <Text style={styles.readMoreText}>Read more</Text>
          </Text>
        </View> */}

        {/* Interests */}
        <View style={styles.sectionSpacing}>
          <Text style={styles.sectionTitleBase}>Interests</Text>
          <View style={styles.interestsQueue}>
            {getPeopleDetailsRes?.data?.hobbies?.map((interest: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.chip,
                  interest.selected ? styles.chipSelected : styles.chipUnselected,
                ]}
              >
                {/* {interest.selected && (
                  <Image source={ICONS.done} style={styles.chipIcon} resizeMode="contain" />
                )} */}
                <Text
                  style={
                    interest.selected
                      ? styles.chipTextSelected
                      : styles.chipTextUnselected
                  }
                >
                  {interest.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Gallery */}
        <View style={styles.galleryContainer}>
          <View style={styles.galleryHeaderRow}>
            <Text style={styles.sectionTitleBase}>Gallery</Text>
            <TouchableOpacity
            //  onPress={() => navigate('Gallery')}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.galleryRow2}>
            <Image source={{ uri: GALLERY[0] }} style={styles.galleryImgLarge} />
            <Image source={{ uri: GALLERY[1] }} style={styles.galleryImgLarge} />
          </View>

          <View style={styles.galleryRow3}>
            <Image source={{ uri: GALLERY[2] }} style={styles.galleryImgSmall} />
            <Image source={{ uri: GALLERY[3] }} style={styles.galleryImgSmall} />
            <Image source={{ uri: GALLERY[4] }} style={styles.galleryImgSmall} />
          </View> */}
        </View>
      </View>
    </ScrollView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  coverImage: {
    width: width,
    height: height * 0.55,
  },
  headerBtn: {
    width: ms(48),
    height: ms(48),
    backgroundColor: 'rgba(50, 50, 50, 0.4)',
    borderRadius: ms(15),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: ms(20),
  },
  headerIcon: {
    width: ms(20),
    height: ms(20),
    tintColor: COLORS.white,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: ms(40),
    borderTopRightRadius: ms(40),
    marginTop: -mvs(50),
    paddingHorizontal: ms(20),
    paddingBottom: mvs(40),
  },
  floatingActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -mvs(35),
    marginBottom: mvs(30),
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
  profileHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(25),
  },
  nameText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(24),
    color: COLORS.black,
  },
  professionText: {
    fontFamily: FONTS.regular,
    fontSize: normalize(12),
    color: COLORS.textTertiary,
    marginTop: mvs(4),
  },
  sendBtn: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(15),
    borderWidth: 1,
    borderColor: '#FFE6F5', // Light pink border
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: ms(22),
    height: ms(22),
    tintColor: COLORS.primary,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(25),
  },
  sectionTitleBase: {
    fontFamily: FONTS.bold,
    fontSize: normalize(16),
    color: COLORS.black,
    marginBottom: mvs(8),
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: normalize(16),
    color: COLORS.black,
    marginBottom: mvs(4),
  },
  sectionSubtext: {
    fontFamily: FONTS.regular,
    fontSize: normalize(12),
    color: COLORS.textTertiary,
    includeFontPadding: false,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE6F5',
    paddingHorizontal: ms(12),
    paddingVertical: mvs(6),
    borderRadius: ms(8),
  },
  locationPin: {
    width: ms(12),
    height: ms(12),
    tintColor: COLORS.primary,
    marginRight: ms(4),
  },
  locationBadgeText: {
    fontFamily: FONTS.semiBold,
    fontSize: normalize(12),
    color: COLORS.primary,
  },
  sectionSpacing: {
    marginBottom: mvs(25),
  },
  aboutText: {
    fontFamily: FONTS.regular,
    fontSize: normalize(12),
    color: COLORS.textTertiary,
    includeFontPadding: false,
  },
  readMoreText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(14),
    color: COLORS.primary,
  },
  interestsQueue: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: mvs(5),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingVertical: mvs(8),
    borderRadius: ms(8),
    borderWidth: 1,
    marginRight: ms(10),
    marginBottom: mvs(10),
  },
  chipSelected: {
    borderColor: '#FFD1ED',
    backgroundColor: COLORS.white,
  },
  chipUnselected: {
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  chipTextSelected: {
    fontFamily: FONTS.semiBold,
    fontSize: normalize(14),
    color: COLORS.primary,
  },
  chipTextUnselected: {
    fontFamily: FONTS.regular,
    fontSize: normalize(14),
    color: '#808191',
  },
  chipIcon: {
    width: ms(14),
    height: ms(14),
    tintColor: COLORS.primary,
    marginRight: ms(8),
  },
  galleryContainer: {
    marginBottom: mvs(20),
  },
  galleryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(15),
  },
  seeAllText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(14),
    color: COLORS.primary,
  },
  galleryRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(10),
  },
  galleryImgLarge: {
    width: '48%',
    height: mvs(220),
    borderRadius: ms(10),
    resizeMode: 'cover',
  },
  galleryRow3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  galleryImgSmall: {
    width: '32%',
    height: mvs(130),
    borderRadius: ms(10),
    resizeMode: 'cover',
  },
});
