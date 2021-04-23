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

export let login_post = (body) => api.post('/Authenticate/', body).then(response => response);
