import {
  Button, Form, Input, message,
} from 'antd';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import authApi from '../../requests/authApi';

function Register() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    const data = await authApi.register(values);
    const { success, message: responseMessage } = data;
    if (success) {
      messageApi.success(responseMessage);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      messageApi.error(responseMessage);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onNavigate = () => {
    navigate('/login');
  };

  return (
    <div className="register-wrapper">
      {contextHolder}
      <Form
        layout="vertical"
        style={{ width: '25rem' }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item>
          <h2 className="register-header">Register</h2>
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input a username!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
              type: 'email',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item>
          <a onClick={onNavigate}>Have an existing account? Log in</a>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Register;
