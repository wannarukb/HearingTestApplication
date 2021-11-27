import {create} from 'apisauce';
import Config from './constants/Config';
var baseURL= Config.CONNECTIONS.server_url

// define the api
const api = create({
     baseURL: baseURL,
     headers: {
     // Accept: 'multipart/form-data',
     // Accept: 'application/json',
     },
});



let login_post = (body) => api.post('/v1/Authenticate', body).then(response => response);
let register_post = (body) => api.post('/v1/Users/', body).then(response => response);

/* 
* GET :  Test Tone v.1.1
* URL : https://www3.ict.mahidol.ac.th/test/hearing/api/api/v1.1/TestTones/3
*/
// let testtone_get = (userToken) =>{ 
//     let token = 'Bearer ' + userToken;
//     api.setHeader('Authorization', token);
//     const response = api.get('/v1.1/TestTones/3');
//     return response;
// }


//https://www3.ict.mahidol.ac.th/test/hearing/api/api/v1.2/TestTones/3/Redmi%20Note8%20Pro
let testtone_get = (userToken, deviceModel) =>{ 
     let token = 'Bearer ' + userToken;
     api.setHeader('Authorization', token);
     const response = api.get('/v1.2/TestTones/3/' + deviceModel);
     return response;
 }


/* 
* POST : Get test tone protocol by device & model information
* URL : https://www3.ict.mahidol.ac.th/test/hearing/api/api/OutputProtocols/
*/
let testtone_post = (body) => {
     const response = api.post('/OutputProtocols', body);
     return response;
}


//https://www3.ict.mahidol.ac.th/test/hearing/api/api/v1.1/UserHearingTests/{UserID}
let testtone_header_get = (userToken, userId) => {
     let token = 'Bearer ' + userToken;
     api.setHeader('Authorization', token);
     const response = api.get('/v1.1/UserHearingTests/' + userId);
     console.log(api);
     console.log(response);
     return response;
}

//https://www3.ict.mahidol.ac.th/test/hearing/api/api/v1.1/UserHearingTests/
let testtone_result_post = (body) => api.post('/v1.1/UserHearingTests/', body).then(response => response);

export {
     login_post,
     register_post,
     testtone_get,
     testtone_result_post,
     testtone_header_get
}
