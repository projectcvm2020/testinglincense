import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Button, Modal } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import Cancel from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { View, TouchableOpacity } from "react-native-web";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makeStyles } from "@material-ui/core/styles";
import Moment from "moment";
import Print from "@material-ui/icons/Print";
import PrintDis from "@material-ui/icons/PrintDisabled";
import RadioUnche from "@material-ui/icons/RadioButtonUnchecked";
import RadioChe from "@material-ui/icons/RadioButtonChecked";
import Timer from "@material-ui/icons/Timer";
import { getRequest } from "../../../utility/net/urls";
import Avatar from "@material-ui/core/Avatar";
import { connect } from "react-redux";
import PPrint from "./print";
import { postRequest } from "../../../utility/net/urls";

import {
 
  NumberFormatCustom,
} from "../../../utility/formValidation";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  cols: {
    padding: theme.spacing(1),
    textAlign: "center",
    justifyContent: "center",
    color: theme.palette.text.secondary,
  },
}));
function licenseModule({
  setLicenseList,
  licenseList,
  isNew,
  setRecordId,
  submit,
  token,
  userid,
  username,
  setStep,
  isCompany,
  item,
  recordId,
  srcPrint,
  months
}) {
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImg] = useState("");
  const webcamRef = React.useRef(null);
  const [modalCancel, setModalCancel] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [buttonCamDisabled, setButtonCamDisabled] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [imgBlob, setImgBlob] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [print, setPrint] = useState(false);
  const [activarCarnet1, setActivarCarnet1] = useState(false);
  const [activarCarnet2, setActivarCarnet2] = useState(false);
  const [activarCarnet3, setActivarCarnet3] = useState(false);
  const [entId, setEntid] = useState(null);
  const [authid, setAuthid] = useState(null);
  const [Months, setMonths] = useState(null);
  const [ValidationMonts,setValidationMonts]=useState(null)
  const capture = React.useCallback(() => {
    setImg(webcamRef.current.getScreenshot());
  }, [webcamRef]);

  const videoConstraints = {
    width: 171,
    height: 200,
    facingMode: "user",
  };
  const openFileInput = () => {
    document.getElementById("hiddenFileInput").click();
  };
  const chooseImage = (event) => {
    toBase64(event.target.files[0]);
  };
  useEffect(() => {
    if (imgSrc == "") setSaveBtnDisabled(true);
    else setSaveBtnDisabled(false);
  }, [imgSrc]);
  useEffect(() => {
    if (currentItem) {
      setModalDetail(true);
      setLoadingImg(true);
      getImg((res) => {
        setLoadingImg(false);
        setImgBlob("data:image/png;base64," + res.img);
      });
    } else setModalDetail(false);
  }, [currentItem]);

  useEffect(() => {
    if (!item) {
      setAuthid(0);
      setEntid(licenseList.length > 0 ? licenseList[0].entityid : null);
    } else {
      setAuthid(item.id);
      setEntid(item.entityid);
    }
    setMonths(months)
  }, []);
  useEffect(() => {
    if (!item && licenseList.length > 0) {
      setAuthid(0);
      setEntid(licenseList[0].entityid);
    }
  }, [licenseList]);
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        //resolve(reader.result)
        var _src = reader.result.toString();
        setImg(_src);
      };
      reader.onerror = (error) => reject(error);
    });
  const save = () => {
    setSaveBtnDisabled(true);
    setLoadingModal(true);
    setButtonCamDisabled(true);
    if (imgSrc != "") {
      submit(createLic(), null, (res) => {
        console.log(res);
        if (!res.data.hasError) {
          setLicenseList(res.data.generatedLicense);
          toast.info("Registro auto-salvado");
          //setRecordId(res.data.lastId);
          setSaveBtnDisabled(false);
          setTimeout(() => {
            setShowModal(false);
            setLoadingModal(false);
          }, 3000);
        } else {
          setTimeout(() => {
            setShowModal(false);
          }, 3000);
          toast.error(res.data.message);
          setSaveBtnDisabled(false);
          setLoadingModal(false);
          setButtonCamDisabled(false);
        }
      });
    } else {
      toast.warn("Debes tomar una foto primero");
    }
  };
  const createLic = () => {
    return {
      id: 0,
      entityid: 0,
      autorizedid: item ? item.id : 0,
      state: 1,
      createdate: 0,
      expiredate: 0,
      photo: imgSrc,
      printed: 0,
      createdbyid: userid,
      createdbyname: username,
      months:Months
    };
  };
  console.log("meses",months)
  const ItemView = () => {
    return (
      <>
        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Creación de carnet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
              <TextField
                error={ValidationMonts?true:false}
                value={Months}
                helperText={
                  ValidationMonts
                }
                style={{marginTop:10}}
                required
                onChange={(t) => {
                  setMonths(t.target.value)
                }}
                label={"Meses de vencimiento"}
                id="formatted-numberformat-input"
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  inputProps: {
                    prefix: "",
                    thousandSeparator: true,
                  },
                }}
              />
            </View>
            <ToastContainer
              position="bottom-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cerrar
            </Button>
            <Button
              disabled={saveBtnDisabled}
              variant="primary"
              onClick={() => {
                if(Months>0&&Months)
                  save();
                 
                else  
                  setValidationMonts("Verifique el tiempo de vencimiento")
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {loadingModal && (
                  <View style={{ marginRight: 10 }}>
                    <CircularProgress color="#000" size={20} />
                  </View>
                )}
                <div>Crear</div>
              </View>
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const List = () => {
    return licenseList
      .filter((i) => {
        if (!item) return i.id > 0;
        else return i.autorizedid == item.id;
      })
      .map((item, index) => (
        <TouchableOpacity
          style={{ marginBottom: 10 }}
          onPress={() => {
            setCurrentItem(item);
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
            <Grid container spacing={1}>
              <Grid container item xs={12} spacing={3}>
                <React.Fragment>
                  <Grid item xs={3}>
                    <Typography
                      className={classes.cols}
                      variant="title"
                      color="inherit"
                      noWrap
                    >
                      {item.id.padStart(5, "0")}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      className={classes.cols}
                      variant="title"
                      color="inherit"
                      noWrap
                    >
                      {Moment(item.createdate).format("DD/MM/YYYY")}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      className={classes.cols}
                      variant="title"
                      color="inherit"
                      noWrap
                    >
                      {Moment(item.expiredate).format("DD/MM/YYYY")}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      {item.state == 1 ? <RadioChe /> : <RadioUnche />}
                    </View>
                  </Grid>
                </React.Fragment>
              </Grid>
            </Grid>
          </div>
        </TouchableOpacity>
      ));
  };

  const getImg = (evt) => {
    getRequest("img/getimg?img=" + currentItem.photo, token)
      .then((res) => {
        if (evt) evt(res);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
  const Btn = () => {
    return (
      <Button
        onClick={() => {
          setImg("");
          setShowModal(true);
        }}
        variant="outline-secondary"
        size="sm"
      >
        Crear carnet
      </Button>
    );
  };

  // console.log("ruta","https://valehub.com/cvmp/resources/affiliates/printlicense/"+item.entityid+"/"+item.id)
  console.log("/resources/print/" + srcPrint + "/" + entId + "/" + authid);
  return (
    <div className={classes.root}>
      {licenseList.filter((i) => {
        if (item) return i.autorizedid == item.id;
        else return true;
      }).length == 0 ? (
        <>
          <div style={{ float: "left", marginTop: 5, marginRight: 10 }}>
            Este afiliado no tiene registros de carnet emitidos.
          </div>
          <Btn />
        </>
      ) : (
        <>
          <div style={{ marginBottom: 10 }}>
            <Grid container spacing={1}>
              <Grid container item xs={12} spacing={3}>
                <React.Fragment>
                  <Grid item xs={3}>
                    <div className={classes.cols}>CÓDIGO</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.cols}>CREADO</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.cols}>VENCE</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.cols}>ACTIVO</div>
                  </Grid>
                </React.Fragment>
              </Grid>
            </Grid>
            {List()}
          </div>
          {licenseList.filter((i) => {
            if (!item) return i.state == 1;
            else return i.autorizedid == item.id && i.state == 1;
          }).length == 0 && (
            <div>
              <Btn />
            </div>
          )}
        </>
      )}
      {licenseList.filter((i) => {
        if (!item) return i.state == 1;
        else return i.autorizedid == item.id && i.state == 1;
      }).length > 0 && (
        <View style={{ flexDirection: "row" }}>
          <Button
            disabled={
              licenseList.filter((i) => {
                if (!item) return i.printed == 0 && i.state == 1;
                else
                  return (
                    i.autorizedid == item.id && i.printed == 0 && i.state == 1
                  );
              }).length > 0
                ? false
                : true
            }
            onClick={() => {
              setPrint(true);
            }}
            variant="outline-secondary"
            size="sm"
          >
            {licenseList.filter((i) => {
              if (!item) return i.printed == 2 && i.state == 1;
              else
                return (
                  i.autorizedid == item.id && i.printed == 2 && i.state == 1
                );
            }).length > 0 ? (
              <Timer />
            ) : (
              <Print />
            )}{" "}
            Imprimir carnet
          </Button>
          <Button
            disabled={
              licenseList.filter((i) => {
                if (!item) return i.state == 1;
                else return i.autorizedid == item.id && i.state == 1;
              }).length > 0&&srcPrint!="employes/printlicense"
                ? false
                : true
            }
            style={{ marginLeft: 10 }}
            onClick={() => {
              setModalCancel(true);
            }}
            variant="outline-danger"
            size="sm"
          >
            <Cancel />
            Anular carnet
          </Button>
        </View>
      )}
      {ItemView()}
      {setStep && (
        <Button
          style={{ marginTop: 10 }}
          variant="secondary"
          onClick={() => {
            setStep(0);
          }}
        >
          Atras
        </Button>
      )}
      <Modal
        show={modalCancel}
        onHide={() => {
          setModalCancel(false);
        }}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Anulación de carnet</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Seguro que desea anular el carnet en uso?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModalCancel(false);
            }}
          >
            Descartar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              postRequest(
                "affiliates/cancellicense",
                { authorizedid: authid, entityid: entId },
                token
              )
                .then((res) => {
                  if (!res.data.hasError) {
                    setLicenseList(res.data.generatedLicense);
                    toast.success("has cancelado un carnet");
                    setTimeout(() => {
                      setModalCancel(false);
                    }, 1000);
                  }
                })
                .catch((err) => {
                  console.log(
                    "Algo pasó al intentar conectar con el servidor.",
                    err
                  );
                });
            }}
          >
            Si, anular
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={modalDetail}
        onHide={() => {
          setModalDetail(false);
        }}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalle de carnet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentItem && (
            <View style={{ alignItems: "center" }}>
              {loadingImg ? (
                <View
                  style={{
                    width: 200,
                    height: 200,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress color="secondary" size={20} />
                </View>
              ) : (
                <Avatar style={{ width: 200, height: 200 }} src={imgBlob} />
              )}
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View>
                  <div>Código</div>
                  <div>Creado</div>
                  <div>Vence</div>

                  <div>Creado por</div>
                  <div>Estado</div>
                </View>
                <View style={{ marginLeft: 20 }}>
                  <div>{currentItem.id.padStart(5, "0")}</div>
                  <div>
                    {Moment(currentItem.createdate).format("DD/MM/YYYY") +
                      " : " +
                      currentItem.time}
                  </div>
                  <div>
                    {Moment(currentItem.expiredate).format("DD/MM/YYYY")}
                  </div>
                  <div>{currentItem.createdbyname}</div>
                  <div>{currentItem.state == 1 ? "Activo" : "Inactivo"}</div>
                </View>
              </View>
            </View>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setCurrentItem(null);
              setImgBlob("");
            }}
          >
            Salir
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={print}
        onHide={() => {
          setActivarCarnet1(false);
          setPrint(false);
        }}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Impresión de carnet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            scrolling="no"
            id="ifmcontentstoprint"
            title=""
            width="100%"
            height="485"
            src={"/resources/print/" + srcPrint + "/" + entId + "/" + authid}
          >
            {" "}
          </iframe>
        </Modal.Body>
        <Modal.Footer>
          {activarCarnet1 && (
            <Button
              variant="secondary"
              onClick={() => {
                setActivarCarnet2(true);
              }}
            >
              Activar carnet
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => {
              // var content = document.getElementById("divcontents");
              var pri = document.getElementById("ifmcontentstoprint")
                .contentWindow;
              // pri.document.open();
              //pri.document.write(content.innerHTML);
              pri.document.close();
              pri.focus();
              pri.print();
              setActivarCarnet1(true);
            }}
          >
            Imprimir
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setActivarCarnet1(false);
              setPrint(false);
            }}
          >
            Salir
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={activarCarnet2}
        onHide={() => {
          setActivarCarnet2(false);
        }}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Activación de carnet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Este proceso no tiene reverso, asegurate de haber impreso ambos
            lados del carnet
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setActivarCarnet2(false);
            }}
          >
            Descartar
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              postRequest(
                "affiliates/activatelicense",
                { authorizedid: authid, entityid: entId },
                token
              )
                .then((res) => {
                  if (!res.data.hasError) {
                    setLicenseList(res.data.generatedLicense);
                    toast.success("has activado un carnet");
                    setActivarCarnet2(false);
                    setActivarCarnet1(false);
                    setPrint(false);
                  }
                })
                .catch((err) => {
                  console.log(
                    "Algo pasó al intentar conectar con el servidor.",
                    err
                  );
                });
            }}
          >
            Si, ya imprimi ambos lados
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
      />
    </div>
  );
}
const mapState = ({ authStorage }) => {
  return {
    token: authStorage.token,
    userid: authStorage.user.id,
    username: authStorage.user.name,
    months:authStorage.params.filter(i=>i.param=="licenseexpiremonths")[0].value
  };
};

export default connect(mapState)(licenseModule);
