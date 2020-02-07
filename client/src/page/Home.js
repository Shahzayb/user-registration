import React from 'react';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../component/Navbar';
import UserList from '../component/UserList';
import { fetchUser } from '../redux/action/user';

const useStyles = makeStyles(theme => ({
  heroContent: {
    padding: theme.spacing(8, 0, 6)
  },
  subHeading: {
    margin: theme.spacing(2)
  }
}));

const Home = props => {
  const classes = useStyles();
  return (
    <>
      <Navbar />
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              VU Registration Module
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              It's a user registration module with login, register, search users
              and forget password functionalities.
            </Typography>
          </Container>
        </div>
        <Typography
          className={classes.subHeading}
          component="h2"
          variant="h4"
          color="textPrimary"
          gutterBottom
        >
          Users List:
        </Typography>
        <UserList
          curPage={props.pagination.curPage}
          hasMore={props.pagination.hasMore}
          fetchNext={props.fetchUser}
          user={props.user}
        />
      </main>
    </>
  );
};

const mapState = state => ({
  user: state.user.user,
  pagination: state.user.pagination
});

const mapDispatch = { fetchUser };

export default connect(mapState, mapDispatch)(Home);
