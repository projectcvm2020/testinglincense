import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest } from "../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateFnsUtils from "@date-io/date-fns";
import Divider from "@material-ui/core/Divider";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { ValidateEmail } from "../../utility/formValidation";
import Moment from "moment";
import {
  getPosition,
  getControlPoint,
  getParish,
  getSector,
} from "../../components/loadSelect";
import { Redirect } from "react-router-dom";
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
}));
export default function personalInfo({ setStep, values, isNew, setInitState }) {
  const [validating, setValidating] = useState(false);
  const [validEmail, setValidEmail] = useState(true);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState([]);
  const [controlPoint, setControlPoint] = useState([]);
  const [parish, setParish] = useState([]);
  const [sector, setSector] = useState([]);
  const [loadingSector, setLoadingSector] = useState(false);
  useEffect(() => {
    getParish(setParish);
    getPosition(setPosition);
    getControlPoint(setControlPoint);
  }, []);
  useEffect(() => {
    getSector(setSector, setLoadingSector, values.parish);
    if(values.parish=="0")
      setInitState( Object.assign({}, values, { sector:null }))
  }, [values.parish]);
  const submit = (event) => {
    event.preventDefault();
    setValidating(true);
    setValidEmail(ValidateEmail(values.email));
    if (
      values.name != "" &&
      values.lastName != "" &&
      values.dni != "" &&
      values.email != "" &&
      validEmail &&
      values.password == values.passwordConfirm &&
      values.password != ""
    ) {
      setStep(2);
    }
  };
  const ListSelect = (data) => {
    return data.map((item, index) => {
      return (
        <MenuItem key={index} value={item.id}>
          {item.name}
        </MenuItem>
      );
    });
  };
  console.log(values.email);
  return (
    <div className={classes.container1}>
      <Card>
        <CardContent>
          <h5>Nuevo Usuario</h5>
          <h7>Información personal</h7>
          <form
            className={classes.root}
            autoComplete="off"
            noValidate
            onSubmit={submit}
          >
            <div>
              <TextField
                error={validating && values.name == "" ? true : false}
                id="standard-error-helper-text"
                helperText={
                  validating && values.name == "" ? "Campo requerido" : ""
                }
                required
                label="Nombre"
                value={values.name}
                onChange={(t) =>
                  setInitState(
                    Object.assign({}, values, { name: t.target.value })
                  )
                }
              />
              <TextField
                error={
                  validating &&
                  (values.lastName == "" || values.lastName == null)
                    ? true
                    : false
                }
                id="standard-error-helper-text"
                helperText={
                  validating && values.lastName == "" ? "Campo requerido" : ""
                }
                required
                label="Apellido"
                value={values.lastName}
                onChange={(t) =>
                  setInitState(
                    Object.assign({}, values, { lastName: t.target.value })
                  )
                }
              />
            </div>
            <div>
              <TextField
                error={validating && values.dni == "" ? true : false}
                id="standard-error-helper-text"
                helperText={
                  validating && values.dni == "" ? "Campo requerido" : ""
                }
                required
                label="DNI"
                value={values.dni}
                onChange={(t) =>
                  setInitState(
                    Object.assign({}, values, { dni: t.target.value })
                  )
                }
              />

              <TextField
                id="standard-select-currency"
                select
                label="Genero"
                value={values.gender}
                onChange={(v) => {
                  setInitState(
                    Object.assign({}, values, { gender: v.target.value })
                  );
                }}
              >
                <MenuItem key={0} value={0}>
                  Hombre
                </MenuItem>

                <MenuItem key={1} value={1}>
                  Mujer
                </MenuItem>
              </TextField>
            </div>
            <div>
              <TextField
                error={validating && values.dateofbird == "" ? true : false}
                id="date"
                type="date"
                defaultValue={values.dateofbird}
                value={values.dateofbird}
                label="Fecha de nacimiento"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, { dateOfBirth: t.target.value })
                  );
                }}
              />
              <TextField
                error={
                  (validating && values.email == "") || validEmail == false
                    ? true
                    : false
                }
                id="standard-error-helper-text"
                label="Email"
                value={values.email}
                onBlur={() => {
                  if (values.email != "")
                    setValidEmail(ValidateEmail(values.email));
                  else setValidEmail(null);
                }}
                onChange={(t) =>
                  setInitState(
                    Object.assign({}, values, { email: t.target.value })
                  )
                }
                required
                helperText={
                  (validating && values.email == "") || validEmail == false
                    ? "Email invalido"
                    : ""
                }
              />
            </div>
            <div>
              <Divider style={{ marginBottom: 20, marginTop: 20 }} />

              <TextField
                id="standard-select-currency"
                select
                label="Cargo"
                value={values.position}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, { position: t.target.value })
                  );
                }}
              >
                {ListSelect(position)}
              </TextField>
              <TextField
                id="standard-select-currency"
                select
                label="Punto de control"
                value={values.controlpoint}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, { controlpoint: t.target.value })
                  );
                }}
              >
                {ListSelect(controlPoint)}
              </TextField>
            </div>
            <div>
              <TextField
                id="standard-select-currency"
                
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
                <MenuItem key={0} value={"0"}>
                  CVM
                </MenuItem>
                {ListSelect(parish)}
              </TextField>
              {sector.length > 0 ? (
                <TextField
                  id="standard-select-currency"
                 
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
            <Divider style={{ marginBottom: 20, marginTop: 20 }} />
            <div>
              <TextField
                id="standard-select-currency"
                select
                label="Tipo de usuario"
                value={values.userType}
                onChange={(t) => {
                  setInitState(
                    Object.assign({}, values, { userType: t.target.value })
                  );
                }}
              >
                <MenuItem key={0} value={0}>
                  Estandar
                </MenuItem>

                <MenuItem key={0} value={1}>
                  Administrador
                </MenuItem>

                <MenuItem key={0} value={2}>
                  Movil
                </MenuItem>
              </TextField>
            </div>
            <TextField
              id="standard-error-helper-text"
              label="Contraseña"
              type="password"
              value={values.password}
              onChange={(t) =>
                setInitState(
                  Object.assign({}, values, { password: t.target.value })
                )
              }
              error={
                (validating && values.password == "") ||
                (validating &&
                  values.password != "" &&
                  values.password != values.passwordConfirm)
                  ? true
                  : false
              }
              helperText={
                validating && values.password == ""
                  ? "Campo requerido"
                  : validating &&
                    values.password != "" &&
                    values.password != values.passwordConfirm
                  ? "Las contraseñas no coinciden"
                  : ""
              }
              required
            />
            <TextField
              id="standard-error-helper-text"
              label="Confirmar contraseña"
              type="password"
              value={values.passwordConfirm}
              onChange={(t) =>
                setInitState(
                  Object.assign({}, values, { passwordConfirm: t.target.value })
                )
              }
              error={
                (validating && values.passwordConfirm == "") ||
                (validating &&
                  values.passwordConfirm != "" &&
                  values.password != values.passwordConfirm)
                  ? true
                  : false
              }
              helperText={
                validating && values.passwordConfirm == ""
                  ? "Campo requerido"
                  : validating &&
                    values.passwordConfirm != "" &&
                    values.password != values.passwordConfirm
                  ? "Las contraseñas no coinciden"
                  : ""
              }
              required
            />
            <Divider style={{ marginBottom: 20, marginTop: 20 }} />
            <div>
              <View style={{ flexDirection: "row" }}>
                {isNew && (
                  <Button
                    disabled={false}
                    style={{ marginTop: 20, marginRight: 10 }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setStep(0);
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
                  //^[A-Za-z0-9_.]+$
                  className={classes.button}
                >
                  Siguiente
                </Button>
                {loading && (
                  <View style={{ paddingTop: 10, paddingLeft: 20 }}>
                    <CircularProgress color="secondary" size={20} />
                  </View>
                )}
              </View>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
