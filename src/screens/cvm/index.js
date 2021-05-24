import React from "react";
import { makeStyles, useTheme, createMuiTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import AppbarContent from "../../components/appBar";
import Menu from "@material-ui/core/Menu";

import MenuItem from "@material-ui/core/MenuItem";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    Redirect,
  } from "react-router-dom";
import Profile from '../profile'
import Fuel from '../fuel'
import Lic from '../lic'
import Sec from '../sector'
import MuiListItem from "@material-ui/core/ListItem";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));
export default function cvm() {
  const classes = useStyles();
  
  return (
    <>

    
    <Router basename="/cvm" >
      <AppBar position="fixed" className={classes.appBar} color="default">
        <AppbarContent addMenuIcon={true} drawerOpen={null} menuItems={null} />
      </AppBar>
     
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/fuel">
        <Fuel />
      </Route>
      <Route path="/lic">
        <Lic />
      </Route>
      <Route path="/sector">
        <Sec />
      </Route>
      <Route exact path="/">
        <Profile />
      </Route>
      </Router>  
     
    </>
  );
}
