import React, {useState} from 'react';
import AuthContext, {DevContext} from './components/context';
import {BrowserRouter, Route} from 'react-router-dom';

import {createCookie, eraseCookie, readCookie} from "./utils";
import Tasks from "./components/tasks";
import Navbar from './components/navbar';
import NewTask from "./components/newTask";
import Task from './components/task';
import Login from "./components/login";
import PrivateRoute from "./components/privateRoute";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
}

const init = (initialState: any) => {
  const user = readCookie('user');
  const token = readCookie('token');

  return {
    ...initialState,
    isAuthenticated: user && token,
    user,
    token
  }
};

const reducer = (state: object, action: any) => {
  switch (action.type) {
    case "LOGIN" :
      createCookie('user', action.user, 86400)
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


const App = () => {
  const [authState, authDispatch] = React.useReducer(reducer, initialState, init);

  const [sortField, setSortField] = useState<any | null>(null);
  const [sortDirection, setSortDirection] = useState<any | null>(null);


  const handleSorting = (field?: string, direction?: string) => {
    setSortDirection(direction);
    setSortField(field);
  }

  window.addEventListener('storage', function ({key, newValue}) {
      if ((key === 'isAuthenticated') && (!newValue)) {
        authDispatch({type: 'LOGOUT'});
      }
    }
  );

  return (
    <BrowserRouter>
      <DevContext.Provider value={{developer: 'ptash4'}}>
        <AuthContext.Provider value={{authState, authDispatch}}>
          <Navbar handleSorting={handleSorting}/>
          <Route exact path='/' render={() => <Tasks sortField={sortField} sortDirection={sortDirection}/>}/>
          <Route exact path='/new-task' component={NewTask}/>
          <Route exact path='/login' component={Login}/>
          <PrivateRoute path='/task/:taskID' component={Task}/>
        </AuthContext.Provider>
      </DevContext.Provider>
    </BrowserRouter>
  );
}

export default App;
