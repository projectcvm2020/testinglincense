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
import { getSector, getFuel } from "../../../components/loadSelect";
import { toBase64 } from "../../../utility/img";
export default function paymentGoldForm({
  modalPago,
  setModalPago,
  sendPayment,
}) {
  const [buttonCamDisabled, setButtonCamDisabled] = useState(false);
  const [validating, setValidating] = useState(false);
  const [imgSrc, setImg] = useState("");
  const [detallePago, setDetallePago] = useState(null);
  const webcamRef = React.useRef(null);
  const [ammount, setAmount] = useState(null);
  const [sendingPayment, setSendingPayment] = useState(false);
  const [sector, setSector] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [fuelType, setFuelType] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [fuelCant, setFuelcant] = useState(null);
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
    getSector(setSector, () => {}, null);
    getFuel(setFuelType);
  },[]);

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
  return (
    <Modal
      show={modalPago}
      onHide={() => {
        setModalPago(false);
        setValidating(false);
      }}
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Pago</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <div>
            <TextField
              label="Monto en oro"
              style={{ width: "25ch" }}
              id="standard-error-helper-text"
              value={ammount}
              error={
                (ammount == null || ammount <= 0) && validating ? true : false
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
          </div>
          <div>
            <TextField
              label="Referencia de litros"
              style={{ width: "25ch" }}
              id="standard-error-helper-text"
              value={fuelCant}
              error={
                (fuelCant == null || fuelCant <= 0) && validating ? true : false
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
          </div>
          <div>
            <TextField
              id="standard-select-currency"
              error={validating && !selectedSector ? true : false}
              style={{ width: "25ch" }}
              select
              required
              label="Sector"
              value={selectedSector}
              onChange={(t) => {
                setSelectedSector(t.target.value);
              }}
            >
              {ListSelect(sector)}
            </TextField>
          </div>
          
          <div>
            <TextField
              id="standard-error-helper-text"
              fullWidth
              label="Detalle"
              value={detallePago}
              multiline={true}
              rows={4}
              style={{ width: "25ch" }}
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
        </View>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          disabled={sendingPayment}
          onClick={() => {
            setModalPago(false);
            setValidating(false);
          }}
        >
          Descartar
        </Button>

        <Button
          disabled={sendingPayment}
          variant="primary"
          onClick={() => {
            setValidating(true);
            if (
              !(ammount == null || ammount <= 0) &&
              imgSrc != null &&
              selectedSector != null &&
              selectedFuelType != null &&
              fuelCant!=  null
            ) {
              sendPayment({
                ammount: ammount,
                fuelType: selectedFuelType,
                sector: selectedSector,
                fuelCant:fuelCant,
                comment:detallePago
              });
              setAmount(null);
              setSelectedSector(null);
              setSelectedFuelType(null);
              setFuelcant(null)
              setImg(null);
              setModalPago(false);
              setValidating(false);
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
  );
}
