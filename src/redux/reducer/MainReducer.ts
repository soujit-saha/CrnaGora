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
    swipeRes?: any;
    matchesListRes?: any;
    matchesBlockRes?: any;
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
    swipeRes: {},
    matchesListRes: [],
    matchesBlockRes: [],
};

const MainSlice = createSlice({
    name: 'Main',
    initialState,
    reducers: {

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
    },
});

export const {


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

    swipeRequest,
    swipeSuccess,
    swipeFailure,

    matchesListRequest,
    matchesListSuccess,
    matchesListFailure,

    matchesBlockRequest,
    matchesBlockSuccess,
    matchesBlockFailure,


} = MainSlice.actions;

export default MainSlice.reducer;
