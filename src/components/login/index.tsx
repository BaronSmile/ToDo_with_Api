import React, {useContext, useState} from 'react';
import AuthContext, {DevContext} from '../context';
import {useHistory} from 'react-router-dom'
import axios from "axios";
import {Alert, Button, Form, Input} from 'antd';

const layout = {
  labelCol: {span: 6},
  wrapperCol: {span: 12},
};
const tailLayout = {
  wrapperCol: {offset: 6, span: 12},
};


const Login = (props: { history: string[]; }) => {
  const {authState, authDispatch} = useContext(AuthContext) as any;
  const {developer} = useContext(DevContext) as any;
  const history = useHistory();

  if (authState.isAuthenticated) {
    props.history.push('/');
  }

  const [disabled, setDisabled] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [alertState, setAlert] = useState('');

  const submit = async () => {
    if (!userName || !password) {
      setAlert('Все поля обязательны для заполнения!');
      return;
    }

    setDisabled(true);

    const bodyFormData = new FormData();
    bodyFormData.set('username', userName);
    bodyFormData.set('password', password);

    const login = (await axios.post(`https://uxcandy.com/~shapoval/test-task-backend/v2/login?developer=${developer}`, bodyFormData, {
      headers: {'Content-Type': 'multipart/form-data'}
    })).data;

    if (login.status === 'ok') {
      authDispatch({type: 'LOGIN', user: userName, token: login.message.token});
      history.push('/');
    } else {
      setAlert('Неправильные реквизиты доступа!');
      setDisabled(false);
    }
  }
  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{remember: true}}
      title='Авторизация'
      style={{paddingTop:'3em'}}
    >
      {
        alertState &&
        <Alert style={{margin:'2em '}} message={alertState} type="error" showIcon />
      }

      <Form.Item
        label="Имя пользователя:"
        name="username"
        rules={[{required: true, message: 'Введите имя пользователя!'}]}
      >
        <Input disabled={disabled} onBlur={(e) => {
          setUserName(e.target.value)
        }}/>
      </Form.Item>

      <Form.Item
        label="Пароль:"
        name="password"
        rules={[{required: true, message: 'Введите пароль!'}]}
      >
        <Input.Password disabled={disabled} onBlur={(e) => {setPassword(e.target.value)}}/>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" disabled={disabled} onClick={submit}>
          Отправить
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
