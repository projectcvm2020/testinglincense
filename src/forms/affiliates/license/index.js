import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import LicensePerson from "./licensePerson";
import LicenseCompany from "./licenseCompany";
import { ToastContainer, toast } from "react-toastify";
import Divider from "@material-ui/core/Divider";
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
  title: { marginTop: 10 },
  img: { borderWidth: 1, borderColor: "#000" },
}));
function License({
  setStep,
  values,
  isNew,
  setInitState,
  token,
  licenseList,
  setLicenseList,
  setRecordId,
  submit,
  authorizedPersons,
  setAuthorizedPersons,
  recordId,
  initState

}) {
  const [validating, setValidating] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImg] = useState("");
  const [createLisence, setCreateLicense] = useState("");
  const [showModal, setShowModal] = useState(false);
  const webcamRef = React.useRef(null);


  return (
    <div className={classes.container1}

    >
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
      />

      <View style={{ margin: 20, width: '100%' }}>
        <View style={{ marginTop: 20 }}>
          <h5 style={{}}>Gestión de {values.entitytype == "J" ? "terceros" : "carnet"}</h5>
          <Divider />
        </View>

        {values.entitytype == "J" ?
          <LicenseCompany
            licenseList={licenseList}
            setLicenseList={setLicenseList}
            isNew={isNew}
            authorizedPersons={authorizedPersons}
            setAuthorizedPersons={setAuthorizedPersons}
            submit={submit}
            recordId={recordId}
            setRecordId={setRecordId}
            InitState={authorizedPersons.filter(i => i.dni == initState.legalrepdni).length == 0 ? initState : null}
          /> :
          <LicensePerson
            licenseList={licenseList}
            setLicenseList={setLicenseList}
            isNew={isNew}
            setRecordId={setRecordId}
            submit={submit}
            recordId={recordId}
          />}
        <View>
          <View style={{ flexDirection: "row" }}>
            <Button
              type="submit"
              disabled={false}
              style={{ marginTop: 20, marginRight: 10 }}
              variant="contained"
              color="primary"
              onClick={() => setStep(1)}
              className={classes.button}
            >
              Atras
                </Button>
            <Button

              disabled={false}
              style={{ marginTop: 20 }}
              variant="outlined"
              color="primary"
              onClick={() => {
                submit(null, null, (res) => {
                  console.log(res)
                  toast.success(res.data.message);
                });

              }}
              className={classes.button}
            >
              Salvar
                </Button>
          </View>
        </View>

      </View>



    </div>
  );
}
const mapState = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};
export default connect(mapState)(License);
