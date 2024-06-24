import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from './types';

export const loginUser = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, credentials);
    const { token } = res.data;

    localStorage.setItem('token', token);

    dispatch({ type: LOGIN_SUCCESS, payload: token });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.response.data.message });
  }
};
