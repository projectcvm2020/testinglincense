export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const ATTEMPT = "ATTEMPT";
export const FAILURE = "FAILURE";


export const CHANGE_CONFIG = "CHANGE_CONFIG";
export const RESET_CONFIG = "RESET_CONFIG";
export const CHANGE_VALUE = "CHANGE_VALUE";
export const RESET_VALUE = "RESET_VALUE";
export const SET_ACTIVE_MODULE = "SET_ACTIVE_MODULE";
export const USER_UPDATE = "USER_UPDATE";
export const UPDATE_CURENT_COMPONENT = "UPDATE_CURENT_COMPONENT";
export const ACTIVE_PROFILE_MODULE = "ACTIVE_PROFILE_MODULE";
export const PRINT_LICENCE = "PRINT_LICENCE";
export const MENU_OPEN = "MENU_OPEN";
export const MODULE_UPDATE = "MODULE_UPDATE";
export const generateDispatch =(type,payload)=>{
    return {
        type:type,
        payload:payload
    }
}