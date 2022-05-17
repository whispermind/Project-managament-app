import { Form, Input, Button, AutoComplete, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, LoginOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../app/hooks';
import { asyncSignIn } from '../../reducer/authorization/authorizationSlice';
import { useNavigate } from 'react-router-dom';
import Links from '../../enumerations/LinksEnum';
import { useTranslation } from 'react-i18next';
import { SignInData } from '../../API/authorization';
import formProperties from '../../antd/formProperties';
import isActionFulfilled from '../../app/actionHelper';
import PageTitle from '../../components/styled/PageTitle';
import { MessageKeys, duration } from '../../antd/messageProperties';
import FormPageContainer from '../../components/styled/FormPageContainer';

const { tailLayout, layout } = formProperties;

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [form] = Form.useForm();

  async function signInRequest(userData: SignInData) {
    const key = MessageKeys.signIn;
    message.loading({ content: t('messages.loading'), key, duration: 0 });

    const data = await dispatch(asyncSignIn(userData));

    if (isActionFulfilled(data)) {
      message.success({ content: t(`messages.${key}-done`), key, duration });
      navigate(`/${Links.mainPage}`);
    } else {
      message.error({ content: t(`messages.${key}-error`), key, duration });
    }
  }

  return (
    <>
      <PageTitle textLink="buttons.sign-in" icon={<LoginOutlined />} />
      <FormPageContainer>
        <Form {...layout} form={form} name="control-hooks" onFinish={signInRequest}>
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

export default SignInPage;
