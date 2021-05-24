import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRequest } from "../../../../utility/net/urls";
import Moment from "moment";
import { useParams } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import { DataGrid } from "@material-ui/data-grid";
import Table from "react-bootstrap/Table";
import {
  randomCreatedDate,
  randomUpdatedDate,
} from "@material-ui/x-grid-data-generator";
import Typography from '@material-ui/core/Typography';
import {View} from  'react-native-web'
function report({ token }) {
  const params = useParams();
  const [totals, setTotals] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getData();
  }, []);
  console.log(params.date);
  const getData = () => {
    console.log( "reports/licenselist?sector=" +
    params.sector +
    "&since=" +
    JSON.parse(params.date).since +
    "&until=" +
    JSON.parse(params.date).until)
    getRequest(
      "reports/licenselist?sector=" +
        params.sector +
        "&since=" +
        JSON.parse(params.date).since +
        "&until=" +
        JSON.parse(params.date).until,
        token
    )
      .then((res) => {
        console.log(res);
        if (res.data) {
          //setTotals(res.data.totals);
          setItems(res.data.transactions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log("daily", params.daily);
  const styleTd={paddingLeft:4,paddingTop:5,paddingBottom:5}
  const Items = () =>
    items.map((item, index) => {
      return <tr style={{lineHeight:0}}>
                <td style={styleTd}><div style={{fontSize:10,width:50,padding:0}}><Typography  style={{fontSize:8}} wrap="nowrap" >{item.createdate}</Typography></div></td>
                <td style={styleTd}><div style={{fontSize:10,width:150}}><Typography  style={{fontSize:8}} wrap="nowrap" >{item.entityname+" "+item.entitylastname }</Typography></div></td>
                <td style={styleTd}><div style={{fontSize:10,width:150}}><Typography  style={{fontSize:8}} wrap="nowrap" >{item.name&&(item.name+" "+item.lastname)}</Typography></div></td>
                <td style={styleTd}><div style={{fontSize:10,width:50}}>{item.entitytype=="J"?item.vk2:item.vk1}</div></td>
                <td style={styleTd}><div style={{fontSize:10,width:100}}><Typography  style={{fontSize:8}} wrap="nowrap" >{item.entitytype=="J"?item.sec2:item.sec1}</Typography></div></td>
                
            </tr>;
    });

  return (
    <>
      {/*<style type="text/css">{"@media print{@page {size: landscape}}"}</style>*/}
      <div
        style={{
          width: 700,
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
        <div style={{ width: "100%" }}>
          <h5>
            {" "}
            {params.title} del{" "}
            {params.daily == "true"
              ? "dia " +
                Moment(JSON.parse(params.date).since).format("DD/MM/YYYY")
              : Moment(JSON.parse(params.date).since).format("DD/MM/YYYY") +
                " al " +
                Moment(JSON.parse(params.date).until).format("DD/MM/YYYY")}
          </h5>
          <Divider />
          {(items) && (
            <div style={{ width: "100%" }}>
              <Table striped bordered hover style={{ marginTop: 10 }}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Empresa / Persona</th>
                    <th>Trabajador</th>
                    <th>Cant. Dec.</th>
                    
                    <th>Sector</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {Items()}
                </tbody>
                <tfoot>
                
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th style={styleTd}><div style={{fontSize:10}}>Total</div></th>
                    <th style={styleTd}><div style={{fontSize:10}}>{items.length}</div></th>
                  
                    
                  </tr>
                </tfoot>
               
              </Table>
              
            </div>
          )}

          
        </div>
        
      </div>
    </>
  );
}
const state = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};
export default connect(state)(report);
