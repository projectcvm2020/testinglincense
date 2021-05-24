import React from 'react'
import { UPDATE_CURENT_COMPONENT,ACTIVE_PROFILE_MODULE,PRINT_LICENCE,MENU_OPEN } from "../constants";

const initialState = {
  isLoading: false,
  active:true,
  comp: null,
  activeProfileModule:null,
  printLicence:false,
  menuOpen:false
};
export default function auxReducer(state = initialState, action) {
  console.log("action module activeddd",action)
  switch (action.type) {

    case UPDATE_CURENT_COMPONENT:
      return {
        ...state,
        isLoading: false,
        active:true,
        comp: action.payload.currentcomponent,
      };
   
    case ACTIVE_PROFILE_MODULE:
      return {
        ...state,
        activeProfileModule:action.payload.activeprofilemodule
      };  
    case PRINT_LICENCE:
      return {
        ...state,
        printLicence:action.payload.printLicence
      };  
    case MENU_OPEN:
      return {
        ...state,
        menuOpen:action.payload.menuOpen
      };  
    default:
      return state;
  }
}
