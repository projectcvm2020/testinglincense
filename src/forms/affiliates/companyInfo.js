import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity } from "react-native-web";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest, getRequest } from "../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateFnsUtils from "@date-io/date-fns";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Checkbox from "@material-ui/core/Checkbox";
import { ToastContainer, toast } from "react-toastify";
import { connect } from "react-redux";
import {
  getParish,
  getMineralType,
  getExtractionMethod,
  getFinanceMethod,
  getSector,
  getGetActityType,
  getActivitySubType,
  getPosition,
} from "../../components/loadSelect";

import {
  validateRegex,
  validateDocument,
  ValidateEmail,
  NumberFormatCustom,
} from "../../utility/formValidation";
import Modals from "react-modal";
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: "1%",
      width: "100%",
      fontSize: 10,
      [theme.breakpoints.up("sm")]: {
        width: "45%",
      },
    },
    width: "80%",
  },
  container1: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  title: { marginTop: 10 },
  Divider: { width: "94%" },
}));

function companyInfo({
  setStep,
  values,
  isNew,
  setInitState,
  token,
  submit,
  loadingFetch,
}) {
  const [validating, setValidating] = useState(false);
  const [validEmail1, setValidEmail1] = useState(true);
  const [validEmail2, setValidEmail2] = useState(true);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [parish, setParish] = useState([]);
  const [sector, setSector] = useState([]);
  const [position, setPosition] = useState([]);
  const [activityType, setActivityType] = useState([]);
  const [activitySubType, setActivitySubType] = useState([]);
  const [mineralTypes, setMineralTypes] = useState([]);
  const [extractionMethod, setExtractionMethod] = useState([]);
  const [financeMethod, setFinanceMethod] = useState([]);
  const [loadingSector, setLoadingSector] = useState(false);
  const [loadingSubTypes, setLoadingSubTypes] = useState(false);
  const [validDocument, setValidDocument] = useState(0);
  const [loadingDni, setLoadingDni] = useState(false);
  const [formValidateErrors, setFormValidateErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mineralTaxe, setMineralTaxe] = useState(0);
  
  useEffect(() => {
    getParish(setParish);
    getMineralType(setMineralTypes);
    getGetActityType(setActivityType);
    getExtractionMethod(setExtractionMethod);
    getFinanceMethod(setFinanceMethod);
    getPosition(setPosition);
  }, []);

  useEffect(() => {
    getSector(setSector, setLoadingSector, values.parish);
  }, [values.parish]);
  useEffect(() => {
    getActivitySubType(
      setActivitySubType,
      setLoadingSubTypes,
      values.activitytype
    );
  }, [values.activitytype]);
  const getMineralTaxe=()=>{
    
    getRequest("personresource/getmineraltypes?id="+values.mineraltype,token).then(res=>{
      
      if(res.data){
        setMineralTaxe(res.data.taxe)
        if(values.percentpayment)
          setInitState(
            Object.assign({}, values, {
              paymentvalue: res.data.taxe,
            })
          );
      }
      
    })
  }
  useEffect(()=>{getMineralTaxe()},[values.mineraltype])
  const ListSelect = (data) => {
    return data.map((item, index) => {
      return (
        <MenuItem key={index} value={item.id}>
          {item.name}
        </MenuItem>
      );
    });
  };
  useEffect(()=>{
      if(values.percentpayment==true)
      {
        setInitState(
          Object.assign({}, values, {
            paymentvalue: mineralTaxe,
          })
        );
      }
      else{
        setInitState(
          Object.assign({}, values, {
            paymentvalue: "0",
          })
        );
      }

  },[values.percentpayment])
  var formErr = 0;
  const validateForm = (type, inputValue, validDoc, validEmail) => {
    var error = false;
    if (validating) {
      if (inputValue == "") error = true;
      if (type == "doc" && isNew) {
        if (validDoc == 2) error = true;
      }
      if (type == "mail") {
        if (!validEmail) error = true;
      }
    }

    if (error) formErr += 1;

    return error;
  };

  useEffect(() => {
    if (validating) {
      setTimeout(() => {
        console.log("err", formErr);
        if (formErr == 0 && !saving) setStep(2);
        if (formErr == 0 && saving) {
          console.log("saving");
          submit(null, null, (res) => {
            toast.success(res.data.message);
            console.log("res", res);
            setSaving(false);
          });
        }
        setLoading(false);
      }, 1000);
    }
  }, [validating]);

  const person = () => {
    return (
      <>
        <View style={{ marginTop: 20 }}>
          <h5 style={{}}>Información personal</h5>
          <Divider className={classes.Divider} />
        </View>
        <div>
          <TextField
            id="standard-error-helper-text"
            label="Tipo de entidad"
            disabled
            value={"Figura personal"}
          />
          <TextField
            error={validateForm("doc", values.entitydni, validDocument, null)}
            helperText={
              validating && isNew && values.entitydni == ""
                ? "Campo requerido"
                : validDocument == 2
                ? "Ya la cedula ha sido registrada"
                : ""
            }
            id="standard-error-helper-text"
            label="CI"
            required
            value={values.entitydni}
            onKeyPress={(e) => {
              validateRegex(e, /[0-9]|\./);
            }}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, { entitydni: t.target.value })
              );
            }}
            onBlur={(t) => {
              setValidDocument(0);
              validateDocument(
                { value: values.entitydni, entitytype: values.entitytype },
                setLoadingDni,
                setValidDocument
              );
            }}
            InputProps={{
              inputComponent: NumberFormatCustom,
              inputProps: {
                prefix: values.entitytype + "-",
                thousandSeparator: false,
              },
            }}
          />
        </div>
        <div>
          <TextField
            id="standard-error-helper-text"
            error={validateForm("", values.entityname, null, null)}
            helperText={
              validating && values.entityname == "" ? "Campo requerido" : ""
            }
            label="Nombres"
            required
            value={values.entityname}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, {
                  entityname: t.target.value,
                })
              );
            }}
          />
          <TextField
            id="standard-error-helper-text"
            error={validateForm("", values.entitylastname, null, null)}
            helperText={
              validating && values.entitylastname == "" ? "Campo requerido" : ""
            }
            label="Apellidos"
            required
            value={values.entitylastname}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, {
                  entitylastname: t.target.value,
                })
              );
            }}
          />
        </div>
        <div>
          <TextField
            id="standard-select-currency"
            error={validateForm("", values.entitygender, null, null)}
            helperText={
              validating && values.entitygender == "" ? "Campo requerido" : ""
            }
            select
            required
            label="Genero"
            value={values.entitygender}
            onChange={() => {}}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, { entitygender: t.target.value })
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

          <TextField
            label="RIF"
            disabled
            value={values.entityrif}
            required
            id="standard-error-helper-text"
            InputProps={{
              inputComponent: NumberFormatCustom,
              inputProps: {
                prefix: values.entitytype + "-",
                thousandSeparator: false,
              },
            }}
          />
        </div>
        <div>
          <TextField
            error={
              validateForm("mail", values.entityemail, null, validEmail1) ||
              !validEmail1
                ? true
                : false
            }
            id="standard-error-helper-text"
            label="Email"
            value={values.entityemail}
            onBlur={() => {
              if (values.entityemail != "")
                setValidEmail1(ValidateEmail(values.entityemail));
              else setValidEmail1(null);
            }}
            onChange={(t) =>
              setInitState(
                Object.assign({}, values, { entityemail: t.target.value })
              )
            }
            required
            helperText={
              (validating && values.entityemail == "") || validEmail1 == false
                ? "Email invalido"
                : ""
            }
          />
          <TextField
            id="standard-error-helper-text"
            error={validating && values.entityphonenumber == "" ? true : false}
            helperText={
              validating && values.entityphonenumber == ""
                ? "Campo requerido"
                : ""
            }
            label="Número de teléfono"
            required
            value={values.entityphonenumber}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, {
                  entityphonenumber: t.target.value,
                })
              );
            }}
          />
        </div>
        <div>
          <TextField
            id="date"
            label="Fecha de nacimiento"
            error={validateForm("", values.entitydateofbirth, null, null)}
            helperText={
              validating && values.entitydateofbirth == ""
                ? "Campo requerido"
                : ""
            }
            type="date"
            defaultValue={values.entitydateofbirth}
            value={values.entitydateofbirth}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            required
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, {
                  entitydateofbirth: t.target.value,
                })
              );
            }}
          />
        </div>
        <div>
          <TextField
            id="standard-error-helper-text"
            fullWidth
            error={validateForm("", values.entitydirection, null, null)}
            helperText={
              validating && values.entitydirection == ""
                ? "Campo requerido"
                : ""
            }
            label="Dirección"
            value={values.entitydirection}
            multiline={true}
            rows={4}
            required
            style={{ width: "92%" }}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, {
                  entitydirection: t.target.value,
                })
              );
            }}
          />
        </div>
        <div>
          <TextField
            id="standard-select-currency"
            error={validateForm("", values.parish, null, null)}
            helperText={
              validating && values.parish == "" ? "Campo requerido" : ""
            }
            select
            required
            label="Municipio"
            value={values.parish}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, { parish: t.target.value })
              );
            }}
          >
            {ListSelect(parish)}
          </TextField>
          {sector.length > 0 ? (
            <TextField
              id="standard-select-currency"
              error={validateForm("", values.sector, null, null)}
              helperText={
                validating && values.sector == "" ? "Campo requerido" : ""
              }
              select
              required
              label="Sector"
              value={loadingSector ? "Consultando..." : values.sector}
              onChange={(t) => {
                setInitState(
                  Object.assign({}, values, { sector: t.target.value })
                );
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
            id="standard-error-helper-text"
            select
            value={values.cvmposition + ""}
            label="Cargo en la CVM"
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, { cvmposition: t.target.value })
              );
            }}
          >
            <MenuItem key={-1} value={null}>
              Ninguno
            </MenuItem>
            {ListSelect(position)}
          </TextField>
       
        <TextField
                  label="Permiso a circular en"
                  
                  id="standard-error-helper-text"
                  error={validateForm("", values.circulationaccesibility, null, null)}
                  helperText={
                    validating && values.circulationaccesibility == "" ? "Campo requerido" : ""
                  }
                  select
                  value={values.circulationaccesibility}
                  onChange={(t) => {
                    setInitState(
                      Object.assign({}, values, {
                        circulationaccesibility: t.target.value,
                      })
                    );
                  }}
                >
                  <MenuItem key={1} value={"0"}>
                    Estado Bolivar
                  </MenuItem>
                  <MenuItem key={2} value={"1"}>
                    Todo el territorio nacional
                  </MenuItem>
                </TextField>
        </div>
      </>
    );
  };
  const company = () => {
    return (
      <>
        <View style={{ marginTop: 20 }}>
          <h5 style={{}}>Información personal</h5>
          <Divider className={classes.Divider} />
        </View>
        <div>
          <TextField
            id="standard-error-helper-text"
            label="Tipo de entidad"
            disabled
            value={"Figura personal"}
          />
        </div>
        <div>
          <TextField
            id="standard-error-helper-text"
            fullWidth
            required
            error={validateForm("", values.entityname, null, null)}
            helperText={
              validating && values.entityname == "" ? "Campo requerido" : ""
            }
            label="Nombre de la empresa"
            value={values.entityname}
            style={{ width: "92%" }}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, { entityname: t.target.value })
              );
            }}
          />
        </div>
        <div>
          <TextField
            label="RIF"
            disabled
            value={values.entityrif}
            required
            id="standard-error-helper-text"
            InputProps={{
              inputComponent: NumberFormatCustom,
              inputProps: {
                prefix: values.entitytype + "-",
                thousandSeparator: false,
              },
            }}
          />
          <TextField
            id="standard-error-helper-text"
            error={validateForm("", values.entityphonenumber, null, null)}
            helperText={
              validating && values.entityphonenumber == ""
                ? "Campo requerido"
                : ""
            }
            label="Número de teléfono"
            required
            value={values.entityphonenumber}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, {
                  entityphonenumber: t.target.value,
                })
              );
            }}
          />
        </div>

        <div>
          <TextField
            error={
              validateForm("mail", values.entityemail, null, validEmail1) ||
              !validEmail1
                ? true
                : false
            }
            id="standard-error-helper-text"
            label="Empresa email"
            value={values.entityemail}
            onBlur={() => {
              if (values.entityemail != "")
                setValidEmail1(ValidateEmail(values.entityemail));
              else setValidEmail1(null);
            }}
            onChange={(t) =>
              setInitState(
                Object.assign({}, values, { entityemail: t.target.value })
              )
            }
            required
            helperText={
              (validating && values.entityemail == "") || validEmail1 == false
                ? "Email invalido"
                : ""
            }
          />
        </div>
        <div>
          <TextField
            id="standard-error-helper-text"
            fullWidth
            error={validateForm("", values.entitydirection, null, null)}
            helperText={
              validating && values.entitydirection == ""
                ? "Campo requerido"
                : ""
            }
            label="Dirección"
            value={values.entitydirection}
            multiline={true}
            rows={4}
            required
            style={{ width: "92%" }}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, {
                  entitydirection: t.target.value,
                })
              );
            }}
          />
        </div>
        <div>
          <TextField
            id="standard-select-currency"
            error={validateForm("", values.parish, null, null)}
            helperText={
              validating && values.parish == "" ? "Campo requerido" : ""
            }
            select
            required
            label="Municipio"
            value={values.parish}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, { parish: t.target.value })
              );
            }}
          >
            {ListSelect(parish)}
          </TextField>
          {sector.length > 0 ? (
            <TextField
              id="standard-select-currency"
              error={validateForm("", values.sector, null, null)}
              helperText={
                validating && values.sector == "" ? "Campo requerido" : ""
              }
              select
              required
              label="Sector"
              value={loadingSector ? "Consultando..." : values.sector}
              onChange={(t) => {
                setInitState(
                  Object.assign({}, values, { sector: t.target.value })
                );
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
      </>
    );
  };
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const Submit = () => {
    setLoading(true);
    setValidating(false);
    setTimeout(() => {
      setValidating(true);
    }, 1000);
  };
 
  return (
    <div className={classes.container1}>
      <form
        className={classes.root}
        id="form"
        autoComplete="off"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          Submit();
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {isNew && (
            <Button
              disabled={false}
              style={{ marginTop: 20, marginRight: 10 }}
              variant="contained"
              color="primary"
              onClick={() => {
                if (isNew) setStep(0);
              }} //^[A-Za-z0-9_.]+$
              className={classes.button}
            >
              Atras
            </Button>
          )}
          <Button
            type="submit"
            disabled={false}
            style={{ marginTop: 20 }}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Siguiente
          </Button>
          {!isNew && (
            <Button
              disabled={false}
              style={{ marginTop: 20, marginLeft: 10 }}
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={() => {
                setSaving(true);
                setTimeout(() => Submit(), 1000);
              }}
            >
              Salvar
            </Button>
          )}
          {loading && (
            <View style={{ paddingTop: 30, paddingLeft: 20 }}>
              <CircularProgress color="secondary" size={20} />
            </View>
          )}
        </View>
        {values.entitytype == "J" ? company() : person()}
        {values.entitytype == "J" && (
          <>
            <View style={{ marginTop: 20 }}>
              <h5 style={{}}>Información del representante legal</h5>
              <Divider className={classes.Divider} />
            </View>

            <div>
              <TextField
                id="standard-error-helper-text"
                error={validateForm("", values.legalrepname, null, null)}
                helperText={
                  validating && values.legalrepname == ""
                    ? "Campo requerido"
                    : ""
                }
                label="Nombres"
                required
                value={values.legalrepname}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, {
                      legalrepname: t.target.value,
                    })
                  );
                }}
              />
              <TextField
                id="standard-error-helper-text"
                error={validateForm("", values.legalreplastname, null, null)}
                helperText={
                  validating && values.legalreplastname == ""
                    ? "Campo requerido"
                    : ""
                }
                label="Apellidos"
                required
                value={values.legalreplastname}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, {
                      legalreplastname: t.target.value,
                    })
                  );
                }}
              />
            </div>
            <div>
              <span>
                <TextField
                  label=" "
                  style={{ width: "10%" }}
                  id="standard-select-currency"
                  select
                  value={values.legalrepdnitype}
                  onChange={(t) => {
                    setInitState(
                      Object.assign({}, values, {
                        legalrepdnitype: t.target.value,
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
                  style={{ width: "33%" }}
                  id="standard-error-helper-text"
                  error={validateForm("", values.legalrepdni, null, null)}
                  helperText={
                    validating && values.legalrepdni == ""
                      ? "Campo requerido"
                      : ""
                  }
                  label="CI"
                  required
                  value={values.legalrepdni}
                  onChange={(t) => {
                    setInitState(
                      Object.assign({}, values, {
                        legalrepdni: t.target.value,
                      })
                    );
                  }}
                />
              </span>
              <TextField
                id="standard-select-currency"
                error={validateForm("", values.legalrepgender, null, null)}
                helperText={
                  validating && values.legalrepgender == ""
                    ? "Campo requerido"
                    : ""
                }
                select
                required
                label="Genero"
                value={values.legalrepgender}
                onChange={() => {}}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, {
                      legalrepgender: t.target.value,
                    })
                  );
                }}
              >
                <MenuItem key={0} value={"0"}>
                  Hombre
                </MenuItem>

                <MenuItem key={0} value={"1"}>
                  Mujer
                </MenuItem>
              </TextField>
            </div>
            <div>
              <TextField
                id="standard-error-helper-text"
                error={validateForm("", values.legalrepphonenumber, null, null)}
                helperText={
                  validating && values.legalrepphonenumber == ""
                    ? "Campo requerido"
                    : ""
                }
                label="Número de teléfono"
                required
                value={values.legalrepphonenumber}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, {
                      legalrepphonenumber: t.target.value,
                    })
                  );
                }}
              />
              <TextField
                error={validateForm("", values.legalrepemail, null, null)}
                id="standard-error-helper-text"
                label="Email"
                value={values.legalrepemail}
                onBlur={() => {
                  if (values.legalrepemail != "")
                    setValidEmail2(ValidateEmail(values.legalrepemail));
                  else setValidEmail2(null);
                }}
                onChange={(t) =>
                  setInitState(
                    Object.assign({}, values, {
                      legalrepemail: t.target.value,
                    })
                  )
                }
                required
                helperText={
                  (validating && values.legalrepemail == "") ||
                  validEmail2 == false
                    ? "Email invalido"
                    : ""
                }
              />
            </div>
            <div>
              <TextField
                id="standard-error-helper-text"
                fullWidth
                required
                label="Dirección"
                error={validateForm("", values.legalrepdirection, null, null)}
                helperText={
                  validating && values.legalrepdirection == ""
                    ? "Campo requerido"
                    : ""
                }
                multiline
                value={values.legalrepdirection}
                rows={4}
                style={{ margin: 8, width: "92%" }}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, {
                      legalrepdirection: t.target.value,
                    })
                  );
                }}
              />
            </div>
            <div>
              <TextField
                id="date"
                label="Fecha de nacimiento"
                error={validateForm("", values.dateofbird, null, null)}
                helperText={
                  validating && values.dateofbird == "" ? "Campo requerido" : ""
                }
                type="date"
                defaultValue={values.dateofbird}
                value={values.entitydateofbirth}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, {
                      dateofbird: t.target.value,
                    })
                  );
                }}
              />
            </div>
          </>
        )}
        <View style={{ marginTop: 20 }}>
          <h5 style={{}}>Información de actividad</h5>
          <Divider className={classes.Divider} />
        </View>
        <div>
          <TextField
            id="standard-error-helper-text"
            //error={validateForm("", values.rum, null, null)}
            //helperText={
            //validating && values.rum == "" ? "Campo requerido" : ""
            //}
            label="RUM"
            required
            value={values.rum}
            onChange={(t) => {
              setInitState(Object.assign({}, values, { rum: t.target.value }));
            }}
          />
        </div>
        <div style={{ display: values.cvmposition ? "none" : "block" }}>
          <TextField
            id="standard-error-helper-text"
            error={
              !values.cvmposition
                ? validateForm("", values.activitytype, null, null)
                : false
            }
            helperText={
              validating && values.activitytype == "" ? "Campo requerido" : ""
            }
            select
            required
            disabled={values.cvmposition ? true : false}
            label="Tipo de actividad"
            value={values.activitytype}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, { activitytype: t.target.value })
              );
            }}
          >
            {ListSelect(activityType)}
          </TextField>
          {activitySubType.length > 0 ? (
            <TextField
              id="standard-error-helper-text"
              select
              required
              disabled={values.cvmposition ? true : false}
              label="Sub-tipo"
              value={values.activitysubtype}
              onChange={(t) => {
                setInitState(
                  Object.assign({}, values, {
                    activitysubtype: t.target.value,
                  })
                );
              }}
            >
              {ListSelect(activitySubType)}
            </TextField>
          ) : (
            <TextField
              disabled
              id="standard-basic"
              label="Sub-tipo"
              value={loadingSubTypes ? "Consultando..." : "N/A"}
            />
          )}
        </div>
        {values.entitytype!="J"&&<div>
          <FormControlLabel
            style={{marginTop:15}}
            control={
              <Checkbox
                checked={values.percentpayment == "1" ? true : false}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, {
                      percentpayment: t.target.checked,
                    })
                  );

                }}
                name="checkedB"
                color="primary"
               
              />
            }
            label="Tasa Porcentual"
          />
          <TextField
            label="Tasa"
            
            error={
              values.entitytype!="J"  &&
              validateForm("", values.paymentvalue, null, null)
            }
            helperText={
              values.mineraltype > 0 &&
              validating &&
              values.validkilograms == ""
                ? "Campo requerido"
                : ""
            }
            value={values.paymentvalue}
            required
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, {
                  paymentvalue: t.target.value,
                })
              );
            }}
            id="formatted-numberformat-input"
            InputProps={{
              inputComponent: NumberFormatCustom,
              inputProps: { prefix: "Gr ", thousandSeparator: true },
            }}
          />
        </div>}
        <div>
          <TextField
            id="standard-error-helper-text"
            error={validateForm("", values.mineraltype, null, null)}
            helperText={
              validating && values.mineraltype == "" ? "Campo requerido" : ""
            }
            select
            required
            label="Tipo de mineral"
            value={values.mineraltype}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, { mineraltype: t.target.value })
              );
            }}
          >
            {ListSelect(mineralTypes)}
          </TextField>
          <TextField
            label="Cantidad permitida"
            disabled={values.mineraltype > 0 ? false : true}
            error={
              values.mineraltype > 0 &&
              validateForm("", values.validkilograms, null, null)
            }
            helperText={
              values.mineraltype > 0 &&
              validating &&
              values.validkilograms == ""
                ? "Campo requerido"
                : ""
            }
            value={values.validkilograms}
            required
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, {
                  validkilograms: t.target.value,
                })
              );
            }}
            id="formatted-numberformat-input"
            InputProps={{
              inputComponent: NumberFormatCustom,
              inputProps: { prefix: "Gr ", thousandSeparator: true },
            }}
          />
        </div>
        <div style={{ display: values.cvmposition ? "none" : "block" }}>
          <TextField
            error={
              !values.cvmposition
                ? validateForm("", values.extractmethod, null, null)
                : false
            }
            helperText={
              validating && values.extractmethod == "" ? "Campo requerido" : ""
            }
            id="standard-error-helper-text"
            select
            disabled={values.cvmposition ? true : false}
            required
            label="Metodo de extracción"
            value={values.extractmethod}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, { extractmethod: t.target.value })
              );
            }}
          >
            {ListSelect(extractionMethod)}
          </TextField>
          <TextField
            id="standard-error-helper-text"
            select
            disabled={values.cvmposition ? true : false}
            required
            error={
              !values.cvmposition
                ? validateForm("", values.financmethod, null, null)
                : false
            }
            helperText={
              validating && values.financmethod == "" ? "Campo requerido" : ""
            }
            label="Metodo financiero"
            value={values.financmethod}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, { financmethod: t.target.value })
              );
            }}
          >
            {ListSelect(financeMethod)}
          </TextField>
        </div>
        {values.entitytype == "J" && (
          <div>
            <TextField
              id="standard-error-helper-text"
              label="Numero de empleados"
              onKeyPress={(e) => {
                validateRegex(e, /[0-9]|\./);
              }}
              required
              error={validateForm("", values.employeenumber, null, null)}
              helperText={
                validating && values.employeenumber == ""
                  ? "Campo requerido"
                  : ""
              }
              value={values.employeenumber}
              onChange={(t) => {
                setInitState(
                  Object.assign({}, values, {
                    employeenumber: t.target.value,
                  })
                );
              }}
            />
          </div>
        )}
        <div>
          <FormControlLabel
            control={
              <Switch
                checked={values.ambientimpact}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, {
                      ambientimpact: t.target.checked,
                    })
                  );
                }}
              />
            }
            label="Estudios de impacto ambiental"
          />
        </div>
        <div>
          <TextField
            id="standard-basic"
            fullWidth
            label="Permisos legales que posee para operar"
            multiline
            rows={4}
            value={values.legacypermisions}
            style={{ width: "92%" }}
            onChange={(t) => {
              setInitState(
                Object.assign({}, values, {
                  legacypermisions: t.target.value,
                })
              );
            }}
          />
        </div>
        <Divider
          className={classes.Divider}
          style={{ marginBottom: 20, marginTop: 20 }}
        />
        <div>
          <View style={{ flexDirection: "row" }}>
            {isNew && (
              <Button
                disabled={false}
                style={{ marginTop: 20, marginRight: 10 }}
                variant="contained"
                color="primary"
                onClick={() => {
                  if (isNew) setStep(0);
                }} //^[A-Za-z0-9_.]+$
                className={classes.button}
              >
                Atras
              </Button>
            )}
            <Button
              type="submit"
              disabled={false}
              style={{ marginTop: 20 }}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Siguiente
            </Button>
            {!isNew && (
              <Button
                disabled={false}
                style={{ marginTop: 20, marginLeft: 10 }}
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() => {
                  setSaving(true);
                  setTimeout(() => Submit(), 1000);
                }}
              >
                Salvar
              </Button>
            )}
            {loading && (
              <View style={{ paddingTop: 30, paddingLeft: 20 }}>
                <CircularProgress color="secondary" size={20} />
              </View>
            )}
          </View>
        </div>
      </form>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
      />

      <Modals
        isOpen={loadingFetch}
        onAfterOpen={() => {}}
        onRequestClose={() => {}}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <CircularProgress color="secondary" size={20} />
      </Modals>
    </div>
  );
}
const mapStateToProps = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};
export default connect(mapStateToProps)(companyInfo);
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
