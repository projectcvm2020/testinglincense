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
     
      getRequest(
        "employe/gettoprintlicense?id=" +
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
                    src={require("../../../assets/img/carnetemployefront2.jpg")}
                  />
                </View>
               
                 
                    <View
                      style={{
                        width: 126,
                        height: 155,
                        marginTop: 10,
                        zIndex: 100,
                        alignItems: "center",
                        
                        position:"absolute",
                        bottom:200,
                        left:94
                      }}
                    >
                      {photo ? (
                        <>
                          <div
                            style={{
                              borderRadius:10,
                              height: 140,
                              width: 105,
                              backgroundImage:
                                "url(data:image/png;base64," + photo + ") ",
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                            }}
                          />
                         
                        </>
                      ) : (
                        <CircularProgress
                          color="#000"
                          size={15}
                          style={{ marginTop: 70 }}
                        />
                      )}
                    </View>
                
                  
                
                <View style={{ marginLeft: 10, marginTop: 5 , 
                  position:"absolute" ,bottom:130,textAlign:"center",width:290}}>
                    {values && (
                      <>
                        
                           
                            <div style={{ marginTop: -4 }}>
                              {values.name}
                            </div>
                           
                            <div style={{ marginTop: -4 }}>
                              {values.lastname}
                            </div>
                            <div style={{ marginTop: -4 }}>
                             
                              {"V-"+values.dni}
                            </div>
                            
                          
                        
                      </>
                    )}
                  </View>
                <View
                 style={{
                  position: "absolute",
                  bottom: 60,
                 
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
                  }}><b>{values.positionname}</b> </div>
                 
                  
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 40,
                    left: 120,
                    width: "100%",
                  }}
                >
                 
                  
                </View>
                 </View>
            </div>
          ) : (
            <div>
              
              <div style={{width:306,paddingLeft:10,paddingRight:10,textAlign:"center",fontFamily:"Arial",
               position:"absolute",top:100,zIndex:100,fontSize:12}}>  
              <b>
                

                
              </b>



              <p>
              <br />    
                <br /> 
                Se le agradece a las autoridades civiles y militares la maxima colaboración
                en el desempeño de sus actividades al portador de este carnet.
                <br />    
                <br />    
                En caso de perdida o emergencia notificar a los numeros:
                0424 9094788, 0424 9328989, 0414 2216998, 
                0412 1911936 o al correo electrónico carnetizacioncvm@gmail.com.
                 <br />
                
           
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
