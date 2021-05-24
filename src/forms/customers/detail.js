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
import Modals from "react-modal";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Modal } from "react-bootstrap";
import MenuItem from "@material-ui/core/MenuItem";
const useStyles = makeStyles((theme) => ({
  root: {
   
  },
  container1: {
    margin:"auto",
   width:"70%"
  },
  content: {
   
  },
}));

function detail({ token, userId,recordId2 ,setShowModal,getItems,submitAction }) {
  const history = useHistory();
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);
  let params = useParams();
  const classes = useStyles();
  const [save,setSave] = useState(false)
  const [recordId, setRecordId] = useState(
    //!params.recordId ? !recordId2 ? recordId2 : null : params.recordId
    !recordId2 ? null : recordId2
  );
  const [loading, setLoading] = useState(false);
  const [initState, setInitState] = useState({
    name: "",
    rif:"",
    phonenumber:"",
    address:"",
    entitytype:"",
    active: true,

  });
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
      getRequest("personresource/getcustomer?id=" + recordId, token)
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
    setSaving(true);
    postRequest(
      "personresource/setcustomer",
      {
        data: initState,
        id: recordId,
      },
      token
    )
      .then((res) => {
        //setCommitRequest(res);
        console.log(res.data.message);
        if (!res.data.customersDberror) {
          getItems(false)
          if(submitAction){
            submitAction(res.data.lastRecord)
          }
          toast.success(res.data.message);
        }
        else toast.error(res.data.customersDberror.message);
        setSaving(false);

        setTimeout(() => setShowModal(false), 3000);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
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
      <div className={classes.content}>
          <div>
          <TextField style={{width:"100%"}}
              id="standard-error-helper-text"
              error={validateForm("", initState.name, null, null)}
              helperText={
                validating && initState.name == "" ? "Campo requerido" : ""
              }
              label="Nombre y apellido"
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
            style={{width:50,marginTop:16}}
            id="standard-select-currency"
            select
            error={validateForm("", initState.entitytype, null, null)}
            value={initState.entitytype}
            onChange={(v) => {
             
              setInitState(
                Object.assign({}, initState, {
                  entitytype: v.target.value,
                })
              );
              
            }}
          >
            <MenuItem key={0} value={"J"}>
              J
            </MenuItem>

            <MenuItem key={1} value={"V"}>
              V
            </MenuItem>
            <MenuItem key={2} value={"E"}>
              E
            </MenuItem>
            <MenuItem key={3} value={"G"}>
              G
            </MenuItem>
          </TextField>
          <TextField style={{width:"83%",marginLeft:4}}
              id="standard-error-helper-text"
              error={validateForm("", initState.rif, null, null)}
              helperText={
                validating && initState.rif == "" ? "Campo requerido" : ""
              }
              label="CI/RIF"
              required
              value={initState.rif}
              onChange={(t) => {
                setInitState(
                  Object.assign({}, initState, {
                    rif: t.target.value,
                  })
                );
              }}
            />
            </div>
        
          <div>
            <TextField style={{width:"100%"}}
              id="standard-error-helper-text"
              error={validateForm("", initState.address, null, null)}
              helperText={
                validating && initState.address == "" ? "Campo requerido" : ""
              }
              label="Direccíon"
              required
              value={initState.address}
              onChange={(t) => {
                setInitState(
                  Object.assign({}, initState, {
                    address: t.target.value,
                  })
                );
              }}
            />
          </div>
          <div>
            <TextField style={{width:"100%"}}
              id="standard-error-helper-text"
              error={validateForm("", initState.phonenumber, null, null)}
              helperText={
                validating && initState.phonenumber == "" ? "Campo requerido" : ""
              }
              label="Teléfono"
              required
              value={initState.phonenumber}
              onChange={(t) => {
                setInitState(
                  Object.assign({}, initState, {
                    phonenumber: t.target.value,
                  })
                );
              }}
            />
          </div>
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={initState.active}
                  onChange={(t) => {
                    setInitState(
                      Object.assign({}, initState, {
                        active: t.target.checked,
                      })
                    );
                  }}
                />
              }
              label="Activo"
            />
          </div>
          <div>
           <Modal.Footer>
          {saving && (
              <View
                style={{
                  marginTop: 20,
                  marginRight: 20,
                  alignItems: "center",
                  justifyContent: "center",
                 
                }}
              >
                <CircularProgress color="secondary" size={20} />
                <div>Salvando datos</div>
              </View>
            )}
            <Button
              disabled={saving ? true : false}
              style={{ marginTop: 20, marginLeft: 10 ,}}
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
           
            </Modal.Footer>
          </div>
        </div>
      </div>
      <Modals
        isOpen={loading}
        onAfterOpen={() => {}}
        onRequestClose={() => {}}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <CircularProgress color="secondary" size={20} />
      </Modals>
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
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export default connect(mapStateToProps)(detail);
