/* eslint-disable prettier/prettier */
const types = {
    SET_GUEST_RESULT: 'SET_GUEST_RESULT',
    SET_INITIAL_STATE : 'SET_INITIAL_STATE'
};
  
export const guestResultActions = {
    setTestToneGuest: guestResultInfo => {
        return {type: types.SET_GUEST_RESULT, guestResultInfo};
    },

    setInitialState(){
        return {type: types.SET_INITIAL_STATE};
    }
};
  
const initialState = {   
    "guestResultInfo" :  {
        hearingTestId:"",
        userId:"",
        startDate:"",
        resultSum:"",
        isSync : false
    }
};
  
export const reducer = (state = initialState, action) => {
    const {type, guestResultInfo} = action;  
    switch (type) {
        case types.SET_GUEST_RESULT:
            console.log('Guest Test Result Redux : ' + JSON.stringify(guestResultInfo));
            return Object.assign({}, state, {
                ...state,
                guestResultInfo
            });
        case types.SET_INITIAL_STATE:
            console.log(initialState);
            return Object.assign({}, initialState);
        default:
            return state;
    }
};
  