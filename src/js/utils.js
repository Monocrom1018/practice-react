import { f7 } from 'framework7-react';

export const showToastCenter = text => {
  let toastCenter;
  if (!toastCenter) {
    toastCenter = f7.toast.create({
      text: text,
      position: 'center',
      closeTimeout: 1500,
    });
  }
  toastCenter.open();
};

export const openPreloader = text => {
  f7.dialog.preloader(text);
  setTimeout(() => {
    f7.dialog.close();
  }, 1000);
};
