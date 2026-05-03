import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { navigate } from '../../utils/helper/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequest, notificationSetUpRequest, settingRequest } from '../../redux/reducer/AuthReducer';
import connectionrequest from '../../utils/helper/NetInfo';
import ToastAlert from '../../utils/helper/Toast';
import Loader from '../../utils/helper/Loader';

const MENU_ITEMS = [
  { id: '1', title: 'My Preferences', icon: ICONS.myPreferences, type: 'link', screen: 'MyPreferences' },
  { id: '2', title: 'Subscription', icon: ICONS.myPreferences, type: 'link', screen: 'Subscription' },
  { id: '3', title: 'Terms of use', icon: ICONS.termsOfUse, type: 'link', screen: 'TermsofUse' },
  { id: '4', title: 'Privacy Policy', icon: ICONS.privacyPolicy, type: 'link', screen: 'PrivacyPolicy' },
  { id: '5', title: 'Rate this app', icon: ICONS.rateThisApp, type: 'link' },
  { id: '6', title: 'Contact Us', icon: ICONS.contactUs, type: 'link' },
  { id: '7', title: 'Notifications', icon: ICONS.notifications, type: 'toggle' },
];

const Profile = () => {
  const dispatch = useDispatch();
  const { isMainLoading, peopleListRes, getProfileRes } = useSelector((state: any) => state.MainReducer);
  const { isReqLoading } = useSelector((state: any) => state.AuthReducer);
  const [notificationsEnabled, setNotificationsEnabled] = useState(getProfileRes?.data?.enable_notification == 1 ? true : false);

  const onNotifiedPress = () => {
    setNotificationsEnabled(!notificationsEnabled);
    let data = {
      enable_notification: !notificationsEnabled
    }

    connectionrequest()
      .then(() => {
        dispatch(notificationSetUpRequest(data))
      })
      .catch(err => {
        ToastAlert('Please connect To Internet');
      });
  }

  const onLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => dispatch(logoutRequest(null)),
          style: 'destructive',
        },
      ]
    );
  };

  const renderStatsColumn = (title: string, value: string) => (
    <View style={styles.statsColumn}>
      <View style={styles.statsHeaderRow}>
        <Text style={styles.statsTitle}>{title}</Text>
        <View style={styles.addBadge}>
          <Text style={styles.addBadgeText}>+</Text>
        </View>
      </View>
      <Text style={styles.statsValue}>{value}</Text>
    </View>
  );

  useEffect(() => {
    connectionrequest()
      .then(() => {
        dispatch(settingRequest({}))
      })
      .catch(err => {
        ToastAlert('Please connect To Internet');
      });
  }, [])

  return (
    <View style={styles.container}>
      <Loader visible={isReqLoading} />
      {/* Background Gradient */}
      <LinearGradient
        colors={['#FAFAFA', '#FFE3F6']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0, y: 1 }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Identity Card */}
          <View style={styles.identityRow}>
            <Image
              source={{ uri: getProfileRes?.data?.profile_image }}
              style={styles.avatarImage}
            />
            <View style={styles.identityDetails}>
              <Text style={styles.identityName}>{getProfileRes?.data?.name}, {getProfileRes?.data?.age}</Text>
              <Text style={styles.identityPlan}>{getProfileRes?.data?.
                subscription?.plan_name}</Text>
            </View>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigate('MyProfile')}>
              <Image source={ICONS.vectorPinkNext} style={styles.nextArrow} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <View style={styles.horizontalDivider} />

          {/* Stats Bar */}
          <View style={styles.statsContainer}>
            {renderStatsColumn('LIKES', '08')}
            <View style={styles.verticalDivider} />
            {renderStatsColumn('BOOSTS', '10')}
            <View style={styles.verticalDivider} />
            {renderStatsColumn('Messages', '25')}
          </View>

          {/* Options Menu List */}
          <View style={styles.menuContainer}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuListItem}
                activeOpacity={item.type === 'link' ? 0.7 : 1}
                onPress={() => { if (item.screen) navigate(item.screen) }}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.iconCircle}>
                    <Image source={item.icon} style={styles.menuIcon} />
                  </View>
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>

                {item.type === 'link' ? (
                  <Image source={ICONS.vectorPinkNext} style={styles.nextArrow} resizeMode="contain" />
                ) : (
                  <Switch
                    trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                    thumbColor={COLORS.white}
                    ios_backgroundColor={COLORS.lightGray}
                    onValueChange={() => onNotifiedPress()}
                    value={notificationsEnabled}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout App Button */}

          <TouchableOpacity onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>


        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ms(20),
    paddingBottom: mvs(100), // clearance for bottom tab
  },
  headerContainer: {
    paddingHorizontal: ms(20),
    paddingTop: mvs(10),
    paddingBottom: mvs(25),

  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: normalize(32),
    color: COLORS.black,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(25),
  },
  avatarImage: {
    width: ms(55),
    height: ms(55),
    borderRadius: ms(27.5),
  },
  identityDetails: {
    flex: 1,
    marginLeft: ms(15),
  },
  identityName: {
    fontFamily: FONTS.bold,
    fontSize: normalize(18),
    color: COLORS.black,
    marginBottom: mvs(4),
  },
  identityPlan: {
    fontFamily: FONTS.medium,
    fontSize: normalize(12),
    color: COLORS.textTertiary,
  },
  nextArrow: {
    width: ms(14),
    height: ms(14),
    tintColor: COLORS.primary,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: mvs(25),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(25),
    paddingHorizontal: ms(10),
  },
  statsColumn: {
    alignItems: 'center',
  },
  statsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(4),
  },
  statsTitle: {
    fontFamily: FONTS.regular,
    fontSize: normalize(12.5),
    color: 'rgba(0, 0, 0, 0.7)',
    textTransform: 'uppercase',
  },
  addBadge: {
    width: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: ms(5),
  },
  addBadgeText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(10),
    color: COLORS.white,
    includeFontPadding: false,

    // centers the + nicely via typography
  },
  statsValue: {
    fontFamily: FONTS.medium, // Not fully bold based on mock
    fontSize: normalize(20),
    color: COLORS.black,
  },
  verticalDivider: {
    width: 1,
    height: mvs(50),
    backgroundColor: COLORS.borderLight,
  },
  menuContainer: {
    marginBottom: mvs(10),
  },
  menuListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: ms(20),
    paddingVertical: mvs(15),
    borderRadius: ms(15),
    marginBottom: mvs(15),
    elevation: 3,
    shadowColor: 'rgba(136, 136, 136, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: ms(45),
    height: ms(45),
    borderRadius: ms(22.5),
    backgroundColor: COLORS.primary, // Soft pink background for icons
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(15),
    borderWidth: ms(2),
    borderColor: COLORS.white,
    elevation: 5,
    shadowColor: 'rgba(233, 64, 87, 0.8)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  menuIcon: {
    width: ms(24),
    height: ms(24),
    tintColor: COLORS.white,
    resizeMode: 'contain'
  },
  menuText: {
    fontFamily: FONTS.medium,
    fontSize: normalize(14),
    color: COLORS.black,
  },

  logoutText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(16),
    color: COLORS.primary,
    textAlign: 'center',
  },
});