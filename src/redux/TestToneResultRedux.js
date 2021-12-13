const types = {
    TESTTONERESULTLIST: 'TESTTONERESULT_LIST',
    TESTTONERESULT_HEADER_LIST : 'TESTTONERESULT_HEADER_LIST',
    LOGOUT: 'LOGOUT',
};
  
export const testToneActions = {
    postTestToneResult: testToneResultTemp => {
        return {type: types.TESTTONERESULTLIST, testToneResultTemp};
    },

    loadTestToneResult: testToneResultHeader => {
        return {type: types.TESTTONERESULTLIST, testToneResultHeader};
    },
    logout() {
        return {type: types.LOGOUT};
    },
};
  
const initialState = {   
    "testToneResultTemp" : {},
    "testToneResultHeader" : {}
};
  
export const reducer = (state = initialState, action) => {
    const {type, testToneResultTemp, testToneResultHeader} = action;  
    switch (type) {
        case types.TESTTONERESULTLIST:
            return Object.assign({}, state, {
                ...state,
                testToneResultTemp
            });
        case types.TESTTONERESULT_HEADER_LIST:
            return Object.assign({}, state, {
                ...state,
                testToneResultHeader
            });
        case types.LOGOUT:
            console.log(initialState);
            return Object.assign({}, initialState);
        default:
            return state;
    }
};
  