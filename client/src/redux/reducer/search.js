import * as actionTypes from '../action/type';

const initialState = {
  term: '',
  pagination: {
    curPage: 0,
    hasMore: true
  },
  user: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEARCH_USER:
      if (state.term !== action.term) {
        return {
          user: [...action.user],
          pagination: { ...action.pagination },
          term: action.term
        };
      }
      return {
        ...state,
        user: [...state.user, ...action.user],
        pagination: { ...state.pagination, ...action.pagination }
      };
    case actionTypes.RESET_SEARCH:
      return initialState;
    default:
      return state;
  }
};
