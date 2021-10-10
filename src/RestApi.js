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

let testtone_get = (userToken) =>{ 
  let token = 'Bearer ' + userToken;
  api.setHeader('Authorization', token);
  const response = api.get('/v1.1/TestTones/3');
  return response;
}


let testtone_result_post = (body) => api.post('/v1/ResultTestTones/', body).then(response => response);

export {
  login_post,
  register_post,
  testtone_get,
  testtone_result_post
}
