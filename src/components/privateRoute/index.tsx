import React, {useContext} from 'react';
import {Route, useHistory} from 'react-router-dom';
import AuthContext from '../context';

const PrivateRoute = (props: { component: any; path: any; }) => {
  const { authState } = useContext(AuthContext) as any;
  const {component: Component, path} = props;
  const history = useHistory();

  return (
    <Route path={path} render={() => {
      if (!authState.isAuthenticated) {
        history.push('/login');
        return <div/>;
      }
      return <Component />
    }} />
  );
}

export default PrivateRoute;