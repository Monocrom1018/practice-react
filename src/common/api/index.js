import { PlainAPI, API, API_URL, version } from './api.config';
import { getToken, saveToken, destroyToken } from '../auth';
export { version };

export const api_url = API_URL;
export const refresh = _ =>
  PlainAPI.post(
    '/token',
    {},
    {
      headers: {
        'X-CSRF-TOKEN': getToken().csrf,
        Authorization: `Bearer ${getToken().token}`,
      },
    },
  ).then(res => {
    saveToken(res.data);
    return res.data;
  });

// User
export const login = params =>
  PlainAPI.post('/user/login', params).then(res => {
    saveToken(res.data);
    return res;
  });

export const logout = _ =>
  API.delete('/user/logout').then(res => {
    destroyToken();
  });

export const signup = params =>
  PlainAPI.post('/user/signup', params).then(res => {
    saveToken(res.data);
    return res;
  });

export const withdrawal = params =>
  API.post('/user/withdrawal', params).then(res => {
    if (res.status === 402) {
      return false;
    }
    destroyToken();
    return res;
  });

export const getUserData = () => API.get('/user/getUserData');
export const patchUserInfo = params => API.patch('/user/patchUserInfo', params);

// User
export const getItems = () => API.get('/items');
export const getDetails = params => API.get(`/items/details/${params}`);
export const patchQuantity = params =>
  API.patch('/items/patchQuantity', params);

// Cart
export const createCart = params => API.post('/carts/createCart', params);
export const getCart = () => API.get('/carts/getCart');
export const deleteCart = params => API.delete(`/carts/deleteCart/${params}`);

// Like
export const toggleLike = params => API.post('/items/toggleLike', params);
export const getLike = params => API.get(`/items/getLike/${params}`);
export const getAllLikes = () => API.get('/items/getAllLikes');

// Order
export const createOrder = params => API.post('/items/createOrder', params);
export const getOrder = () => API.get('/items/getOrder');

// Review
export const createReview = params => API.post('/review/write', params);
export const getAllReviews = params => API.get(`/review/getAll/${params}`);
export const getTarget = params => API.get(`/review/getTarget/${params}`);
export const updateReview = params => API.patch('/review/update', params);

// RecentView
export const createRecentView = params =>
  API.post('/items/createRecentView', params);
export const getRecentView = () => API.get('/items/getRecentView');
