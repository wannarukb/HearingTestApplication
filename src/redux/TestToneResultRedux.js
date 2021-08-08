const types = {
    TESTTONERESULTLIST: 'TESTTONERESULT_LIST',
};
  
export const testToneActions = {
    postTestToneResult: testToneResultTemp => {
        return {type: types.TESTTONERESULTLIST, testToneResultTemp};
    },
};
  
const initialState = {   
    "testToneResultTemp" : {}
};
  
export const reducer = (state = initialState, action) => {
    const {type, testToneResultTemp} = action;  
    switch (type) {
        case types.TESTTONERESULTLIST:
            return Object.assign({}, state, {
                ...state,
                testToneResultTemp
            });
        default:
            return state;
    }
};
  