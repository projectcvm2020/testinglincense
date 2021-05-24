import React from 'react'
import { postRequest } from "../../utility/net/urls";
import store  from '../../store'
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
export const ValidateEmail=(mail)=> {
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    
    return (false)
}
export const validateRegex = (evt, regex) => {
  var theEvent = evt || window.event;
  if (!regex.test(evt.key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
};
export const validateDocument = (value,setLoading,setValidDocument,evt = null) => {
  const token=store.getState().authStorage.token
  setLoading(true)
  postRequest("affiliates/checkdocument", {
    value: value.value,
    entitytype:value.entitytype
  },token)
    .then((res) => {
      console.log(res);
      if (res.data.count == "0") {
        
        setValidDocument(1);
        if (evt) {evt();}
      } else {
         
        setValidDocument(2);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.log("Algo pasó al intentar conectar con el servidor.", err);
    });
};
export const validateDocument2 = (value,setLoading,setValidDocument,evt = null) => {
  const token=store.getState().authStorage.token
  setLoading(true)
  postRequest("miner/checkdocument", {
    value: value.value,
    entitytype:value.entitytype
  },token)
    .then((res) => {
      console.log(res);
      if (res.data.count == "0") {
        
        setValidDocument(1);
        if (evt) {evt();}
      } else {
         
        setValidDocument(2);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.log("Algo pasó al intentar conectar con el servidor.", err);
    });
};
export function NumberFormatCustom(props) {
  const { inputRef, onChange,prefix,thousandSeparator, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator={thousandSeparator}
      isNumericString
      prefix={prefix}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
