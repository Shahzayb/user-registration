import React, { useState } from 'react';
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
import Navbar from '../component/Navbar';
import Copyright from '../component/Copyright';
import forgotPasswordApi from '../api/forgotPassword';

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

function ForgotPassword(props) {
  const classes = useStyles();
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const forgotPasswordHandler = e => {
    e.preventDefault();
    setSubmitting(true);
    console.log(email);
    forgotPasswordApi(email)
      .then(() => {
        setSuccess(true);
      })
      .catch(() => {
        setAlertOpen(true);
        setSubmitting(false);
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
              Forget Password
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
                  Invalid email address
                </Alert>
              </Collapse>
            </div>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                type="email"
                label="Email Address"
                name="email"
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isSubmitting}
                onClick={forgotPasswordHandler}
              >
                Submit Email
              </Button>
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      ) : (
        <Typography
          style={{ marginTop: '3rem' }}
          variant="h5"
          color="primary"
          align="center"
        >
          Reset password link is sent successfully. Please goto your email
          account and click on reset link to reset password.
        </Typography>
      )}
    </>
  );
}

export default ForgotPassword;
