import AsyncStorage from '@react-native-async-storage/async-storage';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import ToastAlert from '../../utils/helper/Toast';
import {
    peopleListFailure,
    peopleListSuccess,
    createPaymentIntentSuccess,
    createPaymentIntentFailure,
    confirmPaymentSuccess,
    confirmPaymentFailure,
    getProfileSuccess,
    getProfileFailure,
    getPeopleDetailsSuccess,
    getPeopleDetailsFailure,
    swipeSuccess,
    swipeFailure,
    matchesListSuccess,
    matchesListFailure,
    matchesBlockSuccess,
    matchesBlockFailure,
    getStatusesSuccess, getStatusesFailure,
    createStatusSuccess, createStatusFailure,
    deleteStatusSuccess, deleteStatusFailure,
    reactStatusSuccess, reactStatusFailure,
    getStatusCommentsSuccess, getStatusCommentsFailure,
    addStatusCommentSuccess, addStatusCommentFailure,
    getUserStatusesSuccess, getUserStatusesFailure
} from '../reducer/MainReducer';
// import { getApi, postApi } from '../../utils/helper/ApiRequest';
import { ApiHeaders, ApiResponse } from '../types';
import { constants } from '../../utils/constants';
import { getApi, postApi, deleteApi } from '../../utils/helper/ApiRequest';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import { cacheSignal } from 'react';
import { getTokenSuccess } from '../reducer/AuthReducer';



const getItems = (state: any) => state.AuthReducer;


//people list saga
export function* peopleListSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    console.log("item", item.getTokenResponse)
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.getTokenResponse,
    };
    try {
        const page = action.payload?.page || 1;
        const limit = action.payload?.limit || 10;
        const response: ApiResponse = yield call(
            getApi,
            `users?page=${page}&limit=${limit}`,
            header,
        );

        console.log("118", response)
        yield put(peopleListSuccess({
            data: response?.data?.data?.data || [],
            page: page
        }));


    } catch (error: any) {
        console.log(error);
        yield put(peopleListFailure(error));
        ToastAlert(error?.response?.data?.message || 'Social Main Failed');
    }
}

export function* createPaymentIntentSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    console.log("item", item.verifyOTPRes?.token)
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.verifyOTPRes?.token,
    };
    try {
        const response: ApiResponse = yield call(
            postApi,
            'create-payment-intent',
            action.payload,
            header,
        );

        console.log("create-payment-intent res", response)
        yield put(createPaymentIntentSuccess(response?.data));

    } catch (error: any) {
        console.log(error);
        yield put(createPaymentIntentFailure(error));
        ToastAlert(error?.response?.data?.message || 'Create Payment Intent Failed');
    }
}

export function* confirmPaymentSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.verifyOTPRes?.token,
    };
    try {
        const response: ApiResponse = yield call(
            postApi,
            'confirm-payment',
            action.payload,
            header,
        );

        console.log("confirm-payment res", response)
        yield put(confirmPaymentSuccess(response?.data));
        ToastAlert(response?.data?.message || 'Your payment is confirmed!');

        yield call(
            AsyncStorage.setItem,
            constants.TOKEN,
            JSON.stringify(item.verifyOTPRes?.token),
        );
        yield put(getTokenSuccess(item.verifyOTPRes?.token || null));
        // navigate("UpgradePlan")

    } catch (error: any) {
        console.log(error);
        yield put(confirmPaymentFailure(error));
        ToastAlert(error?.response?.data?.message || 'Payment Failed');
    }
}

export function* getProfileSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.getTokenResponse,
    };
    try {
        const response: ApiResponse = yield call(
            postApi,
            'get/profile',
            action.payload,
            header,
        );

        console.log("profile res", response)
        yield put(getProfileSuccess(response?.data));

    } catch (error: any) {
        console.log(error);
        yield put(getProfileFailure(error));
        ToastAlert(error?.response?.data?.message || 'Profile Failed');
    }
}

export function* getPeopleDetailsSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.getTokenResponse,
    };
    try {
        const response: ApiResponse = yield call(

            getApi,
            'users/' + action.payload,
            header,
        );

        console.log("profile details res", response)
        yield put(getPeopleDetailsSuccess(response?.data));

    } catch (error: any) {
        console.log(error);
        yield put(getPeopleDetailsFailure(error));
        ToastAlert(error?.response?.data?.message || 'Profile Details Failed');
    }
}

export function* swipeSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.getTokenResponse,
    };
    try {
        const response: ApiResponse = yield call(
            postApi,
            'swipe',
            action.payload,
            header,
        );

        console.log("swipe res", response)
        yield put(swipeSuccess(response?.data?.data));

    } catch (error: any) {
        console.log(error);
        yield put(swipeFailure(error));
        ToastAlert(error?.response?.data?.message || 'Swipe Failed');
    }
}

export function* matchesListSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.getTokenResponse,
    };
    try {
        const response: ApiResponse = yield call(
            getApi,
            'matches',
            header,
        );

        console.log("matches res", response)
        yield put(matchesListSuccess(response?.data));

    } catch (error: any) {
        console.log(error);
        yield put(matchesListFailure(error));
        ToastAlert(error?.response?.data?.message || 'Matches Failed');
    }
}

export function* matchesBlockSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.getTokenResponse,
    };
    try {
        const response: ApiResponse = yield call(
            postApi,
            'matches/block/' + action.payload.id,
            action.payload.body,
            header,
        );

        console.log("matches/block res", response)
        yield put(matchesBlockSuccess(response?.data));

    } catch (error: any) {
        console.log(error);
        yield put(matchesBlockFailure(error));
        ToastAlert(error?.response?.data?.message || 'Matches Block Failed');
    }
}

// export function* profileSetUpSaga(
//   action: PayloadAction<any>,
// ): Generator<any, void, any> {
//   const item = yield select(getItems);
//   console.log('153', item.verifyOTPRes?.token);
//   const header: ApiHeaders = {
//     Accept: 'application/json',
//     contenttype: 'multipart/form-data',
//     accesstoken: item.verifyOTPRes?.token,
//   };
//   try {
//     const data = action.payload;

//     // Build FormData here so the Redux action payload stays serializable
//     const formData = new FormData();

//     const scalarFields = [
//       'name',
//       'dob',
//       'gender',
//       'dating_preferences',
//       'profession',
//       'location',

//     ];
//     scalarFields.forEach(key => {
//       if (data[key] !== undefined && data[key] !== null) {
//         formData.append(key, String(data[key]));
//       }
//     });

//     // Hobbies – flat array of item IDs
//     (data.hobbies ?? []).forEach((id: any, index: number) => {
//       formData.append(`hobbies[${index}]`, String(id));
//     });

//     // Profile image
//     if (data.profile_image?.uri) {
//       formData.append('profile_image', {
//         uri: data.profile_image.uri,
//         name: data.profile_image.name ?? 'profile_image.jpg',
//         type: data.profile_image.type ?? 'image/jpeg',
//       } as any);
//     }

//     // Gallery images
//     // (data.gallary ?? data.gallery ?? []).forEach(
//     //   (asset: any, index: number) => {
//     //     if (asset?.uri) {
//     //       formData.append(`gallery_images[${index}]`, {
//     //         uri: asset.uri,
//     //         name: asset.name ?? `photo_${index}.jpg`,
//     //         type: asset.type ?? 'image/jpeg',
//     //       } as any);
//     //     }
//     //   },
//     // );

//     const response: ApiResponse = yield call(
//       postApi,
//       'setup-profile',
//       formData,
//       header,
//     );
//     console.log('39', response);
//     if (response?.status == 201 || response?.status == 200) {
//       yield put(profileSetUpSuccess(response?.data?.access_token));
//       navigate('Sucessful')
//     } else {
//       yield put(profileSetUpFailure(response?.data));
//     }
//   } catch (error: any) {
//     console.log(error);
//     yield put(profileSetUpFailure(error));
//     ToastAlert(error?.response?.data?.message || 'Profile Setup Failed');
//   }
// }









export function* getStatusesSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(getApi, 'statuses', header);
        yield put(getStatusesSuccess(response?.data));
    } catch (error: any) {
        yield put(getStatusesFailure(error));
        ToastAlert(error?.response?.data?.message || 'getStatuses Failed');
    }
}

export function* createStatusSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(postApi, 'statuses', action.payload, header);
        yield put(createStatusSuccess(response?.data));
    } catch (error: any) {
        yield put(createStatusFailure(error));
        ToastAlert(error?.response?.data?.message || 'createStatus Failed');
    }
}

export function* deleteStatusSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(deleteApi, 'statuses/' + action.payload.id, header);
        yield put(deleteStatusSuccess(response?.data));
    } catch (error: any) {
        yield put(deleteStatusFailure(error));
        ToastAlert(error?.response?.data?.message || 'deleteStatus Failed');
    }
}

export function* reactStatusSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(postApi, 'statuses/' + action.payload.id + '/react', action.payload, header);
        yield put(reactStatusSuccess(response?.data));
    } catch (error: any) {
        yield put(reactStatusFailure(error));
        ToastAlert(error?.response?.data?.message || 'reactStatus Failed');
    }
}

export function* getStatusCommentsSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(getApi, 'statuses/' + action.payload.id + '/comments', header);
        yield put(getStatusCommentsSuccess(response?.data));
    } catch (error: any) {
        yield put(getStatusCommentsFailure(error));
        ToastAlert(error?.response?.data?.message || 'getStatusComments Failed');
    }
}

export function* addStatusCommentSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(postApi, 'statuses/' + action.payload.id + '/comments', action.payload, header);
        yield put(addStatusCommentSuccess(response?.data));
    } catch (error: any) {
        yield put(addStatusCommentFailure(error));
        ToastAlert(error?.response?.data?.message || 'addStatusComment Failed');
    }
}

export function* getUserStatusesSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(getApi, 'statuses/user/' + action.payload.id, header);
        yield put(getUserStatusesSuccess(response?.data));
    } catch (error: any) {
        yield put(getUserStatusesFailure(error));
        ToastAlert(error?.response?.data?.message || 'getUserStatuses Failed');
    }
}

// Watcher Saga
export function* watchMainSaga(): Generator<any, void, any> {
    yield takeLatest('Main/peopleListRequest', peopleListSaga);
    yield takeLatest('Main/createPaymentIntentRequest', createPaymentIntentSaga);
    yield takeLatest('Main/confirmPaymentRequest', confirmPaymentSaga);
    yield takeLatest('Main/getProfileRequest', getProfileSaga);
    yield takeLatest('Main/getPeopleDetailsRequest', getPeopleDetailsSaga);
    yield takeLatest('Main/getStatusesRequest', getStatusesSaga);
    yield takeLatest('Main/createStatusRequest', createStatusSaga);
    yield takeLatest('Main/deleteStatusRequest', deleteStatusSaga);
    yield takeLatest('Main/reactStatusRequest', reactStatusSaga);
    yield takeLatest('Main/getStatusCommentsRequest', getStatusCommentsSaga);
    yield takeLatest('Main/addStatusCommentRequest', addStatusCommentSaga);
    yield takeLatest('Main/getUserStatusesRequest', getUserStatusesSaga);
    yield takeLatest('Main/swipeRequest', swipeSaga);
    yield takeLatest('Main/matchesListRequest', matchesListSaga);
    yield takeLatest('Main/matchesBlockRequest', matchesBlockSaga);
}
