import React, {useState, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {DevContext} from './Contexts';
import {Alert, Button, Form, Input} from 'antd';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const NewTask = (props) => {
  const {developer} = useContext(DevContext);
  const [disabled, setDisabled] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [alertState, setAlert] = useState('');

  const submit = async () => {
    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    if (!userName || !email || !description) {
      setAlert('Необходимо заполнить все поля!');
      return;
    }

    if (!validateEmail(email)) {
      setAlert('email не валиден');
      return;
    }

    setDisabled(true);

    const bodyFormData = new FormData();
    bodyFormData.set('username', userName);
    bodyFormData.set('email', email);
    bodyFormData.set('text', JSON.stringify({original: description}));

    const createdTask = (await axios.post(`https://uxcandy.com/~shapoval/test-task-backend/v2/create?developer=${developer}`, bodyFormData, {
      headers: {'Content-Type': 'multipart/form-data' }
    })).data;

    if (createdTask.status === 'ok') {
      props.history.push({
        pathname: '/',
        state: { alertMsg: 'Задача была успешно создана!', alertType: 'alert-success' }
      });
    } else {
      setAlert('Задача не была создана!');
      setDisabled(false);
    }
  }

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{remember: true}}
      style={{paddingTop:'3em'}}
    >

      {
        alertState &&
        <Alert style={{margin:'2em '}} message={alertState} type="error" showIcon />
      }
      <Form.Item
        label="Имя пользователя:"
        name="username"
        rules={[{required: true, message: 'Пожалуйста введите ваше имя!'}]}
      >
        <Input disabled={disabled} onBlur={(e) => {setUserName(e.target.value)}}/>
      </Form.Item>

      <Form.Item name={['user', 'email']} label="Email" rules={[{ required: true, message: 'Пожалуйста введите ваш Email!' }]}>
        <Input disabled={disabled}  onBlur={(e) => {setEmail(e.target.value)}}/>
      </Form.Item>

      <Form.Item name={['user', 'introduction']} label="Задача" rules={[{ required: true, message: 'Пожалуйста введите задачу!' }]}>
        <Input.TextArea disabled={disabled} onBlur={(e) => {setDescription(e.target.value)}}/>
      </Form.Item>

      <Form.Item {...tailLayout} >
        <Button type="primary" htmlType="submit" disabled={disabled} onClick={submit}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default withRouter(NewTask);