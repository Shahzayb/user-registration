import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import SignIn from './page/SignIn';
import SignUp from './page/SignUp';
import Home from './page/Home';
import ForgotPassword from './page/ForgotPassword';
import ResetPassword from './page/ResetPassword';
import Search from './page/Search';
import withAuth from './hoc/withAuth';
import { ensureLogin } from './redux/action/auth';

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={SignIn} />
        <Route path="/register" component={SignUp} />
        <Route path="/search/:searchTerm" component={Search} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password/:userId" component={ResetPassword} />
      </Switch>
    </>
  );
}

const mapState = state => ({ loading: state.auth.loading });

const mapDispatch = { ensureLogin };

export default connect(mapState, mapDispatch)(withAuth(App));
