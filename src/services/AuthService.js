import {
    login_post,
    register_post,
    login_guest_post,
    register_guest_post
} from '../RestAPI';

const AuthService = {

    //Member User
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

    //Guest
    login_guest_api : async(deviceInfo) =>{
        return await login_guest_post(deviceInfo);
    },

    register_guest_post : async (user) => {
        return await register_post(user);
    },
};

export default AuthService;