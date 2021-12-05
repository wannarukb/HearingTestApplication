import {
    testtone_get, 
    testtone_result_post,
    testtone_header_get
} from '../RestAPI';

const TestToneService = {
    test_tone_api: async (userId, deviceModel) => {
        let response = await testtone_get(userId, deviceModel);
        return response;
    },


    post_testTone_result_api: async (testToneResult) => {
        return await testtone_result_post(testToneResult);
    },

    get_test_tone_header_api : async(userToken, userId) => {
        let response = await testtone_header_get(userToken, userId);
        return response;
    }
};

export default TestToneService;