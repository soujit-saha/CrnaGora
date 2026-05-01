import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { navigate } from '../../utils/helper/RootNavigation';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import {
    getStatusesRequest,
    createStatusRequest,
    deleteStatusRequest,
    reactStatusRequest,
    getStatusCommentsRequest,
    addStatusCommentRequest,
    getUserStatusesRequest
} from '../../redux/reducer/MainReducer';

const ACTIVITIES = [
  { id: '1', name: 'You', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', isYou: true },
  { id: '2', name: 'Emma', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: '3', name: 'Ava', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: '4', name: 'Sophia', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  { id: '5', name: 'Mia', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
];

const FILTERS = ['All', 'Unread', 'Most Recent', 'Nearest'];

const MESSAGES = [
  {
    id: '1',
    name: 'Emelie',
    message: 'Sticker 😍',
    time: '23 min',
    unread: 1,
    isStarred: true,
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '2',
    name: 'Abigail',
    message: 'Typing..',
    time: '27 min',
    unread: 2,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '3',
    name: 'Elizabeth',
    message: 'Ok, see you then.',
    time: '33 min',
    unread: 0,
    image: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '4',
    name: 'Penelope',
    message: "You: Hey! What's up, long time..",
    time: '50 min',
    unread: 0,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '5',
    name: 'Chloe',
    message: 'You: Hello how are you?',
    time: '55 min',
    unread: 0,
    image: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '6',
    name: 'Grace',
    message: 'You: Great I will write later..',
    time: '1 hour',
    unread: 0,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  },
];

const Messages = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterSelect, setFilterSelect] = useState('Women');
  const [filterOthers, setFilterOthers] = useState('New matches');

  const dispatch = useDispatch();
  const { getStatusesRes } = useSelector((state: any) => state.MainReducer);

  useEffect(() => {
    dispatch(getStatusesRequest({}));
  }, []);

  const handleCreateStatus = (data: any) => {
    dispatch(createStatusRequest(data));
  };

  const handleDeleteStatus = (id: string) => {
    dispatch(deleteStatusRequest({ id }));
  };

  const handleReactStatus = (id: string, reactData: any) => {
    dispatch(reactStatusRequest({ id, ...reactData }));
  };

  const handleGetStatusComments = (id: string) => {
    dispatch(getStatusCommentsRequest({ id }));
  };

  const handleAddStatusComment = (id: string, commentData: any) => {
    dispatch(addStatusCommentRequest({ id, ...commentData }));
  };

  const handleGetUserStatuses = (id: string) => {
    dispatch(getUserStatusesRequest({ id }));
  };

  // Custom visual static slider components to guarantee pixel perfection
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

  const renderActivityRing = (item: typeof ACTIVITIES[0]) => {
    // if (item.isYou) {
    //   return (
    //     <TouchableOpacity key={item.id} style={styles.activityColumn} >
    //       <View style={[styles.ringContainer, { borderColor: COLORS.border, borderWidth: 2 }]}>
    //         <View style={styles.ringInnerSpace}>
    //           <Image source={{ uri: item.image }} style={styles.activityImage} />
    //         </View>
    //       </View>
    //       <Text style={styles.activityName}>{item.name}</Text>
    //     </TouchableOpacity>
    //   );
    // }

    return (
      <TouchableOpacity key={item.id} style={styles.activityColumn} onPress={() => navigate('Stories')}>
        <LinearGradient
          colors={['#FF9D33', COLORS.primary]}
          style={styles.ringContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.ringInnerSpace}>
            <Image source={{ uri: item.image }} style={styles.activityImage} />
          </View>
        </LinearGradient>
        <Text style={styles.activityName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerActionsFixed}>
          <TouchableOpacity style={styles.headerBtn}>
            <Image source={ICONS.search} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setIsFilterVisible(true)}>
            <Image source={ICONS.filter} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Activities Section */}
        <Text style={styles.sectionTitle}>Activities</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activitiesScroll}
        >
          {ACTIVITIES.map(renderActivityRing)}
        </ScrollView>

        {/* Filters Section */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Messages List */}
        <Text style={styles.sectionTitle}>Messages</Text>
        <View style={styles.messagesList}>
          {MESSAGES.map((msg) => (
            <TouchableOpacity key={msg.id} style={styles.messageRow} activeOpacity={0.7} onPress={() => navigate('Chat')}>
              <View style={styles.msgAvatarWrapper}>
                <Image source={{ uri: msg.image }} style={styles.msgAvatar} />
              </View>

              <View style={styles.msgDetails}>
                <View style={styles.msgTopRow}>
                  <View style={styles.msgNameRow}>
                    <Text style={styles.msgName}>{msg.name}</Text>
                    {msg.isStarred && (
                      <Image source={ICONS.star} style={styles.starIconSmall} resizeMode="contain" />
                    )}
                  </View>
                  <Text style={styles.msgTime}>{msg.time}</Text>
                </View>

                <View style={styles.msgBottomRow}>
                  <Text style={styles.msgText} numberOfLines={1}>
                    {msg.message}
                  </Text>
                  {msg.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{msg.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet Modal */}
      <Modal
        isVisible={isFilterVisible}
        onBackdropPress={() => setIsFilterVisible(false)}
        onSwipeComplete={() => setIsFilterVisible(false)}
        swipeDirection="down"
        style={styles.modalStyle}
        backdropOpacity={0.4}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeaderRow}>
            <View style={{ width: ms(40) }} />
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Select Section */}
          <Text style={styles.filterSectionTitle}>Select</Text>
          <View style={styles.segmentedControl}>
            {['Women', 'Men', 'Both'].map((option) => {
              const isActive = option === filterSelect;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                  onPress={() => setFilterSelect(option)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Distance Section */}
          <View style={styles.sliderTitleRow}>
            <Text style={styles.filterSectionTitle}>Distance</Text>
            <Text style={styles.sliderValueText}>40km</Text>
          </View>
          {renderVisualSlider(45)}

          <View style={{ height: mvs(25) }} />

          {/* Age Section */}
          <View style={styles.sliderTitleRow}>
            <Text style={styles.filterSectionTitle}>Age</Text>
            <Text style={styles.sliderValueText}>20-28</Text>
          </View>
          {renderVisualRangeSlider(15, 35)}

          <View style={{ height: mvs(25) }} />

          {/* Others Section */}
          <Text style={styles.filterSectionTitle}>Others</Text>
          <View style={styles.segmentedControlOutline}>
            {['New matches', 'Online', 'Archived'].map((option) => {
              const isActive = option === filterOthers;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.segmentBtnOutline, isActive && styles.segmentBtnOutlineActive]}
                  onPress={() => setFilterOthers(option)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentTextOutline, isActive && styles.segmentTextOutlineActive]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Apply Button */}
          <TouchableOpacity style={styles.applyBtn} onPress={() => setIsFilterVisible(false)}>
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: mvs(10),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingTop: mvs(10),
    paddingBottom: mvs(15),
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: normalize(32),
    color: COLORS.black,
  },
  headerActionsFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10), // Adding gap for modern React Native
  },
  headerBtn: {
    width: ms(45),
    height: ms(45),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginLeft: ms(10), // Fallback gap
  },
  headerIcon: {
    width: ms(20),
    height: ms(20),
    tintColor: COLORS.black,
  },
  scrollContent: {
    paddingBottom: mvs(100), // clearance for bottom navigator
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: normalize(16),
    color: COLORS.black,
    paddingHorizontal: ms(20),
    marginBottom: mvs(15),
  },
  activitiesScroll: {
    paddingHorizontal: ms(15), // Accommodate item padding
    marginBottom: mvs(25),
  },
  activityColumn: {
    alignItems: 'center',
    marginHorizontal: ms(8),
  },
  ringContainer: {
    width: ms(66),
    height: ms(66),
    borderRadius: ms(33),
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringInnerSpace: {
    width: ms(62),
    height: ms(62),
    borderRadius: ms(31),
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityImage: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(28),
  },
  activityName: {
    fontFamily: FONTS.semiBold,
    fontSize: normalize(12),
    color: COLORS.black,
    marginTop: mvs(8),
  },
  filtersScroll: {
    paddingHorizontal: ms(20),
    marginBottom: mvs(25),
  },
  filterChip: {
    paddingHorizontal: ms(15),
    paddingVertical: mvs(8),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginRight: ms(12),
    backgroundColor: COLORS.white,
  },
  filterChipActive: {
    borderColor: COLORS.primary,
  },
  filterText: {
    fontFamily: FONTS.regular,
    fontSize: normalize(14),
    color: COLORS.textTertiary,
  },
  filterTextActive: {
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  messagesList: {
    paddingHorizontal: ms(20),
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mvs(20),
  },
  msgAvatarWrapper: {
    width: ms(55),
    height: ms(55),
    borderRadius: ms(27.5),
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: ms(2),
  },
  msgAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: ms(25),
  },
  msgDetails: {
    flex: 1,
    marginLeft: ms(15),
  },
  msgTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(4),
  },
  msgNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgName: {
    fontFamily: FONTS.bold,
    fontSize: normalize(15),
    color: COLORS.black,
  },
  starIconSmall: {
    width: ms(12),
    height: ms(12),
    tintColor: '#FF9500',
    marginLeft: ms(5),
  },
  msgTime: {
    fontFamily: FONTS.regular,
    fontSize: normalize(11),
    color: COLORS.textTertiary,
  },
  msgBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  msgText: {
    fontFamily: FONTS.regular,
    fontSize: normalize(13),
    color: COLORS.textTertiary,
    flex: 1,
    marginRight: ms(15),
  },
  unreadBadge: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(10),
    color: COLORS.white,
  },

  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: ms(30),
    borderTopRightRadius: ms(30),
    paddingHorizontal: ms(20),
    paddingBottom: mvs(30),
    paddingTop: mvs(10),
  },
  modalHandle: {
    width: ms(40),
    height: mvs(5),
    backgroundColor: '#EAEAEA',
    borderRadius: ms(3),
    alignSelf: 'center',
    marginBottom: mvs(20),
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(25),
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: normalize(18),
    color: COLORS.black,
  },
  clearText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(12),
    color: '#ff4da6', // Pink
    width: ms(40),
    textAlign: 'right',
  },
  filterSectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: normalize(12),
    color: COLORS.black,
    marginBottom: mvs(15),
  },
  segmentedControl: {
    flexDirection: 'row',
    height: mvs(50),
    backgroundColor: COLORS.white,
    borderRadius: ms(15),
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: mvs(25),
    overflow: 'hidden',
  },
  segmentBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EAEAEA',
  },
  segmentBtnActive: {
    backgroundColor: '#ff4da6',
    borderRightWidth: 0,
  },
  segmentText: {
    fontFamily: FONTS.regular,
    fontSize: normalize(12),
    color: COLORS.black,
  },
  segmentTextActive: {
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  segmentedControlOutline: {
    flexDirection: 'row',
    height: mvs(45),
    backgroundColor: COLORS.white,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: mvs(30),
    overflow: 'hidden',
  },
  segmentBtnOutline: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EAEAEA',
  },
  segmentBtnOutlineActive: {
    backgroundColor: '#FAFAFA', // Slight grey
  },
  segmentTextOutline: {
    fontFamily: FONTS.regular,
    fontSize: normalize(10),
    color: COLORS.textTertiary,
  },
  segmentTextOutlineActive: {
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  sliderTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderValueText: {
    fontFamily: FONTS.regular,
    fontSize: normalize(11),
    color: COLORS.textTertiary,
  },
  sliderTrackContainer: {
    height: mvs(30),
    justifyContent: 'center',
    position: 'relative',
    marginTop: mvs(5),
  },
  sliderTrackBackground: {
    width: '100%',
    height: mvs(4),
    backgroundColor: '#EAEAEA',
    borderRadius: ms(2),
    position: 'absolute',
  },
  sliderTrackActive: {
    height: mvs(4),
    backgroundColor: '#ffb3e6', // Soft pink track
    borderRadius: ms(2),
    position: 'absolute',
  },
  sliderThumb: {
    position: 'absolute',
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    backgroundColor: '#ff4da6', // Vibrant pink thumb
    top: '50%',
    marginTop: -ms(12),
    marginLeft: -ms(12),
    borderWidth: 3,
    borderColor: '#FFF0F8', // subtle halo
  },
  applyBtn: {
    height: mvs(55),
    width: '100%',
    backgroundColor: '#ffb3e6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(16),
  },
  applyBtnText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(16),
    color: COLORS.white,
  },
});