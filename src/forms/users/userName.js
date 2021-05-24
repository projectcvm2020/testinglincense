import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest } from "../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { validateRegex } from "../../utility/formValidation";
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

export default function UserName({ setInitState, setStep ,values}) {
  const classes = useStyles();
  const [validUser, setValidUser] = useState(0);
  const [username, setUserName] = useState(0);
  const [loading, setLoading] = useState(false);

  const search = (value) => {
    setUserName(value);
    const timeout = setTimeout(() => {
      validateUserName(value);
    }, 100);
    return () => clearTimeout(timeout);
  };

  const validateUserName = (value, evt = null) => {
    postRequest("auth/checkusername", { username: value })
      .then((res) => {
        console.log(res);
        if (res.result.count == "0") {
          setValidUser(1);
          if (evt) evt();
        } else {
          setValidUser(2);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
 
  return (
    <div className={classes.container1}
      style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
    }}
    >
      <Card>
        <CardContent>
          <h5>Nuevo Usuario</h5>
          <h7>Selección de usuario</h7>
          <form className={classes.root} autoComplete="off">
            <TextField
              error={validUser == 2 ? true : false}
              id="outlined-error-helper-text"
              label="Nombre de usuario"
              onKeyPress={(e) => {
                validateRegex(e, /[A-Za-z0-9_.]|\./);
              }}
              onChange={(t) => {
                setValidUser(0);
                setLoading(true);
                search(t.target.value); //^[A-Za-z0-9_.]+$
              }}
              helperText={validUser == 2 ? "El usuario ya existe" : ""}
            />
          </form>
          <View style={{ flexDirection: "row" }}>
            <Button
              disabled={validUser == 2 || username == "" ? true : false}
              variant="contained"
              color="primary"
              onClick={() => {
                setValidUser(0);
                setLoading(true);
                validateUserName(username, () => {
                
                  setInitState(Object.assign({},values,{username:username}))
                  setStep(1);
                });
                //console.log()
                //if(validUser && username!="" && username.toString().indexOf(" "))
              }} //^[A-Za-z0-9_.]+$
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
        </CardContent>
      </Card>
    </div>
  );
}
