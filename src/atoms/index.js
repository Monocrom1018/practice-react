import { atom } from 'recoil';

export const itemsState = atom({
  key: 'itemsState',
  default: [],
});

export const cartsState = atom({
  key: 'cartState',
  default: [],
});

export const likeState = atom({
  key: 'likeState',
  default: [],
});

export const paymentsState = atom({
  key: 'paymentsState',
  default: {},
});
