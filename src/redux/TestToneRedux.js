const types = {
    TESTTONELIST: 'TESTTONE_LIST',
};
  
export const testToneActions = {
    loadTestToneList: testToneList => {
        return {type: types.TESTTONELIST, testToneList};
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
        default:
            return state;
    }
};
  