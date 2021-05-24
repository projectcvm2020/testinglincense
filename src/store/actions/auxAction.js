import { UPDATE_CURENT_COMPONENT,ACTIVE_PROFILE_MODULE,generateDispatch, PRINT_LICENCE, MENU_OPEN} from "../constants";

export const updateAuxAction = (value) => (dispatch) => {
   
      dispatch(generateDispatch(UPDATE_CURENT_COMPONENT,{currentcomponent:value}))
      return true
};
export const setActiveProfileModule = (value) => (dispatch) =>{
  
  dispatch(generateDispatch(ACTIVE_PROFILE_MODULE,{activeprofilemodule:value}))

  return true
}
export const setPrintedLicence=(value)=>(dispatch)=>{
  dispatch(generateDispatch(PRINT_LICENCE,{printLicence:value}))
  return true
}
export const setMenuOpen=(value)=>(dispatch)=>{
  dispatch(generateDispatch(MENU_OPEN,{menuOpen:value}))
  return true
}

