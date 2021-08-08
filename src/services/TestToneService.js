import {
    testtone_get, 
    testtone_result_post
} from '../RestAPI';

const TestToneService = {
    test_tone_api: async (userToken) => {
        let response = await testtone_get(userToken);
        return response;
    },


    post_testTone_result_api: async (testToneResult) => {
        return await testtone_result_post(testToneResult);
    }
};

export default TestToneService;