import React from 'react';
import { useEffect, useState } from 'react';
import {
  withdrawal,
  getUserData,
  getRecentView,
  getAllLikes,
  logout,
} from '../common/api';

import {
  f7,
  Link,
  BlockTitle,
  Swiper,
  SwiperSlide,
  List,
  ListItem,
  Navbar,
  NavRight,
  NavTitle,
  Page,
  theme,
} from 'framework7-react';

import { useRecoilState } from 'recoil';
import { showToastCenter, openPreloader } from '../js/utils';
import { likeState } from '../atoms';

const MyPagePage = () => {
  const [like, setLike] = useRecoilState(likeState);
  const [user, setUser] = useState({ name: '' });
  const [recentView, setRecentView] = useState([]);
  const [likeList, setLikeList] = useState('');

  const handleLogout = () => {
    f7.dialog.confirm('로그아웃 하시겠어요?', async () => {
      openPreloader('처리 중 입니다');
      await logout();
      setTimeout(() => {
        showToastCenter('로그아웃 되었습니다.');
        location.replace('/');
      }, 1000);
    });
  };

  const handleWithdrawal = () => {
    f7.dialog.password('비밀번호를 입력해주세요', password => {
      openPreloader('처리 중 입니다');
      const withdrawalData = withdrawal({ password: password });
      if (!withdrawalData) {
        return showToastCenter('입력정보가 정확하지 않습니다');
      }
      setTimeout(() => {
        showToastCenter('회원탈퇴가 완료되었습니다.');
        location.replace('/');
      }, 1000);
    });
  };

  useEffect(async () => {
    const userData = await getUserData();
    await setUser(userData.data);

    const likeDatas = await getAllLikes();
    await setLikeList(likeDatas.data);

    const recentViewData = await getRecentView();
    setRecentView(recentViewData.data);
  }, [like]);

  return (
    <Page name="MyPage">
      {/* Top Navbar */}
      <Navbar sliding={false}>
        <NavTitle className="tracking-wide">My Page</NavTitle>
        <NavRight>
          <Link
            href="/search"
            iconIos="f7:search"
            iconMd="material:search"
            iconAurora="f7:search"
            disableButton={!theme.aurora}
          />
        </NavRight>
      </Navbar>
      <div className="bg-white"></div>

      {/* Page content */}
      <div className="flex flex-row justify-center mt-7 mx-4 text-base border-b border-t py-4 text-gray-800">
        <span className="font-semibold text-base text-gray-800">
          {user.name}
        </span>
        님, 즐거운 쇼핑되세요!
      </div>

      {/* 최근에 본 상품 */}
      <BlockTitle className="mt-7 mx-4 font-bold text-lg border-b-2 mb-2">
        최근에 본 상품
      </BlockTitle>
      {recentView.length === 0 ? (
        <div className="mx-4 text-gray-500">최근에 본 상품이 없습니다</div>
      ) : (
        <Swiper
          slidesPerView={3}
          spaceBetween={10}
          scrollbar
          observer
          observeParents
          className="mx-4 pb-3"
        >
          {recentView.map((view, index) => {
            return (
              <SwiperSlide key={index}>
                <a href={`/detail/${view.Item.id}`}>
                  <img src={view.Item.image} />
                  <div className="text-center truncate text-gray-800">
                    {view.Item.name}
                  </div>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {/* 찜한 상품 */}
      <BlockTitle className="font-bold text-lg border-b-2 mb-2  mt-7 mx-4">
        찜한 상품
      </BlockTitle>
      {likeList.length === 0 ? (
        <div className="mx-4 text-gray-500">찜한 상품이 없습니다</div>
      ) : (
        <Swiper
          slidesPerView={3}
          spaceBetween={10}
          scrollbar
          observer
          observeParents
          className="mx-4 pb-3"
        >
          {likeList.map((like, index) => {
            return (
              <SwiperSlide key={index}>
                <a href={`/detail/${like.Item.id}`}>
                  <img src={like.Item.image} />
                  <div className="text-center truncate text-gray-800">
                    {like.Item.name}
                  </div>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {/* 유저정보 */}
      <List>
        <ListItem link={'/users/userInfo'}>
          <div className="flex">
            <i className="f7-icons text-gray-500 ml-1">person</i>
            <span className="tracking-widest ml-2 text-base text-gray-800">
              회원정보수정
            </span>
          </div>
        </ListItem>
        <ListItem onClick={handleLogout} link={'#'}>
          <div className="flex">
            <i className="f7-icons mr-1 text-gray-500">square_arrow_left</i>
            <span className="tracking-widest ml-2 text-base text-gray-800">
              로그아웃
            </span>
          </div>
        </ListItem>
        <ListItem onClick={handleWithdrawal} link={'#'}>
          <div className="flex">
            <i className="f7-icons mr-1 text-gray-500">
              square_arrow_left_fill
            </i>
            <span className="tracking-widest ml-2 text-base text-gray-800">
              회원탈퇴
            </span>
          </div>
        </ListItem>
      </List>
    </Page>
  );
};
export default MyPagePage;
