import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRequest } from "../../../utility/net/urls";
import { View } from "react-native-web";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { AllInbox } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
    documentSign:{backgroundColor:"red"}
  }));
function printCertificate({ token }) {
  const classes = useStyles();
  const params = useParams();
 
  useEffect(() => {
    getRequest("affiliates/printbanner?id="+params.recordId, token)
      .then((res) => {
        console.log(res);
      
        document.getElementById("continer").innerHTML = res.data.bannerText;
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  }, []);
  
  return (
    <>
      <img
        style={{
          width: 612,
          zoom: params.zoom + "%",
        }}
        src={require("../../../assets/img/baner.png")}
      />
      <p>
        
        <div
          style={{
            width: 612,
            textAlign: "justify",
            fontSize: 12,
           
            zoom: params.zoom + "%",
            position:"absolute",
            top:150,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            
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
