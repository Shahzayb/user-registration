import * as actionTypes from './type';
import { PAGE_SIZE } from '../../config/pagination';
import searchUserApi from '../../api/searchUser';

export const searchUser = (q, nextPage) => async dispatch => {
  try {
    const user = await searchUserApi(q, nextPage, PAGE_SIZE);

    dispatch({
      type: actionTypes.SEARCH_USER,
      user,
      pagination: {
        curPage: nextPage,
        hasMore: user.length === PAGE_SIZE ? true : false
      },
      term: q
    });
  } catch (error) {
    console.error(error);
  }
};

export const resetSearch = () => ({ type: actionTypes.RESET_SEARCH });
