import React, { useState } from "react";
import {
  Form,
  FormControl,
  Button,
  NavDropdown,
  Nav,
  Navbar,
} from "react-bootstrap";
import { View } from "react-native";
import "bootstrap/dist/css/bootstrap.min.css";
import { connect } from "react-redux";
import { authLoginAction } from "../../store/actions/authAction";
import { useHistory, Redirect,Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
function login({ isFetching, userLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const login = (event) => {
    event.preventDefault();
    if (username != "" && password != "")
      userLogin({
        username,
        password,
      },(res)=>{
       
        if(res.data.state=="fail")
          toast.error(res.data.msj)
      });
   
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: window.innerHeight,
      }}
    >
      <Redirect to="/" />

      <img
        style={{ width: 200, height: 200, marginBottom: 20 }}
        src={require("../../assets/img/logocvm.png")}
      />
      <Form onSubmit={login}>
        <Form.Group>
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Usuario"
            onChange={(v) => setUsername(v.target.value)}
            value={username}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            onChange={(v) => setPassword(v.target.value)}
            value={password}
          />
        </Form.Group>
        <View style={{ flexDirection: "row" }}>
          <Button variant="primary" type="submit" onClick={() => {}}>
            Entrar
          </Button>
          {isFetching && (
            <CircularProgress
              color="#ccc"
              style={{ marginLeft: 10, marginTop: 10 }}
              size={20}
            />
          )}
        </View>
      </Form>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
      />
     
      <div style={{marginTop:10}}><Link  to="/passwordrecovery">Recuperar contraseña</Link></div>
    </View>
  );
}
const mapStateToProps = ({ authStorage, configStorage }) => {
  return {
    isFetching: authStorage.isFetching,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (value,evt) => dispatch(authLoginAction(value,evt)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(login);
