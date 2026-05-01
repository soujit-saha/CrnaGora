import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { COLORS, FONTS, IMAGES } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import normalize from '../../utils/helper/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from '../../utils/helper/RootNavigation';
import CustomButton from '../../component/CustomButton';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Find Your Balkan Love',
    subtitle: 'Discover people who share your culture, humor, and passion',
    image: IMAGES.onboardingOne,
  },
  {
    id: '2',
    title: 'Authentic Balkan Singles',
    subtitle: 'From Zagreb to Belgrade, Sarajevo to Skopje, connect locally or globally',
    image: IMAGES.onboardingTwo,
  },
  {
    id: '3',
    title: 'Begin Your Journey',
    subtitle: 'Your perfect match is closer than you think',
    image: IMAGES.onboardingThree,
  },
];

const EXTENDED_SLIDES = [
  { ...SLIDES[SLIDES.length - 1], id: 'fake-prev' },
  ...SLIDES,
  { ...SLIDES[0], id: 'fake-next' },
];

const Onboarding = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const slidesRef = useRef<FlatList>(null);

  const slideWidth = width * 0.82;

  const getItemLayout = (_: any, index: number) => ({
    length: slideWidth,
    offset: slideWidth * index,
    index,
  });

  const onMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / slideWidth);

    if (index === 0) {
      slidesRef.current?.scrollToIndex({ index: SLIDES.length, animated: false });
      setCurrentIndex(SLIDES.length);
    } else if (index === EXTENDED_SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: 1, animated: false });
      setCurrentIndex(1);
    } else {
      setCurrentIndex(index);
    }
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={[styles.slide, { width: slideWidth }]}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => {
          let activeIndex = currentIndex - 1;
          if (activeIndex < 0) activeIndex = SLIDES.length - 1;
          if (activeIndex >= SLIDES.length) activeIndex = 0;

          return (
            <View
              key={`dot-${index}`}
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.content}>
        <FlatList
          data={EXTENDED_SLIDES}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={slideWidth}
          decelerationRate="fast"
          bounces={false}
          keyExtractor={(item) => item.id}
          ref={slidesRef}
          getItemLayout={getItemLayout}
          initialScrollIndex={1}
          onMomentumScrollEnd={onMomentumScrollEnd}
          contentContainerStyle={{ paddingHorizontal: (width - slideWidth) / 2 }}
        />
      </View>

      <View style={styles.footerContainer}>
        {renderDots()}

        <CustomButton
          title="Create an account"
          onPress={() => navigate('Signup', 1)}
        />

        <View style={styles.signInContainer}>
          <Text style={styles.signInLabel}>Already have an account? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('Signup', 2)}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 0.76,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '90%',
    height: height * 0.50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: mvs(20),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: ms(16),
  },
  textContainer: {
    flex: 1,
    paddingTop: mvs(15),
    alignItems: 'center',
    width: '80%',

  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: normalize(20),
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: mvs(8),
    includeFontPadding: false,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: normalize(12),
    color: '#323755',
    textAlign: 'center',
    includeFontPadding: false,
  },
  footerContainer: {
    flex: 0.24,
    paddingHorizontal: ms(40),
    justifyContent: 'flex-start',
    // paddingBottom: mvs(20),
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: mvs(30),
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: COLORS.lightGray,
    marginHorizontal: ms(4),
  },
  activeDot: {
    // width: ms(20),
    backgroundColor: COLORS.primaryLight,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: mvs(20),
  },
  signInLabel: {
    fontFamily: FONTS.regular,
    fontSize: normalize(14),
    color: COLORS.textTertiary,
  },
  signInText: {
    fontFamily: FONTS.bold,
    fontSize: normalize(14),
    color: COLORS.primary,
  },
});
