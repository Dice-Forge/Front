import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export function addTokenJwtToAxiosInstance(token: string) {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  console.log(
    'axiosheader :',
    axiosInstance.defaults.headers.common.Authorization
  );
}

export function removeTokenJwtFromAxiosInstance() {
  axiosInstance.defaults.headers.common.Authorization = '';
}

export default axiosInstance;
