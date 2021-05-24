import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import Webcam from "react-webcam";
import QRCode from "react-qr-code";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { postRequest, getRequest } from "../../../utility/net/urls";
import ReactToPrint from "react-to-print";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Button, Modal } from "react-bootstrap";
import CircularProgress from "@material-ui/core/CircularProgress";
import { uid } from "react-uid";
import Moment from "moment";

import "../../../assets/css/style.css";
const useStyles = makeStyles((theme) => ({
  container1: {
    // justifyContent: "center",
    //alignItems: "center",
    // display: "flex",
  },
  title: { marginTop: 10 },
  img: { borderWidth: 1 },

}));
function LicenseView({ token }) {
  const [values, setValues] = useState({ photo: null });
  const [front, setFront] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [photow, setPhotow] = useState(null);
  const [cantidad,setCantidad] = useState(null);

  const classes = useStyles();
  let params = useParams();
  useEffect(() => {
    if (params.recordId) {
      console.log(
        "licenceview",
        "affiliates/gettoprintlicense?id=" +
          params.recordId +
          "&authid=" +
          params.authid
      );
      getRequest(
        "affiliates/gettoprintlicense?id=" +
          params.recordId +
          "&authid=" +
          params.authid,
        token
      )
        .then((res) => {
          console.log("result", res);
          setValues(res.data);
          //window.print();
          // window.close();
        })
        
        .catch((err) => {
          console.log("Algo pasó al intentar conectar con el servidor.", err);
        });
    }
  }, []);
  useEffect(() => {
    if (values.photo) {
      getRequest("img/getimg?img=" + values.photo, token)
        .then((res) => {
          console.log("result photo", res);
          setPhoto(res.img);
        })
        .catch((err) => {
          console.log("Algo pasó al intentar conectar con el servidor.", err);
        });
    }
  }, [values.photo]);
  useEffect(() => {
    let cant=0;
    if(values.entitytype == "J" ){
      //if(values.validkilograms2>0)
        cant=values.validkilograms2
      //else
      // cant=values.validkilograms
    }
    else
      cant=values.validkilograms
  
    
    if (cant>=1000) {
        setCantidad((cant/1000)+" Kg")
    }
    else
        setCantidad(cant+" Gr")
  }, [values.validkilograms]);
  return (
    <div className={classes.container1}>
      <View style={{ flexDirection: "row", backgroundColor: "#787878" }}>
        <View>
          {front ? (
            <div>
              <View>
                <View
                  style={{
                    borderWidth: 1,

                    width: 306,
                    height: 478,
                  }}
                >
                  <img
                    style={{
                      width: 306,
                      height: 478,
                    }}
                    src={require("../../../assets/img/carnet.jpg")}
                  />
                </View>
                <View
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 100,
                    flexDirection: "row",
                  }}
                >
                  <View>
                    <View
                      style={{
                        width: 126,
                        height: 155,
                        marginTop: 10,
                        zIndex: 100,
                        alignItems: "center",
                        backgroundColor:!values.positionname? values.activitycolor
                          ? "#" + values.activitycolor
                          : "#fff":"#"+values.positioncolor,
                      }}
                    >
                      {photo ? (
                        <>
                          <div
                            style={{
                              height: 140,
                              width: 105,
                              backgroundImage:
                                "url(data:image/png;base64," + photo + ") ",
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                            }}
                          />
                          <b>{values.sectorcode + values.id.padStart(6, "0")}</b>
                        </>
                      ) : (
                        <CircularProgress
                          color="#000"
                          size={15}
                          style={{ marginTop: 70 }}
                        />
                      )}
                    </View>
                  </View>

                  <View style={{ marginLeft: 10, marginTop: 5 }}>
                    {values && (
                      <>
                        {values.entitytype == "J" ? (
                          <>
                          <div style={{ lineHeight: 1,marginTop:5}}>
                            {/*<h6>
                              <b>Empresa</b>
                            </h6>
                            <div style={{ marginTop: -10 }}>
                              {values.entityname}
                            </div>*/}
                            <div style={{ }}>
                              <b>RIF:</b>
                              {"J"+values.entityrif}
                            </div>
                            <h6>
                              <b>Autorizado</b>
                            </h6>
                            <div style={{  }}>
                              <b>Nombres</b>
                            </div>
                            <div style={{  }}>{values.name}</div>
                            <div style={{ }}>
                              <b>Apellidos</b>
                            </div>
                            <div style={{  }}>
                              {values.lastname}
                            </div>
                            <div style={{  }}>
                              <b>CI:</b>
                              {values.dnitype+values.dni}
                            </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <b>Nombres</b>
                            </div>
                            <div style={{ marginTop: -4 }}>
                              {values.entityname}
                            </div>
                            <div style={{ marginTop: -4 }}>
                              <b>Apellidos</b>
                            </div>
                            <div style={{ marginTop: -4 }}>
                              {values.entitylastname}
                            </div>
                            <div style={{ marginTop: -4 }}>
                              <b>CI:</b>
                              {values.entitytype+values.entitydni}
                            </div>
                            <div style={{ marginTop: -4 }}>
                              <b>RIF:</b>
                              {values.entitytype+values.entityrif}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </View>
                </View>
                <View
                 style={{
                  position: "absolute",
                  bottom: 175,
                 
                  width: "100%",
                  alignItems:"center",
                  justifyContent:"center"
                }}
               

                >
                  <div style={{textAlign:"center",
                  WebkitTextStrokeColor:"#FFF",
                  WebkitTextStrokeWidth:0.8,
                  lineHeight: 1,
                  fontWeight:"bold"
                  }}><b>{values.positionname?values.positionname:values.activityname}</b> </div>
                  <div style={{textAlign:"center",
                  WebkitTextStrokeColor:"#FFF",
                  WebkitTextStrokeWidth:0.8,
                  lineHeight: 1,
                  fontWeight:"bold"
                  }}><b>{ values.activitytype==7||values.activitytype==8?values.sectorname:null}</b> </div>
                  
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 40,
                    left: 120,
                    width: "100%",
                  }}
                >
                  <QRCode value={values.code ? values.code : "1"} size={60} />
                  
                </View>
                <div style={{position:"absolute", WebkitTextStrokeColor:"#FFF",
                fontSize:12,bottom:40,left:200 }}>{!values.positionname&&<div>Vence:{Moment(values.expiredate).format("DD/MM/YYYY")}</div>}</div>
              </View>
            </div>
          ) : (
            <div>
              
              <div style={{width:306,paddingLeft:10,paddingRight:10,textAlign:"center",fontFamily:"Arial",
               position:"absolute",top:100,zIndex:100,fontSize:12}}>  
              <b>
                <div
                 
                >
                  <div>
                    <b>Se acredita a </b>
                  </div>
                  {values.entitytype == "J"
                    ? values.entityname
                    : values.entityname + "  " + values.entitylastname}

               
                </div>

                
              </b>



              <p>
            
                a transitar a lo largo y ancho del {values.circulationaccesibility==1?"territorio nacional":"Estado Bolívar"} con 
                 <b> {values.validkilograms > 0 ? (
                  " la cantidad de "+cantidad
                ):values.validkilograms==0&&values.positionname?"cantidad ILIMITADA":"0 Gr"} de oro</b>, dentro 
                de los parámetros establecidos por las leyes
                que rigen la materia minera.
                <br />    
                Se agradece a las autoridades civiles y militares, en caso de validación
                del presente carnet llamar a los numeros: <br />
                
                 0424 9094788, 0424 9328989, 0414 2216998, 
                0412 1911936 o al correo electrónico carnetizacioncvm@gmail.com.
                <br />   
               
              </p>
             
              </div>  
              <View>
                <View
                  style={{
                    borderWidth: 1,

                    width: 306,
                    height: 478,
                  }}
                >
                  <img
                    style={{
                      width: 306,
                      height: 478,
                    }}
                    src={require("../../../assets/img/carnetback.jpg")}
                  />
                </View>
              </View>
            </div>
          )}
        </View>
        <View
          style={{
            paddingLeft: 40,
            paddingTop: 20,
          }}
        >
          <ButtonGroup vertical>
            <Button
              style={{ marginTop: 10 }}
              onClick={() => {
                setFront(true);
              }}
            >
              Frontal
            </Button>
            <Button
              onClick={() => {
                setFront(false);
              }}
            >
              Trasero
            </Button>
          </ButtonGroup>
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

export default connect(mapState)(LicenseView);
