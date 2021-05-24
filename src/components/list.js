import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native-web";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { fade, makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Divider from "@material-ui/core/Divider";
import { Modal } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { updateAuxAction } from "../store/actions/auxAction";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: "inherit",
    backgroundColor: "#ccc",
    borderRadius: 5,
    [theme.breakpoints.down("xs")]: {
      width: "70%",
    },
  },
  inputInput: {
    bordercolor: "#000",
    borderWidth: 1,
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "80%",
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
    /*[theme.breakpoints.down("sm")]: {
      width: "10%",
    },*/
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    top: 0,
    zIndex: 100,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: "80%",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 20,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  showMore: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
}));
function List({
  ListForm,
  Form,
  list,
  title,
  update,
  srcRedir,
  idFieldName,
  setSearch,
  setOffSet,
  showSaveButton,
  showInModal,
  showModal,
  setShowModal,
  getItems
}) {
  const [openModalNew, setOpenModalNew] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [searchValue, setSearchValue] = React.useState();
  
  const [selectedId, setSelectedId] = React.useState(null);
  useEffect(() => {
    update(Form);
  }, []);
  useEffect(() => {
    if (selectedId) setShowModal(true);
  }, [selectedId]);
  const classes = useStyles();
  const history = useHistory();

  const ListItems = () =>
    list.map((item, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if (!showInModal) {
              console.log(
                "ruta",
                "/" + srcRedir + "/item/" + item[idFieldName]
              );
              history.push({
                pathname: "/" + srcRedir + "/item/" + item[idFieldName],
                state: { srcRedir: srcRedir },
              });
            } else {
              setSelectedId(item[idFieldName]);
            }
          }}
        >
          <ListForm item={item} index={index} />
        </TouchableOpacity>
      );
    });
  return (
    <div>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon style={{ color: "#000" }} />
        </div>
        <InputBase
          placeholder={"Buscar " + title}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
          onChange={(tx) => {
            setSearch(tx.target.value);
          }}
        />

        <IconButton
          //style={{position:"absolute",left:200,top:-10}}
          onClick={() => {
            if (!showInModal) {
              history.push({
                pathname: "/" + srcRedir + "/newitem/",
                state: { srcRedir: srcRedir },
              });
            }
            else {
              setShowModal(true);
            }
          }}
        >
          <AddCircleIcon style={{ fontSize: 30 }} />
        </IconButton>
      </div>

      <Divider />
      <ListItems />
      <div className={classes.showMore}>
        <Button
          disabled={showSaveButton ? false : true}
          style={{ marginTop: 20, marginLeft: 10 }}
          variant="outlined"
          color="primary"
          onClick={() => {
            setOffSet();
          }}
        >
          Mostrar mas
        </Button>
      </div>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        onExited={() => setSelectedId(null)}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form recordId2={selectedId} setShowModal={setShowModal} getItems={getItems} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

const mapStateToProps = () => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {
    update: (value) => dispatch(updateAuxAction(value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(List);
