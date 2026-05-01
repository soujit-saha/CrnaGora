import React, { useEffect } from 'react';
import { StyleSheet, View, Image, StatusBar } from 'react-native';
import { COLORS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from '../../utils/helper/RootNavigation';
import { useDispatch } from 'react-redux';
import { getTokenRequest } from '../../redux/reducer/AuthReducer';

const SplashScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  // Navigate to Onboarding after a short delay (e.g., 2.5 seconds)
  useEffect(() => {

    const timer = setTimeout(() => {
      dispatch(getTokenRequest());
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.logoContainer}>
        <Image
          source={ICONS.splashLogo}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: ms(250),
    height: ms(250),
  },
});
