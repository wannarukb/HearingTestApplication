const types = {
    TESTTONELIST: 'TESTTONE_LIST',
    LOGOUT : 'LOGOUT'
};
  
export const testToneActions = {
    loadTestToneList: testToneList => {
        return {type: types.TESTTONELIST, testToneList};
    },
    logout() {
        return {type: types.LOGOUT};
    },
};
  
const initialState = {   
    "testToneList" : {}
};
  
export const reducer = (state = initialState, action) => {
    const {type, testToneList} = action;  
    switch (type) {
        case types.TESTTONELIST:
            return Object.assign({}, state, {
                ...state,
                testToneList
            });
        case types.LOGOUT:
            console.log(initialState);
            return Object.assign({}, initialState);
        default:
            return state;
    }
};
  