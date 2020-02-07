import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../component/Navbar';

import Copyright from '../component/Copyright';
import postUser from '../api/postUser';
import { registerUser } from '../redux/action/auth';
import { resetUser } from '../redux/action/user';
import { resetSearch } from '../redux/action/search';

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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const initialFormState = {
  name: {
    value: '',
    validation: {
      required: true
    },
    touched: false,
    valid: false,
    errorMessage: {
      required: 'please enter your full name'
    },
    errorMessageProp: 'required'
  },
  username: {
    value: '',
    validation: {
      required: true,
      unique: true
    },
    touched: false,
    valid: false,
    errorMessage: {
      required: 'please enter username',
      unique: 'username is already taken'
    },
    errorMessageProp: 'required'
  },
  email: {
    value: '',
    validation: {
      required: true,
      unique: true,
      email: true
    },
    touched: false,
    valid: false,
    errorMessage: {
      required: 'please enter email address',
      unique: 'email is already taken',
      email: 'please enter valid email address'
    },
    errorMessageProp: 'required'
  },
  password: {
    value: '',
    validation: {
      required: true,
      minlength: 8
    },
    touched: false,
    valid: false,
    errorMessage: {
      required: 'please enter password',
      minlength: 'your password should contain at least 8 characters'
    },
    errorMessageProp: 'required'
  }
};

// checks the validity of name, email, password, and username fields based on value and validation rules
const checkFieldValidity = (value, rules) => {
  let isValid = true;
  let errorMessageProp = '';

  if (rules.required) {
    isValid = value && value.trim() && isValid;
    errorMessageProp = 'required';
  }
  if (isValid && rules.minlength) {
    isValid = value && value.trim().length >= rules.minlength && isValid;
    errorMessageProp = 'minlength';
  }

  if (isValid && rules.email) {
    // eslint-disable-next-line
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    isValid = value && emailRegex.test(value.trim()) && isValid;
    errorMessageProp = 'email';
  }

  return [isValid, errorMessageProp];
};

// checks the whole form validity before submition
const ensureFormValidity = (form, setForm) => {
  const newForm = { ...form };
  let isValid = true;
  for (let key of Object.keys(form)) {
    const [valid, errorMessageProp] = checkFieldValidity(
      form[key].value,
      form[key].validation
    );

    newForm[key] = { ...newForm[key], touched: true, valid, errorMessageProp };

    isValid = newForm[key].valid && isValid;
  }
  setForm(newForm);
  return isValid;
};

// extract user data ( email, password... ) from state
const extractFormData = form => {
  const data = {};
  for (let key of Object.keys(form)) {
    data[key] = form[key].value;
  }
  return data;
};

function SignUp(props) {
  const classes = useStyles();
  const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const { name, username, email, password } = form;

  const handleChange = (value, field) => {
    const [valid, errorMessageProp] = checkFieldValidity(
      value,
      form[field].validation
    );
    setForm(form => ({
      ...form,
      [field]: {
        ...form[field],
        value,
        touched: true,
        valid,
        errorMessageProp
      }
    }));
  };

  const handleBlur = field => {
    setForm(form => ({
      ...form,
      [field]: {
        ...form[field],
        touched: true
      }
    }));
  };

  const invalidateField = (name, errorMessageProp) => {
    setForm(form => ({
      ...form,
      [name]: {
        ...form[name],
        valid: false,
        touched: true,
        errorMessageProp
      }
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const isValid = ensureFormValidity(form, setForm);
    if (isValid) {
      setSubmitting(true);
      const user = extractFormData(form);
      postUser(user)
        .then(({ user, token }) => {
          props.resetUser();
          props.resetSearch();
          props.registerUser(user, token);
          setSubmitionCompleted(true);
        })
        .catch(res => {
          if (res.status === 422) {
            setSubmitting(false);
            res.json().then(({ errors }) => {
              for (let { param } of errors) {
                invalidateField(param, 'unique');
              }
            });
          }
        });
    }
  };

  return !isSubmitionCompleted ? (
    <>
      {' '}
      <Navbar />
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>

          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="full-name"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                  error={!name.valid && name.touched}
                  value={name.value}
                  onChange={e => handleChange(e.target.value, 'name')}
                  onBlur={() => handleBlur('name')}
                  helperText={
                    !name.valid &&
                    name.touched &&
                    name.errorMessage[name.errorMessageProp]
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  error={!username.valid && username.touched}
                  value={username.value}
                  onChange={e => handleChange(e.target.value, 'username')}
                  onBlur={() => handleBlur('username')}
                  helperText={
                    !username.valid &&
                    username.touched &&
                    username.errorMessage[username.errorMessageProp]
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!email.valid && email.touched}
                  value={email.value}
                  onChange={e => handleChange(e.target.value, 'email')}
                  onBlur={() => handleBlur('email')}
                  helperText={
                    !email.valid &&
                    email.touched &&
                    email.errorMessage[email.errorMessageProp]
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={!password.valid && password.touched}
                  value={password.value}
                  onChange={e => handleChange(e.target.value, 'password')}
                  onBlur={() => handleBlur('password')}
                  helperText={
                    !password.valid &&
                    password.touched &&
                    password.errorMessage[password.errorMessageProp]
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </>
  ) : (
    <Redirect to="/" />
  );
}

const mapDispatch = { registerUser, resetUser, resetSearch };

export default connect(null, mapDispatch)(SignUp);
