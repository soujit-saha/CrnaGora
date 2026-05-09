import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MainState {
    status: string;
    isMainLoading: boolean;
    error?: string;
    peopleListRes?: any;
    createPaymentIntentRes?: any;
    confirmPaymentRes?: any;
    getProfileRes?: any;
    getPeopleDetailsRes?: any;
    getStatusesRes?: any;
    createStatusRes?: any;
    deleteStatusRes?: any;
    reactStatusRes?: any;
    getStatusCommentsRes?: any;
    addStatusCommentRes?: any;
    getUserStatusesRes?: any;
    getMyStatusesRes?: any;
    swipeRes?: any;
    matchesListRes?: any;
    matchesBlockRes?: any;
    updateLocationRes?: any;
    // Chat
    isChatLoading: boolean;
    chatListRes?: any;
    chatMessagesRes?: any;
    startChatRes?: any;
    sendMessageRes?: any;
    markAsReadRes?: any;
    archiveChatRes?: any;
    muteChatRes?: any;
    favoriteChatRes?: any;
    unmatchUserRes?: any;
    fcmToken: string;
}

const initialState: MainState = {
    status: '',
    isMainLoading: false,
    peopleListRes: [],
    createPaymentIntentRes: {},
    confirmPaymentRes: {},
    getProfileRes: {},
    getPeopleDetailsRes: {},
    getStatusesRes: [],
    createStatusRes: {},
    deleteStatusRes: {},
    reactStatusRes: {},
    getStatusCommentsRes: [],
    addStatusCommentRes: {},
    getUserStatusesRes: [],
    getMyStatusesRes: [],
    swipeRes: {},
    matchesListRes: [],
    matchesBlockRes: [],
    updateLocationRes: {},
    // Chat
    isChatLoading: false,
    chatListRes: [],
    chatMessagesRes: [],
    startChatRes: {},
    sendMessageRes: {},
    markAsReadRes: {},
    archiveChatRes: {},
    muteChatRes: {},
    favoriteChatRes: {},
    unmatchUserRes: {},
    fcmToken: '',
};

const MainSlice = createSlice({
    name: 'Main',
    initialState,
    reducers: {
        storeFcmToken(state, action: PayloadAction<string>) {
            state.fcmToken = action.payload;
        },
        //getProfile Setup
        peopleListRequest(state, action: PayloadAction<any>) {
            state.isMainLoading = true;
            state.status = action.type;
        },
        peopleListSuccess(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            if (action.payload?.page === 1) {
                state.peopleListRes = action.payload.data;
            } else {
                state.peopleListRes = [...(state.peopleListRes || []), ...(action.payload.data || [])];
            }
            state.status = action.type;
        },
        peopleListFailure(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.error = action.payload?.error || 'userList failed';
            state.status = action.type;
        },

        // Create Payment Intent
        createPaymentIntentRequest(state, action: PayloadAction<any>) {
            state.isMainLoading = true;
            state.status = action.type;
        },
        createPaymentIntentSuccess(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.createPaymentIntentRes = action.payload;
            state.status = action.type;
        },
        createPaymentIntentFailure(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.error = action.payload?.error || 'createPaymentIntent failed';
            state.status = action.type;
        },

        // Confirm Payment
        confirmPaymentRequest(state, action: PayloadAction<any>) {
            state.isMainLoading = true;
            state.status = action.type;
        },
        confirmPaymentSuccess(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.confirmPaymentRes = action.payload;
            state.status = action.type;
        },
        confirmPaymentFailure(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.error = action.payload?.error || 'confirmPayment failed';
            state.status = action.type;
        },

        // getProfile
        getProfileRequest(state, action: PayloadAction<any>) {
            state.isMainLoading = true;
            state.status = action.type;
        },
        getProfileSuccess(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.getProfileRes = action.payload;
            state.status = action.type;
        },
        getProfileFailure(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.error = action.payload?.error || 'getProfile failed';
            state.status = action.type;
        },

        // getProfileDetails
        getPeopleDetailsRequest(state, action: PayloadAction<any>) {
            state.isMainLoading = true;
            state.status = action.type;
        },
        getPeopleDetailsSuccess(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.getPeopleDetailsRes = action.payload;
            state.status = action.type;
        },
        getPeopleDetailsFailure(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.error = action.payload?.error || 'getPeopleDetails failed';
            state.status = action.type;
        },

        // Statuses
        getStatusesRequest(state, action: PayloadAction<any>) { state.isMainLoading = true; state.status = action.type; },
        getStatusesSuccess(state, action: PayloadAction<any>) { state.isMainLoading = false; state.getStatusesRes = action.payload; state.status = action.type; },
        getStatusesFailure(state, action: PayloadAction<any>) { state.isMainLoading = false; state.error = action.payload?.error || 'getStatuses failed'; state.status = action.type; },

        createStatusRequest(state, action: PayloadAction<any>) { state.isMainLoading = true; state.status = action.type; },
        createStatusSuccess(state, action: PayloadAction<any>) { state.isMainLoading = false; state.createStatusRes = action.payload; state.status = action.type; },
        createStatusFailure(state, action: PayloadAction<any>) { state.isMainLoading = false; state.error = action.payload?.error || 'createStatus failed'; state.status = action.type; },

        deleteStatusRequest(state, action: PayloadAction<any>) { state.isMainLoading = true; state.status = action.type; },
        deleteStatusSuccess(state, action: PayloadAction<any>) { state.isMainLoading = false; state.deleteStatusRes = action.payload; state.status = action.type; },
        deleteStatusFailure(state, action: PayloadAction<any>) { state.isMainLoading = false; state.error = action.payload?.error || 'deleteStatus failed'; state.status = action.type; },

        reactStatusRequest(state, action: PayloadAction<any>) { state.isMainLoading = true; state.status = action.type; },
        reactStatusSuccess(state, action: PayloadAction<any>) { state.isMainLoading = false; state.reactStatusRes = action.payload; state.status = action.type; },
        reactStatusFailure(state, action: PayloadAction<any>) { state.isMainLoading = false; state.error = action.payload?.error || 'reactStatus failed'; state.status = action.type; },

        getStatusCommentsRequest(state, action: PayloadAction<any>) { state.isMainLoading = true; state.status = action.type; },
        getStatusCommentsSuccess(state, action: PayloadAction<any>) { state.isMainLoading = false; state.getStatusCommentsRes = action.payload; state.status = action.type; },
        getStatusCommentsFailure(state, action: PayloadAction<any>) { state.isMainLoading = false; state.error = action.payload?.error || 'getStatusComments failed'; state.status = action.type; },

        addStatusCommentRequest(state, action: PayloadAction<any>) { state.isMainLoading = true; state.status = action.type; },
        addStatusCommentSuccess(state, action: PayloadAction<any>) { state.isMainLoading = false; state.addStatusCommentRes = action.payload; state.status = action.type; },
        addStatusCommentFailure(state, action: PayloadAction<any>) { state.isMainLoading = false; state.error = action.payload?.error || 'addStatusComment failed'; state.status = action.type; },

        getUserStatusesRequest(state, action: PayloadAction<any>) { state.isMainLoading = true; state.status = action.type; },
        getUserStatusesSuccess(state, action: PayloadAction<any>) { state.isMainLoading = false; state.getUserStatusesRes = action.payload; state.status = action.type; },
        getUserStatusesFailure(state, action: PayloadAction<any>) { state.isMainLoading = false; state.error = action.payload?.error || 'getUserStatuses failed'; state.status = action.type; },

        getMyStatusesRequest(state, action: PayloadAction<any>) { state.isMainLoading = true; state.status = action.type; },
        getMyStatusesSuccess(state, action: PayloadAction<any>) { state.isMainLoading = false; state.getMyStatusesRes = action.payload; state.status = action.type; },
        getMyStatusesFailure(state, action: PayloadAction<any>) { state.isMainLoading = false; state.error = action.payload?.error || 'getMyStatuses failed'; state.status = action.type; },


        // update location
        updateLocationRequest(state, action: PayloadAction<any>) {
            // state.isMainLoading = true;
            state.status = action.type;
        },
        updateLocationSuccess(state, action: PayloadAction<any>) {
            // state.isMainLoading = false;
            state.updateLocationRes = action.payload; state.status = action.type;
        },
        updateLocationFailure(state, action: PayloadAction<any>) {

            // state.isMainLoading = false; 
            state.error = action.payload?.error || 'updateLocation failed'; state.status = action.type;
        },

        // Swipe
        swipeRequest(state, action: PayloadAction<any>) {
            // state.isMainLoading = true;
            state.status = action.type;
        },
        swipeSuccess(state, action: PayloadAction<any>) {
            // state.isMainLoading = false;
            state.swipeRes = action.payload;
            state.status = action.type;
        },
        swipeFailure(state, action: PayloadAction<any>) {
            // state.isMainLoading = false;
            state.error = action.payload?.error || 'swipe failed';
            state.status = action.type;
        },

        // Matches
        matchesListRequest(state, action: PayloadAction<any>) {
            state.isMainLoading = true;
            state.status = action.type;
        },
        matchesListSuccess(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.matchesListRes = action.payload;
            state.status = action.type;
        },
        matchesListFailure(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.error = action.payload?.error || 'matchesList failed';
            state.status = action.type;
        },

        // Matches Block
        matchesBlockRequest(state, action: PayloadAction<any>) {
            state.isMainLoading = true;
            state.status = action.type;
        },
        matchesBlockSuccess(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.matchesBlockRes = action.payload;
            state.status = action.type;
        },
        matchesBlockFailure(state, action: PayloadAction<any>) {
            state.isMainLoading = false;
            state.error = action.payload?.error || 'matchesBlock failed';
            state.status = action.type;
        },

        // Chat List
        chatListRequest(state, action: PayloadAction<any>) {
            state.isChatLoading = true;
            state.status = action.type;
        },
        chatListSuccess(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.chatListRes = action.payload;
            state.status = action.type;
        },
        chatListFailure(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.error = action.payload?.error || 'chatList failed';
            state.status = action.type;
        },

        // Chat Messages
        chatMessagesRequest(state, action: PayloadAction<any>) {
            state.isChatLoading = true;
            state.status = action.type;
        },
        chatMessagesSuccess(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.chatMessagesRes = action.payload;
            state.status = action.type;
        },
        chatMessagesFailure(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.error = action.payload?.error || 'chatMessages failed';
            state.status = action.type;
        },

        // Start Chat
        startChatRequest(state, action: PayloadAction<any>) {
            state.isChatLoading = true;
            state.status = action.type;
        },
        startChatSuccess(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.startChatRes = action.payload;
            state.status = action.type;
        },
        startChatFailure(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.error = action.payload?.error || 'startChat failed';
            state.status = action.type;
        },

        // Send Message
        sendMessageRequest(state, action: PayloadAction<any>) {
            state.status = action.type;
        },
        sendMessageSuccess(state, action: PayloadAction<any>) {
            state.sendMessageRes = action.payload;
            state.status = action.type;
        },
        sendMessageFailure(state, action: PayloadAction<any>) {
            state.error = action.payload?.error || 'sendMessage failed';
            state.status = action.type;
        },

        // Mark as Read
        markAsReadRequest(state, action: PayloadAction<any>) {
            state.isChatLoading = true;
            state.status = action.type;
        },
        markAsReadSuccess(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.markAsReadRes = action.payload;
            state.status = action.type;
        },
        markAsReadFailure(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.error = action.payload?.error || 'markAsRead failed';
            state.status = action.type;
        },

        // Archive Chat
        archiveChatRequest(state, action: PayloadAction<any>) {
            state.isChatLoading = true;
            state.status = action.type;
        },
        archiveChatSuccess(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.archiveChatRes = action.payload;
            state.status = action.type;
        },
        archiveChatFailure(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.error = action.payload?.error || 'archiveChat failed';
            state.status = action.type;
        },

        // Mute Chat
        muteChatRequest(state, action: PayloadAction<any>) {
            state.isChatLoading = true;
            state.status = action.type;
        },
        muteChatSuccess(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.muteChatRes = action.payload;
            state.status = action.type;
        },
        muteChatFailure(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.error = action.payload?.error || 'muteChat failed';
            state.status = action.type;
        },

        // Favorite Chat
        favoriteChatRequest(state, action: PayloadAction<any>) {
            state.isChatLoading = true;
            state.status = action.type;
        },
        favoriteChatSuccess(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.favoriteChatRes = action.payload;
            state.status = action.type;
        },
        favoriteChatFailure(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.error = action.payload?.error || 'favoriteChat failed';
            state.status = action.type;
        },

        // Unmatch User
        unmatchUserRequest(state, action: PayloadAction<any>) {
            state.isChatLoading = true;
            state.status = action.type;
        },
        unmatchUserSuccess(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.unmatchUserRes = action.payload;
            state.status = action.type;
        },
        unmatchUserFailure(state, action: PayloadAction<any>) {
            state.isChatLoading = false;
            state.error = action.payload?.error || 'unmatchUser failed';
            state.status = action.type;
        },

        // Append a new real-time message
        appendNewMessage(state, action: PayloadAction<any>) {
            if (Array.isArray(state.chatMessagesRes)) {
                state.chatMessagesRes = [action.payload, ...state.chatMessagesRes];
            }
        },

        // Clear chat messages
        clearChatMessages(state) {
            state.chatMessagesRes = [];
        },
    },
});

export const {

    storeFcmToken,

    peopleListRequest,
    peopleListSuccess,
    peopleListFailure,

    createPaymentIntentRequest,
    createPaymentIntentSuccess,
    createPaymentIntentFailure,

    confirmPaymentRequest,
    confirmPaymentSuccess,
    confirmPaymentFailure,

    getProfileRequest,
    getProfileSuccess,
    getProfileFailure,

    getPeopleDetailsRequest,
    getPeopleDetailsSuccess,
    getPeopleDetailsFailure,

    getStatusesRequest, getStatusesSuccess, getStatusesFailure,
    createStatusRequest, createStatusSuccess, createStatusFailure,
    deleteStatusRequest, deleteStatusSuccess, deleteStatusFailure,
    reactStatusRequest, reactStatusSuccess, reactStatusFailure,
    getStatusCommentsRequest, getStatusCommentsSuccess, getStatusCommentsFailure,
    addStatusCommentRequest, addStatusCommentSuccess, addStatusCommentFailure,
    getUserStatusesRequest, getUserStatusesSuccess, getUserStatusesFailure,
    getMyStatusesRequest, getMyStatusesSuccess, getMyStatusesFailure,
    updateLocationRequest, updateLocationSuccess, updateLocationFailure,

    swipeRequest,
    swipeSuccess,
    swipeFailure,

    matchesListRequest,
    matchesListSuccess,
    matchesListFailure,

    matchesBlockRequest,
    matchesBlockSuccess,
    matchesBlockFailure,

    chatListRequest, chatListSuccess, chatListFailure,
    chatMessagesRequest, chatMessagesSuccess, chatMessagesFailure,
    startChatRequest, startChatSuccess, startChatFailure,
    sendMessageRequest, sendMessageSuccess, sendMessageFailure,
    markAsReadRequest, markAsReadSuccess, markAsReadFailure,
    archiveChatRequest, archiveChatSuccess, archiveChatFailure,
    muteChatRequest, muteChatSuccess, muteChatFailure,
    favoriteChatRequest, favoriteChatSuccess, favoriteChatFailure,
    unmatchUserRequest, unmatchUserSuccess, unmatchUserFailure,
    appendNewMessage,
    clearChatMessages,

} = MainSlice.actions;

export default MainSlice.reducer;
