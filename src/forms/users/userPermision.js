import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, TouchableOpacity } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { getRequest } from "../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateFnsUtils from "@date-io/date-fns";
import Divider from "@material-ui/core/Divider";

import Switch from "@material-ui/core/Switch";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

function userPermision({
  setStep,
  userModules,
  SetSelectedModules,
  commit
}) {
  const classes = useStyles();
  
  const [expandId1, setExpandId1] = useState(null);
  const [expandId2, setExpandId2] = useState(null);
  
  const currentItem = (item, index, expand, setExpand, padding_Left,color) => {
    const moreLess =()=> {
      return <span
        onClick={() => {
          if (setExpand)
            setExpand(
              expand != null ? (expand == item.id ? null : item.id) : item.id
            );
        }}
        style={{ cursor: "pointer" }}
      >
        {expand > -1 ? (expand == item.id ? "- " : "+ ") : ""}
      </span>
    };
    return (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: color,
          margin: 5,
          borderRadius: 5,
          paddingHorizontal: 5,
        }}
      >
        <View style={{ flex: 0.9, justifyContent: "center" }}>
          <div><span>{padding_Left}</span>{ moreLess() }<span> {item.name}</span></div>
        </View>

        <View style={{ flex: 0.1,  }}>
          <Switch
            inputProps={{ "aria-label": "secondary checkbox" }}
            onChange={(event) => {
              let mod = [...userModules];
              mod.filter((i) => i.id == item.id)[0].active =
                event.target.checked;

              SetSelectedModules(mod);
            }}
            checked={item.active}
          />
        </View>
      </View>
    );
  };
  const Modules = () => {
    return userModules
      .filter((i) => i.menupath == null)
      .map((item, index) => {
        return (
          <div>
            {currentItem(item, index, expandId1, setExpandId1, "","#EAECF1")}
            {expandId1 == item.id && (
              <>
                {userModules
                  .filter((i) => i.menupath == item.id && i.parent == null)
                  .map((item2, index2) => {
                    return (
                      <>
                        {" "}
                        {currentItem(
                          item2,
                          index2,
                          userModules.filter((i) => i.parent == item2.id)
                            .length > 0
                            ? expandId2
                            : -1,
                          setExpandId2,
                          "└ ",
                          "#D1D1D1"  
                        )}
                        {expandId2 == item2.id && (
                          <>
                            {userModules
                              .filter(
                                (i) =>
                                  i.menupath == item.id && i.parent == item2.id
                              )
                              .map((item3, index3) => {
                                return currentItem(
                                  item3,
                                  index3,
                                  -1,
                                  null,
                                  "└── ",
                                  "#D8D2C6"
                                );
                              })}
                          </>
                        )}
                      </>
                    );
                  })}
              </>
            )}
          </div>
        );
      });
  };

  return (
    <div className={classes.container1}>
      <Card style={{ width: "80%" }}>
        <CardContent>
          <h5>Nuevo Usuario</h5>
          <h7>Permisos de usuario</h7>
          <Divider />

          {Modules()}

          <Divider />

          <div>
            <Button
              disabled={false}
              style={{ marginTop: 20, marginRight: 10 }}
              variant="contained"
              color="primary"
              onClick={() => {
                setStep(1);
              }} //^[A-Za-z0-9_.]+$
              className={classes.button}
            >
              Atras
            </Button>
            <Button
              disabled={false}
              style={{ marginTop: 20 }}
              variant="contained"
              color="primary"
              onClick={() => {
                // console.log("rev",modules.filter((i) => (i.active == true)))
                // SetSelectedModules(modules.filter((i) => (i.active == true)));
                commit((res) => {
                  console.log(res);
                  toast.success(res.data.message);
                  setTimeout(() => setStep(3), 3000);
                });
              }} //^[A-Za-z0-9_.]+$
              className={classes.button}
            >
              Finalizar
            </Button>
          </div>
        </CardContent>
      </Card>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
const mapStateToProps = ({ authStorage }) => {
  return {
    allmodules: authStorage.allmodules,
    token: authStorage.token,
  };
};
export default connect(mapStateToProps)(userPermision);
