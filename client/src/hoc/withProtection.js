import React from 'react';
import { useHistory } from 'react-router-dom';

export default function(Component) {
  return function Protected(props) {
    const { isLoggedIn } = props;
    const history = useHistory();
    if (!isLoggedIn) {
      return <Component {...props} />;
    } else {
      if (history.length > 1) {
        history.goBack();
      } else {
        history.replace('/');
      }
      return null;
    }
  };
}
