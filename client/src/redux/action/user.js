import * as actionTypes from '../action/type';
import { PAGE_SIZE } from '../../config/pagination';
import getUserApi from '../../api/getUser';

export const fetchUser = nextPage => async dispatch => {
  try {
    const user = await getUserApi(nextPage, PAGE_SIZE);

    dispatch({
      type: actionTypes.FETCH_USER,
      user,
      pagination: {
        curPage: nextPage,
        hasMore: user.length === PAGE_SIZE ? true : false
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const resetUser = () => ({ type: actionTypes.RESET_USER });
