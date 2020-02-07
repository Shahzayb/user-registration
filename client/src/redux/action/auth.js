import * as actionTypes from '../action/type';
import getMyProfile from '../../api/getMyProfile';

export const ensureLogin = () => async dispatch => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({
        type: actionTypes.LOGIN_START
      });

      // getMyProfile will throw an exception if response is not ok
      const { user } = await getMyProfile(token);

      const payload = {
        userId: user._id,
        profilePic: user.profilePicUrl,
        username: user.username,
        isLoggedIn: true
      };

      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload
      });
    } else {
      dispatch({
        type: actionTypes.LOGIN_FAIL
      });
    }
  } catch (e) {
    console.error(e);
    localStorage.removeItem('token');
    dispatch({
      type: actionTypes.LOGIN_FAIL
    });
  }
};

export const registerUser = (user, token) => {
  localStorage.setItem('token', token);
  return {
    type: actionTypes.REGISTER_USER,
    payload: {
      userId: user._id,
      username: user.username,
      profilePic: user.profilePicUrl,
      token
    }
  };
};

export const loginUser = (user, token) => {
  localStorage.setItem('token', token);
  const payload = {
    userId: user._id,
    profilePic: user.profilePicUrl,
    username: user.username,
    isLoggedIn: true
  };
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload
  };
};

export const logoutUser = () => {
  localStorage.removeItem('token');

  return {
    type: actionTypes.LOGOUT
  };
};
