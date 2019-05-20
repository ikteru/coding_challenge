import axios from 'axios';
import { BACKEND_URL } from '../configs';
import authClient from './Auth';

export function AxiosClient(){
  return  axios.create(
      {
          baseURL: BACKEND_URL,
          timeout: 1000,
          headers: {'Authorization': `Bearer ${authClient.getIdToken()}`}
      }
  )
}

export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}


