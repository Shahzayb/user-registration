import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { searchUser } from '../redux/action/search';
import UserList from '../component/UserList';
import Navbar from '../component/Navbar';

const Search = props => {
  const { search, searchUser } = props;

  const searchHandler = page => {
    searchUser(search.term, page);
  };

  return (
    <>
      <Navbar />
      <Typography
        style={{ padding: '2rem 0 0 2rem' }}
        gutterBottom
        variant="h3"
        component="h1"
      >
        Search result for: {search.term}
      </Typography>
      <UserList
        curPage={search.pagination.curPage}
        hasMore={search.pagination.hasMore}
        fetchNext={searchHandler}
        user={search.user}
      />
    </>
  );
};

const mapState = (state, ownProps) => {
  const searchTerm = ownProps.match.params.searchTerm.trim();
  let search = state.search;
  if (search.term !== searchTerm) {
    search = {
      term: searchTerm,
      user: [],
      pagination: {
        curPage: 0,
        hasMore: true
      }
    };
  }
  return { search };
};

const mapDispatch = { searchUser };

export default connect(mapState, mapDispatch)(Search);
