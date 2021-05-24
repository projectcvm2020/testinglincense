import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme,createMuiTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MuiListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import AppbarContent from "../../components/appBar";
import Home from "./home";
import Icon from '@material-ui/core/Icon';
import { Scrollbars } from "react-custom-scrollbars";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";
import Newitem from "../newItem";
import { connect } from "react-redux";
import { router } from "../../navigation/routers/profileRouter";
import { setActiveProfileModule,setMenuOpen } from "../../store/actions/auxAction";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "../../assets/css/icons.css";
import { withStyles } from '@material-ui/core/styles';
const drawerWidth = 240;
const ListItem = withStyles({
  root: {
    width:"90%",
    marginBottom:5,
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
    "&$selected": {
      backgroundColor: "#ECD894",
      color: "white",
    
    },
    "&$selected:hover": {
      backgroundColor: "#ECD27D",
      color: "white",
     
      
    },
    "&:hover": {
      backgroundColor: "#FAF6DF",
      color: "#000",
     
     
    }
  },
  selected: {}
})(MuiListItem);
const Accordion = withStyles({
  root: {
   
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 1,
    },
    '&:before': {
      display: 'none',
      
    },
    '&$expanded': {
      margin: 'auto',
      
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {

    borderBottom: '0px solid rgba(0, 0, 0, .125)',
    marginBottom: 1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
  
  },
}))(MuiAccordionDetails);
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
  appBarShift: {
    //marginLeft: drawerWidth,
    //width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    alignItems: "center",
    justifyContent: "flex-end",

    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  
}));

function MiniDrawer({ modules, activeProfileModule, setActiveModule,userFullName,menuOpen,setMenuOpen }) {
  let location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [path, setPath] = React.useState("");
  const history = useHistory();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDrawerOpenHandler = (value) => {
    setMenuOpen(value);
  };
  const handleDrawerOpen = () => {
    setMenuOpen(true);
  };

  const handleDrawerClose = () => {
    setMenuOpen(false);
  };
  React.useEffect(() => {
    setPath(location.pathname);
  }, [location, setPath]);
  const activetRoute = (route) => {
    return path.indexOf(route) > -1 ? true : false;
  };
 
  React.useEffect(() => {
    
    if(modules){
      let parent = modules.filter((i) => i.active == 1 && i.parent !=null&& i.menupath==34 && i.path== 
      window.location.href.split("/")[5])[0]
     
      if(parent){
         setExpanded("panel"+parent.parent)
        
         
      }
     
    }
  
  }, []);
  
  const menuItems = modules
    .filter((i) => i.active == 1 && i.parent == null  && i.menupath==34)
    .map((item, index) => {
      return (
        <>
          {item.path ? (
            <ListItem
              button
              key={index}
              to={item.path && "/" + item.path}
              component={Link}
              onClick={() => {
                if (item.path) {
                  setPath(item.path);
                }
              }}
              selected={activetRoute(item.path)}
            >
              <ListItemIcon>
              <i class="material-icons">{(item.icon+"").toLowerCase()}</i>
              </ListItemIcon>
              {item.name}
            </ListItem>
          ) : (
            <Accordion expanded={expanded === 'panel'+item.id} 
            onChange={handleChange('panel'+item.id)}
            
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
               
               
              >
                <div >
                  <i class="material-icons" style={{float:"left"}}>{(item.icon+"").toLowerCase()}</i>
                  <div style={{marginLeft:menuOpen?30:-10,marginTop:5}}>{menuOpen&&item.name}</div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
              <div style={{width:"100%"}}>
                {modules
                  .filter((i) => i.active == 1 && i.parent == item.id)
                  .map((item2, index2) => {
                    return (
                      <ListItem
                        button
                        style={{marginLeft:0,width:menuOpen?"100%":50,paddingRight:10,marginRight:10}}
                        key={index2 + "A"}
                        to={item2.path && "/" + item2.path}
                        component={Link}
                        onClick={() => {
                          if (item2.path) {
                            setPath(item2.path);
                            //return <Redirect to={item.path}/>
                            setActiveModule(item2.path);
                          }
                        }}
                        selected={activetRoute(item2.path)}
                      >
                        <ListItemIcon >
                        <i class="material-icons">{(item2.icon+"").toLowerCase()}</i>
                        </ListItemIcon>
                        <span>{menuOpen&&item2.name}</span>
                      </ListItem>
                    );
                  })}
                  </div>
              </AccordionDetails>
            </Accordion>
          )}
        </>
      );
    });
  
  const Routers = modules.map((item, index) => {
    const Comp = router
      .filter((i) => i.path === item.path)
      .map((i) => i.component);
    
    return (
      <Route key={"1" + index} path={"/" + item.path}>
        {Comp}
      </Route>
    );
  });
 
  return (
    <div className={classes.root}>
      <Router basename="/cvm/profile">
        <CssBaseline />
        
        <Drawer
          // anchor={"right"}
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: menuOpen,
            [classes.drawerClose]: !menuOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: menuOpen,
              [classes.drawerClose]: !menuOpen,
            }),
          }}
        >
          <Scrollbars
          renderThumbHorizontal={() => <div></div>}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
            <List>
              <div style={{marginLeft:10}}>
                <IconButton
                 
                  aria-label="open drawer"
                  onClick={() => handleDrawerOpenHandler(!menuOpen)}
                  edge="start"
                  className={clsx(classes.menuButton, {
                    //  [classes.hide]: open,
                  })}
                >
                  {!menuOpen ? <MenuIcon /> : <CloseIcon />}
                </IconButton>
              </div>
              <Divider />

              {menuItems}
             
            </List>
            <Divider />
          </Scrollbars>
        </Drawer>
        <main className={classes.content}>
          <Toolbar />
          <h5 style={{color:"#008EEA"}}>Hola {userFullName}</h5>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route
              path={(
                "/" +
                window.location.href.split("/")[5] +
                "/item/:recordId"
              ).replace("//cvm/profile", "")}
            >
              <Newitem />
            </Route>
            <Route
              path={(
                "/" +
                window.location.href.split("/")[5] +
                "/newitem"
              ).replace("//cvm/profile", "")}

            >
              <Newitem />
            </Route>

            {Routers}
          </Switch>
        </main>
      </Router>
    </div>
  );
}
const mapStateToProps = ({ authStorage, auxStorage }) => {
  return {
    modules: authStorage.modules,
    activeProfileModule: auxStorage.activeProfileModule,
    userFullName:authStorage.user.name+" "+authStorage.user.lastname,
    menuOpen:auxStorage.menuOpen
  };
};
const setState = (dispatch) => {
  return {
    setActiveModule: (value) => dispatch(setActiveProfileModule(value)),
    setMenuOpen:(value) => dispatch(setMenuOpen(value)),
  };
};
export default connect(mapStateToProps, setState)(MiniDrawer);
