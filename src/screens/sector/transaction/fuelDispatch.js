import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Cancel from "@material-ui/icons/Cancel";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { NumberFormatCustom } from "../../../utility/formValidation";
import MenuItem from "@material-ui/core/MenuItem";
import { getFuel, getPlant } from "../../../components/loadSelect";
import Button from "@material-ui/core/Button";
import ButtonS from "react-bootstrap/Button";
import { postRequest, getRequest } from "../../../utility/net/urls";
import Table from "react-bootstrap/Table";
import Autocomplete, {
  AutocompleteBody,
} from "../../../components/autocompleteTextFIeld";
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));
function fuelDispatch({ token, showModal, setShowModal }) {
  const [fuelType, setFuelType] = useState([]);
  const [plant, setPlant] = useState([]);
  const [ammountFuel, setAmmoutFuel] = useState(null);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [selectedParish, setSelectedParish] = useState(null);
  const [validating, setValidating] = useState(false);
  const [save, setSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assignmentType, setAssignmentType] = useState(false);

  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [comentarios, setComentarios] = useState(null);
  const [searchEntityValue, setSearchEntityValue] = useState(null);
  const [showCreateMiner,setShowCreateMiner]= useState(null);
  /**/
  const [searchListVisible, setSearchListVisible] = useState(null);
  const [entityList, setEntityList] = useState([]);
  const [itemFocused, setItemFocused] = useState(-1);
  const [entityName, setEntityName] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  /**/

  const input1Ref = useRef(null);
  const classes = useStyles();
  const ListSelect = (data) => {
    return data.map((item, index) => {
      return (
        <MenuItem key={index} value={item.id}>
          {item.name}
        </MenuItem>
      );
    });
  };
  useEffect(() => {
    getFuel(setFuelType);

    getPlant(setPlant);
  }, []);

  const resetValues = () => {
    setSelectedParish(null);
    setSelectedSector(null);
    setSelectedFuelType(null);
    setAssignmentType(null);
    setAmmoutFuel("");
    setCustomerData(null);
    setValidating(false);
    setEntityName(null);
  };
  useEffect(() => {
    if (itemFocused >= 0) {
    }
  }, [itemFocused]);
  useEffect(() => {
    if (selectedPlant != "0" && selectedPlant != null) {
      setCustomerData(null);
      setEntityName(null);
    }
  }, [selectedPlant]);
  const submit = () => {
    setSaving(true);
    postRequest(
      "SectorTransaction/createDispatch",
      {
        parish: parish,
        sector: sector,
        assignedentity: null,
        fueltype: selectedFuelType,
        creationuser: userId,
        assignmenttype: assignmentType,

        assignmentissuer: sector,
        inunit: assignmentType == "back" ? ammountFuel : null,
        outunit: assignmentType == "outfuel" ? ammountFuel : null,
        entitytype: customerData.entitytype,
        entityrif: customerData.entityrif,
        entityaddress: customerData.entitydirection,
        entityphonenumber: customerData.phoneNumber,
        entityname: customerData.entityname + " " + customerData.entitylastname,
        plant: selectedPlant,
        affiliateid: customerData.id,
        alliance: customerData.isalliance,
      },
      token
    )
      .then((res) => {
        //setCommitRequest(res);
        console.log(res.data);
        if (!res.data.createDispatchDberror) {
          setTransactionList(res.data.transactions);
          resetValues();
          // toast.success(res.data.message);
        } else toast.error(res.data.createDispatchDberror.message);
        setSaving(false);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
  useEffect(() => {
    if (save) {
      if (selectedFuelType && ammountFuel && ammountFuel > 0) {
        setSaving(true);

        setTimeout(() => submit(), 1000);
      } else {
        setSave(false);
      }
    }
  }, [save]);
  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        //onExited={() => setSelectedId(null)}
        animation={true}
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className={classes.root}>
            <div>
              <TextField
                id="standard-select-currency"
                error={validating && !selectedFuelType ? true : false}
                helperText={
                  validating && !selectedFuelType ? "Campo requerido" : ""
                }
                select
                required
                label="Tipo de combustible"
                value={selectedFuelType}
                onChange={(t) => {
                  setSelectedFuelType(t.target.value);
                }}
              >
                {ListSelect(fuelType)}
              </TextField>
              <TextField
                label="Cantidad de combustible"
                error={
                  validating && (!ammountFuel || ammountFuel <= 0)
                    ? true
                    : false
                }
                helperText={
                  validating && (!ammountFuel || ammountFuel <= 0)
                    ? "Campo requerido"
                    : ""
                }
                value={ammountFuel}
                required
                onChange={(t) => {
                  setAmmoutFuel(t.target.value);
                }}
                id="formatted-numberformat-input"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  inputProps: { prefix: "lt ", thousandSeparator: true },
                }}
              />
            </div>
            <div>
              <div>
                <TextField
                  id="standard-select-currency"
                  error={validating && !assignmentType ? true : false}
                  helperText={
                    validating && !assignmentType ? "Campo requerido" : ""
                  }
                  select
                  required
                  label="Tipo de asignación"
                  value={assignmentType}
                  onChange={(t) => {
                    setAssignmentType(t.target.value);
                  }}
                >
                  <MenuItem key={1} value={"outfuel"}>
                    Salida
                  </MenuItem>
                  <MenuItem key={2} value={"backfuel"}>
                    Reverso
                  </MenuItem>
                </TextField>
                <TextField
                  id="standard-select-currency"
                  select
                  required
                  label="Plantas"
                  value={selectedPlant}
                  onChange={(t) => {
                    setSelectedPlant(t.target.value);
                  }}
                >
                  <MenuItem key={0} value={"0"}>
                    Ninguna
                  </MenuItem>
                  {ListSelect(plant)}
                </TextField>
              </div>
            </div>
            <Autocomplete
              label="Buscar Minero"
              url="affiliates/getaffiliateslist"
              disabled={
                /*selectedPlant == "0" || selectedPlant == null
                  ? false
                : true*/ false
              }
              error={
                /*validating &&
                !entityName &&
                (selectedPlant == "0" || selectedPlant == null)
                  ? true
                  : false*/ false
              }
              helperText={
                /*validating && !entityName ? "Campo requerido" : ""*/ ""
              }
              setSearchListVisible={setSearchListVisible}
              entityList={entityList}
              setEntityList={setEntityList}
              itemFocused={itemFocused}
              setItemFocused={setItemFocused}
              entityName={entityName}
              setEntityName={setEntityName}
              setSelectedData={setCustomerData}
              setShowCreateItem={setShowCreateMiner}
              selectedDownValue={() => {
                console.log(entityList[itemFocused + 1].entityname);
                return entityList[itemFocused + 1].entityname;
              }}
              selectedUpValue={() => {
                console.log(entityList[itemFocused - 1].entityname);
                return entityList[itemFocused - 1].entityname;
              }}
            />
            <AutocompleteBody
              hasItems={entityList.length > 0 ? true : false}
              searchListVisible={searchListVisible}
              render={() => {
                return entityList.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      onMouseOver={() => setItemFocused(index)}
                      onClick={() => {
                        setEntityName(
                          item.entityname + " " + item.entitylastname
                        );
                        setCustomerData(item);
                        document.getElementById("tx").value =
                          item.entityname + " " + item.entitylastname;
                      }}
                      style={{
                        backgroundColor: itemFocused == index ? "#ccc" : null,
                      }}
                    >
                      <td>{item.entityname + " " + item.entitylastname}</td>
                    </tr>
                  );
                });
              }}
            />
            <div>
              <TextField
                id="standard-basic"
                fullWidth
                label="Comentarios"
                multiline
                rows={3}
                value={comentarios}
                style={{ width: "92%" }}
                onChange={(t) => {
                  setComentarios(t.target.value);
                }}
              />
            </div>
            <div>
              <ButtonS
                variant="outline-secondary"
                style={{ marginTop: 20, marginBottom: 10 }}
                onClick={() => {
                  setValidating(true);
                  setSave(true);
                }}
              >
                {" "}
                Despachar combustible
              </ButtonS>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showCreateMiner}
        onHide={() => {
          setShowCreateMiner(false);
        }}
        //onExited={() => setSelectedId(null)}
        animation={true}
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>

        hola

        </Modal.Body>

        </Modal>
    </>
  );
}
const mapStateToProps = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};
export default connect(mapStateToProps)(fuelDispatch);
