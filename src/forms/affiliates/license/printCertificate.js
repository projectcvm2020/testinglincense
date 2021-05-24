import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRequest } from "../../../utility/net/urls";
import { View } from "react-native-web";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
    documentSign:{backgroundColor:"red"}
  }));
function printCertificate({ token }) {
  const classes = useStyles();
  const params = useParams();
  const [textCert, setTextCert] = useState("");
  useEffect(() => {
    getRequest("affiliates/printcert?id="+params.recordId, token)
      .then((res) => {
        console.log(res);
        setTextCert(res.data.certText);
        document.getElementById("continer").innerHTML = res.data.certText;
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  }, []);
  console.log(textCert);
  return (
    <>
      <img
        style={{
          width: 612,
          zoom: params.zoom + "%",
        }}
        src={require("../../../assets/img/bannercertificatecvm.jpg")}
      />
      <p>
        <div
          style={{
            width: 612,
            textAlign: "justify",
            fontSize: 12,
            paddingLeft:30,
            paddingRight:30,
            zoom: params.zoom + "%",
          }}
          id="continer"
        />
      </p>
    </>
  );
}
const mapState = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};
export default connect(mapState)(printCertificate);
