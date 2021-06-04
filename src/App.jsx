import React, {useState} from 'react';
import {Route, withRouter} from 'react-router-dom';

import NavBar from './Components/Navbar';
import Index from './Components/Tasks';
import NewTask from './Components/NewTask';
import Task from './Components/Task';
import Login from './Components/Login';
import AuthContext, {DevContext} from './Components/Contexts'
import SecuredRoute from './Components/SecuredRoute';
import {createCookie, eraseCookie, readCookie} from './utils/utils';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const init = (initialState) => {
  const user = readCookie('user');
  const token = readCookie('token');

  return {
    ...initialState,
    isAuthenticated: user && token,
    user: user,
    token: token
  };
}

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      createCookie('user', action.user, 86400);
      createCookie('token', action.token, 86400);
      localStorage.setItem('isAuthenticated', 'true');
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
        token: action.token
      };
    case "LOGOUT":
      eraseCookie('user');
      eraseCookie('token');
      localStorage.removeItem('isAuthenticated');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null
      };
    default:
      return state;
  }
};

const App = (props) => {
  const [authState, authDispatch] = React.useReducer(reducer, initialState, init);

  const [sortField, setSortField] = useState();
  const [sortDirection, setSortDirection] = useState();

  const handleSorting = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  }

  window.addEventListener('storage', function ({key, newValue}) {
      if ((key === 'isAuthenticated') && (!newValue)) {
        authDispatch({type: 'LOGOUT'});
      }
    }
  );

  return (
    <DevContext.Provider value={{developer: 'ptash4'}}>
      <AuthContext.Provider value={{authState, authDispatch}}>
        <div>
          <NavBar handleSorting={handleSorting}/>
          <Route exact path='/' render={() => <Index sortField={sortField} sortDirection={sortDirection}/>}/>
          <Route path='/new-task' component={NewTask}/>
          <Route exact path='/login' component={Login}/>
          <SecuredRoute path='/task/:taskID' component={Task}/>
        </div>
      </AuthContext.Provider>
    </DevContext.Provider>
  );
}

export default withRouter(App);