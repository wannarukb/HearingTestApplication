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

let login_post = (body) => api.post('/Authenticate/', body).then(response => response);
let register_post = (body) => api.post('/Users/', body).then(response => response);

let testtone_get = (userToken) =>{ 
  let token = 'Bearer ' + userToken;
  api.setHeader('Authorization', token);
  const response = api.get('/TestTones/');
  return response;
}


export {
  login_post,
  register_post,
  testtone_get
}
