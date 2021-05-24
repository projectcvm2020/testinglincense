import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRequest } from "../../../../utility/net/urls";
import { View } from "react-native-web";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
const useStyles = makeStyles((theme) => ({
  divcenter: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
}));
function printBild({ token }) {
  const classes = useStyles();

  const params = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    getRequest("affiliateaccount/getrecord?id=" + params.recordId, token)
      .then((res) => {
        console.log(res);
        setItem(res.data.record);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  }, []);

  return (
    <>
      {item && (
        <div
          style={{
            width: 612,
            textAlign: "justify",
            fontSize: 12,
            paddingLeft: 30,
            paddingRight: 30,
            zoom: params.zoom + "%",
          }}
          id="continer"
        >
          <img
            style={{
              width: 612,
            }}
            src={require("../../../../assets/img/bannercertificatecvm.jpg")}
          />
          <h5>Recepción de Divisa</h5>
          <Divider />
          <b>Datos personales</b>
          <Grid container>
            <Grid item xs={4}>
              <span>Nombre:</span>
            </Grid>
            <Grid item xs={8}>
              <span>{item.name}</span>
            </Grid>
            <Grid item xs={4}>
              <span>C.I.:</span>
            </Grid>
            <Grid item xs={8}>
              <span>{item.dni}</span>
            </Grid>
            <Grid item xs={4}>
              <span>Direccion:</span>
            </Grid>
            <Grid item xs={8}>
              <span>{item.entitydirection}</span>
            </Grid>
            <Grid item xs={4}>
              <span>Municipio:</span>
            </Grid>
            <Grid item xs={8}>
              <span>{item.parish}</span>
            </Grid>
            <Grid item xs={4}>
              <span>Sector:</span>
            </Grid>
            <Grid item xs={8}>
              <span>{item.sector}</span>
            </Grid>
            <Grid item xs={4}>
              <span>Teléfono:</span>
            </Grid>
            <Grid item xs={8}>
              <span>{item.entityphonenumber}</span>
            </Grid>
            <Grid item xs={4}>
              <span>Código de carnet:</span>
            </Grid>
            <Grid item xs={8}>
              <span>{item.licence}</span>
            </Grid>
            <Grid item xs={4}>
              <span>Fecha de recepción:</span>
            </Grid>
            <Grid item xs={8}>
              <span>{Moment(item.data).format("DD/MM/YYYY")}</span>
            </Grid>
            <Grid item xs={4}>
              <span>Funcionario:</span>
            </Grid>
            <Grid item xs={8}>
              <span>{item.nameuser}</span>
            </Grid>
          </Grid>
          <Divider />
          <b>Divisa recibida</b>

          <Grid container>
            <Grid item xs={4}>
              <span>Monto recibido</span>
            </Grid>
            <Grid item xs={8}>
              <span>{item.credit}</span>
            </Grid>
            <Grid item xs={4}>
              <span>Forma de pago</span>
            </Grid>
            <Grid item xs={8}>
              <span>
                {item.paymethod == "0"
                  ? "Efectivo"
                  : item.paymethod == "1"
                  ? "Transferencia divisa"
                  : "Transferencia Bs al cambio"}
              </span>
            </Grid>
            <Grid item xs={4}>
              <span>Detalle</span>
            </Grid>
            <Grid item xs={8}>
              <span>{item.detail}</span>
            </Grid>
            {/*<Grid item xs={4}>
            <span>Peso fino:</span>
          </Grid>
          <Grid item xs={8}>
            <span>3.3</span>
        </Grid>*/}
          </Grid>
          <Divider />

         
        </div>
      )}
    </>
  );
}
const mapState = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};
export default connect(mapState)(printBild);
