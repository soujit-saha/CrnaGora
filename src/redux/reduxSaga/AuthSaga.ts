import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import ToastAlert from '../../utils/helper/Toast';
import {

  getTokenFailure,
  getTokenSuccess,

  logoutFailure,
  logoutSuccess,
  profileSetUpFailure,
  profileSetUpSuccess,

  socialAuthSuccess,
  socialAuthFailure,
  storeTempToken,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOTPSuccess,
  verifyOTPFailure,
  hobbiesSuccess,
  hobbiesFailure,
  settingSuccess,
  settingFailure,
  masterdropdownSuccess,
  masterdropdownFailure,
  plansSuccess,
  plansFailure,
  notificationSetUpSuccess,
  notificationSetUpFailure,

} from '../reducer/AuthReducer';
// import { getApi, postApi } from '../../utils/helper/ApiRequest';
import { ApiHeaders, ApiResponse } from '../types';
import { constants } from '../../utils/constants';
import { getApi, postApi } from '../../utils/helper/ApiRequest';
import { goBack, navigate } from '../../utils/helper/RootNavigation';


// Define types for action payloads
interface LoginPayload {
  email: string;
  password: string;
}

interface LogoutPayload {
  showMsg: boolean;
}

const getItems = (state: any) => state.AuthReducer;

//Checking Saga
export function* getTokenSaga(): Generator<any, void, any> {
  try {
    const response: string | null = yield call(
      AsyncStorage.getItem,
      constants?.TOKEN,
    );

    if (response != null) {
      const tokenData = JSON.parse(response);
      yield put(getTokenSuccess(tokenData));
    } else {
      yield put(getTokenSuccess(null)); // Provide default empty token instead of null
    }
  } catch (error: any) {
    yield put(getTokenFailure(error));
  }
}

//socialAuth saga
export function* socialAuthSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'social/login',
      action.payload,
      header,
    );

    yield put(socialAuthSuccess(response?.data));
    yield put(storeTempToken(response?.data?.data?.token));

    if (response?.data?.data?.user?.display_name == null) {
      navigate('AgreeTerms');
    } else {
      yield call(
        AsyncStorage.setItem,
        constants.TOKEN,
        JSON.stringify(response?.data?.data?.token),
      );
      yield put(getTokenSuccess(response?.data?.data?.token || null));
      // yield put(loginSuccess(response?.data?.data?.token));
      ToastAlert('Login Successful');
    }
  } catch (error: any) {
    console.log(error);
    yield put(socialAuthFailure(error));
    ToastAlert(error?.response?.data?.message || 'Social Auth Failed');
  }
}

//hobbies saga
export function* plansSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
    accesstoken: item.getTokenResponse || item.verifyOTPRes?.token,

  };
  try {
    const response: ApiResponse = yield call(
      getApi,
      'plans/?plan_type=' + action.payload,
      header,
    );

    console.log("118", response)
    yield put(plansSuccess(response?.data?.data));
    // navigate('Otp', action.payload)

  } catch (error: any) {
    console.log(error);
    yield put(plansFailure(error));
    ToastAlert(error?.response?.data?.message || 'Social Auth Failed');
  }
}

//hobbies saga
export function* hobbiesSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      getApi,
      'hobbies',
      header,
    );

    console.log("118", response)
    yield put(hobbiesSuccess(response?.data?.data));
    // navigate('Otp', action.payload)

  } catch (error: any) {
    console.log(error);
    yield put(hobbiesFailure(error));
    ToastAlert(error?.response?.data?.message || 'Social Auth Failed');
  }
}

//setting saga
export function* settingSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      getApi,
      'setting',
      header,
    );

    console.log("118", response)
    yield put(settingSuccess(response?.data?.data));
    // navigate('Otp', action.payload)

  } catch (error: any) {
    console.log(error);
    yield put(settingFailure(error));
    ToastAlert(error?.response?.data?.message || 'Social Auth Failed');
  }
}

//masterdropdown saga
export function* masterdropdownSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      getApi,
      'master/dropdown',
      header,
    );

    console.log("118", response)
    yield put(masterdropdownSuccess(response?.data?.data));
    // navigate('Otp', action.payload)

  } catch (error: any) {
    console.log(error);
    yield put(masterdropdownFailure(error));
    ToastAlert(error?.response?.data?.message || 'Social Auth Failed');
  }
}

//sendOtp saga
export function* sendOtpSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'login',
      action.payload,
      header,
    );

    console.log("response", response)
    yield put(sendOtpSuccess(response?.data?.data));
    navigate('Otp', action.payload)

  } catch (error: any) {
    console.log(error);
    yield put(sendOtpFailure(error));
    ToastAlert(error?.response?.data?.message || 'Social Auth Failed');
  }
}

//verifyOTPsaga
export function* verifyOTPSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    const response: ApiResponse = yield call(
      postApi,
      'verify-otp',
      action.payload,
      header,
    );

    // console.log("response", response)
    yield put(verifyOTPSuccess(response?.data?.data));
    // navigate('Otp', action.payload)

    if (response?.data?.data?.user?.name == null) {
      navigate('ProfileDetails');
    } else {
      yield call(
        AsyncStorage.setItem,
        constants.TOKEN,
        JSON.stringify(response?.data?.data?.token),
      );
      yield put(getTokenSuccess(response?.data?.data?.token || null));
      yield put(verifyOTPSuccess(response?.data?.data));
      ToastAlert('Login Successful');
    }

  } catch (error: any) {
    console.log(error);
    yield put(verifyOTPFailure(error));
    ToastAlert(error?.response?.data?.message || 'Social Auth Failed');
  }
}

//login saga
export function* profileSetUpSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  console.log('153', item.verifyOTPRes?.token);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    accesstoken: item.verifyOTPRes?.token,
  };
  try {
    const data = action.payload;

    // Build FormData here so the Redux action payload stays serializable
    const formData = new FormData();

    const scalarFields = [
      'name',
      'dob',
      'gender',
      'dating_preferences',
      'profession',
      'location',

    ];
    scalarFields.forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, String(data[key]));
      }
    });

    // Hobbies – flat array of item IDs
    (data.hobbies ?? []).forEach((id: any, index: number) => {
      formData.append(`hobbies[${index}]`, String(id));
    });

    // Profile image
    // if (data.profile_image?.uri) {
    //   formData.append('profile_image', {
    //     uri: data.profile_image.uri,
    //     name: data.profile_image.name ?? 'profile_image.jpg',
    //     type: data.profile_image.type ?? 'image/jpeg',
    //   } as any);
    // }

    // Gallery images
    // (data.gallary ?? data.gallery ?? []).forEach(
    //   (asset: any, index: number) => {
    //     if (asset?.uri) {
    //       formData.append(`gallery_images[${index}]`, {
    //         uri: asset.uri,
    //         name: asset.name ?? `photo_${index}.jpg`,
    //         type: asset.type ?? 'image/jpeg',
    //       } as any);
    //     }
    //   },
    // );
    console.log('39', formData);


    const response: ApiResponse = yield call(
      postApi,
      'setup-profile',
      formData,
      header,
    );
    console.log('39', response);
    if (response?.status == 201 || response?.status == 200) {
      yield put(profileSetUpSuccess(response?.data?.access_token));
      navigate('Sucessful')
    } else {
      yield put(profileSetUpFailure(response?.data));
    }
  } catch (error: any) {
    console.log(error);
    yield put(profileSetUpFailure(error));
    ToastAlert(error?.response?.data?.message || 'Profile Setup Failed');
  }
}

//notificationSetUp saga
export function* notificationSetUpSaga(
  action: PayloadAction<any>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  console.log('153', item.verifyOTPRes?.token);
  const header: ApiHeaders = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    accesstoken: item.getTokenResponse || item.verifyOTPRes?.token,
  };
  try {
    const data = action.payload;

    // Build FormData here so the Redux action payload stays serializable
    const formData = new FormData();

    const scalarFields = [
      'enable_notification',


    ];

    scalarFields.forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, String(data[key]));
      }
    });



    const response: ApiResponse = yield call(
      postApi,
      'setup-profile',
      formData,
      header,
    );
    console.log('39', response);
    if (response?.status == 201 || response?.status == 200) {
      yield put(notificationSetUpSuccess(response?.data?.access_token));
      navigate('Plan')
    } else {
      yield put(notificationSetUpFailure(response?.data));
    }
  } catch (error: any) {
    console.log(error);
    yield put(notificationSetUpFailure(error));
    ToastAlert(error?.response?.data?.message || 'Profile Setup Failed');
  }
}

//logout saga
export function* saveTokenToLoginSaga(
  action: PayloadAction<LogoutPayload>,
): Generator<any, void, any> {
  const item = yield select(getItems);
  console.log('153', item.verifyOTPRes?.token);
  try {
    yield call(
      AsyncStorage.setItem,
      constants.TOKEN,
      JSON.stringify(item.verifyOTPRes?.token),
    );
    yield put(getTokenSuccess(item.verifyOTPRes?.token || null));

  } catch (error: any) {
    console.log(error);

  }
}

//logout saga
export function* logoutSaga(
  action: PayloadAction<LogoutPayload>,
): Generator<any, void, any> {
  try {
    yield call(AsyncStorage.removeItem, constants.TOKEN);
    yield put(getTokenSuccess(null)); // Provide default empty token instead of null
    yield put(logoutSuccess({ message: 'logout', success: true }));
    // if (action.payload.showMsg) {
    ToastAlert('Logout Successful');
    // }
  } catch (error: any) {
    yield put(logoutFailure(error));
    ToastAlert('Logout Failed');
  }
}

//logout saga
// export function* tokenLoginSaga(
//   action: PayloadAction<LogoutPayload>,
// ): Generator<any, void, any> {
//   const item = yield select(getItems);
//   try {
//     yield call(
//       AsyncStorage.setItem,
//       constants.TOKEN,
//       JSON.stringify(item.storeTempTokenRes),
//     );
//     yield put(getTokenSuccess(item.storeTempTokenRes || null));
//     yield put(loginSuccess(item.storeTempTokenRes));
//     ToastAlert('Signup Successful');
//     yield put(tokenLoginSuccess(item.storeTempTokenRes));
//   } catch (error: any) {
//     yield put(tokenLoginFailure(error));
//     ToastAlert('Token Login Failed');
//   }
// }

// Watcher Saga
export function* watchAuthSaga(): Generator<any, void, any> {
  yield takeLatest('Auth/getTokenRequest', getTokenSaga);
  yield takeLatest('Auth/logoutRequest', logoutSaga);
  yield takeLatest('Auth/profileSetUpRequest', profileSetUpSaga);
  yield takeLatest('Auth/notificationSetUpRequest', notificationSetUpSaga);
  yield takeLatest('Auth/socialAuthRequest', socialAuthSaga);
  yield takeLatest('Auth/sendOtpRequest', sendOtpSaga);
  yield takeLatest('Auth/verifyOTPRequest', verifyOTPSaga);
  yield takeLatest('Auth/hobbiesRequest', hobbiesSaga);
  yield takeLatest('Auth/saveTokenToLogin', saveTokenToLoginSaga);
  yield takeLatest('Auth/settingRequest', settingSaga);
  yield takeLatest('Auth/masterdropdownRequest', masterdropdownSaga);
  yield takeLatest('Auth/plansRequest', plansSaga);
}
