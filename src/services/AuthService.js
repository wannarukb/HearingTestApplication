import {
    login_post,
    register_post
} from '../RestAPI';

const AuthService = {
    login_api: async (email, pass) => {
        let body = {
            "email" : email,
            "password" : pass
        };
        return await login_post(body);
    },

    register_api: async (user) => {
        return await register_post(user);
    },
};

export default AuthService;