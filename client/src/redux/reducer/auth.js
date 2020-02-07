import * as actionTypes from '../action/type';

const initialState = {
  userId: '',
  username: '',
  isLoggedIn: false,
  profilePic: '',
  loading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return {
        ...state,
        loading: true
      };

    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    case actionTypes.LOGIN_FAIL:
      return { ...initialState, loading: false };
    case actionTypes.LOGOUT:
      return { ...initialState, loading: false };
    case actionTypes.REGISTER_USER:
      return {
        ...state,
        ...action.payload,
        loading: false,
        isLoggedIn: true
      };
    default:
      return state;
  }
};
