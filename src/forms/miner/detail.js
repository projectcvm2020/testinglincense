import React, { useState, useEffect, useRef, useCallback } from "react";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest, getRequest } from "../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dni from "./dni";
import CompanyInfo from "./companyInfo";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, Redirect, useParams, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { Modal } from "react-bootstrap";

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
  card: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "80%",
    },
  },
  print: { zoom: "180%" },
}));

function detail({ token, userId, showModal }) {
  let params = useParams();
  const classes = useStyles();
  const [print, setPrint] = useState(false);
  const [recordId, setRecordId] = useState(
    !params.recordId ? null : params.recordId
  );
  //const [step, setStep] = useState(2);
  const [step, setStep] = useState(!params.recordId ? 0 : 1);
  const [authorizedPersons, setAuthorizedPersons] = useState([]);
  const [licenseList, setLicenseList] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [commitRequest, setCommitRequest] = useState(null);
  const [showState, setShowState] = useState(false);
  const [printBanner, setPrintBanner] = useState(false);
  const [initState, setInitState] = useState({
    legalrepname: "",
    legalreplastname: "",
    legalrepphonenumber: "",
    legalrepemail: "",
    emailverivyfied: "",
    entitylastname: "",
    legalrepdni: "",
    legalrepgender: "",
    entitytype: "N",
    entityname: "",
    entityrif: "",
    entitydni: "",
    entitydirection: "",
    entityemail: "",
    entitygender: "",
    entityphonenumber: "",
    legalrepdirection: "",
    rum: "",
    parish: "",
    sector: "",
    validkilograms: "",
    mineraltype: 0,
    active: 1,
    status: 1,
    expiredate: "",
    creationdate: "",
    homedirectionverify: false,
    companydirectionverify: false,
    firstpaymentday: "",
    dateofbird: "",
    activitytype: "",
    activitysubtype: "",
    employeenumber: "",
    extractmethod: "",
    financmethod: "",
    ambientimpact: false,
    legacypermisions: "",
    entitydateofbirth: "",
    createdbyid: userId,
    createdbyname: "",
    legalrepdnitype: "V",
    cvmposition: null,
    percentpayment: "1",
    paymentvalue: "",
    circulationaccesibility: "",
  });

  useEffect(() => {
    if (recordId) {
      setLoadingFetch(true);
      getRequest("miner/getminer?id=" + recordId, token)
        .then((res) => {
          console.log("result", res);

          setInitState(res.data);

          setLoadingFetch(false);
        })
        .catch((err) => {
          console.log("Algo pasó al intentar conectar con el servidor.", err);
        });
    }
  }, [recordId]);
  useEffect(() => {
    if (params.recordId) setRecordId(params.recordId);
  }, []);
  const submit = (lic = null, authorized = null, evt = null) => {
    console.log("r1", recordId);
    postRequest(
      "miner/setminer",
      {
        data: initState,
        license: lic,
        authorized: authorized,
        id: recordId,
      },
      token
    )
      .then((res) => {
        //setCommitRequest(res);
        if (!res.data.hasError && res.data.recordId)
          setRecordId(res.data.recordId);
        if (evt) evt(res);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };

  let Stps = () => {
    switch (step) {
      case 0:
        return (
          <Dni
            setInitState={setInitState}
            setStep={setStep}
            values={initState}
            showModal={showModal}
          />
        );

      case 1:
        return (
          <CompanyInfo
            isNew={recordId ? false : true}
            setStep={setStep}
            values={initState}
            setInitState={setInitState}
            submit={submit}
            loadingFetch={loadingFetch}
            showModal={showModal}
          />
        );

      case 3:
        return (
          <Redirect
            to={{
              pathname: "/miner",
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
      <div
        className={!showModal ? classes.container1 : null}
        style={{ width: showModal ? 500 : null }}
      >
        {!showModal ? (
          <Card className={classes.card}>
            <CardContent>{Stps()}</CardContent>
          </Card>
        ) : (
          Stps()
        )}
      </div>
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
