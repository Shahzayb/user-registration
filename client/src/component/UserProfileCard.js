import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    minWidth: '200px',
    margin: 'auto'
  }
}));

export default function UserProfileCard(props) {
  const classes = useStyles();
  const { user } = props;
  return (
    <Paper className={classes.paper}>
      <Grid
        direction="row"
        justify="space-around"
        alignItems="center"
        container
        spacing={2}
      >
        <Grid item xs={4}>
          <Avatar alt={user.name} src={user.profilePic} />
        </Grid>
        <Grid item xs={8} container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs zeroMinWidth>
              <Tooltip title={user.username}>
                <Typography gutterBottom variant="subtitle1" noWrap>
                  {user.username}
                </Typography>
              </Tooltip>
              <Tooltip title={user.name}>
                <Typography variant="body2" color="textSecondary" noWrap>
                  {user.name}
                </Typography>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
