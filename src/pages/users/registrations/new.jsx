import React, { useState, useRef } from 'react';
import { f7, Navbar, Page, List, ListInput, Button } from 'framework7-react';
import { showToastCenter, openPreloader } from '../../../js/utils';
import { signup } from '@/common/api';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항 입니다'),
  email: Yup.string().email().required('필수 입력사항 입니다'),
  password: Yup.string()
    .min(4, '길이가 너무 짧습니다')
    .max(50, '길이가 너무 깁니다')
    .required('필수 입력사항 입니다'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], '비밀번호가 일치하지 않습니다.')
    .required('필수 입력사항 입니다'),
  phone: Yup.string().required('필수 입력사항 입니다'),
  detailAddress: Yup.string().required('필수 입력사항 입니다'),
});

const SignUpPage = () => {
  const [address, setAddress] = useState('');
  const [postCode, setPostCode] = useState('');
  const postCodeEl = useRef(null);

  const handlePostCode = () => {
    new daum.Postcode({
      oncomplete: data => {
        setAddress(data.address);
        setPostCode(' [' + data.zonecode + ']');
      },
      width: 380,
      height: 466,
    }).embed(postCodeEl.current);
  };

  return (
    <Page>
      <Navbar title="회원가입" backLink={true} sliding={false}></Navbar>
      <p className="font-semibole text-4xl text-center mt-5">insomenia</p>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          phone: '',
          detailAddress: '',
        }}
        validationSchema={SignUpSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);
          try {
            openPreloader('처리 중 입니다');
            await signup({
              name: values.name,
              email: values.email,
              password: values.password,
              phone: values.phone,
              address: address,
              detailAddress: values.detailAddress,
            });

            setTimeout(() => {
              showToastCenter('가입을 환영합니다 :)');
              location.replace(`/`);
            }, 1000);
          } catch (error) {
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
            <List noHairlinesMd>
              <div className="p-3 font-semibold bg-white">기본 정보</div>
              <ListInput
                label={i18next.t('login.name')}
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                errorMessageForce={true}
                errorMessage={touched.name && errors.name}
              />
              <ListInput
                label={i18next.t('login.email')}
                type="email"
                name="email"
                placeholder="이메일을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce={true}
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={i18next.t('login.password')}
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce={true}
                errorMessage={touched.password && errors.password}
              />
              <ListInput
                label={i18next.t('login.password_confirmation')}
                type="password"
                name="password_confirmation"
                placeholder="비밀번호를 확인해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password_confirmation}
                errorMessageForce={true}
                errorMessage={
                  touched.password_confirmation && errors.password_confirmation
                }
              />
              <ListInput
                label={i18next.t('login.phone')}
                type="text"
                name="phone"
                placeholder="010-000-0000"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
                errorMessageForce={true}
                errorMessage={touched.phone && errors.phone}
              />
            </List>
            <List>
              <div className="flex flex-row justify-between items-center mr-4">
                <div className="p-3 font-semibold bg-white">주소 정보</div>
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
                value={address + postCode}
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
            <div className="p-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                회원가입
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default SignUpPage;
