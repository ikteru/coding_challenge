import axios from 'axios';
import { BACKEND_URL } from '../configs';
import authClient from './Auth';

export const axiosClient = axios.create({
    baseURL: BACKEND_URL,
    timeout: 1000,
    headers: {'Authorization': `Bearer ${authClient.getIdToken()}` }
  });;

  export const args = {
    baseURL: BACKEND_URL,
    timeout: 1000,
    headers: {'Authorization': `Bearer ${authClient.getIdToken()}` }
  };
