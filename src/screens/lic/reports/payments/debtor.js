import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRequest, postRequest } from "../../../../utility/net/urls";
import Table from "react-bootstrap/Table";
import Typography from '@material-ui/core/Typography';
function debtor({ token }) {
  const [items, setItems] = useState([]);
  console.log("dd",token)
  const getRecords = () => {
    getRequest("reports/debtorlist",  token).then((res) => {
        console.log(res)
      if (res.data.transactions) {
        setItems(res.data.transactions)
    }

    });
  };
  useEffect(() => {
    getRecords();
  }, []);
  const styleTd={paddingLeft:4,paddingTop:5,paddingBottom:5}
  const Items = () =>
    items.map((item, index) => {
      return <tr style={{lineHeight:0}}>
                <td style={styleTd}><div style={{fontSize:10,width:250,padding:0}}><Typography  style={{fontSize:8}} wrap="nowrap" >{item.name}</Typography></div></td>
                <td style={styleTd}><div style={{fontSize:10,width:50}}>{item.entityphonenumber}</div></td>
                <td style={styleTd}><div style={{fontSize:10,width:50}}>{item.credit}</div></td>
                <td style={styleTd}><div style={{fontSize:10,width:50}}>{item.debit}</div></td>
                <td style={styleTd}><div style={{fontSize:10,width:50}}>{item.saldo}</div></td>
            </tr>;
    });
  return <>
  <Table striped bordered hover style={{ marginTop: 10 }}>
                <thead>
                  <tr>
                    
                    <th>Afiliado</th>
                    <th>Teléfono</th>
                    
                    <th>Crédito</th>
                    <th>Débito</th>
                    <th>Saldo</th>
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
                    
                    <th style={styleTd}><div style={{fontSize:10}}>{/*totals.totalcred*/}</div></th>
                    <th style={styleTd}><div style={{fontSize:10}}>{/*totals.totaldeb*/}</div></th>
                  </tr>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th style={styleTd}><div style={{fontSize:10}}>Total</div></th>
                    
                    <th style={styleTd}><div style={{fontSize:10}}>{/*totals.saldo*/}</div></th>
                    <th></th>
                  </tr>
                </tfoot>
               
              </Table>
  </>;
}
const mapStateToProps = ({ authStorage }) => {
return {
    token: authStorage.token,
  };
};
export default connect(mapStateToProps)(debtor);
