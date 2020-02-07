import React, { useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const centerStyles = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

export default function(Component) {
  return function Auth(props) {
    const { ensureLogin } = props;
    useEffect(() => {
      ensureLogin();
    }, [ensureLogin]);

    if (props.loading) {
      return (
        <div style={centerStyles}>
          <CircularProgress />
        </div>
      );
    } else {
      return <Component {...props} />;
    }
  };
}
