import React, { useState } from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { Redirect, useParams, useLocation } from 'react-router-dom';

import Navbar from '../component/Navbar';
import Copyright from '../component/Copyright';
import resetPasswordApi from '../api/resetPassword';
import { loginUser } from '../redux/action/auth';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  alertContainer: {
    width: '100%',
    margin: theme.spacing(2, 0, 2, 0)
  }
}));

function ResetPassword(props) {
  const classes = useStyles();
  const { userId } = useParams();
  const { search } = useLocation();
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetPasswordHandler = e => {
    e.preventDefault();
    setSubmitting(true);
    resetPasswordApi(password, userId, search)
      .then(({ user, token }) => {
        setSuccess(true);
        props.loginUser(user, token);
      })
      .catch(res => {
        if (res.status === 422) {
          res.json().then(({ errors }) => {
            setError(errors[0].msg);
            setAlertOpen(true);
            setSubmitting(false);
          });
        } else {
          setError('invalid token or userId');
          setAlertOpen(true);
          setSubmitting(false);
        }
      });
  };

  return (
    <>
      <Navbar />
      {!success ? (
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
            <div className={classes.alertContainer}>
              <Collapse in={isAlertOpen}>
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlertOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {error}
                </Alert>
              </Collapse>
            </div>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="password"
                label="Password"
                name="password"
                autoFocus
                value={password}
                onChange={e => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isSubmitting}
                onClick={resetPasswordHandler}
              >
                Submit New Password
              </Button>
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

const mapDispatch = { loginUser };

export default connect(null, mapDispatch)(ResetPassword);
