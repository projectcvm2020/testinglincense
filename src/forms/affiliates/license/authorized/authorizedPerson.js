import React, { useState, useEffect } from "react";

import { Button, Modal } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import Add from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import CircularProgress from "@material-ui/core/CircularProgress";
import { View, TouchableOpacity } from "react-native-web";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makeStyles } from "@material-ui/core/styles";
import Moment from "moment";
import Print from "@material-ui/icons/Print";
import PrintDis from "@material-ui/icons/PrintDisabled";
import RadioUnche from "@material-ui/icons/RadioButtonUnchecked";
import RadioChe from "@material-ui/icons/RadioButtonChecked";
import Typography from "@material-ui/core/Typography";
import Timer from "@material-ui/icons/Timer";
import { getRequest } from "../../../../utility/net/urls";
import { connect } from "react-redux";
import ItemForm from "./itemForm";
import Paper from '@material-ui/core/Paper';
import LicenseModule from "../licenseModule";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  cols: {
    padding: theme.spacing(1),
    textAlign: "flex-start",
    alignItems: "flex-start",
    color: theme.palette.text.secondary,
    marginLeft:5
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
export default function authorizedPerson(props) {
  
  const [currentItem, setCurrentItem] = useState(null);
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [newItem, setNewItem] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [step,setStep] = useState(0)
  
  useEffect(() => {
    if (currentItem) {
      setNewItem(false);
      setEditMode(false);
      setModalDetail(true);
    } else setModalDetail(false);
  }, [currentItem]);
  useEffect(() => {
    if (newItem) {
      setEditMode(true);
      setModalDetail(true);
    }
  }, [newItem]);

  const List = () => {
    return (
      
        // .filter((i) => i.id > 0)
        props.authorizedPersons.map((item, index) => (
          <TouchableOpacity key={index}
            style={{ marginBottom: 10 }}
            onPress={() => {
              setCurrentItem(item);
              setNewItem(false);
            }}
          >
            <div
              className={classes.root}
              style={{
                backgroundColor: index % 2 === 0 ? "#EAECF1" : "#F2F4F7",
                padding: 5,
                borderRadius: 5,
              }}
            >
              <Grid container className={classes.root} spacing={3}>
                <Grid  container item xs={12} spacing={3}>
                  <React.Fragment>
                    <Grid item xs={6}>
                      <Typography
                        className={classes.cols}
                        variant="inherit"
                        color="inherit"
                        noWrap
                        align="left"
                      >
                        {item.name + "  " + item.lastname}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography
                        
                        className={classes.cols}
                        variant="inherit"
                        color="inherit"
                        noWrap
                      >
                        {" "+item.dni}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography
                        className={classes.cols}
                        variant="inherit"
                        color="inherit"
                        noWrap
                      >
                        {Moment(item.createdate).format("DD/MM/YYYY")}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.state == 1 ? <RadioChe /> : <RadioUnche />}
                      </View>
                    </Grid>
                  </React.Fragment>
                </Grid>
              </Grid>
            </div>
          </TouchableOpacity>
        ))
    );
  };
  const Step=()=>{
    switch(step)
    {
      case 0:
        return <ItemForm
                  setModalDetail={setModalDetail}
                  item={currentItem}
                  newItem={newItem}
                  setNewItem={setNewItem}
                  setEditMode={setEditMode}
                  editMode={editMode}
                  setStep={setStep}
                  setCurrentItem={setCurrentItem}
                  closeModal={closeModal}
                  {...props}

                />
      case 1:
        return <LicenseModule
                  {...props}
                  setStep={setStep}
                  item={currentItem}
                  isCompany={true}
                  type={0}
                  srcPrint="affiliates/printlicense"
                />

    }
  }
  const closeModal=()=>{
    setModalDetail(false);
    setNewItem(false);
    setEditMode(false);
    setCurrentItem(null);
    setStep(0)
  }
  return (
    <>
      <div>
        <Grid container spacing={1}>
          <Grid container item xs={12} spacing={3}>
            <React.Fragment>
              <Grid item xs={6}>
                <div className={classes.cols}>NOMBRE</div>
              </Grid>
              <Grid item xs={2}>
                <div className={classes.cols}>DNI</div>
              </Grid>
              <Grid item xs={2}>
                <div className={classes.cols}>CREADO</div>
              </Grid>
              <Grid item xs={2}>
                <div className={classes.cols}>ACTIVO</div>
              </Grid>
            </React.Fragment>
          </Grid>
        </Grid>
        {List()}
      </div>
      <Button
        disabled={false}
        style={{}}
        onClick={() => {
          setNewItem(true);
          setEditMode(true);
        }}
        variant="outline-secondary"
        size="sm"
      >
        <Add />
        Crear
      </Button>
      <Modal
        show={modalDetail}
        onHide={() => {
          
          closeModal()
        }}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {!newItem ? "Detalle" : "Creación"} de tercero
            {!newItem && !editMode && (
              <Button
                disabled={false}
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setEditMode(true);
                }}
                variant="outline-secondary"
                size="sm"
              >
                <Edit />
              </Button>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalDetail && Step()}
        </Modal.Body>
      </Modal>
    </>
  );
}
