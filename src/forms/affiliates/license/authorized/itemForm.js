import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Moment from "moment";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import { Scrollbars } from "react-custom-scrollbars";
import { detect } from "../../../../utility/detectNavigator";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import {
  getParish,
  getSector,
  ListSelect,
} from "../../../../components/loadSelect";

import {
  validateRegex,
  validateDocument,
  ValidateEmail,
  NumberFormatCustom,
} from "../../../../utility/formValidation";
import Tooltip from '@material-ui/core/Tooltip';
import SyncIcon from '@material-ui/icons/Sync';
import { postRequest } from "../../../../utility/net/urls";
import { Button, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      width: "20ch",
      color: "#787878",
    },
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 10,
  },

  item: {
    paddingTop: 5,
    borderRadius: 5,
    backgroundColor: "#f4faff",
    paddingLeft: 5,
    color: "#787878",
  },
  item2: {
    paddingTop: 5,
    borderRadius: 5,
    backgroundColor: "#f7f7f7",
    paddingLeft: 5,
    width: "20ch",
  },
  labelDir2: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 91,
    backgroundColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    fontSize: 10,
  },
  error: {
    color: "red",
    position: "absolute",
    fontSize: 8,
    marginTop: -4,
  },
}));
function itemForm({
  item,
  newItem,
  setNewItem,
  editMode,
  setEditMode,
  setModalDetail,
  isNew,
  token,
  setAuthorizedPersons,
  recordId,
  submit,
  userId,
  setStep,
  setCurrentItem,
  closeModal,
  InitState
}) {
  const classes = useStyles();
  const [validating, setValidating] = useState(false);
  const [validEmail1, setValidEmail1] = useState(true);
  const [validDocument, setValidDocument] = useState(0);
  const [parish, setParish] = useState([]);
  const [sector, setSector] = useState([]);
  const [loadingSector, setLoadingSector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDni, setLoadingDni] = useState(false);
  const [row, setRow] = useState([]);
 
  const initState = {
    dnitype: "V",
    entityid: recordId,
    name: "",
    lastname: "",
    dni: "",
    phonenumber: "",
    email: "",
    direction: "",
    gender: "",
    dateofbird: "",
    createdate: "",
    createdbyid: userId,
    createdbyname: "",
    state: 1,
    parish: "",
    sector: "",
    time: "",
    validkilograms: "",
    percentpayment: "",
    paymentvalue: "",
  };
  //useEffect(()=>{if(item)},[])
  useEffect(() => {
    if (item) setRow(item);
    else setRow(initState);
    getParish(setParish);
  }, []);
  useEffect(() => {
    if (row.parish) getSector(setSector, setLoadingSector, row.parish);
  }, [row.parish]);

  var formErr = 0;
  const validateForm = (type, inputValue, validDoc, validEmail) => {
    var error = false;
    if (validating) {
      if (inputValue == "") error = true;
      if (type == "doc" && newItem) {
        if (validDoc == 2) error = true;
      }
      if (type == "mail") {
        if (!validEmail) error = true;
      }
    }

    if (error) formErr += 1;

    return error;
  };
  const Submit = () => {
    setLoading(true);
    setValidating(false);
    setStep(0);
    setTimeout(() => {
      setValidating(true);
    }, 1000);
  };

  useEffect(() => {
    if (validating) {
      setLoading(true);
      setTimeout(() => {
        if (formErr == 0) {
          console.log(JSON.stringify({ authorized: row }));
          console.log("isNew", isNew);
          if (isNew) {
            submit(null, row, (res) => {
              console.log(res);
              if (!res.data.hasError) toast.success(res.data.message);
              else toast.error(res.data.affiliatesDbError.message);
              console.log(res);
              if (res.data.authorizedResult) {
                if (!res.data.authorizedResult.hasError)
                  toast.success(res.data.authorizedResult.message);
                else
                  toast.error(
                    res.data.authorizedResult.authorizedDbError.message
                  );
                setRow(res.data.authorizedResult.newAuthorized);
                setCurrentItem(res.data.authorizedResult.newAuthorized);
                setNewItem(false);
                setEditMode(false);
                setLoading(false);
              }
            });
          } else {
            postRequest("affiliates/saveauthorized", { authorized: row }, token)
              .then((res) => {
                console.log("isNew", isNew);
                const setLocalState = () => {
                  setNewItem(false);
                  setEditMode(false);
                  setLoading(false);
                };

                //setAuthorizedPersons()
                if (!res.data.hasError) {
                  toast.success(res.data.message);
                  if (res.data.newAuthorized) {
                    setRow(res.data.newAuthorized);
                    setCurrentItem(res.data.newAuthorized);
                  }

                  setLocalState();
                  setAuthorizedPersons(res.data.authorizedList);
                } else {
                  toast.error(res.data.authorizedDbError.message);
                  setTimeout(() => {
                    setLocalState();
                    setModalDetail(false);
                  }, 5000);
                }
              })
              .catch((err) => {
                setLoading(false);
                console.log(
                  "Algo pasó al intentar conectar con el servidor.",
                  err
                );
              });
          }
        } else setLoading(false);
      }, 1000);
    }
  }, [validating]);

  console.log("parish", sector);
  return (
    <View>
      <View style={{ alignItems: "center", height: 350 }}>
        <Scrollbars>
          <View style={{ alignItems: "center" }}>
            <View style={{}}>
              <View style={{ marginLeft: 20 }}>
                <div className={classes.root}>

                  <Grid container spacing={1}>
                    {!editMode ? (
                      <>
                        <Grid item xs={6}>
                          <div className={classes.item}>Nombre y apellido
                         
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.item2}>
                            {row.name + " " + row.lastname}

                          </div>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={6}>
                          <div className={classes.item}>Nombre
                          {InitState&&<Tooltip title="Datos de representante legal">
                           <IconButton aria-label="show 4 new mails" color="inherit" style={{}} size="small" 
                            onClick={()=>{
                              setRow(
                                Object.assign({}, row, {
                                  dnitype:InitState.legalrepdnitype,
                                  name:InitState.legalrepname,
                                  entityid:recordId,
                                  lastname: InitState.legalreplastname,
                                  phonenumber:InitState.legalrepphonenumber,
                                  dni:InitState.legalrepdni,
                                  email:InitState.legalrepemail,
                                  direction:InitState.legalrepdirection,
                                  gender:InitState.legalrepgender,
                                })
                              );

                            }}
                            >

                          <SyncIcon   style={{ fontSize: 15 }}/>
                          </IconButton>
                          </Tooltip>}
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.error}>
                            {validating && row.name == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField
                            error={validateForm("", row.name, null, null)}
                            id="standard-error-helper-text"
                            value={row.name}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, { name: t.target.value })
                              );
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.item}>Apellido</div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.error}>
                            {validating && row.lastname == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField
                            error={validateForm("", row.lastname, null, null)}
                            id="standard-error-helper-text"
                            value={row.lastname}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  lastname: t.target.value,
                                })
                              );
                            }}
                          />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={6}>
                      <div className={classes.item}>DNI</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!newItem ? (
                        <div className={classes.item2}>
                          {" "}
                          {row.dnitype + "-" + row.dni}
                        </div>
                      ) : (
                        <>
                          <div className={classes.error}>
                            {validating && newItem && row.dni == ""
                              ? "Campo requerido"
                              : validDocument == 2
                                ? "Ya la cedula ha sido registrada"
                                : ""}
                          </div>

                          <TextField
                            style={{ width: 40 }}
                            id="standard-select-currency"
                            select
                            error={validateForm(null, row.dnitype, null, null)}
                            value={row.dnitype + ""}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  dnitype: t.target.value,
                                })
                              );
                            }}
                          >
                            <MenuItem key={1} value={"V"}>
                              V
                            </MenuItem>
                            <MenuItem key={2} value={"E"}>
                              E
                            </MenuItem>
                          </TextField>
                          <TextField
                            style={{ width: 110, marginLeft: 5 }}
                            error={validateForm(
                              "doc",
                              row.dni,
                              validDocument,
                              null
                            )}
                            id="standard-error-helper-text"
                            value={row.dni}
                            onBlur={(t) => {
                              setValidDocument(0);
                              validateDocument(
                                { value: row.dni, entitytype: row.dnitype },

                                setLoadingDni,
                                setValidDocument
                              );
                            }}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, { dni: t.target.value })
                              );
                            }}
                          />
                        </>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.item}>E-mail</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!editMode ? (
                        <div className={classes.item2}>{row.email}</div>
                      ) : (
                        <>
                          <div className={classes.error}>
                            {(validating && row.email == "") ||
                              validEmail1 == false
                              ? "Email invalido"
                              : ""}
                          </div>
                          <TextField
                            error={
                              validateForm(
                                "mail",
                                row.email,
                                null,
                                validEmail1
                              ) || !validEmail1
                                ? true
                                : false
                            }
                            id="standard-error-helper-text"
                            value={row.email}
                            onBlur={() => {
                              if (row.email != "")
                                setValidEmail1(ValidateEmail(row.email));
                              else setValidEmail1(null);
                            }}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  email: t.target.value,
                                })
                              );
                            }}
                          />
                        </>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.item}>Teléfono</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!editMode ? (
                        <div className={classes.item2}>{row.phonenumber}</div>
                      ) : (
                        <>
                          <div className={classes.error}>
                            {validating && row.phonenumber == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField
                            error={false}
                            id="standard-error-helper-text"
                            error={validateForm(
                              "",
                              row.phonenumber,
                              null,
                              null
                            )}
                            value={row.phonenumber}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  phonenumber: t.target.value,
                                })
                              );
                            }}
                          />
                        </>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.item}>Genero</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!editMode ? (
                        <div className={classes.item2}>
                          {row.gender == "0" ? "Hombre" : "Mujer"}
                        </div>
                      ) : (
                        <>
                          <div className={classes.error}>
                            {validating && row.gender == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField
                            id="standard-select-currency"
                            error={validateForm("", row.gender, null, null)}
                            select
                            required
                            value={row.gender}
                            onChange={() => { }}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  gender: t.target.value,
                                })
                              );
                            }}
                          >
                            <MenuItem key={0} value={"0"}>
                              Hombre
                            </MenuItem>

                            <MenuItem key={1} value={"1"}>
                              Mujer
                            </MenuItem>
                          </TextField>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.item}>Fecha de nacimiento</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!editMode ? (
                        <div className={classes.item2}>
                          {Moment(row.dateofbird).format("DD/MM/YYYY")}
                        </div>
                      ) : (
                        <>
                          <div className={classes.error}>
                            {validating && row.dateofbird == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField
                            id="date"
                            error={validateForm("", row.dateofbird, null, null)}
                            type="date"
                            defaultValue={row.dateofbird}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  dateofbird: t.target.value,
                                })
                              );
                            }}
                          />
                        </>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.item}>Dirección</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!editMode ? (
                        <div className={classes.labelDir2}>
                          <Scrollbars>{row.direction}</Scrollbars>
                        </div>
                      ) : (
                        <>
                          <div className={classes.error}>
                            {validating && row.direction == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField
                            error={validateForm("", row.direction, null, null)}
                            id="standard-error-helper-text"
                            value={row.direction}
                            multiline
                            rows={3}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  direction: t.target.value,
                                })
                              );
                            }}
                          />
                        </>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.item}>Municipio</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!editMode ? (
                        <div className={classes.item2}>
                          {parish.length > 0 ? (
                            parish.filter((i) => i.id == row.parish)[0].name
                          ) : (
                            <span style={{ color: "#6786B9" }}>Loading...</span>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className={classes.error}>
                            {validating && row.parish == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField
                            select
                            error={validateForm("", row.parish, null, null)}
                            id="standard-error-helper-text"
                            value={row.parish}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  parish: t.target.value,
                                })
                              );
                            }}
                          >
                            {ListSelect(parish)}
                          </TextField>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.item}>Sector</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!editMode ? (
                        <div className={classes.item2}>
                          {sector.length > 0 ? (
                            sector.filter((i) => i.id == row.sector)[0].name
                          ) : (
                            <span style={{ color: "#6786B9" }}>Loading...</span>
                          )}
                        </div>
                      ) : sector.length > 0 ? (
                        <>
                          <div className={classes.error}>
                            {validating && row.sector == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField
                            id="standard-select-currency"
                            error={validateForm("", row.sector, null, null)}
                            select
                            required
                            value={
                              loadingSector ? "Consultando..." : row.sector
                            }
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  sector: t.target.value,
                                })
                              );
                            }}
                          >
                            {ListSelect(sector)}
                          </TextField>
                        </>
                      ) : (
                        <TextField
                          disabled
                          id="standard-basic"
                          value={loadingSector ? "Consultando..." : "N/A"}
                        />
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.item}>Tasa porcentual</div>
                    </Grid>
                    <Grid item xs={6}>
                      <Checkbox
                        checked={row.percentpayment == "1" ? true : false}
                        onChange={(t) => {
                          setRow(
                            Object.assign({}, row, {
                              percentpayment: t.target.checked,
                            })
                          );
                        }}
                        name="checkedB"
                        color="primary"
                        disabled={!editMode ? true : false}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.item}>Tasa</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!editMode ? (
                        <div className={classes.item2}>
                          {(row.percentpayment ? "%" : "Gr. ") +
                            row.paymentvalue}
                        </div>
                      ) : (
                        <>
                          <div className={classes.error}>
                            {validating && row.paymentvalue == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField
                            error={validateForm(
                              "",
                              row.paymentvalue,
                              null,
                              null
                            )}
                            value={row.paymentvalue}
                            required
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  paymentvalue: t.target.value,
                                })
                              );
                            }}
                            id="formatted-numberformat-input"
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                              inputProps: {
                                prefix: row.percentpayment ? "% " : "Gramas ",
                                thousandSeparator: true,
                              },
                            }}
                          />
                        </>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.item}>Cantidad permitida</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!editMode ? (
                        <div className={classes.item2}>
                          {"Gr. " + row.validkilograms}
                        </div>
                      ) : (
                        <>
                          <div className={classes.error}>
                            {validating && row.validkilograms == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField
                            error={validateForm(
                              "",
                              row.validkilograms,
                              null,
                              null
                            )}
                            value={row.validkilograms}
                            required
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  validkilograms: t.target.value,
                                })
                              );
                            }}
                            id="formatted-numberformat-input"
                            InputProps={{
                              inputComponent: NumberFormatCustom,
                              inputProps: {
                                prefix: "Gramas ",
                                thousandSeparator: true,
                              },
                            }}
                          />
                        </>
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <div className={classes.item}>Permiso a circular en</div>
                    </Grid>
                    <Grid item xs={6}>
                      {!editMode ? (
                        <div className={classes.item2}>
                          {row.circulationaccesibility == 0
                            ? "Estado Bolívar"
                            : "Todo el territorio nacional"}
                        </div>
                      ) : (
                        <>
                          <div className={classes.error}>
                            {validating && row.circulationaccesibility == ""
                              ? "Campo requerido"
                              : ""}
                          </div>
                          <TextField

                            id="standard-select-currency"
                            select
                            value={row.circulationaccesibility}
                            onChange={(t) => {
                              setRow(
                                Object.assign({}, row, {
                                  circulationaccesibility: t.target.value,
                                })
                              );
                            }}
                          >
                            <MenuItem key={1} value={0}>
                              Estado Bolivar
                            </MenuItem>
                            <MenuItem key={2} value={1}>
                              Todo el territorio nacional
                            </MenuItem>
                          </TextField>
                        </>
                      )}
                    </Grid>
                    {!newItem && (
                      <>
                        <Grid item xs={6}>
                          <div className={classes.item}>Creado por</div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.item2}>
                            {row.createdbyname}
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.item}>Fecha de creado</div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.item2}>
                            {Moment(row.createdate).format("DD/MM/YYYY") +
                              " : " +
                              row.time}
                          </div>
                        </Grid>

                        <Grid item xs={6}>
                          <div className={classes.item}>Fecha de creado</div>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.item2}>
                            {row.state == 1 ? "Activo" : "Inactivo"}
                          </div>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </div>
              </View>
            </View>
          </View>
        </Scrollbars>
      </View>
      <View style={{ marginTop: 10 }}>
        <Modal.Footer>
          {loading && <CircularProgress color="secondary" size={20} />}
          {!newItem && (
            <Button
              disabled={loading}
              variant="secondary"
              onClick={() => {
                setStep(1);
              }}
            >
              Gestión de carnet
            </Button>
          )}
          {newItem && (
            <Button
              disabled={loading}
              variant="secondary"
              onClick={() => {
                Submit();
              }}
            >
              Crear
            </Button>
          )}

          {!newItem && editMode && (
            <Button
              disabled={loading}
              variant="secondary"
              onClick={() => {
                // setModalDetail(false);
                Submit();
              }}
            >
              Salvar
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => {
              closeModal();
            }}
          >
            Salir
          </Button>
        </Modal.Footer>
      </View>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
      />
    </View>
  );
}
const mapState = ({ authStorage }) => {
  console.log("authStorage", authStorage);
  return {
    token: authStorage.token,
    userId: authStorage.user.id,
  };
};
export default connect(mapState)(itemForm);
