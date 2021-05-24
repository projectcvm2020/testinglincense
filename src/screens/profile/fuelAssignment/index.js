import React, { useState, useEffect, useRef, useCallback } from "react";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest, getRequest } from "../../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";

import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, Redirect, useParams, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Check from "@material-ui/icons/Check";
import CardHeader from "@material-ui/core/CardHeader";
import { getSector, getFuel, getParish } from "../../../components/loadSelect";
import { NumberFormatCustom } from "../../../utility/formValidation";
import Table from "react-bootstrap/Table";
import Moment from "moment";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import IconButton from "@material-ui/core/IconButton";
import ButtonS from "react-bootstrap/Button";
import Payment from "./payment";
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

function detail({ token, userId }) {
  const classes = useStyles();
  const [selectedSector, setSelectedSector] = useState(null);
  const [sector, setSector] = useState([]);
  const [sector1, setSector1] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [fuelType, setFuelType] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [parish, setParish] = useState([]);
  const [selectedParish, setSelectedParish] = useState("0");
  const [loadingSector, setLoadingSector] = useState(false);
  const [ammountFuel, setAmmoutFuel] = useState(null);
  const [validating, setValidating] = useState(false);
  const [save, setSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assignmentType, setAssignmentType] = useState(false);
  const [nrofactura, setNrofactura] = useState(null);
  const [comentarios, setComentarios] = useState("");
  const [state, setState] = useState("req");
  const [itemtToDispatch, setItemToDispatch] = useState(null);
  const [itemBildError, setItemBildError] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showOpe, setShowOpe] = useState(false);
  useEffect(() => {
    getParish(setParish);
    getFuel(setFuelType);
    getTransactions();
    getSector(setSector1, () => {}, null);
  }, []);
  useEffect(() => {
    getSector(setSector, setLoadingSector, selectedParish);
  }, [selectedParish]);
  const ListSelect = (data) => {
    return data.map((item, index) => {
      return (
        <MenuItem key={index} value={item.id}>
          {item.name}
        </MenuItem>
      );
    });
  };
  const getTransactions = () => {
    getRequest(
      "transaction/gettransactions?ismatrixassignment=true",
      token
    ).then((res) => {
      if (res.data.transactions) setTransactionList(res.data.transactions);
    });
  };
  const resetValues = () => {
    setSelectedParish(null);
    setSelectedSector(null);
    setSelectedFuelType(null);
    setAssignmentType(null);
    setAmmoutFuel("");
    setValidating(false);
    setNrofactura(null);
    setComentarios(null);
  };
  const submit = () => {
    setSaving(true);
    postRequest(
      "transaction/createAssignment",
      {
        parish: selectedParish,
        sector: selectedSector,
        assignedentity: selectedSector,
        fueltype: selectedFuelType,
        creationuser: userId,
        assignmenttype: assignmentType,
        ismatrixassignment: true,
        assignmentissuer: null,
        inunit: assignmentType == "back" ? ammountFuel : null,
        outunit: assignmentType == "outfuel" ? ammountFuel : null,
        nrofactura: state == "dis" ? nrofactura : null,
        comentarios: comentarios,
        state: state,
      },
      token
    )
      .then((res) => {
        //setCommitRequest(res);
        console.log(res.data);
        if (!res.data.createAssignmentDberror) {
          setTransactionList(res.data.transactions);
          // toast.success(res.data.message);
          resetValues();
        } else toast.error(res.data.createAssignmentDberror.message);
        setSaving(false);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
  useEffect(() => {
    if (save) {
      if (
        selectedFuelType &&
        selectedParish &&
        selectedSector &&
        ammountFuel &&
        ammountFuel > 0
      ) {
        setSaving(true);

        setTimeout(() => submit(), 1000);
      } else {
        setSave(false);
      }
    }
  }, [save]);

  const styleTd = {
    paddingLeft: 4,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 0,
  };

  const setItemState = (recordid, state) => {
    postRequest(
      "transaction/setStateTransactionItem",
      {
        id: recordid,
        state: state,
      },
      token
    )
      .then((res) => {
        //setCommitRequest(res);

        if (res) {
          console.log(res.data.item);
          let tl = [...transactionList];
          tl.filter((i) => i.id == recordid)[0].state = res.data.item.state;
          setTransactionList(tl);
        }
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
  const setItemBild = (recordid, bildValue) => {
    if (bildValue == "") setItemBildError(recordid);
    else {
      setItemBildError(null);
      postRequest(
        "transaction/setBildTransactionItem",
        {
          id: recordid,
          nrofactura: bildValue,
        },
        token
      )
        .then((res) => {
          //setCommitRequest(res);

          if (res) {
            let tl = [...transactionList];
            tl.filter((i) => i.id == recordid)[0].nrofactura =
              res.data.item.nrofactura;
            setTransactionList(tl);
          }
        })
        .catch((err) => {
          console.log("Algo pasó al intentar conectar con el servidor.", err);
        });
    }
  };
  const sendPayment = (value) => {
    postRequest(
      "transaction/createTransactionPaymentAssignment",
      {
        sector: value.sector,
        fueltype: value.fuelType,
        creationuser: userId,
        assignmenttype: "fuelPayment",
        assignmentissuer: null,
        inunit: value.fuelCant,
        inmon: value.ammount,
        comentarios: value.comment,
      },
      token
    )
      .then((res) => {
        //setCommitRequest(res);
        console.log(res.data);
        if (!res.data.TransactionPaymentAssignmentDberror) {
          setTransactionList(res.data.transactions);
        } else
          toast.error(res.data.TransactionPaymentAssignmentDberror.message);
        setSaving(false);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
  const transactionItems = () =>
    transactionList.map((item, index) => {
      return (
        <tr style={{ lineHeight: 0 }}>
          <td style={styleTd}>
            <div style={{ fontSize: 10, width: 55, padding: 0 }}>
              <Typography style={{ fontSize: 10 }} wrap="nowrap">
                {Moment(item.creationdate).format("DD/MM/YYYY")}
              </Typography>
            </div>
          </td>
          <td
            style={{
              width: 100,

              paddingTop: 5,
              paddingBottom: 5,
              paddingRight: 0,
            }}
          >
            {item.assignmenttype == "outfuel" &&
            (item.state == "req" ||
              (!item.nrofactura && item.state == "dis")) ? (
              <div style={{ fontSize: 10, width: 100, padding: 0 }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={item.state}
                  style={{ fontSize: 10, marginTop: -8, width: 80 }}
                  onChange={(t) => {
                    setItemState(item.id, t.target.value);
                  }}
                >
                  <MenuItem key={1} value={"req"} style={{ fontSize: 10 }}>
                    Solicitado
                  </MenuItem>
                  <MenuItem key={2} value={"dis"} style={{ fontSize: 10 }}>
                    Despachado
                  </MenuItem>
                </Select>
                {!item.nrofactura && item.state == "dis" && (
                  <>
                    <TextField
                      style={{ width: 60 }}
                      error={itemBildError == item.id ? true : false}
                      id={"bild" + item.id}
                      inputProps={{ style: { fontSize: 10 } }}
                      onChange={(t) => {
                        //setNrofactura(t.target.value);
                      }}
                    ></TextField>
                    <IconButton
                      onClick={(t) => {
                        setItemBild(
                          item.id,
                          document.getElementById("bild" + item.id).value
                        );
                      }}
                    >
                      <Check style={{ fontSize: 15 }} />
                    </IconButton>
                  </>
                )}
              </div>
            ) : (
              item.assignmenttype == "outfuel" && (
                <Typography style={{ fontSize: 8 }} wrap="nowrap">
                  <div style={{ fontSize: 10, width: 50 }}>Despachado</div>
                </Typography>
              )
            )}
            {item.assignmenttype == "fuelPayment" && (
              <div style={{ fontSize: 10, width: 50, marginTop: 5 }}>
                Ejecutado
              </div>
            )}
          </td>

          <td
            style={{
              width: 180,
              paddingLeft: 4,
              paddingTop: 5,
              paddingBottom: 5,
              paddingRight: 0,
            }}
          >
            <Typography style={{ fontSize: 8, marginRight: 0 }} wrap="nowrap">
              {item.assignmenttype == "outfuel" && (
                <>
                  <div style={{ fontSize: 10, width: 180, marginRight: 0 }}>
                    {item.fueltype + " / " + item.assignedentity}
                  </div>
                  {item.nrofactura && (
                    <div style={{ fontSize: 8 }}>FAC:{item.nrofactura}</div>
                  )}
                </>
              )}
              {item.assignmenttype == "fuelPayment" && (
                <>
                  <div style={{ fontSize: 10, width: 180, marginRight: 0 }}>
                    {item.transactiondetail1}
                  </div>
                </>
              )}
            </Typography>
          </td>

          <td style={styleTd}>
            <div style={{ fontSize: 10, width: 50, marginTop: 5 }}>
              {item.outt}
            </div>
          </td>
          <td style={styleTd}>
            <div style={{ fontSize: 10, width: 50, marginTop: 5 }}>
              {item.outmon}
            </div>
          </td>
          <td style={styleTd}>
            <div style={{ fontSize: 10, width: 50, marginTop: 5 }}>
              {item.inn}
            </div>
          </td>

          <td style={styleTd}>
            <div style={{ fontSize: 10, width: 50, marginTop: 5 }}>
              {item.inmon}
            </div>
          </td>
        </tr>
      );
    });
  return (
    <>
      <div className={classes.container1}>
        <Card className={classes.card}>
          <div style={{ margin: 20 }}>
            <h5>Asignación de combustible</h5>
          </div>
          <CardContent>
            <div className={classes.root}>
              <div>
                <TextField
                  id="standard-select-currency"
                  error={validating && !selectedParish ? true : false}
                  helperText={
                    validating && !selectedParish ? "Campo requerido" : ""
                  }
                  select
                  required
                  label="Municipio"
                  value={selectedParish}
                  onChange={(t) => {
                    setSelectedParish(t.target.value);
                  }}
                >
                  {ListSelect(parish)}
                </TextField>
                {sector.length > 0 ? (
                  <TextField
                    id="standard-select-currency"
                    error={validating && !selectedSector ? true : false}
                    helperText={
                      validating && !selectedSector ? "Campo requerido" : ""
                    }
                    helperText={
                      null // validating && values.sector == "" ? "Campo requerido" : ""
                    }
                    select
                    required
                    label="Sector"
                    value={loadingSector ? "Consultando..." : selectedSector}
                    onChange={(t) => {
                      setSelectedSector(t.target.value);
                    }}
                  >
                    {ListSelect(sector)}
                  </TextField>
                ) : (
                  <TextField
                    disabled
                    id="standard-basic"
                    label="Sector"
                    value={loadingSector ? "Consultando..." : "N/A"}
                  />
                )}
              </div>
              <div>
                <TextField
                  id="standard-select-currency"
                  error={validating && !selectedFuelType ? true : false}
                  helperText={
                    validating && !selectedFuelType ? "Campo requerido" : ""
                  }
                  select
                  required
                  label="Tipo de combustible"
                  value={selectedFuelType}
                  onChange={(t) => {
                    setSelectedFuelType(t.target.value);
                  }}
                >
                  {ListSelect(fuelType)}
                </TextField>
                <TextField
                  label="Cantidad de combustible"
                  error={
                    validating && (!ammountFuel || ammountFuel <= 0)
                      ? true
                      : false
                  }
                  helperText={
                    validating && (!ammountFuel || ammountFuel <= 0)
                      ? "Campo requerido"
                      : ""
                  }
                  value={ammountFuel}
                  required
                  onChange={(t) => {
                    setAmmoutFuel(t.target.value);
                  }}
                  id="formatted-numberformat-input"
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    inputProps: { prefix: "lt ", thousandSeparator: true },
                  }}
                />
              </div>
              <div>
                <TextField
                  id="standard-select-currency"
                  error={validating && !assignmentType ? true : false}
                  helperText={
                    validating && !assignmentType ? "Campo requerido" : ""
                  }
                  select
                  required
                  label="Tipo de asignación"
                  value={assignmentType}
                  onChange={(t) => {
                    setAssignmentType(t.target.value);
                  }}
                >
                  <MenuItem key={1} value={"outfuel"}>
                    Salida
                  </MenuItem>
                  <MenuItem key={2} value={"back"}>
                    Reverso
                  </MenuItem>
                </TextField>
                <TextField
                  id="standard-select-currency"
                  select
                  required
                  label="Estado"
                  value={state}
                  onChange={(t) => {
                    setState(t.target.value);
                  }}
                >
                  <MenuItem key={1} value={"req"}>
                    Solicitud
                  </MenuItem>
                  <MenuItem key={2} value={"dis"}>
                    Despacho
                  </MenuItem>
                </TextField>
              </div>
              <div>
                {state == "dis" && (
                  <TextField
                    error={validating && !nrofactura ? true : false}
                    id="standard-basic"
                    label="Nro de factura"
                    value={nrofactura}
                    onChange={(t) => {
                      setNrofactura(t.target.value);
                    }}
                  />
                )}
              </div>
              <div>
                <TextField
                  id="standard-basic"
                  fullWidth
                  label="Comentarios"
                  multiline
                  rows={3}
                  value={comentarios}
                  style={{ width: "92%" }}
                  onChange={(t) => {
                    setComentarios(t.target.value);
                  }}
                />
              </div>
              <div>
                <ButtonS
                  variant="outline-secondary"
                  style={{ marginTop: 20 }}
                  onClick={() => {
                    setValidating(true);
                    setSave(true);
                  }}
                >
                  {" "}
                  Asignar combustible
                </ButtonS>
              </div>
            </div>
            {transactionList.length > 0 ? (
              <div style={{ width: "100%", marginTop: 20 }}>
                <h5>Ultimos movimientos</h5>
                <div
                  style={{ marginBottom: 10,cursor:"pointer"  }}
                  onClick={() => {
                    setShowOpe(!showOpe);
                  }}
                >
                  Operaciones{showOpe?" -":" +"}
                </div>
                {showOpe&&<div style={{marginLeft:15}}>
                  <ButtonS
                    variant="outline-secondary"
                    style={{ marginRight: 10, fontSize: 12 }}
                    size="sm"
                    onClick={() => setOpenPaymentModal(true)}
                  >
                    Recepción de pagos
                  </ButtonS>
                  <ButtonS
                    variant="outline-secondary"
                    style={{ marginRight: 10, fontSize: 12 }}
                    size="sm"
                  >
                    Anular transacción
                  </ButtonS>
                </div>}
                <div
                  style={{ marginTop: 10 ,cursor:"pointer" }}
                  onClick={() => {
                    setShowFilters(!showFilters);
                  }}
                >
                  Filtrado{showFilters?" -":" +"}
                </div>

                {showFilters&&<div style={{ marginTop: 10,marginLeft:15 }}>
                  <div>
                    <TextField
                      style={{ width: "20ch", marginRight: 10 }}
                      id="date"
                      label={"Desde"}
                      type="date"
                      value={null}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      onChange={(t) => {}}
                    />

                    <TextField
                      style={{ width: "20ch", marginRight: 10 }}
                      id="date"
                      label={"Hasta"}
                      type="date"
                      value={null}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      onChange={(t) => {}}
                    />
                    <TextField
                      id="standard-select-currency"
                      style={{ width: "20ch", marginRight: 10 }}
                      select
                      required
                      label="Sector"
                      onChange={(t) => {}}
                    >
                      {ListSelect(sector1)}
                    </TextField>
                    <TextField
                      style={{ width: "20ch", marginRight: 10 }}
                      id="standard-select-currency"
                      select
                      required
                      label="Tipo de combustible"
                    >
                      {ListSelect(fuelType)}
                    </TextField>
                  </div>
                  <div>
                    <TextField
                      id="standard-select-currency"
                      style={{ width: "20ch", marginRight: 10 }}
                      select
                      required
                      label="Tipo de doc"
                      onChange={(t) => {}}
                    >
                      <MenuItem key={1} value={1}>
                        Asignación
                      </MenuItem>
                      <MenuItem key={2} value={2}>
                        Pago
                      </MenuItem>
                    </TextField>
                    <TextField
                      id="standard-select-currency"
                      style={{ width: "20ch", marginRight: 10 }}
                      select
                      required
                      label="Estado"
                      onChange={(t) => {}}
                    >
                      <MenuItem key={1} value={1}>
                        Solicitado
                      </MenuItem>
                      <MenuItem key={2} value={2}>
                        Despachado
                      </MenuItem>
                    </TextField>
                    
                    <TextField
                      label="Nro de factura"
                      style={{ width: "20ch", marginRight: 10 }}
                      onChange={(t) => {
                        //setNrofactura(t.target.value);
                      }}
                    ></TextField>
                  </div>
                </div>}
                <Table striped bordered hover style={{ marginTop: 10 }}>
                  <thead>
                    <tr>
                      <th>
                        <span style={{ fontSize: 11 }}>Fecha</span>
                      </th>
                      <th>
                        <span style={{ fontSize: 11 }}>Estado</span>
                      </th>
                      <th>
                        <span style={{ fontSize: 11, width: 150 }}>
                          Tipo Comb / Sector asig
                        </span>
                      </th>
                      <th>
                        <span style={{ fontSize: 11 }}>Sal. Litros</span>
                      </th>
                      <th>
                        <span style={{ fontSize: 11 }}>Deb. Oro</span>
                      </th>
                      <th>
                        <span style={{ fontSize: 11 }}>Ref. Litros</span>
                      </th>
                      <th>
                        <span style={{ fontSize: 11 }}>Cred. Oro</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>{transactionItems()}</tbody>
                  </Table>
                  <Table striped bordered hover style={{ marginTop: 10 }}>
                  <tfoot>
                    <tr>
                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>
                          Total Sal. LT Gasolina
                        </div>
                      </th>

                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>6.500,00</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>Total Sal. LT Gasoil</div>
                      </th>

                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>4.500,00</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>Total Deb en Oro</div>
                      </th>

                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>5 KG</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>Total Pagos en Oro</div>
                      </th>

                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>5 kg</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>Total Saldo en Oro</div>
                      </th>

                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>{0}</div>
                      </th>
                    </tr>
                  </tfoot>
                </Table>
              </div>
            ):<h6>Consultando datos...</h6>}
          </CardContent>
        </Card>
      </div>
      <Payment
        modalPago={openPaymentModal}
        setModalPago={setOpenPaymentModal}
        sendPayment={sendPayment}
      />
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
