import Axios from 'axios';
const baseURL = process.env.REACT_APP_API_URL;
const axiosInstance = Axios.create({
  baseURL: baseURL,
});
axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (
      window.location.pathname !== '/' &&
      window.location.pathname !== '/oddspage' &&
      error.response.status === 401
    ) {
      window.location.href = '/';
    }
    if (error.response.status === 503) {
      window.location.href = '/maintenance';
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;

const publicAxiosInstance = Axios.create({
  baseURL: baseURL,
});
export { 
  publicAxiosInstance 
}
