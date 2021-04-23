import {
    login_post,
} from '../RestApi';
    
const ReactNativeCodeApi = {
    login_api: async (email, pass) => {
        // let body = new FormData();
        // body.append('email', email);
        // body.append('password', pass);
        let body = {
            "email" : email,
            "password" : pass
        };
        return await login_post(body);
    },
};
  
export default ReactNativeCodeApi;
  