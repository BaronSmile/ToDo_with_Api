import React, {useContext, useState} from 'react';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {Button, Checkbox, Input, Typography} from "antd";

import css from './Task.module.scss';
import AuthContext, {DevContext} from '../Contexts'
import htmlDecode from '../../utils/utils';

const {Title} = Typography;

const Index = (props) => {
  const getDescription = (txt) => {
    const description = JSON.parse(htmlDecode(txt));
    return description.edited ? description.edited : description.original;
  };

  const {developer} = useContext(DevContext);
  const {authState, authDispatch} = useContext(AuthContext);
  const [disabled, setDisabled] = useState(false);
  const [description, setDescription] = useState(getDescription(props.location.state.task.text));
  const [status, setStatus] = useState(props.location.state.task.status);

  const submit = async () => {
    setDisabled(true);

    const bodyFormData = new FormData();
    bodyFormData.set('status', status);
    const originalDescription = JSON.parse(htmlDecode(props.location.state.task.text)).original;
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
    <div className={css.taskBlock}>
      <Title level={3}>Редактирование задачи</Title>


      <Input disabled={true} defaultValue={props.location.state.task.username.toString()}/>


      <Input style={{margin: '2em 0'}} disabled={true} defaultValue={props.location.state.task.email.toString()}/>


      <Input.TextArea
        disabled={disabled}
        onChange={(e) => {
          setDescription(e.target.value)
        }}
        defaultValue={description.toString()}
      />

      <div style={{margin: '1em 0 2em'}}>
        <Checkbox
          checked={status === 10}
          onChange={() => setStatus(status === 10 ? 0 : 10)}
        >
          Выполнено
        </Checkbox>
        <Checkbox
          checked={status === 11}
          onChange={() => setStatus(status === 11 ? 0 : 11)}
        >
          Выполнено админом
        </Checkbox>
        <Checkbox
          checked={status === 1}
          onChange={() => setStatus(status === 1 ? 0 : 1)}
        >
          Задача не выполнена, отредактирована админом
        </Checkbox>
      </div>

      <Button
        type="primary"
        htmlType="submit"
        disabled={disabled}
        onClick={submit}
        style={{display: 'block'}}
      >
        Submit
      </Button>

    </div>
  )
}

export default withRouter(Index);