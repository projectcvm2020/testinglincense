  import { USER_LOGIN,ATTEMPT, FAILURE,USER_LOGOUT,USER_UPDATE,MODULE_UPDATE } from "../constants";

const initialState = {
  isFetching: false,
  user: [],
  token: null,
  modules:[],
  allmodules:[],
  params:[]
 
};
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_UPDATE:
    case USER_LOGIN:
      return {
        ...state,
        isFetching: false,
        user: action.payload.data.result.userdata ,
        token: action.payload.data.result.Token,
        modules:action.payload.data.result.modules,
        allmodules:action.payload.data.result.allmodules,
        params:action.payload.data.result.params
      };
    case ATTEMPT:
      return {
        ...state,
        isFetching: true,
        token: null,
      };  
    case FAILURE:
      return {
        ...state,
        token: null,
        data: [],
        isFetching: false,
      };
    case USER_LOGOUT:
     // setTimeout(()=>{window.location=window.location.origin.toString()},3000)
      return {
        ...state,
        isFetching: false,
        data: [],
        token: null,
        modules:[]
      };
    case MODULE_UPDATE:
      return {
        ...state,
        
        modules:action.payload
      }; 
    default:
      return state;
  }
}
