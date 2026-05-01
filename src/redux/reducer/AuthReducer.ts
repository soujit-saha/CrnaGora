import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  status: string;
  isLoading: boolean;
  isReqLoading: boolean;
  getTokenResponse: string | null;
  sendOtpRes: {};
  logoutResponse: {};
  error?: string;
  signUpRes: {};
  verifyOTPRes: {};
  safetyPolicyRes: {};
  storeProfileSetupDataRes?: {};
  profileSetUpRes?: {};
  usernameCheckRes?: {};
  masterDataRes?: {};
  hobbiesRes?: [];
  socialAuthRes?: {};
  storeTempTokenRes?: string | null;
  ResetPasswordRes?: {};
  ForgotPasswordRes?: {};
  forgotPageCountRes?: number;
  signUpPageCountRes?: boolean;
  tokenLoginRes?: {};
  saveTokenToLoginRes?: {};
  masterdropdownRes?: {};
  settingRes?: {};
  plansRes?: {};
  notificationSetUpRes?: {};
}

const initialState: AuthState = {
  status: '',
  isLoading: true,
  isReqLoading: false,
  getTokenResponse: '',
  sendOtpRes: {},
  logoutResponse: {},
  signUpRes: {},
  verifyOTPRes: {},
  safetyPolicyRes: {},
  storeProfileSetupDataRes: {},
  profileSetUpRes: {},
  usernameCheckRes: {},
  masterDataRes: {},
  hobbiesRes: [],
  socialAuthRes: {},
  storeTempTokenRes: '',
  ResetPasswordRes: {},
  ForgotPasswordRes: {},
  forgotPageCountRes: 0,
  signUpPageCountRes: false,
  tokenLoginRes: {},
  saveTokenToLoginRes: {},
  masterdropdownRes: {},
  settingRes: {},
  plansRes: {},
  notificationSetUpRes: {},
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    //get token
    getTokenRequest(state, action: PayloadAction<void>) {
      state.isLoading = true;
      state.status = action.type;
    },
    getTokenSuccess(state, action: PayloadAction<string | null>) {
      state.isLoading = false;
      state.getTokenResponse = action.payload;
      state.status = action.type;
    },
    getTokenFailure(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.error = action.payload?.error || 'Get token failed';
      state.status = action.type;
    },

    //login
    sendOtpRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    sendOtpSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.sendOtpRes = action.payload;
      state.status = action.type;
    },
    sendOtpFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'Login failed';
      state.status = action.type;
    },

    //login
    verifyOTPRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    verifyOTPSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.verifyOTPRes = action.payload;
      state.status = action.type;
    },
    verifyOTPFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'verifyOTP failed';
      state.status = action.type;
    },

    //Profile Setup
    profileSetUpRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    profileSetUpSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.profileSetUpRes = action.payload;
      state.status = action.type;
    },
    profileSetUpFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'profileSetUp failed';
      state.status = action.type;
    },

    //Profile Setup
    notificationSetUpRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    notificationSetUpSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.notificationSetUpRes = action.payload;
      state.status = action.type;
    },
    notificationSetUpFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'profileSetUp failed';
      state.status = action.type;
    },

    //Social Auth
    socialAuthRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    socialAuthSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.socialAuthRes = action.payload;
      state.status = action.type;
    },
    socialAuthFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'socialAuth failed';
      state.status = action.type;
    },

    //Hobbies
    hobbiesRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    hobbiesSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.hobbiesRes = action.payload;
      state.status = action.type;
    },
    hobbiesFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'hobbies failed';
      state.status = action.type;
    },

    settingRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    settingSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.settingRes = action.payload;
      state.status = action.type;
    },
    settingFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'setting failed';
      state.status = action.type;
    },

    masterdropdownRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    masterdropdownSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.masterdropdownRes = action.payload;
      state.status = action.type;
    },
    masterdropdownFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'masterdropdown failed';
      state.status = action.type;
    },

    plansRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    plansSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.plansRes = action.payload;
      state.status = action.type;
    },
    plansFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'plans failed';
      state.status = action.type;
    },

    // Store Temp Token 
    storeTempToken(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.storeTempTokenRes = action.payload;
      state.status = action.type;
    },

    // Store Temp Token 
    saveTokenToLogin(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.saveTokenToLoginRes = action.payload;
      state.status = action.type;
    },

    //logout
    logoutRequest(state, action: PayloadAction<any>) {
      state.isReqLoading = true;
      state.status = action.type;
    },
    logoutSuccess(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.logoutResponse = action.payload;
      state.status = action.type;
    },
    logoutFailure(state, action: PayloadAction<any>) {
      state.isReqLoading = false;
      state.error = action.payload?.error || 'Logout failed';
      state.status = action.type;
    },
  },
});

export const {
  getTokenRequest,
  getTokenSuccess,
  getTokenFailure,

  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,

  logoutRequest,
  logoutSuccess,
  logoutFailure,

  verifyOTPRequest,
  verifyOTPSuccess,
  verifyOTPFailure,

  profileSetUpRequest,
  profileSetUpSuccess,
  profileSetUpFailure,

  socialAuthRequest,
  socialAuthSuccess,
  socialAuthFailure,

  storeTempToken,

  hobbiesRequest,
  hobbiesSuccess,
  hobbiesFailure,

  masterdropdownRequest,
  masterdropdownSuccess,
  masterdropdownFailure,

  settingRequest,
  settingSuccess,
  settingFailure,

  plansRequest,
  plansSuccess,
  plansFailure,

  saveTokenToLogin,

  notificationSetUpRequest,
  notificationSetUpSuccess,
  notificationSetUpFailure,
} = AuthSlice.actions;

export default AuthSlice.reducer;
