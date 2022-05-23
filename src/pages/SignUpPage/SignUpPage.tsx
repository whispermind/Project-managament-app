import { Form, Input, Button, AutoComplete } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UsergroupAddOutlined } from '@ant-design/icons';
import { useApiRequestWithUIMessages } from '../../app/useApiRequestWithUIMessages';
import { asyncSignUp } from '../../reducer/authorization/authorizationSlice';
import { useTranslation } from 'react-i18next';
import { SignUpData } from '../../API/authorization';
import formProperties from '../../antd/formProperties';
import PageTitle from '../../components/styled/PageTitle';
import { MessageKeys } from '../../antd/messageProperties';
import FormPageContainer from '../../components/styled/FormPageContainer';
import { IUserData } from '../../API/dependencies';

const { tailLayout, layout } = formProperties;

const SignUpPage = () => {
  const { t } = useTranslation();

  const [form] = Form.useForm();

  const signUpRequest = useApiRequestWithUIMessages<SignUpData, IUserData>({
    messageKey: MessageKeys.signIn,
    thunk: asyncSignUp
  });

  // async function signUpRequest(userData: SignUpData) {
  //   const key = MessageKeys.signUp;
  //   message.loading({ ...{ content: t('messages.loading'), key, duration: 0 } });

  //   const data = await dispatch(asyncSignUp(userData));

  //   if (isActionFulfilled(data.meta.requestStatus)) {
  //     message.success({ ...{ content: t(`messages.${key}-done`), key, duration } });
  //     navigate(Links.signInPage);
  //   } else {
  //     message.error({ ...{ content: t(`messages.${key}-error`), key, duration } });
  //   }
  // }

  return (
    <>
      <PageTitle textLink="buttons.sign-up" icon={<UsergroupAddOutlined />} />
      <FormPageContainer>
        <Form {...layout} form={form} name="control-hooks" onFinish={signUpRequest}>
          <Form.Item
            name="name"
            label={t('labelOfForms.name')}
            rules={[
              {
                required: true
              }
            ]}>
            <Input placeholder={t('labelOfForms.name')} />
          </Form.Item>

          <Form.Item
            name="login"
            label={t('labelOfForms.login')}
            rules={[
              {
                required: true
              }
            ]}>
            <Input placeholder={t('labelOfForms.login')} />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('labelOfForms.password')}
            rules={[
              {
                required: true
              }
            ]}>
            <AutoComplete>
              <Input.Password
                placeholder={t('labelOfForms.password')}
                autoComplete="off"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </AutoComplete>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              {t('buttons.Submit')}
            </Button>
          </Form.Item>
        </Form>
      </FormPageContainer>
    </>
  );
};

export default SignUpPage;
