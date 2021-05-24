import React, { useState, useEffect, useRef, useCallback } from "react";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest, getRequest } from "../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";

import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, Redirect, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {
  
  NumberFormatCustom,
} from "../../utility/formValidation";
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  container1: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
}));

function detail({ token, userId }) {
  const history=useHistory()
  const [validating, setValidating] = useState(false);
  const [mineralTypes,setMineralTypes] = useState(false);
  const [saving, setSaving] = useState(false);
  let params = useParams();
  const [save,setSave] = useState(false)
  const classes = useStyles();
  const [recordId, setRecordId] = useState(
    !params.recordId ? null : params.recordId
  );
  const [loading,setLoading]=useState(false)  
  const [initState, setInitState] = useState({
   name:"",
   mineralid:null,
   ammount:null
   
  });
  useEffect(() => {
    getMineralType(setMineralTypes);
 
  }, []);
  var formErr = 0;
  const validateForm = (type, inputValue, validDoc, validEmail) => {
    var error = false;
    if (validating) {
      if (inputValue == "") error = true;
      if (type == "doc" && isNew) {
        if (validDoc == 2) error = true;
      }
      if (type == "mail") {
        if (!validEmail) error = true;
      }
    }

    if (error) formErr += 1;

    return error;
  };
  useEffect(() => {
    if (recordId) {
        setLoading(true);
      getRequest("personresource/gettaxes?id=" + recordId, token)
        .then((res) => {
            setLoading(false);
          setInitState(res.data);
          
        })
        .catch((err) => {
          console.log("Algo pasó al intentar conectar con el servidor.", err);
        });
    }
  }, [recordId]);
  useEffect(() => {
    if (params.recordId) setRecordId(params.recordId);
  }, []);
  const submit = () => {
    console.log("r1", recordId);
    postRequest("personresource/settaxes",
      {
        data: initState,
        id:recordId 
      },
      token
    )
      .then((res) => {
        //setCommitRequest(res);
        console.log(res.data.message)
        if(!res.data.positionDberror)
            toast.success(res.data.message);
        else
            toast.error(res.data.positionDberror.message)
        setSaving(false)

        setTimeout(() =>history.push("/taxes") , 3000);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
  const ListSelect = (data) => {
    return data.map((item, index) => {
      return (
        <MenuItem key={index} value={item.id}>
          {item.name}
        </MenuItem>
      );
    });
  };
  useEffect(()=>{

    if(save){
      
      if(formErr==0){

        setSaving(true);
       
        setTimeout(() => submit(), 1000);
      }
      else{
        setSave(false)
      }
    }
  },[save])
  return (
    <>
      <div className={classes.container1}>
        <div>
        <div>
          <TextField
            id="standard-error-helper-text"
            error={validateForm("", initState.name, null, null)}
            helperText={
              validating && initState.name == "" ? "Campo requerido" : ""
            }
            label="Descripción"
            required
            value={initState.name}
            onChange={(t) => {
              setInitState(
                Object.assign({}, initState, {
                  name: t.target.value,
                })
              );
            }}
          />
        </div>
        <div>
        <TextField
            error={validateForm("", initState.mineralid, null, null)}
            helperText={
              validating && initState.mineralid == "" ? "Campo requerido" : ""
            }
            id="standard-error-helper-text"
            select
            
            required
            label="Tipo de mineral"
            value={initState.mineralid}
            onChange={(t) => {
              setInitState(
                Object.assign({}, initState, { mineralid: t.target.value })
              );
            }}
          >
            {ListSelect(mineralTypes)}
          </TextField>
        </div>

        <div>
          <TextField
            label="Valor"
            error={validateForm("", initState.validkilograms, null, null)}
            helperText={
              validating && initState.validkilograms == "" ? "Campo requerido" : ""
            }
            value={initState.validkilograms}
            required
            onChange={(t) => {
              setInitState(
                Object.assign({}, initState, {
                  validkilograms: t.target.value,
                })
              );
            }}
            id="formatted-numberformat-input"
            InputProps={{
              inputComponent: NumberFormatCustom,
              inputProps: { prefix: "Gr ", thousandSeparator: true },
            }}
          />
        </div>
        
        <div>
        <Button
                disabled={false}
                style={{ marginTop: 20, marginLeft: 10 }}
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => {
                  setValidating(true)
                  setSave(true)
                }}
              >
                Salvar
              </Button>
        </div>
      </div>
      </div>
      <ToastContainer 
     position="bottom-center"
     autoClose={5000}
     hideProgressBar={false}
     newestOnTop={false}
     closeOnClick
     rtl={false}
     pauseOnFocusLoss
     draggable
     pauseOnHover
      />
    </>
  );
}
const mapStateToProps = ({ authStorage }) => {
  return {
    token: authStorage.token,
    userId: authStorage.user.id,
  };
};
export default connect(mapStateToProps)(detail);
