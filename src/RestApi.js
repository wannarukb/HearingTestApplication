import {create} from 'apisauce';
import Config from './constants/Config';
var baseURL= Config.CONNECTIONS.server_url

// define the api
const api = create({
     baseURL: baseURL,
     headers: {},
});


//Normal User
let login_post = (body) => api.post('/v1.2/Authenticate', body).then(response => response);
let register_post = (body) => api.post('/v1.2/UserAccounts/', body).then(response => response);

//Guest User
let register_guest_post = (body) => api.post('/v1.2/Users/GuestRegister', body).then(response => response);
let login_guest_post = (body) => api.post('/v1.2/UserAccounts', body).then(response => response);


/* 
* GET : Get test tone header by user Id and brand model
* URL : https://www3.ict.mahidol.ac.th/test/hearing/api/api/v1.2/TestTones/userid/{UserId}/{BrandModel}
*/
let testtone_get = (userId, deviceModel) =>{ 
     // const response = api.get('/v1.2/TestTones/userid/'+ userId +'/' + deviceModel);
     const response = api.get('/v1.2/TestTones/'+ userId +'/' + deviceModel);
     return response;
 }


/* 
* GET : Get test tone header by user Id
* URL : https://www3.ict.mahidol.ac.th/test/hearing/api/api/v1.2/UserHearingTests/{UserID}
*/
let testtone_header_get = (userToken, userId) => {
     let token = 'Bearer ' + userToken;
     api.setHeader('Authorization', token);
     const response = api.get('/v1.2/UserHearingTests/' + userId);
     return response;
}

/* 
* POST : Post test tone result
* URL : https://www3.ict.mahidol.ac.th/test/hearing/api/api/v1.2/UserHearingTests/
*/
let testtone_result_post = (body) => api.post('/v1.2/UserHearingTests/', body).then(response => response);

export {
     login_post,
     register_post,
     login_guest_post,
     register_guest_post,
     testtone_get,
     testtone_result_post,
     testtone_header_get
}
