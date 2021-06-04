import React, {useContext} from 'react';
import {Route, withRouter} from 'react-router-dom';
import AuthContext from './Contexts'

const SecuredRoute = (props) => {
  const { authState } = useContext(AuthContext);
  const {component: Component, path} = props;

  return (
    <Route path={path} render={() => {
      if (!authState.isAuthenticated) {
        props.history.push('/login');
        return <div/>;
      }
      return <Component />
    }} />
  );
}

export default withRouter(SecuredRoute);