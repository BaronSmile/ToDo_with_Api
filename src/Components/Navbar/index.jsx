import React, {useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import AuthContext from '../Contexts'
import {Button, Dropdown, Menu} from 'antd';
import {CaretDownOutlined, CaretUpOutlined, DownOutlined, FileAddOutlined} from '@ant-design/icons';
import css from './navbar.module.scss';

const Index = ({handleSorting, history, location}) => {
  const {authState, authDispatch} = useContext(AuthContext);

  const sortMenu = (
    <>
      {
        location.pathname === '/' &&
        <Menu  className={css.navbar}>
          <Menu.Item
            icon={<CaretDownOutlined/>}
            key="sort:1"
            onClick={() => handleSorting('username', 'asc')}
          >
            По имени
          </Menu.Item>
          <Menu.Item
            icon={<CaretUpOutlined/>}
            key="sort:2"
            onClick={() => handleSorting('username', 'desc')}
          >
            По имени
          </Menu.Item>
          <Menu.Divider/>
          <Menu.Item
            icon={<CaretDownOutlined/>}
            key="sort:3"
            onClick={() => handleSorting('email', 'asc')}
          >
            По email
          </Menu.Item>
          <Menu.Item
            icon={<CaretUpOutlined/>}
            key="sort:4"
            onClick={() => handleSorting('email', 'desc')}
          >
            По email
          </Menu.Item>
          <Menu.Divider/>
          <Menu.Item
            icon={<CaretDownOutlined/>}
            key="sort:5"
            onClick={() => handleSorting('status', 'asc')}
          >
            По статусу
          </Menu.Item>
          <Menu.Item
            icon={<CaretUpOutlined/>}
            key="sort:6"
            onClick={() => handleSorting('status', 'desc')}
          >
            По статусу
          </Menu.Item>
        </Menu>}
    </>);

  return (
    <div className={css.menu}>
      <div className={css.menu__setting}>
        <Link className={css.logo} to='/'><h2>LOGO</h2></Link>
        {
          location.pathname === '/' &&
          <Dropdown overlay={sortMenu} trigger={['click']}>
            <Button type='link' onClick={e => e.preventDefault()}>
              Сортировка <DownOutlined/>
            </Button>
          </Dropdown>
        }


        <Link className={css.newTask} to='/new-task'>
          Новая задача <FileAddOutlined/>
        </Link>


      </div>
      {
        !authState.isAuthenticated &&
        <Button onClick={() => history.replace('/login')} className={css.btn}>Войти</Button>
      }
      {
        authState.isAuthenticated &&
        <div>
          <label className={css.label}>{authState.user}</label>
          <Button className={css.btn_out} onClick={() => authDispatch({type: 'LOGOUT'})}>Выйти</Button>
        </div>
      }
    </div>
  );
}

export default withRouter(Index);