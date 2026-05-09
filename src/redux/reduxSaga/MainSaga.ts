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
    matchesListRequest,
    matchesListSuccess,
    matchesListFailure,
    matchesBlockRequest,
    matchesBlockSuccess,
    matchesBlockFailure,
    getStatusesSuccess, getStatusesFailure,
    createStatusSuccess, createStatusFailure,
    deleteStatusSuccess, deleteStatusFailure,
    reactStatusSuccess, reactStatusFailure,
    getStatusCommentsSuccess, getStatusCommentsFailure,
    addStatusCommentSuccess, addStatusCommentFailure,
    getUserStatusesSuccess, getUserStatusesFailure,
    getMyStatusesSuccess, getMyStatusesFailure,
    updateLocationSuccess, updateLocationFailure,
    chatListSuccess, chatListFailure,
    chatMessagesSuccess, chatMessagesFailure,
    startChatSuccess, startChatFailure,
    sendMessageSuccess, sendMessageFailure,
    markAsReadSuccess, markAsReadFailure,
    archiveChatSuccess, archiveChatFailure,
    muteChatSuccess, muteChatFailure,
    favoriteChatSuccess, favoriteChatFailure,
    unmatchUserSuccess, unmatchUserFailure,
} from '../reducer/MainReducer';
// import { getApi, postApi } from '../../utils/helper/ApiRequest';
import { ApiHeaders, ApiResponse } from '../types';
import { constants } from '../../utils/constants';
import { getApi, postApi, deleteApi } from '../../utils/helper/ApiRequest';
import { goBack, navigate } from '../../utils/helper/RootNavigation';
import { cacheSignal } from 'react';
import { getTokenSuccess } from '../reducer/AuthReducer';



const getItems = (state: any) => state.AuthReducer;
const getMainItems = (state: any) => state.MainReducer;


//people list saga
export function* peopleListSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    // console.log("item", item.getTokenResponse)
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
    console.log("item", item.storeTempTokenRes)
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.storeTempTokenRes,
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
        accesstoken: item?.getTokenResponse || item.storeTempTokenRes,
    };
    try {
        const response: ApiResponse = yield call(
            postApi,
            'confirm-payment',
            action.payload.body,
            header,
        );

        console.log("confirm-payment res", response)
        yield put(confirmPaymentSuccess(response?.data));
        ToastAlert(response?.data?.message || 'Your payment is confirmed!');
        if (action.payload.type === 1) {
            yield call(
                AsyncStorage.setItem,
                constants.TOKEN,
                JSON.stringify(item.storeTempTokenRes),
            );
            yield put(getTokenSuccess(item.storeTempTokenRes || null));
        }
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
        yield put(matchesListSuccess(response?.data?.data));

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
            {},
            header,
        );

        console.log("matches/block res", response)
        if (action.payload.type === 1) {
            yield put(matchesBlockSuccess(response?.data));
            yield put(matchesListRequest({}));

        } else {
            yield put(matchesBlockSuccess(response?.data));
            goBack()
        }


    } catch (error: any) {
        console.log(error);
        yield put(matchesBlockFailure(error));
        ToastAlert(error?.response?.data?.message || 'Matches Block Failed');
    }
}





export function* getStatusesSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(getApi, 'statuses', header);
        yield put(getStatusesSuccess(response?.data?.data));
    } catch (error: any) {
        yield put(getStatusesFailure(error));
        ToastAlert(error?.response?.data?.message || 'getStatuses Failed');
    }
}

export function* createStatusSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const mainItem = yield select(getMainItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'multipart/form-data', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(postApi, 'statuses', action.payload, header);
        console.log("createStatusSaga", response)
        yield put(createStatusSuccess(response?.data));
        ToastAlert("Status added successfully");

        // Refresh statuses
        yield put({ type: 'Main/getStatusesRequest', payload: {} });
        if (mainItem?.getProfileRes?.data?.id) {
            yield put({ type: 'Main/getMyStatusesRequest', payload: mainItem.getProfileRes.data.id });
        }
    } catch (error: any) {
        console.log("createStatusSaga Error", error)
        yield put(createStatusFailure(error));
        // ToastAlert(error?.response?.data?.message || 'createStatus Failed');
    }
}

export function* deleteStatusSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const mainItem = yield select(getMainItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const id = action.payload?.id || action.payload;
        const response: ApiResponse = yield call(deleteApi, 'statuses/' + id, header);
        yield put(deleteStatusSuccess(response?.data));

        // Refresh statuses
        yield put({ type: 'Main/getStatusesRequest', payload: {} });
        if (mainItem?.getProfileRes?.data?.id) {
            yield put({ type: 'Main/getMyStatusesRequest', payload: mainItem.getProfileRes.data.id });
        }
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

export function* getMyStatusesSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(getApi, 'statuses/user/' + action.payload, header);
        yield put(getMyStatusesSuccess(response?.data));
    } catch (error: any) {
        yield put(getMyStatusesFailure(error));
        ToastAlert(error?.response?.data?.message || 'getMyStatuses Failed');
    }
}

export function* updateLocationSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const response: ApiResponse = yield call(postApi, 'update-location', action.payload, header);
        yield put(updateLocationSuccess(response?.data));
    } catch (error: any) {
        yield put(updateLocationFailure(error));
        ToastAlert(error?.response?.data?.message || 'updateLocation Failed');
    }
}

// ===== CHAT SAGAS =====

export function* chatListSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.getTokenResponse,
    };
    try {
        const response: ApiResponse = yield call(postApi, 'chats', action.payload, header);
        console.log('chatList res', response);
        yield put(chatListSuccess(response?.data));
    } catch (error: any) {
        console.log(error);
        yield put(chatListFailure(error));
        ToastAlert(error?.response?.data?.message || 'Chat List Failed');
    }
}

export function* chatMessagesSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'application/json',
        accesstoken: item.getTokenResponse,
    };
    try {
        const chatId = action.payload?.chatId || action.payload;
        const response: ApiResponse = yield call(getApi, `chats/${chatId}/messages`, header);
        console.log('chatMessages res', JSON.stringify(response?.data)?.substring(0, 500));
        yield put(chatMessagesSuccess(response?.data));
    } catch (error: any) {
        console.log(error);
        yield put(chatMessagesFailure(error));
        ToastAlert(error?.response?.data?.message || 'Chat Messages Failed');
    }
}

export function* startChatSaga(
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
            'chats/store',
            action.payload,
            header,
        );
        console.log('startChat res', response);
        yield put(startChatSuccess(response?.data?.data || response?.data));
    } catch (error: any) {
        console.log(error);
        yield put(startChatFailure(error));
        ToastAlert(error?.response?.data?.message || 'Start Chat Failed');
    }
}

export function* sendMessageSaga(
    action: PayloadAction<any>,
): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = {
        Accept: 'application/json',
        contenttype: 'multipart/form-data',
        accesstoken: item.getTokenResponse,
    };
    try {
        const { chatId, type, message, attachment } = action.payload;

        const formData = new FormData();
        formData.append('type', type || 'text');
        if (message) {
            formData.append('message', message);
        }
        if (attachment) {
            formData.append('attachment', {
                uri: attachment.uri,
                name: attachment.name || 'file',
                type: attachment.type || 'application/octet-stream',
            } as any);
        }

        console.log('Sending message to:', `chats/${chatId}/messages`);
        console.log('Payload type:', type);
        console.log('Has attachment:', !!attachment);

        const response: ApiResponse = yield call(
            postApi,
            `chats/${chatId}/messages`,
            formData,
            header,
        );
        console.log('sendMessage res:', JSON.stringify(response?.data)?.substring(0, 500));
        yield put(sendMessageSuccess(response?.data?.data || response?.data));
    } catch (error: any) {
        console.log(error);
        yield put(sendMessageFailure(error));
        ToastAlert(error?.response?.data?.message || 'Send Message Failed');
    }
}

export function* markAsReadSaga(
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
            `statuses/${action?.payload}/read`,
            {},
            header,
        );
        console.log('markAsRead res', response);
        yield put(markAsReadSuccess(response?.data));
    } catch (error: any) {
        console.log(error);
        yield put(markAsReadFailure(error));
        // We might not want to toast for background tasks like marking as read
        // but following the pattern for now.
        // ToastAlert(error?.response?.data?.message || 'Mark as Read Failed');
    }
}

export function* archiveChatSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const chatId = action.payload?.chatId || action.payload?.chat || action.payload;
        const response: ApiResponse = yield call(postApi, `chats/${chatId}/archive`, {}, header);
        yield put(archiveChatSuccess(response?.data));
        goBack();
    } catch (error: any) {
        yield put(archiveChatFailure(error));
        ToastAlert(error?.response?.data?.message || 'Archive Chat Failed');
    }
}

export function* muteChatSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const chatId = action.payload?.chatId || action.payload?.chat || action.payload;
        const response: ApiResponse = yield call(postApi, `chats/${chatId}/mute`, {}, header);
        yield put(muteChatSuccess(response?.data));
        goBack();
    } catch (error: any) {
        yield put(muteChatFailure(error));
        ToastAlert(error?.response?.data?.message || 'Mute Chat Failed');
    }
}

export function* favoriteChatSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const chatId = action.payload?.chatId || action.payload?.chat || action.payload;
        const response: ApiResponse = yield call(postApi, `chats/${chatId}/favorite`, {}, header);
        yield put(favoriteChatSuccess(response?.data));
        goBack();
    } catch (error: any) {
        yield put(favoriteChatFailure(error));
        ToastAlert(error?.response?.data?.message || 'Favorite Chat Failed');
    }
}

export function* unmatchUserSaga(action: PayloadAction<any>): Generator<any, void, any> {
    const item = yield select(getItems);
    const header: ApiHeaders = { Accept: 'application/json', contenttype: 'application/json', accesstoken: item.getTokenResponse };
    try {
        const chatId = action.payload?.chatId || action.payload?.chat || action.payload;
        const response: ApiResponse = yield call(postApi, `chats/${chatId}/unmatch`, {}, header);
        yield put(unmatchUserSuccess(response?.data));
        goBack();
    } catch (error: any) {
        yield put(unmatchUserFailure(error));
        ToastAlert(error?.response?.data?.message || 'Unmatch User Failed');
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
    yield takeLatest('Main/getMyStatusesRequest', getMyStatusesSaga);
    yield takeLatest('Main/updateLocationRequest', updateLocationSaga);
    yield takeLatest('Main/swipeRequest', swipeSaga);
    yield takeLatest('Main/matchesListRequest', matchesListSaga);
    yield takeLatest('Main/matchesBlockRequest', matchesBlockSaga);
    // Chat
    yield takeLatest('Main/chatListRequest', chatListSaga);
    yield takeLatest('Main/chatMessagesRequest', chatMessagesSaga);
    yield takeLatest('Main/startChatRequest', startChatSaga);
    yield takeLatest('Main/sendMessageRequest', sendMessageSaga);
    yield takeLatest('Main/markAsReadRequest', markAsReadSaga);
    yield takeLatest('Main/archiveChatRequest', archiveChatSaga);
    yield takeLatest('Main/muteChatRequest', muteChatSaga);
    yield takeLatest('Main/favoriteChatRequest', favoriteChatSaga);
    yield takeLatest('Main/unmatchUserRequest', unmatchUserSaga);
}
