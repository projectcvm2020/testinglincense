import {
  USER_LOGIN,
  USER_LOGOUT,
  ATTEMPT,
  FAILURE,
  USER_UPDATE,
  MODULE_UPDATE
} from "../constants";
import { postRequest } from "../../utility/net/urls";
export const loginSuccess = (data) => {
  return {
    type: USER_LOGIN,
    payload: data,
  };
};

export const authLoginAction = (value, evt = null) => (dispatch, getState) => {
  dispatch({ type: ATTEMPT });
  postRequest("auth/login", value)
    .then((res) => {
      console.log("res", res)
      if (res.data.result.Token) {
        dispatch({
          type: USER_LOGIN,
          payload: res,
        });
      } else {
        dispatch({
          type: FAILURE,
          payload: res,
        });
      }
      if (evt) evt(res);
    })
    .catch((err) => {
      console.log("Algo pasó al intentar conectar con el servidor.", err);
    });
};
export const authLogoutAction = () => (dispatch) => {
  dispatch({
    type: USER_LOGOUT,
  });

  return true;
};
export const setUserValues = (value) => {
  dispatch({
    type: USER_UPDATE,
    payload: value,
  });
};
export const authUpdateModulesAction = (value) => (dispatch) => {
  dispatch({
    type: MODULE_UPDATE,
    payload: value,
  });
}