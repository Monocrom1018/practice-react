import HomePage from '../pages/home.jsx';
import NotFoundPage from '../pages/404.jsx';
import LoginPage from '../pages/users/sessions/new.jsx';
import SignUpPage from '../pages/users/registrations/new.jsx';
import DetailPage from '../pages/detail.jsx';
import CartPage from '../pages/cart.jsx';
import MyPagePage from '../pages/mypage.jsx';
import PaymentPage from '../pages/payment.jsx';
import OrderListPage from '../pages/orderList.jsx';
import ReviewPage from '../pages/review.jsx';
import ItemReviewPage from '../pages/itemReview.jsx';
import updateReviewPage from '../pages/updateReview.jsx';
import SearchPage from '../pages/search.jsx';
import UserInfoPage from '../pages/UserInfo.jsx';

import { getToken } from '../common/auth';

const isLoggedIn = component => {
  const loggedIn = !!getToken().token;
  if (loggedIn) return component;
  return LoginPage;
};

const routes = [
  { path: '/', component: HomePage },
  { path: '/users/sign_in', component: LoginPage },
  { path: '/users/sign_up', component: SignUpPage },
  { path: '/users/mypage', component: isLoggedIn(MyPagePage) },
  { path: '/users/orderList', component: isLoggedIn(OrderListPage) },
  { path: '/users/userInfo', component: UserInfoPage },
  { path: '/detail/:id', component: DetailPage },
  { path: '/review/:id', component: isLoggedIn(ReviewPage) },
  { path: '/review/update/:id', component: isLoggedIn(updateReviewPage) },
  { path: '/review/collection/:id', component: ItemReviewPage },
  { path: '/cart', component: CartPage },
  { path: '/payment', component: isLoggedIn(PaymentPage) },
  { path: '/search', component: SearchPage },
  { path: '(.*)', component: NotFoundPage },
];

export default routes;
