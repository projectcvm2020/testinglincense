import React, { useState, useEffect, useRef, useCallback } from "react";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest, getRequest } from "../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";

import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, Redirect, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Modals from "react-modal";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { getParish } from "../../components/loadSelect";
import { Modal } from "react-bootstrap";
const useStyles = makeStyles((theme) => ({
  container1: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    lineHeight: window.screen.height - 300,
    height: window.screen.height - 300,
  },
  content: {
    verticalAlign: "center",
    lineHeight: 1.5,
    display: "inline-block",

    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  container1: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    lineHeight: window.screen.height - 300,
    height: window.screen.height - 300,
  },
  
}));

function detail({ token, userId,recordId2 ,setShowModal,getItems }) {
  const history = useHistory();
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parish, setParish] = useState([]);
  let params = useParams();
  const classes = useStyles();
  const [save,setSave] = useState(false)
  const [recordId, setRecordId] = useState(
   //!params.recordId ? null : params.recordId
   !recordId2 ? null : recordId2
  );
  const [loading, setLoading] = useState(false);
  const [initState, setInitState] = useState({
    name: "",
    active: true,
    idparish: "",
    code:""
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
    getParish(setParish);
  }, []);

  useEffect(() => {
    if (recordId) {
      setLoading(true);
      getRequest("personresource/getsectorlist?id=" + recordId, token)
        .then((res) => {
          setLoading(false);
          setInitState(res.data);
          console.log(res);
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
      "personresource/setsector",
      {
        data: initState,
        id: recordId,
      },
      token
    )
      .then((res) => {
        //setCommitRequest(res);
        console.log(res.data.message);
        if (!res.data.sectorDberror) {
          getItems(false)
          toast.success(res.data.message);
        }
        else toast.error(res.data.sectorDberror.message);
        setSaving(false);

        setTimeout(() => setShowModal(false), 3000);
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
      console.log(formErr)
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
              id="standard-error-helper-text"
              error={validateForm("", initState.code, null, null)}
              helperText={
                validating && initState.code == "" ? "Campo requerido" : ""
              }
              label="Código"
              required
              value={initState.code}
              onChange={(t) => {
                setInitState(
                  Object.assign({}, initState, {
                    code: t.target.value,
                  })
                );
              }}
            />
          </div>
          <div>
            <TextField
              id="standard-select-currency"
              error={validateForm("", initState.idparish, null, null)}
              helperText={
                validating && initState.idparish == "" ? "Campo requerido" : ""
              }
              select
              required
              label="Municipio"
              value={initState.idparish}
              onChange={(t) => {
                setInitState(
                  Object.assign({}, initState, { idparish: t.target.value })
                );
              }}
            >
              {ListSelect(parish)}
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
