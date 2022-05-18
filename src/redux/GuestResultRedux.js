const types = {
    SET_GUEST_RESULT: 'SET_GUEST_RESULT',
};
  
export const guestResultActions = {
    setTestToneGuest: guestResultInfo => {
        return {type: types.SET_GUEST_RESULT, guestResultInfo};
    },
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
        default:
            return state;
    }
};
  