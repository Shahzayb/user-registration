import React, { useState } from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Navbar from '../component/Navbar';
import Copyright from '../component/Copyright';
import loginUserApi from '../api/loginUser';
import { loginUser as loginUserAction } from '../redux/action/auth';

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

const initialFormState = {
  username: '',
  password: ''
};

function SignIn(props) {
  const classes = useStyles();
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [loginForm, setLoginForm] = useState(initialFormState);
  const [isSubmitting, setSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const loginHandler = e => {
    e.preventDefault();
    setSubmitting(true);
    loginUserApi(loginForm)
      .then(({ user, token }) => {
        props.loginUserAction(user, token);
        setLoginSuccess(true);
      })
      .catch(res => {
        setAlertOpen(true);
        setSubmitting(false);
      });
  };

  const changeHandler = (value, fieldName) => {
    setLoginForm(form => ({ ...form, [fieldName]: value }));
  };

  return !loginSuccess ? (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
                Invalid username or password
              </Alert>
            </Collapse>
          </div>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="text"
              label="Username"
              name="username"
              autoFocus
              value={loginForm.username}
              onChange={e => changeHandler(e.target.value, 'username')}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={loginForm.value}
              onChange={e => changeHandler(e.target.value, 'password')}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isSubmitting}
              onClick={loginHandler}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  disabled={isSubmitting}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  disabled={isSubmitting}
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </>
  ) : (
    <Redirect to="/" />
  );
}

const mapDispatch = { loginUserAction };

export default connect(null, mapDispatch)(SignIn);
