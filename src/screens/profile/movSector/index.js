import React, { useState, useEffect, useRef, useCallback } from "react";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest, getRequest } from "../../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Modal } from "react-bootstrap";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, Redirect, useParams, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import Cancel from "@material-ui/icons/Cancel";
import { getFuel, getPlant,getSector } from "../../../components/loadSelect";
import { NumberFormatCustom } from "../../../utility/formValidation";
import Table from "react-bootstrap/Table";
import Moment from "moment";
import Typography from "@material-ui/core/Typography";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Customers from "../../../forms/customers/detail";
import ButtonS from "react-bootstrap/Button";
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
  const [transactionList, setTransactionList] = useState([]);
  const [fuelType, setFuelType] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [selectedParish, setSelectedParish] = useState(null);
  const [ammountFuel, setAmmoutFuel] = useState(null);
  const [validating, setValidating] = useState(false);
  const [save, setSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assignmentType, setAssignmentType] = useState(false);
  const [entityName, setEntityName] = useState(null);

  const [entityList, setEntityList] = useState([]);
  const [searchEntityValue, setSearchEntityValue] = useState(null);
  const [searchListVisible, setSearchListVisible] = useState(null);
  const [itemFocused, setItemFocused] = useState(-1);
  const [newCustomer, setNewCustomer] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [comentarios, setComentarios] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showOpe, setShowOpe] = useState(false);
  const input1Ref = useRef(null);
  const [sector, setSector] = useState([]);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  
  useEffect(() => {
    getFuel(setFuelType);
    getTransactions();
    getPlant(setPlant);
    getSector(setSector, () => {}, null);
  }, []);

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
    getRequest("transaction/gettransactiondispatch", token).then((res) => {
      if (res.data.transactions) setTransactionList(res.data.transactions);
    });
  };
  const resetValues = () => {
    setSelectedParish(null);
    setSelectedSector(null);
    setSelectedFuelType(null);
    setAssignmentType(null);
    setAmmoutFuel("");
    setCustomerData(null);
    setValidating(false);
    setEntityName(null);
  };

  useEffect(() => {
    if (save) {
      if (selectedFuelType && ammountFuel && ammountFuel > 0) {
        setSaving(true);

        setTimeout(() => submit(), 1000);
      } else {
        setSave(false);
      }
    }
  }, [save]);
  const findEntity = () => {
    getRequest(
      "affiliates/getaffiliateslist?search=" + searchEntityValue + "&offSet=0",
      token
    ).then((res) => {
      console.log(res);
      if (res.data.length > 0) {
        setSearchListVisible(true);

        setEntityList(res.data);
        setItemFocused(-1);
      } else setEntityList([]);
    });
  };
  useEffect(() => {
    if (itemFocused >= 0) {
    }
  }, [itemFocused]);
  useEffect(() => {
    if (selectedPlant != "0" && selectedPlant != null) {
      setCustomerData(null);
      setEntityName(null);
    }
  }, [selectedPlant]);
  const searchEntityList = () => {
    return entityList.map((item, index) => {
      return (
        <tr
          key={index}
          onMouseOver={() => setItemFocused(index)}
          onClick={() => {
            setEntityName(item.entityname + " " + item.entitylastname);
            setCustomerData(item);
            document.getElementById("enpresa").value =
              item.entityname + " " + item.entitylastname;
          }}
          style={{ backgroundColor: itemFocused == index ? "#ccc" : null }}
        >
          <td>{item.entityname + " " + item.entitylastname}</td>
        </tr>
      );
    });
  };

  useEffect(() => {
    if (searchEntityValue) {
      // setIsFetching(true);
      const timeout = setTimeout(() => {
        findEntity();
      }, 300);
      return () => clearTimeout(timeout);
    } else setEntityList([]);
  }, [searchEntityValue]);
  const styleTd = {
    paddingLeft: 4,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 0,
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
              width: 180,
              paddingLeft: 4,
              paddingTop: 5,
              paddingBottom: 5,
              paddingRight: 0,
            }}
          >
            <Typography style={{ marginRight: 0 }} wrap="nowrap">
              <div style={{ fontSize: 10, width: 180, marginRight: 0 }}>
                {item.transactiondetail1}
              </div>
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
          <CardContent>
            {transactionList.length > 0 ? (
              <div style={{ width: "100%" }}>
                <h5>Ultimos movimientos</h5>

                <div
                  style={{ marginBottom: 10, cursor: "pointer" }}
                  onClick={() => {
                    setShowOpe(!showOpe);
                  }}
                >
                  Operaciones{showOpe ? " -" : " +"}
                </div>
                {showOpe && (
                  <div style={{ marginLeft: 15 }}>
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
                  </div>
                )}
                <div
                  style={{ marginTop: 10, cursor: "pointer" }}
                  onClick={() => {
                    setShowFilters(!showFilters);
                  }}
                >
                  Filtrado{showFilters ? " -" : " +"}
                </div>

                {showFilters && (
                  <div style={{ marginTop: 10, marginLeft: 15 }}>
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
                        style={{ width: "20ch", marginRight: 10 }}
                        id="standard-select-currency"
                        select
                        required
                        label="Tipo de combustible"
                      >
                        {ListSelect(fuelType)}
                      </TextField>
                      <TextField
                        id="standard-select-currency"
                        error={validating && !selectedSector ? true : false}
                        style={{ width: "25ch" }}
                        select
                        required
                        label="Sector"
                        value={selectedSector}
                        onChange={(t) => {
                          setSelectedSector(t.target.value);
                        }}
                      >
                        {ListSelect(sector)}
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
                        <MenuItem key={0} value={1}>
                          Asignación CVM
                        </MenuItem>
                        <MenuItem key={1} value={2}>
                          Despacho
                        </MenuItem>
                        <MenuItem key={2} value={3}>
                          Pago
                        </MenuItem>
                      </TextField>
                      <TextField
                        id="standard-select-currency"
                        style={{ width: "20ch", marginRight: 10 }}
                        select
                        required
                        label="Tipo de salida"
                        onChange={(t) => {}}
                      >
                        <MenuItem key={1} value={1}>
                          Pequeña mineria
                        </MenuItem>
                        <MenuItem key={1} value={1}>
                          Explosivos
                        </MenuItem>
                        <MenuItem key={2} value={2}>
                          Aeropuerto
                        </MenuItem>
                        <MenuItem key={2} value={2}>
                          Alianza
                        </MenuItem>
                        <MenuItem key={2} value={2}>
                          Planta
                        </MenuItem>
                      </TextField>
                      <TextField
                        label="Afiliado"
                        style={{ width: "20ch", marginRight: 10 }}
                        onChange={(t) => {
                          //setNrofactura(t.target.value);
                        }}
                      ></TextField>
                    </div>
                  </div>
                )}
                <Table striped bordered hover style={{ marginTop: 10 }}>
                  <thead>
                    <tr>
                      <th>
                        <span style={{ fontSize: 11 }}>Fecha</span>
                      </th>

                      <th>
                        <span style={{ fontSize: 11 }}>
                          Detalle de movimiento
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
                        <div style={{ fontSize: 10 }}>Lt GASOLINA DISP</div>
                      </th>

                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>23.500,00</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>Lt GASOIL DISP</div>
                      </th>

                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>4.500,00</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>Lt SAL. GASOLINA</div>
                      </th>

                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>12.500,00</div>
                      </th>
                    </tr>
                    <tr>
                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>Lt SAL. GASOIL</div>
                      </th>

                      <th style={styleTd}>
                        <div style={{ fontSize: 10 }}>1.500,00</div>
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
      <Modal
        show={newCustomer}
        onHide={() => {
          setNewCustomer(false);
        }}
        // onExited={() => setSelectedId(null)}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Customers
            submitAction={(value) => {
              setEntityName(value.name);
            }}
          />
        </Modal.Body>
      </Modal>
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
