import {testtone_get} from '../RestAPI';

const TestToneService = {
    test_tone_api: async (userToken) => {
        let response = await testtone_get(userToken);
        return response;
    }
};

export default TestToneService;