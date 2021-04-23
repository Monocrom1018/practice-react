import React, { useEffect, useState, useRef } from 'react';
import { cartsState } from '../atoms';
import { getCart, getUserData, createOrder } from '../common/api';
import { showToastCenter, openPreloader } from '../js/utils';
import { useRecoilState } from 'recoil';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
  f7,
  List,
  ListInput,
  ListItem,
  Navbar,
  Button,
  Page,
} from 'framework7-react';

const PaymentSchema = Yup.object().shape({
  purchaser: Yup.string().required('필수 입력사항 입니다'),
  email: Yup.string().email().required('필수 입력사항 입니다'),
  phone: Yup.string().required('필수 입력사항 입니다'),
  detailAddress: Yup.string().required('필수 입력사항 입니다'),
});

const PaymentPage = () => {
  const [carts, setCarts] = useRecoilState(cartsState);
  const [userInfo, setUserInfo] = useState();
  const [method, setMethod] = useState('신용카드');
  const [totalPrice, setTotalPrice] = useState('');
  const [address, setAddress] = useState('');
  const postCodeEl = useRef(null);

  const handlePostCode = () => {
    new daum.Postcode({
      oncomplete: data => {
        setAddress(`${data.address} [ ${data.zonecode} ]`);
      },
      width: 380,
      height: 466,
    }).embed(postCodeEl.current);
  };

  useEffect(async () => {
    const userData = await getUserData();
    await setUserInfo(userData.data);
    await setAddress(userData.data.address);

    const data = await getCart();
    await setCarts(data.data);

    const getTotalPrice = await (data.data.reduce(
      (acc, cur) => acc + cur.total_price,
      0,
    ) + 2500);
    await setTotalPrice(getTotalPrice);
  }, []);

  return (
    <Page name="cart" noToolbar>
      {/* Top Navbar */}
      <Navbar title={'상품결제'} backLink="Back"></Navbar>

      {/* 카트정보 */}
      <List mediaList>
        <div className="mx-4 font-bold text-lg -mt-5">✓ 상품정보</div>
        {carts.map((ele, index) => (
          <ListItem key={index}>
            <div className="flex flex-row justify-between mt-2">
              <div>
                <div className="font-bold">{ele.Option.Item.name}</div>
                <div className="text-gray-500">{ele.weight}g</div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  {ele.total_price?.toLocaleString()}₩ ( {ele.quantity}개 )
                </div>
              </div>
            </div>
            <img slot="media" src={ele.Option.Item.image} width="60" />
          </ListItem>
        ))}
        <ListItem>
          <div className="flex flex-row justify-between text-sm ml-3 mr-1 tracking-wider">
            <div>배송비</div>
            <div>2,500₩</div>
          </div>
        </ListItem>
      </List>

      {/* 회원정보입력 */}
      <Formik
        enableReinitialize
        initialValues={{
          purchaser: userInfo?.name,
          email: userInfo?.email,
          phone: userInfo?.phone,
          address: userInfo?.address,
          detailAddress: userInfo?.detailAddress,
        }}
        validationSchema={PaymentSchema}
        onSubmit={async values => {
          openPreloader('결제처리 중 입니다');
          try {
            await createOrder({
              purchaser: values.purchaser,
              email: values.email,
              phone: values.phone,
              method,
              totalPrice,
              address: address + ' ' + values.detailAddress,
            });
            setTimeout(() => {
              showToastCenter('결제가 완료되었습니다!');
              location.replace(`/`);
            }, 1000);
          } catch (error) {
            f7.dialog.close();
            showToastCenter(error?.response?.data || error?.message);
          }
        }}
        validateOnMount={true}
      >
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
        }) => (
          <Form>
            <List inlineLabels noHairlinesMd>
              <div className="font-bold text-lg mx-4">✓ 고객정보</div>
              <ListInput
                label="주문자"
                type="text"
                name="purchaser"
                placeholder="김커피"
                clearButton
                onBlur={handleBlur}
                value={values.purchaser}
                onChange={handleChange}
                errorMessageForce={true}
                errorMessage={touched.purchaser && errors.purchaser}
              ></ListInput>

              <ListInput
                label="이메일"
                type="text"
                name="email"
                placeholder="latte@coffee.com"
                clearButton
                onBlur={handleBlur}
                value={values.email}
                onChange={handleChange}
                errorMessageForce={true}
                errorMessage={touched.email && errors.email}
              ></ListInput>

              <ListInput
                label="휴대폰번호"
                type="text"
                name="phone"
                placeholder="000-0000-0000"
                clearButton
                onBlur={handleBlur}
                value={values.phone}
                onChange={handleChange}
                errorMessageForce={true}
                errorMessage={touched.phone && errors.phone}
              ></ListInput>
            </List>
            <List noHairlinesMd>
              <div className="flex flex-row justify-between items-center mr-4">
                <div className="font-bold text-lg mx-4">✓ 배송지정보</div>
                <Button
                  onClick={e => handlePostCode(e.target.value)}
                  raised
                  className="w-20 mb-2"
                >
                  주소검색
                </Button>
              </div>
              <ListInput
                label="기본주소 [우편번호]"
                type="text"
                name="address"
                value={address}
                clearButton
                placeholder="주소를 검색해주세요"
              ></ListInput>
              <ListInput
                label="상세주소"
                type="text"
                name="detailAddress"
                clearButton
                onChange={handleChange}
                placeholder="상세주소를 입력해주세요"
                onBlur={handleBlur}
                value={values.detailAddress}
                errorMessageForce={true}
                errorMessage={touched.detailAddress && errors.detailAddress}
              ></ListInput>
            </List>

            <div ref={postCodeEl} className="border-2"></div>

            <List noHairlinesMd className="pb-14">
              <div className="font-bold text-lg mx-4">✓ 결제수단</div>

              <ListItem
                radio
                radioIcon="end"
                value="신용카드"
                title="신용카드"
                name="신용카드"
                defaultChecked
                onClick={e => setMethod(e.target.innerText)}
              />
              <ListItem
                radio
                radioIcon="end"
                value="핸드폰결제"
                name="신용카드"
                title="핸드폰결제"
                onClick={e => setMethod(e.target.innerText)}
              />
            </List>

            <div className="fixed bottom-0 z-50 w-full bg-white pt-1">
              <div className="flex flex-row justify-between text-lg font-semibold tracking-wider mx-4 -mb-3">
                <div>주문 총액</div>
                <div>{totalPrice.toLocaleString()}₩</div>
              </div>
              <Button
                fill
                outline
                strong
                className="mt-5 py-5 font-extrabold disabled:opacity-50 mb-4 "
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                결제하기
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default PaymentPage;
