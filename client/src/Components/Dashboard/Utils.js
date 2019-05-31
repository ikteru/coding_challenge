import axios from 'axios';
import { BACKEND_URL } from '../../configs';
import authClient from '../../Auth/Auth';

export function AxiosClient(){
  return  axios.create(
      {
          baseURL: BACKEND_URL,
          timeout: 1000,
          headers: {
            'Authorization': `Bearer ${authClient.getIdToken()}`,
          }
      }
  )
}

export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function compareValues(key, order='asc') {
  return function(a, b) {
    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string') ?
      a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ?
      b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

export function sortShopsByDistance(shops){
  let result = shops.sort(compareValues('distance'));
  return result;
}

