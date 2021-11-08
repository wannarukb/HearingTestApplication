const types = {
    TESTTONERESULTLIST: 'TESTTONERESULT_LIST',
    TESTTONERESULT_HEADER_LIST : 'TESTTONERESULT_HEADER_LIST'
};
  
export const testToneActions = {
    postTestToneResult: testToneResultTemp => {
        return {type: types.TESTTONERESULTLIST, testToneResultTemp};
    },

    loadTestToneResult: testToneResultHeader => {
        return {type: types.TESTTONERESULTLIST, testToneResultHeader};
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
        default:
            return state;
    }
};
  