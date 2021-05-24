import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native-web";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { Button, Modal } from "react-bootstrap";
import { getRequest, postRequest } from "../../../../utility/net/urls";
import Typography from "@material-ui/core/Typography";
import Moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from "@material-ui/icons/Folder";
import { ToastContainer, toast } from "react-toastify";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { NumberFormatCustom } from "../../../../utility/formValidation";
import Webcam from "react-webcam";
import { toBase64 } from "../../../../utility/img";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Print from "@material-ui/icons/Print";
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import ModalConfirm from '../../../../components/modalConfirm'
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  cols: {
    padding: theme.spacing(1),
    textAlign: "flex-start",
    alignItems: "flex-start",
    color: theme.palette.text.secondary,
    marginLeft: 5,
    fontSize: 12,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));
const StyledMenuItem = withStyles((theme) => ({
  root: {

    
  },
}))(MenuItem);
function estadoCuenta({ affiliateId, token, userid }) {
  const webcamRef = React.useRef(null);
  const classes = useStyles();
  const [validating, setValidating] = useState(false);
  const [records, setRecords] = useState([]);
  const [modalpago, setModalPago] = useState(false);
  const [ammount, setAmount] = useState(null);
  const [tipopago, setTipopago] = useState("0");
  const [formadepago, setFormaDePago] = useState("0");
  const [detallePago, setDetallePago] = useState(null);
  const [printBild, setPrintBild] = useState(false);
  const [itemToPrint, setItemToPrint] = useState(null);
  const [imgSrc, setImg] = useState("");
  const [buttonCamDisabled, setButtonCamDisabled] = useState(false);
  const [sendingPayment, setSendingPayment] = useState(false);
  const [source, setSource] = useState(null);
  const [offSet, setOffSet] = useState(10);
  const [limit, setLimit] = useState(10);
  const [limitOrg] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [showReverseModal, setShowReverseModal] = useState(false);
  const [showReverseModal2, setShowReverseModal2] = useState(false);
  const chooseImage = (event) => {
    toBase64(event.target.files[0], (src) => {
      setImg(src);
    });
  };
  const videoConstraints = {
    width: 171,
    height: 200,
    facingMode: "user",
  };
  const openFileInput = () => {
    document.getElementById("hiddenFileInput").click();
  };
  const capture = React.useCallback(() => {
    setImg(webcamRef.current.getScreenshot());
  }, [webcamRef]);
  useEffect(() => {
    if (itemToPrint) {
      if (itemToPrint.transactiontype == "PAGAF") setSource("printbild");
      if (itemToPrint.transactiontype == "PAGCA") setSource("receipt");
      setPrintBild(true);
    }
  }, [itemToPrint]);
  useEffect(() => {
    if (affiliateId) {
      //setLoadingFetch(true);

      getRequest(
        "affiliateaccount/account?userid=" +
          affiliateId +
          "&offset=" +
          offSet +
          "&limit=" +
          limit,
        token
      )
        .then((res) => {
          console.log("result", res);
          setRecords(res.data);
        })
        .catch((err) => {
          console.log("Algo pasó al intentar conectar con el servidor.", err);
        });
    }
  }, [offSet]);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event,item) => {
  
    setAnchorEl(event.currentTarget);
    setCurrentItem(item);
  };
  useEffect(()=>{
   if(currentItem)
    setAnchorEl(currentItem.currentTarget);
    
  },[currentItem])
  const List = () => {
    {
      /* onPress={() => {
        if (
          item.transactiontype == "PAGAF" ||
          item.transactiontype == "PAGCA"
        )
          setItemToPrint(item);
      }}*/
    }
    return records.Transactions.map((item, index) => {
    
      return (
        <TableRow key={index}>
          <TableCell  align="left">
            
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity style={{marginTop:-3}}onClick={(e)=>
                  
                  {
                    if(item.reversed==0)
                    setCurrentItem({currentTarget:e.currentTarget,item:item})
                  }

                }>
                <MoreVertIcon />
                </TouchableOpacity>
                <span>{Moment(item.date).format("DD/MM/YYYY")}</span>
              </View>
            
          </TableCell>
          <TableCell align="left"> {item.reversed==1?item.description+"/reversado":item.description}</TableCell>
          <TableCell align="right">
            {item.transactiontype == "PAGAF" || item.transactiontype == "REVCBRAF"|| item.transactiontype == "REVCBRCA"
              ? "Gr." + item.cred
              : item.transactiontype == "PAGCA"
              ? "$." + item.cred
              : ""}
          </TableCell>
          <TableCell align="right">
            {item.transactiontype == "CBRAF" || item.transactiontype == "REVPAGAF"
              ? "Gr." + item.deb
              : item.transactiontype == "CBRCA" || item.transactiontype == "REVPAGCA"
              ? "$." + item.deb
              : ""}
          </TableCell>
        </TableRow>
      );
    });
  };
  console.log(currentItem);
  return (
    
    <div className={classes.root}>
      {currentItem&&<StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {["PAGAF","PAGCA"].indexOf(currentItem.item.transactiontype)>=0&&
        <StyledMenuItem 
          onClick={()=>{
            handleClose()
            setItemToPrint(currentItem.item)
            console.log(currentItem.item)
          }}
        >
          <ListItemIcon >
            <Print fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Imprimir" />
        </StyledMenuItem>
        }
        {["PAGAF","PAGCA","CBRCA"].indexOf(currentItem.item.transactiontype)>=0&&
        <StyledMenuItem
           onClick={()=>{
            handleClose()
            setShowReverseModal(true)
          
           
          }}
        >
          <ListItemIcon>
            <SwapHorizIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Reverso" />
        </StyledMenuItem>
      
        }
       {["CBRAF"].indexOf(currentItem.item.transactiontype)>=0&&
        <StyledMenuItem
           onClick={()=>{
            handleClose()
            setShowReverseModal(true)
           
          }}
        >
          <ListItemIcon>
            <SwapHorizIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Reajustar" />
        </StyledMenuItem>
      
        }
      </StyledMenu>}
      <ModalConfirm 
        show={showReverseModal}
        acceptAction={()=>{

          postRequest(
            "affiliateaccount/reversepayment",
            {
              entityid: affiliateId,
              id: currentItem.item.id,
             
             
            },
            token
          )
            .then((res) => {
              if (!res.data.hasError) {
                setRecords(res.data.accountData);
                toast.success("Has realizado un reverso");
                
                setShowReverseModal(false)
              } else toast.error("Fallo al emitir el reverso");
              setSendingPayment(false)
            })
            .catch((err) => {
              console.log(
                "Algo pasó al intentar conectar con el servidor.",
                err
              );
            });

        }}
        denyAction={()=>setShowReverseModal(false)}
        acceptTitle={"Reversar"}
        denyTitle={"Descartar"}
        hideAction={()=>setShowReverseModal(false)}
        title={"Reverso"}
        text={"Seguro que desea reversar este documento??"}
      />
      
      <View style={{ marginTop: 20 }}>
        <h5 style={{}}>Estado de cuenta</h5>
        <Divider />
        {records.Transactions && (
          <>
            <TableContainer >
              <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell  align="left">Fecha</TableCell>
                    <TableCell align="left">Concepto</TableCell>
                   
                    <TableCell align="right">Crédito</TableCell>
                    <TableCell align="right">Débito</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{List()}</TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </View>
      <div style={{}}>
        <div style={{ float: "left", position: "absolute", right: 20, top: 5 }}>
          <IconButton
            onClick={() => {
              if (offSet < Number(records.rowCount)) {
                if (Number(records.rowCount) - (offSet + limitOrg) < 0)
                  setLimit(
                    limitOrg + (Number(records.rowCount) - (offSet + limitOrg))
                  );

                setOffSet(
                  Number(records.rowCount) - (offSet + limitOrg) < 0
                    ? Number(records.rowCount) -
                        (Number(records.rowCount) - (offSet + limitOrg))
                    : offSet + limitOrg
                );
              }
            }}
          >
            <ArrowBackIos style={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            onClick={() => {
              setLimit(limitOrg);
              setOffSet(
                offSet - limitOrg < limitOrg ? limitOrg : offSet - limitOrg
              );
            }}
          >
            <ArrowForwardIos style={{ fontSize: 20 }} />
          </IconButton>
          <span>
            {Number(records.rowCount) - (offSet - limitOrg) - limitOrg + 1 < 0
              ? 1
              : Number(records.rowCount) - (offSet - limitOrg) - limitOrg + 1}
            -{Number(records.rowCount) - (offSet - limitOrg)} de{" "}
            {records.rowCount}
          </span>
        </div>
        <div style={{ clear: "both" }} />
      </div>

      <h5>Totales de movimientos</h5>
      <Divider />
      {records.Total && (
        <>
          <div style={{ marginTop: 10 }}>
            <div style={{ width: "60%", float: "left" }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  Total debitos mineral
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "right" }}>
                    {records.Total.debitmin}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Total débitos divisas
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "right" }}>
                    {records.Total.debitdiv}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Total créditos mineral
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "right" }}>
                    {records.Total.creditmin}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Total créditos divisas
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "right" }}>
                    {records.Total.creditdiv}
                  </div>
                </Grid>
              </Grid>
            </div>
            <Button
              style={{ marginLeft: 20 }}
              variant="secondary"
              onClick={() => {
                setModalPago(true);
              }}
            >
              Realizar pago
            </Button>
          </div>
          <div style={{ clear: "both" }}></div>
          <div style={{ marginTop: 10 }}>
            <h5>Saldos</h5>
            <Divider />
            <div style={{ width: "60%", marginTop: 10 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  Saldo mineral
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "right" }}>
                    {records.Total.saldomin + ""}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  Saldo divisa
                </Grid>
                <Grid item xs={6}>
                  <div style={{ textAlign: "right" }}>
                    {records.Total.saldodiv}
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </>
      )}

      <Modal
        show={modalpago}
        onHide={() => {
          setModalPago(false);
        }}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pago de deuda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <div>
              <TextField
                id="standard-select-currency"
                style={{ width: "25ch" }}
                select
                label="Tipo de pago"
                value={tipopago}
                onChange={() => {}}
                onChange={(t) => {
                  setTipopago(t.target.value);
                }}
              >
                <MenuItem key={0} value={"0"}>
                  Mineral
                </MenuItem>

                <MenuItem key={1} value={"1"}>
                  Divisa
                </MenuItem>
              </TextField>
            </div>

            {tipopago == "1" && (
              <div>
                <TextField
                  id="standard-select-currency"
                  style={{ width: "25ch" }}
                  select
                  label="Forma de pago"
                  value={formadepago}
                  onChange={() => {}}
                  onChange={(t) => {
                    setFormaDePago(t.target.value);
                  }}
                >
                  <MenuItem key={0} value={"0"}>
                    Efectivo
                  </MenuItem>

                  <MenuItem key={1} value={"1"}>
                    Transferencia divisa
                  </MenuItem>
                  <MenuItem key={1} value={"2"}>
                    Transferencia Bs al cambio
                  </MenuItem>
                </TextField>
              </div>
            )}

            <div>
              <TextField
                label="Monto"
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
                    prefix: tipopago == 0 ? "Gr." : "$ ",
                    thousandSeparator: true,
                  },
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
                style={{ width: "25ch" }}
                onChange={(t) => {
                  setDetallePago(t.target.value);
                }}
              />
            </div>
            {tipopago == 0 && (
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
              </View>
            )}
          </View>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            disabled={sendingPayment}
            onClick={() => {
              setModalPago(false);
            }}
          >
            Descartar
          </Button>

          <Button
            disabled={sendingPayment}
            variant="primary"
            onClick={() => {
              setValidating(true);
              if (!(ammount == null || ammount <= 0)) {
                setSendingPayment(true);
                setValidating(false);
                postRequest(
                  "affiliateaccount/sendpayment",
                  {
                    entityid: affiliateId,
                    ammount: ammount,
                    paytype: tipopago,
                    paymethod: formadepago,
                    detail: detallePago,
                    imgSrc: tipopago == 0 ? imgSrc : null,
                    detail2:
                      (detallePago != "" ? " - " : "") + formadepago == "0"
                        ? "Efectivo"
                        : formadepago == "1"
                        ? "Transferencia divisa"
                        : "Transferencia Bs al cambio",
                  },
                  token
                )
                  .then((res) => {
                    if (!res.data.hasError) {
                      setRecords(res.data.accountData);
                      toast.success("Has realizado un pago");
                      setAmount(0);
                      setTipopago("0");
                      setFormaDePago("0");
                      setDetallePago("");
                      setModalPago(false);
                    } else toast.error("Fallo al emitir el pago");
                    setSendingPayment(false);
                  })
                  .catch((err) => {
                    console.log(
                      "Algo pasó al intentar conectar con el servidor.",
                      err
                    );
                  });
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
      <Modal
        show={printBild}
        onHide={() => {
          setPrintBild(false);
          setItemToPrint(null)
          setCurrentItem(null)
        }}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Impresión de Recibo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemToPrint && (
            <>
              <iframe
                scrolling="yes"
                title=""
                width="100%"
                height="485"
                src={
                  "/resources/print/affiliates/" +
                  source +
                  "/" +
                  itemToPrint.id +
                  "/70/"
                }
              >
                {" "}
              </iframe>
              <iframe
                style={{ display: "none" }}
                scrolling="yes"
                id="ifmcontentstoprint"
                title=""
                width="100%"
                height="485"
                src={
                  "/resources/print/affiliates/" +
                  source +
                  "/" +
                  itemToPrint.id +
                  "/180"
                }
              >
                {" "}
              </iframe>
              <div id="divcontents" />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              //var content = document.getElementById("divcontents");
              var iframe = document.getElementById("ifmcontentstoprint");
              var pri = iframe.contentWindow;

              //pri.document.open();
              //pri.document.write(content.innerHTML);
              //pri.document.close();

              pri.focus();
              pri.print();
            }}
          >
            Imprimir
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setPrintBild(false);
             
            }}
          >
            Salir
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
      <input
        type="file"
        id="hiddenFileInput"
        style={{ display: "none" }}
        onChange={chooseImage}
      />
    </div>
  );
}
const stateMaped = ({ authStorage }) => {
  return {
    token: authStorage.token,
    userid: authStorage.user.id,
  };
};
export default connect(stateMaped)(estadoCuenta);
