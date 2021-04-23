import React from 'react';
import { f7, Page, Navbar, List, ListInput, Button } from 'framework7-react';
import { showToastCenter, openPreloader } from '../../../js/utils';
import { login } from '@/common/api';
import { Formik } from 'formik';
import * as Yup from 'yup';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email().required('필수 입력사항 입니다'),
  password: Yup.string()
    .min(4, '길이가 너무 짧습니다')
    .max(50, '길이가 너무 깁니다')
    .required('필수 입력사항 입니다'),
});

const SessionNewPage = () => {
  return (
    <Page className="bg-white">
      <Navbar
        title={i18next.t('login.title')}
        backLink={true}
        sliding={false}
      />
      <p className="font-semibole text-4xl text-center mt-5">insomenia</p>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={SignInSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);
          try {
            openPreloader('처리 중 입니다');
            await login({ user: values });
            setTimeout(() => {
              showToastCenter('로그인 되었습니다');
              location.replace(`/`);
            }, 1000);
          } catch (error) {
            showToastCenter('정보를 다시 확인해주세요');
          }
        }}
        validateOnMount={true}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          isValid,
        }) => (
          <form onSubmit={handleSubmit}>
            <List>
              <ListInput
                label={i18next.t('login.email')}
                name="email"
                type="email"
                placeholder="이메일을 입력해주세요."
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce={true}
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={i18next.t('login.password')}
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce={true}
                errorMessage={touched.password && errors.password}
              />
            </List>
            <div className="p-1">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50 font-medium"
                disabled={isSubmitting || !isValid}
              >
                로그인
              </button>
            </div>
          </form>
        )}
      </Formik>
      <div className="p-1">
        <Button
          className="button button-large button-raised mt-3 font-medium"
          href="/users/sign_up"
        >
          회원가입
        </Button>
      </div>
    </Page>
  );
};

export default SessionNewPage;
