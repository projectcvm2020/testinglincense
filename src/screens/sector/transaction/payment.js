import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native-web";
import { Button, Modal } from "react-bootstrap";
import { getRequest, postRequest } from "../../../utility/net/urls";
import IconButton from "@material-ui/core/IconButton";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import { ToastContainer, toast } from "react-toastify";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { NumberFormatCustom } from "../../../utility/formValidation";
import Webcam from "react-webcam";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getFuel, getPaymentRecept } from "../../../components/loadSelect";
import { toBase64 } from "../../../utility/img";
import Autocomplete, {
  AutocompleteBody,
} from "../../../components/autocompleteTextFIeld";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Detail from "../../../forms/miner/detail";
import Cancel from "@material-ui/icons/Cancel";
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));
function paymentGoldForm({
  modalPago,
  setModalPago,
  sendPayment,
  userId,
  sector,
}) {
  const classes = useStyles();
  const [buttonCamDisabled, setButtonCamDisabled] = useState(false);
  const [validating, setValidating] = useState(false);
  const [imgSrc, setImg] = useState("");
  const [detallePago, setDetallePago] = useState(null);
  const webcamRef = React.useRef(null);
  const [ammount, setAmount] = useState(null);
  const [sendingPayment, setSendingPayment] = useState(false);
  const [paymentRecept, setPaymentRecept] = useState([]);
  const [selectedPaymentRecept, setSelectedPaymentRecept] = useState(null);
  const [fuelType, setFuelType] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [fuelCant, setFuelcant] = useState(null);
  const [showCreateMiner, setShowCreateMiner] = useState(false);
  /**/
  const [searchListVisible, setSearchListVisible] = useState(null);
  const [entityList, setEntityList] = useState([]);
  const [itemFocused, setItemFocused] = useState(-1);
  const [entityName, setEntityName] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  /**/
  const openFileInput = () => {
    document.getElementById("hiddenFileInput").click();
  };
  const capture = React.useCallback(() => {
    setImg(webcamRef.current.getScreenshot());
  }, [webcamRef]);
  const chooseImage = (event) => {
    toBase64(event.target.files[0], (src) => {
      setImg(src);
    });
  };
  useEffect(() => {
    getPaymentRecept(setPaymentRecept);
    getFuel(setFuelType);
  }, []);

  const videoConstraints = {
    width: 171,
    height: 200,
    facingMode: "user",
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
  useEffect(() => {
    if (!showCreateMiner)
      try {
        document.getElementById("tx").value = entityName;
      } catch {}
  }, [showCreateMiner]);
  return (
    <div>
      <Modal
        show={modalPago}
        onHide={() => {
          setModalPago(false);
          setValidating(false);
          setShowCreateMiner(false)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {!showCreateMiner ? (
              <div className={classes.root}>
                <div>
                  <TextField
                    label="Monto en oro"
                    style={{ width: "25ch" }}
                    id="standard-error-helper-text"
                    value={ammount}
                    error={
                      (ammount == null || ammount <= 0) && validating
                        ? true
                        : false
                    }
                    onChange={(t) => {
                      setAmount(t.target.value);
                    }}
                    id="formatted-numberformat-input"
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                      inputProps: {
                        prefix: "Gr.",
                        thousandSeparator: true,
                      },
                    }}
                  />
                  <TextField
                    id="standard-select-currency"
                    error={validating && !selectedPaymentRecept ? true : false}
                    style={{ width: "25ch" }}
                    select
                    required
                    label="Tipo de pago"
                    value={selectedPaymentRecept}
                    onChange={(t) => {
                      setSelectedPaymentRecept(t.target.value);
                    }}
                  >
                    {ListSelect(paymentRecept)}
                  </TextField>
                </div>
                {selectedPaymentRecept == "3" && (
                  <div>
                    <TextField
                      id="standard-select-currency"
                      error={validating && !selectedFuelType ? true : false}
                      style={{ width: "25ch" }}
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
                      label="Referencia de litros"
                      style={{ width: "25ch" }}
                      id="standard-error-helper-text"
                      value={fuelCant}
                      error={
                        (fuelCant == null || fuelCant <= 0) && validating
                          ? true
                          : false
                      }
                      onChange={(t) => {
                        setFuelcant(t.target.value);
                      }}
                      id="formatted-numberformat-input"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                        inputProps: {
                          prefix: "Lt.",
                          thousandSeparator: true,
                        },
                      }}
                    />
                  </div>
                )}

                <div>
                  <Autocomplete
                    label="Buscar Minero"
                    url="miner/getminer"
                    disabled={
                      /*selectedPlant == "0" || selectedPlant == null
                  ? false
                : true*/ false
                    }
                    error={validating && !entityName ? true : false}
                    helperText={
                      validating && !entityName ? "Campo requerido" : ""
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
                              backgroundColor:
                                itemFocused == index ? "#ccc" : null,
                            }}
                          >
                            <td>
                              {item.entityname + " " + item.entitylastname}
                            </td>
                          </tr>
                        );
                      });
                    }}
                  />
                </div>

                <div>
                  <TextField
                    id="standard-error-helper-text"
                    fullWidth
                    label="Detalle"
                    value={detallePago}
                    multiline={true}
                    rows={4}
                    style={{ width: "52ch" }}
                    onChange={(t) => {
                      setDetallePago(t.target.value);
                    }}
                  />
                </div>

                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      {imgSrc == "" ? (
                        <IconButton onClick={capture}>
                          <CameraAltIcon style={{ fontSize: 20 }} />
                        </IconButton>
                      ) : (
                        <IconButton
                          disabled={buttonCamDisabled}
                          onClick={() => setImg("")}
                        >
                          <DeleteIcon style={{ fontSize: 20 }} />
                        </IconButton>
                      )}
                      <IconButton
                        disabled={buttonCamDisabled}
                        onClick={() => {
                          openFileInput();
                        }}
                      >
                        <FolderIcon style={{ fontSize: 20 }} />
                      </IconButton>
                      <input
                        type="file"
                        id="hiddenFileInput"
                        style={{ display: "none" }}
                        onChange={chooseImage}
                      />
                    </View>
                    <View
                      style={{
                        width: 171,
                        height: 200,
                        borderWidth: validating && imgSrc == "" ? 2 : 0,
                        borderColor: "red",
                        backgroundColor: "#000",
                        zIndex: 100,
                        alignItems: "center",
                      }}
                    >
                      {imgSrc == "" ? (
                        <Webcam
                          audio={false}
                          height={200}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          width={171}
                          videoConstraints={videoConstraints}
                        />
                      ) : (
                        <div
                          style={{
                            height: 200,
                            width: 171,

                            backgroundImage: "url(" + imgSrc + ") ",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                          }}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </div>
            ) : (
              <>
                <IconButton
                  style={{}}
                  onClick={() => {
                    setShowCreateMiner(false);
                  }}
                >
                  <Cancel style={{ fontSize: 30 }} />
                </IconButton>
                <Detail showModal={true} />
              </>
            )}
          </View>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            disabled={sendingPayment}
            onClick={() => {
              setModalPago(false);
              setValidating(false);
              setShowCreateMiner(false)
            }}
          >
            Descartar
          </Button>

          <Button
            disabled={(sendingPayment || showCreateMiner)}
            variant="primary"

            onClick={() => {
              console.log(

                {
                  ammount: ammount,
                  fuelType: selectedFuelType,
                  sector: sector, 
                  fuelCant: fuelCant,
                  comment: detallePago,
                  customerData:customerData,
                  selectedPaymentRecept:selectedPaymentRecept
                }
              )
              setValidating(true);
              if (
                !(ammount == null || ammount <= 0) &&
                
                selectedPaymentRecept != null &&
                (fuelCant != null&&selectedPaymentRecept=="3" || selectedPaymentRecept!="3" ) &&
                (selectedFuelType != null&&selectedPaymentRecept=="3" || selectedPaymentRecept!="3" ) &&
                entityName != null
              ) {
                sendPayment({
                 /* inmon: ammount,
                  fueltype: selectedFuelType,
                  sector: sector, 
                  inunit: fuelCant,
                  creationuser:userId,
                  comentarios: detallePago,
                  customerData:customerData,
                  entitytype:customerData.entityName,
                  entitydni:entitydni
                  entityrif:entityrif
                  entityaddress:entityaddress
                  entityphonenumber:entityphonenumber
                  entityname:entityname
                  paymentType:selectedPaymentRecept*/
                });
                setAmount(null);

                setSelectedFuelType(null);
                setFuelcant(null);
                setImg(null);
                setModalPago(false);
                setValidating(false);
                setDetallePago(null)
                setSelectedPaymentRecept(null)
                setCustomerData(null)
                setEntityName(null)
              }
            }}
          >
            <View style={{ flexDirection: "row" }}>
              {sendingPayment && (
                <View style={{ marginRight: 10 }}>
                  <CircularProgress color="#000" size={20} />
                </View>
              )}
              <div>Realizar</div>
            </View>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
const mapStateToProps = ({ authStorage }) => {
  return {
    userId: authStorage.user.id,
    sector: authStorage.user.sector,
  };
};
export default connect(mapStateToProps)(paymentGoldForm);
