import React from 'react'
import { postRequest,getRequest, } from "../utility/net/urls";
import store  from '../store'
import MenuItem from "@material-ui/core/MenuItem";
export const getParish=(set)=>{
   const token=store.getState().authStorage.token
   return getRequest("personresource/getParishList",token)
            .then((res) => {
                set(res.data);
                
            })
            .catch((err) => {
                console.log("Algo pasó al intentar conectar con el servidor.", err);
            });
}
export const getSector=(set,setloading,parishid)=>{
    const token=store.getState().authStorage.token
    setloading(true) 
    let parish=parishid?"?idparish="+parishid:"";
    return getRequest("personresource/getsectorList"+parish,token)
             .then((res) => {
                console.log("res",res,"personresource/getsectorList?idparish="+parishid)
                set(res.data);
                setloading(false) 
             })
             .catch((err) => {
                 console.log("Algo pasó al intentar conectar con el servidor.", err);
             });
 }
 export const getMineralType=(set,parishid)=>{
    const token=store.getState().authStorage.token
    return getRequest("personresource/getmineraltypes",token)
             .then((res) => {
                set(res.data);
                 
             })
             .catch((err) => {
                 console.log("Algo pasó al intentar conectar con el servidor.", err);
             });
 }
 export const getGetActityType=(set)=>{
   const token=store.getState().authStorage.token
    return getRequest("personresource/getactivitytypeslist",token)
             .then((res) => {
                set(res.data);
                 
             })
             .catch((err) => {
                 console.log("Algo pasó al intentar conectar con el servidor.", err);
             });
 }
 export const getActivitySubType=(set,setloading,parentid)=>{
    const token=store.getState().authStorage.token
    setloading(true)
    return getRequest("personresource/getsubtypeslist?parentid="+parentid,token)
             .then((res) => {
                set(res.data);
                setloading(false) 
             })
             .catch((err) => {
                 console.log("Algo pasó al intentar conectar con el servidor.", err);
             });
 }
 export const getExtractionMethod=(set)=>{
   const token=store.getState().authStorage.token
    return getRequest("personresource/getextractionmethod",token)
             .then((res) => {
                set(res.data);
                 
             })
             .catch((err) => {
                 console.log("Algo pasó al intentar conectar con el servidor.", err);
             });
 }
 export const getFinanceMethod=(set)=>{
   const token=store.getState().authStorage.token
    return getRequest("personresource/getfinancmethod",token)
             .then((res) => {
                set(res.data);
                 
             })
             .catch((err) => {
                 console.log("Algo pasó al intentar conectar con el servidor.", err);
             });
 }
export const  ListSelect = (data) => {
    return data.map((item, index) => {
      return (
        <MenuItem key={index} value={item.id}>
          {item.name}
        </MenuItem>
      );
    });
  };

  export const getPosition=(set)=>{
    const token=store.getState().authStorage.token
     return getRequest("personresource/getPosition",token)
              .then((res) => {
                 set(res.data);
                  
              })
              .catch((err) => {
                  console.log("Algo pasó al intentar conectar con el servidor.", err);
              });
  }
  export const getControlPoint=(set)=>{
    const token=store.getState().authStorage.token
     return getRequest("personresource/getcontrolpoint",token)
              .then((res) => {
                 set(res.data);
                  
              })
              .catch((err) => {
                  console.log("Algo pasó al intentar conectar con el servidor.", err);
              });
  }
  export const getFuel=(set)=>{
    const token=store.getState().authStorage.token
     return getRequest("personresource/getfuel",token)
              .then((res) => {
                 set(res.data);
                  
              })
              .catch((err) => {
                  console.log("Algo pasó al intentar conectar con el servidor.", err);
              });
  }
  export const getPlant=(set)=>{
    const token=store.getState().authStorage.token
     return getRequest("personresource/getPlant",token)
              .then((res) => {
                 set(res.data);
                  
              })
              .catch((err) => {
                  console.log("Algo pasó al intentar conectar con el servidor.", err);
              });
  }
  export const getPaymentRecept=(set)=>{
    const token=store.getState().authStorage.token
     return getRequest("personresource/getPaymentRecept",token)
              .then((res) => {
                 set(res.data);
                  
              })
              .catch((err) => {
                  console.log("Algo pasó al intentar conectar con el servidor.", err);
              });
  }
