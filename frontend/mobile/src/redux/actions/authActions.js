import axios from 'axios';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from './types';

export const register = (email, password) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const res = await axios.post('/api/auth/register', { email, password });
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: REGISTER_FAILURE });
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const res = await axios.post('/api/auth/login', { email, password });
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
