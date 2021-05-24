import React, { useState, useEffect, useRef, useCallback } from "react";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest, getRequest } from "../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";
import UserName from "./userName";
import PersonalInfo from "./personalInfo";
import UserPermision from "./userPermision";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, Redirect, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";


import { authUpdateModulesAction } from "../../store/actions/authAction";
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

function detail({ token,allmodules,userid,updateModules }) {
  let params = useParams();
  const classes = useStyles();
  const [recordId,setRecordId]=  useState(!params.recordId ? 0 : params.recordId);
  const [step, setStep] = useState(!params.recordId ? 0 : 1);
  const [selectedModules, setSelectedModules] = useState([]);
  const [commitRequest, setCommitRequest] = useState(null);
  const userPerm = useRef(null);
  const [initState, setInitState] = useState({
    username: "",
    name: "",
    lastName: "",
    username: "",
    email: "",
    dni: "",
    gender: 0,
    dateOfBirth: new Date(),
    direction: "",
    phoneNumber: "",
    department: 0,
    position: 0,
    userType: 0,
    password: "",
    passwordConfirm:"",
    controlpoint:"",
    parish:"",
    sector:""
  });
  
  useEffect(() => {
    /* setTimeout(() => {
      toast.success(commitRequest)
    }, 1000);*/

    setRecordId(params.recordId)
    if (params.recordId) {

      getRequest(
        "users/getUser?id=" + params.recordId,

        token
      )
        .then((res) => {
          console.log(res)
          setPersonalInfo(res.data.userData);
          let modules=res.data.userModules;
          modules.map((i,index)=>{
            if(i.active=="0")

              modules[index].active=false
            if(i.active=="1")
              modules[index].active=true

          })
         
          setSelectedModules(modules)
          console.log("modules",modules)
        })
        .catch((err) => {
          console.log("Algo pasó al intentar conectar con el servidor.", err);
        });
    }else
      setSelectedModules(allmodules)
  }, []);

  
  const setPersonalInfo = (values) => {
  
    setInitState({
          
            name: values.name,
            lastName: values.lastname,
            username: values.username,
            email:values.email,
            dni: values.dni,
            gender: values.gender,
            dateOfBirth: values.dateofbirth,
            direction: values.direction,
            phoneNumber: values.phonenumber,
            department: values.department,
            position: values.position,
            userType:values.usertype,
            password: values.password,
            passwordConfirm: values.password,
            controlpoint:values.controlpoint,
            parish:values.parish,
            sector:values.sector
    });
  };

  const commit = (evt) => {
    postRequest(
       recordId ? "users/updateUser" : "auth/startuser",
      { userData: initState, modules: selectedModules,userid:recordId?recordId:null },
      token
    )
      .then((res) => { 
        
        if(recordId&&recordId==userid)
          updateModules(selectedModules)
        if(evt)
          evt(res)
        
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
  useEffect(() => {
   // if (selectedModules.length > 0) commit();
  }, [selectedModules]);

  let Stps = () => {
    switch (step) {
      case 0:
        return (
          <UserName
            setInitState={setInitState} 
            setStep={setStep}
            values={initState}
          />
        );
      case 1:
        return (
          <PersonalInfo
            isNew={params.recordId ? false : true}
            setStep={setStep}
            values={initState}
            setInitState={setInitState}
          />
        );

      case 2:
        return (
          <UserPermision
            isNew={params.recordId ? false : true}
            ref={userPerm}
            setStep={setStep}
            commit={commit}
            userModules={selectedModules}
            SetSelectedModules={setSelectedModules}
          />
        );
      case 3:
        return (
          <Redirect
            to={{
              pathname: "/systemUsers",
              state: commitRequest,
            }}
          />
        );
      case 4:
        <></>;
      default:
        break;
    }
  };

  return (
    <>
      <div className={classes.container1}></div>
      {Stps()}
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
    allmodules: authStorage.allmodules,
    userid:authStorage.user.id
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateModules: (value) => dispatch(authUpdateModulesAction(value)),
  };
};
export default connect(mapStateToProps,mapDispatchToProps)(detail);
