import React, { useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import { makeStyles } from '@material-ui/core/styles';
import UserProfileCard from './UserProfileCard';
import InfiniteScroll from 'react-infinite-scroller';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    width: '100%',
    padding: theme.spacing(5)
  }
}));

const UserList = props => {
  const classes = useStyles();
  const { user, fetchNext, hasMore, curPage } = props;

  const loadMore = useCallback(() => {
    fetchNext(curPage + 1);
  }, [fetchNext, curPage]);

  if (user.length === 0 && hasMore === false) {
    return (
      <div>
        <Typography
          color="textSecondary"
          align="center"
          variant="subtitle1"
          gutterBottom
        >
          No Content Found. <SentimentVeryDissatisfiedIcon />
        </Typography>
      </div>
    );
  } else {
    return (
      <div className={classes.gridContainer}>
        <InfiniteScroll
          pageStart={curPage}
          hasMore={hasMore}
          loadMore={loadMore}
          loader={
            <div
              key="loader"
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '2rem'
              }}
            >
              <CircularProgress />
            </div>
          }
        >
          <Grid container spacing={3}>
            {user.map(user => (
              <Grid key={user._id} item xs>
                <UserProfileCard user={user} />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </div>
    );
  }
};

export default UserList;
