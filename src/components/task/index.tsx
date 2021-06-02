import React, {useContext, useState} from 'react';
import {htmlDecode} from "../../utils";
import AuthContext, {DevContext} from '../context';
import axios from "axios";
import {withRouter} from 'react-router-dom';
import {Button, Checkbox, Form, Input, Typography} from "antd";

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 16},
};

const tailLayout = {
  wrapperCol: {offset: 4, span: 16},
};

const {Title} = Typography;

const Task = (props: any) => {
  const getDescription = (txt: string) => {
    const description = JSON.parse(htmlDecode(txt) as string);
    return description.edited ? description.edited : description.original;
  };

  const {developer} = useContext(DevContext) as any;
  const {authState, authDispatch} = useContext(AuthContext) as any;
  const [disabled, setDisabled] = useState(false);
  const [description, setDescription] = useState(getDescription(props.location.state.task.text));
  const [status, setStatus] = useState(props.location.state.task.status);


  const submit = async () => {
    setDisabled(true);

    const bodyFormData = new FormData();
    bodyFormData.set('status', status);
    const originalDescription = JSON.parse(htmlDecode(props.location.state.task.text) as string).original;
    const textJSON = description === originalDescription ? {original: originalDescription} : {
      original: originalDescription,
      edited: description
    };
    bodyFormData.set('text', JSON.stringify(textJSON));
    bodyFormData.set('token', authState.token);

    const editedTask = (await axios.post(`https://uxcandy.com/~shapoval/test-task-backend/v2/edit/${props.location.state.task.id}?developer=${developer}`, bodyFormData, {
      headers: {'Content-Type': 'multipart/form-data'}
    })).data;

    if (editedTask.status === 'ok') {
      props.history.push({
        pathname: '/',
        state: {alertMsg: 'Задача была успешно отредактирована!', alertType: 'alert-success'}
      });
    } else {
      setDisabled(false);
      authDispatch({type: 'LOGOUT'});
    }
  }

  return (
    <>
      <Title style={{padding: '2em 0 0 2em'}} level={3}>Редактирование задачи</Title>
      <Form
        {...layout}
        name="basic"
        initialValues={{remember: true}}
        style={{paddingTop: '3em'}}
      >

        <Form.Item label="Имя пользователя:" name="username">
          <Input disabled={true} defaultValue={props.location.state.task.username.toString()}/>
        </Form.Item>

        <Form.Item name={['user', 'email']} label="Email">
          <Input disabled={true} defaultValue={props.location.state.task.email.toString()}/>
        </Form.Item>

        <Form.Item name={['user', 'introduction']} label="Задача">
          <Input.TextArea
            disabled={disabled}
            onChange={(e) => {setDescription(e.target.value)}}
            defaultValue={description.toString()}
          />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember">
          <Checkbox
            checked={status === 10}
            onChange={() => setStatus(status === 10 ? 0 : 10)}
          >
            Выполнено
          </Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout} >
          <Button
            type="primary"
            htmlType="submit"
            disabled={disabled}
            onClick={submit}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default withRouter(Task);
