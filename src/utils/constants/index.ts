// App configuration constants

interface AppConstants {
  readonly TOKEN: string;
  readonly BASE_URL: string;
  readonly PUSHER_APP_KEY: string;
  readonly PUSHER_APP_CLUSTER: string;
  readonly PUSHER_APP_ID: string;
}

export const constants: AppConstants = {
  TOKEN: 'TOKEN',
  BASE_URL: 'https://tinder.swastechinfo.in/api',
  PUSHER_APP_KEY: '6dc15316c4d3bd13decf',
  PUSHER_APP_CLUSTER: 'ap2',
  PUSHER_APP_ID: '2149239',
} as const;

// Colors extracted from Figma design
export const COLORS = {
  // Primary brand colors
  primary: '#FF30BB', // Blaze Orange
  primaryLight: '#FEA3E0', // Blaze Orange

  // Semantic colors
  success: '#34A853', // Chateau Green
  warning: '#FBBC04', // Blaze Orange (same as primary)
  error: '#EB001B', // Red
  info: '#4285F4', // Cornflower Blue

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  codGray: '#1C1C1C',
  shuttleGray: '#5F6368',
  waterloo: '#808191',
  alto: '#D9D9D9',
  whiteLinen: '#F8F2EA',

  // Additional gray variants
  gray: '#5F6368', // Using shuttleGray as the main gray
  lightGray: '#E8E6EA', // Using alto as light gray
  darkGray: '#1C1C1C', // Using codGray as dark gray
  mediumGray: '#959595', // Medium gray for borders and placeholders
  lightestGray: '#E5E5E5', // Very light gray for backgrounds
  placeholderGray: '#989898', // Placeholder text color
  subtleGray: '#666666', // Subtle text color
  mutedGray: '#7C7C7C', // Muted text color
  charcoal: '#333333', // Charcoal color for text

  // Additional UI colors
  accent: '#FF9D33', // Orange accent color
  backgroundTertiary: '#FAFAFA', // Very light background
  accentLight: '#97DFEC', // Light blue accent
  headerBlue: '#007AFF', // Header background blue
  red: '#FF3B30', // Red color for errors

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F2EA',
  surface: '#F8F2EA',

  // Text colors
  textPrimary: '#000000',
  textSecondary: '#1C1C1C',
  textTertiary: 'rgba(0, 0, 0, 0.7)',
  placeholder: '#808191',

  // Border colors
  border: '#D9D9D9',
  borderLight: '#D4CEC6',

  // Additional colors from design
  lightBackground: '#EEFFFD', // Light mint background
  flashSaleBg: '#FFB039', // Flash sale background with opacity
  productBackground: '#F2F2F2', // Product placeholder background
  borderGray: '#E6E8EC', // Product card border
  priceStriked: '#828282', // Striked price color
  yellowAccent: '#FBFF2E', // Yellow accent color
  pinkAccent: '#E76AAD', // Pink accent color
  lightMint: '#C7E2EE', // Light mint color
  blackText: '#212121', // Black text color
  notificationRed: '#F80036', // Notification red color
  lightGreen: '#F0F0F0', // Light green divider
};


export const FONTS = {
  // Font Sizes
  black: 'Urbanist-Black',
  blackItalic: 'Urbanist-BlackItalic',
  bold: 'Urbanist-Bold',
  boldItalic: 'Urbanist-BoldItalic',
  extraBold: 'Urbanist-ExtraBold',
  extraBoldItalic: 'Urbanist-ExtraBoldItalic',
  extraLight: 'Urbanist-ExtraLight',
  extraLightItalic: 'Urbanist-ExtraLightItalic',
  italic: 'Urbanist-Italic',
  light: 'Urbanist-Light',
  lightItalic: 'Urbanist-LightItalic',
  medium: 'Urbanist-Medium',
  mediumItalic: 'Urbanist-MediumItalic',
  regular: 'Urbanist-Regular',
  semiBold: 'Urbanist-SemiBold',
  semiBoldItalic: 'Urbanist-SemiBoldItalic',
  thin: 'Urbanist-Thin',
  thinItalic: 'Urbanist-ThinItalic',
};

export const ICONS = {
  apple: require('../../assets/icons/apple.png'),
  art: require('../../assets/icons/Art.png'),
  back: require('../../assets/icons/back.png'),
  calendar: require('../../assets/icons/Calendar.png'),
  cameraProfile: require('../../assets/icons/camera_profile.png'),
  cardActive: require('../../assets/icons/card_active.png'),
  cardInactive: require('../../assets/icons/card_inactive.png'),
  chat: require('../../assets/icons/chat.png'),
  checkSmall: require('../../assets/icons/check_small.png'),
  closeSmall: require('../../assets/icons/close_small.png'),
  contactUs: require('../../assets/icons/Contact_Us.png'),
  cooking: require('../../assets/icons/Cooking.png'),
  delete: require('../../assets/icons/delete.png'),
  done: require('../../assets/icons/done.png'),
  drink: require('../../assets/icons/drink.png'),
  extreme: require('../../assets/icons/Extreme.png'),
  facebook: require('../../assets/icons/facebook.png'),
  filter: require('../../assets/icons/Filter.png'),
  google: require('../../assets/icons/google.png'),
  karaoke: require('../../assets/icons/Karaoke.png'),
  like: require('../../assets/icons/like.png'),
  location: require('../../assets/icons/location.png'),
  logo: require('../../assets/icons/logo.png'),
  matchesActive: require('../../assets/icons/Matches_active.png'),
  matchesInactive: require('../../assets/icons/Matches_inactive.png'),
  message: require('../../assets/icons/message.png'),
  messageActive: require('../../assets/icons/message_active.png'),
  messageInactive: require('../../assets/icons/message_inactive.png'),
  music: require('../../assets/icons/music.png'),
  myPreferences: require('../../assets/icons/MyPreferences.png'),
  next: require('../../assets/icons/next.png'),
  notifications: require('../../assets/icons/Notifications.png'),
  peopleActive: require('../../assets/icons/people_active.png'),
  peopleInactive: require('../../assets/icons/people_inactive.png'),
  photography: require('../../assets/icons/Photography.png'),
  privacyPolicy: require('../../assets/icons/PrivacyPolicy.png'),
  profileEdit: require('../../assets/icons/ProfileEdit.png'),
  rateThisApp: require('../../assets/icons/Rate_this_app.png'),
  run: require('../../assets/icons/Run.png'),
  search: require('../../assets/icons/search.png'),
  send: require('../../assets/icons/send.png'),
  shopping: require('../../assets/icons/Shopping.png'),
  sort: require('../../assets/icons/sort.png'),
  splashLogo: require('../../assets/icons/SplashLogo.png'),
  star: require('../../assets/icons/star.png'),
  stickers: require('../../assets/icons/stickers.png'),
  swimming: require('../../assets/icons/Swimming.png'),
  tennis: require('../../assets/icons/tennis.png'),
  termsOfUse: require('../../assets/icons/Terms_of_use.png'),
  threeDot: require('../../assets/icons/threeDot.png'),
  traveling: require('../../assets/icons/Traveling.png'),
  vectorPinkNext: require('../../assets/icons/VectorPinkNext.png'),
  videoGames: require('../../assets/icons/video_games.png'),
  yoga: require('../../assets/icons/Yoga.png'),
};

export const IMAGES = {
  demoFour: require('../../assets/images/demofour.png'),
  demoOne: require('../../assets/images/demoone.png'),
  demoThree: require('../../assets/images/demothree.png'),
  demoTwo: require('../../assets/images/demotwo.png'),
  onboardingOne: require('../../assets/images/onboardingOne.png'),
  onboardingThree: require('../../assets/images/onboardingThree.png'),
  onboardingTwo: require('../../assets/images/onboardingTwo.png'),
  reg: require('../../assets/images/reg.png'),
};
export const GIFS = {
  leftLike: require('../../assets/gif/leftlike.png'),
  likeLoader: require('../../assets/gif/LikeLoader.gif'),
  loader: require('../../assets/gif/loader.gif'),
  main: require('../../assets/gif/main.gif'),
  rightLike: require('../../assets/gif/rightlike.png'),
};

// export const SCREEN_NAMES = {
//   // Auth
//   LOGIN: 'Login',
// };

export * from './countries';
