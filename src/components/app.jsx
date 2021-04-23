import { App, Link, Toolbar, View, Views } from 'framework7-react';
import 'lodash';
import React from 'react';
import { cartsState } from '../atoms';
import store from '../common/store';
import { getDevice } from '../js/framework7-custom.js';
import routes from '../js/routes';
import i18n from '../lang/i18n';
import { useRecoilValue } from 'recoil';

global.i18next = i18n;

const MyApp = () => {
  const getCartCount = () => {
    const cartCount = useRecoilValue(cartsState);
    if (cartCount.length === 0) return false;
    return cartCount.length;
  };

  const device = getDevice();
  // Framework7 Parameters
  const f7params = {
    name: 'Insomenia Coffee', // App name
    theme: 'ios', // Automatic theme detection
    id: 'com.insomenia.practice', // App bundle ID
    // App store
    store: store,
    // App routes
    routes: routes,
    // Input settings
    view: {
      iosDynamicNavbar: getDevice().ios,
    },
  };

  return (
    <App {...f7params}>
      <Views tabs className="safe-areas">
        {/* Tabbar for switching views-tabs */}
        <Toolbar tabbar labels bottom>
          <Link
            tabLink="#view-home"
            tabLinkActive
            icon="las la-home"
            text="홈"
          />
          <Link
            tabLink="#view-cart"
            icon="las la-shopping-cart"
            iconBadge={getCartCount()}
            badgeColor="red"
            text="장바구니"
          />
          <Link tabLink="#view-orderList" icon="las la-edit" text="주문내역" />
          <Link
            tabLink="#view-mypage"
            icon="las la-address-book"
            text="마이페이지"
          />
        </Toolbar>

        <View
          id="view-home"
          main
          tab
          tabActive
          url="/"
          iosDynamicNavbar={false}
        />
        <View id="view-items" name="items" tab url="/items?is_main=true/" />
        <View id="view-cart" name="cart" tab url="/cart" />
        <View id="view-orderList" name="orderList" tab url="/users/orderList" />
        <View id="view-mypage" name="mypage" tab url="/users/mypage" />
      </Views>
    </App>
  );
};
export default MyApp;
