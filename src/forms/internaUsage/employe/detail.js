import React, { useState, useEffect, useRef, useCallback } from "react";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest, getRequest } from "../../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";

import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, Redirect, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Modals from "react-modal";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Modal } from "react-bootstrap";
import {
  getPosition,
} from "../../../components/loadSelect";
import {
  validateRegex,
  ValidateEmail,
} from "../../../utility/formValidation";
import {Tab,Tabs} from 'react-bootstrap/'
import MenuItem from "@material-ui/core/MenuItem";

import LicenseModule from "../../affiliates/license/licenseModule";
const useStyles = makeStyles((theme) => ({
  root: {
   
  },
  container1: {
    margin:"auto",
   width:"95%"
  },
  content: {
   
  },
}));

function detail({ token, userId,recordId2 ,setShowModal,getItems }) {
  const history = useHistory();
  const [validating, setValidating] = useState(false);
  const [validEmail1, setValidEmail1] = useState(true);
  const [saving, setSaving] = useState(false);
  const [position, setPosition] = useState([]);
  let params = useParams();
  const classes = useStyles();
  const [save,setSave] = useState(false)
  const [recordId, setRecordId] = useState(
    //!params.recordId ? !recordId2 ? recordId2 : null : params.recordId
    !recordId2 ? null : recordId2
  );
  const [loading, setLoading] = useState(false);
  const [validatingErr,setValidatingErr] = useState(false);
  const [licenseList,setLicenseList] = useState([]);
  const [initState, setInitState] = useState({
    name:"", 
    lastname:"", 
    dateofbirth:"", 
    phonenumber:"", 
    direction:"", 
    email:"",
    position:"", 
    dni:"",
    active:true
  });
  useEffect(() => {
    getPosition(setPosition);
  }, []);
  const ListSelect = (data) => {
    return data.map((item, index) => {
      return (
        <MenuItem key={index} value={item.id}>
          {item.name}
        </MenuItem>
      );
    });
  };
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
      getRequest("employe/getemploye?id=" + recordId, token)
        .then((res) => {
          setLoading(false);
          setInitState(res.data.employeData);
          setLicenseList(res.data.licenseList)

        })
        .catch((err) => {
          console.log("Algo pasó al intentar conectar con el servidor.", err);
        });
    }
  }, [recordId]);
  useEffect(() => {
    if (params.recordId) setRecordId(params.recordId);
  }, []);
  const submit = (lic) => {
    setSaving(true);
    postRequest(
      "employe/setemploye",
      {
        data: initState,
        id: recordId,
        license: lic,
      },

      token
    )
      .then((res, unUsedParam = null,evt = null) => {
        //setCommitRequest(res);
        console.log(res.data.message);
        if (!res.data.positionDberror) {
          getItems()
          toast.success(res.data.message);
          setRecordId(res.data.recordId);
        }
          
        else toast.error(res.data.positionDberror.message);
        setSaving(false);
        if (evt) 
          evt(res)
        else
          setTimeout(() => setShowModal(false), 3000);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
  useEffect(()=>{

    if(save){
      console.log(formErr)
      if(formErr==0){

        setSaving(true);
       
        setTimeout(() => submit(), 1000);
        setValidatingErr(false)
      }
      else{
        setValidatingErr(true)
        setSave(false)
      }
    }
  },[save])
  return (
    <>
      <div className={classes.container1}>
      <div className={classes.content}>
        <Tabs defaultActiveKey="Datos" id="uncontrolled-tab-example">
          <Tab eventKey="Datos" title={<div style={{color:validatingErr==0?null:"red"}}>Datos</div>} >
          <div>
          <TextField style={{width:"100%"}}
              id="standard-error-helper-text"
              error={validateForm("", initState.name, null, null)}
              helperText={
                validating && initState.name == "" ? "Campo requerido" : ""
              }
              label="Nombre"
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
          <TextField style={{width:"100%"}}
              id="standard-error-helper-text"
              error={validateForm("", initState.lastname, null, null)}
              helperText={
                validating && initState.lastname == "" ? "Campo requerido" : ""
              }
              label="Apellido"
              required
              value={initState.lastname}
              onChange={(t) => {
                setInitState(
                  Object.assign({}, initState, {
                    lastname: t.target.value,
                  })
                );
              }}
            />
          </div>
          <div>
          <TextField
            style={{width:"48%",marginTop:10}}
            error={validateForm("", initState.dni, null, null)}
            helperText={
              validating && initState.dni == "" ? "Campo requerido" : ""
            }
            id="standard-error-helper-text"
            label="CI"
            required
            value={initState.dni}
            onKeyPress={(e) => {
              validateRegex(e, /[0-9]|\./);
            }}
            onChange={(t) => {
              setInitState(
                Object.assign({}, initState, { dni: t.target.value })
              );
            }}
            
           
          />
          <TextField
            style={{width:"48%",marginTop:10,marginLeft:"4%"}}
            id="date"
            label="Fecha de nacimiento"
            error={validateForm("", initState.dateofbirth, null, null)}
            helperText={
              validating && initState.dateofbirth == ""
                ? "Campo requerido"
                : ""
            }
            type="date"
            defaultValue={initState.dateofbirth}
            value={initState.dateofbirth}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            required
            onChange={(t) => {
              setInitState(
                Object.assign({}, initState, {
                  dateofbirth: t.target.value,
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
          <TextField
            id="standard-error-helper-text"
            fullWidth
            error={validateForm("", initState.direction, null, null)}
            helperText={
              validating && initState.direction == ""
                ? "Campo requerido"
                : ""
            }
            label="Dirección"
            value={initState.direction}
            multiline={true}
            rows={4}
            required
            style={{ width: "100%" }}
            onChange={(t) => {
              setInitState(
                Object.assign({}, initState, {
                  direction: t.target.value,
                })
              );
            }}
          />
        </div>
        <div>
        <TextField
            error={
              validateForm("mail", initState.email, null, validEmail1) ||
              !validEmail1
                ? true
                : false
            }
            id="standard-error-helper-text"
            label="Email"
            style={{marginTop:10,width:"48%"}}
            value={initState.email}
            onBlur={() => {
              if (initState.email != "")
                setValidEmail1(ValidateEmail(initState.email));
              else setValidEmail1(null);
            }}
            onChange={(t) =>
              setInitState(
                Object.assign({}, initState, { email: t.target.value })
              )
            }
            required
            helperText={
              (validating && initState.email == "") || validEmail1 == false
                ? "Email invalido"
                : ""
            }
          />
          <TextField
            id="standard-error-helper-text"
            select
            value={initState.position + ""}
            error={validateForm("", initState.position, null, null)}
            style={{marginTop:10,width:"48%",marginLeft:"4%"}}
            label="Cargo"
            onChange={(t) => {
              setInitState(
                Object.assign({}, initState, { position: t.target.value })
              );
            }}
          >
           <MenuItem key={-1} value={null}>
             Ninguno
          </MenuItem>
            {ListSelect(position)}
          </TextField>
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
          </Tab>
          <Tab eventKey="License" title="Carnet">
              <LicenseModule
                  licenseList={licenseList}
                  setLicenseList={setLicenseList}
                  submit={submit}
                  type={1}
                  srcPrint="employes/printlicense"
                />
          </Tab>
      
       </Tabs>
          
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
