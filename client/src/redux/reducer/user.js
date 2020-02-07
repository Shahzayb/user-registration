import * as actionTypes from '../action/type';

const initialState = {
  pagination: {
    curPage: 0,
    hasMore: true
  },
  user: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER:
      return {
        user: [...state.user, ...action.user],
        pagination: { ...state.pagination, ...action.pagination }
      };
    case actionTypes.RESET_USER:
      return initialState;
    default:
      return state;
  }
};
