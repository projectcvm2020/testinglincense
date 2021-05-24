import React, { useState, useEffect, useRef, useCallback } from "react";
import { View } from "react-native-web";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest, getRequest } from "../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dni from "./dni";
import CompanyInfo from "./companyInfo";
import Carnet from "./license";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, Redirect, useParams, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import UserAccount from "../../screens/lic/affiliate/userAccount/userAcount";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Folder from "@material-ui/icons/Print";
import ListItem from "@material-ui/core/ListItem";

import { Modal } from "react-bootstrap";

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
  card: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "80%",
    },
  },
  print: { zoom: "180%" }
}));

function detail({ token, userId }) {
  let params = useParams();
  const classes = useStyles();
  const [print, setPrint] = useState(false)
  const [recordId, setRecordId] = useState(
    !params.recordId ? null : params.recordId
  );
  //const [step, setStep] = useState(2);
  const [step, setStep] = useState(!params.recordId ? 0 : 1);
  const [authorizedPersons, setAuthorizedPersons] = useState([]);
  const [licenseList, setLicenseList] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [commitRequest, setCommitRequest] = useState(null);
  const [showState, setShowState] = useState(false);
  const [printBanner, setPrintBanner] = useState(false);
  const [initState, setInitState] = useState({
    legalrepname: "",
    legalreplastname: "",
    legalrepphonenumber: "",
    legalrepemail: "",
    emailverivyfied: "",
    entitylastname: "",
    legalrepdni: "",
    legalrepgender: "",
    entitytype: "N",
    entityname: "",
    entityrif: "",
    entitydni: "",
    entitydirection: "",
    entityemail: "",
    entitygender: "",
    entityphonenumber: "",
    legalrepdirection: "",
    rum: "",
    parish: "",
    sector: "",
    validkilograms: "",
    mineraltype: 0,
    active: 1,
    status: 1,
    expiredate: "",
    creationdate: "",
    homedirectionverify: false,
    companydirectionverify: false,
    firstpaymentday: "",
    dateofbird: "",
    activitytype: "",
    activitysubtype: "",
    employeenumber: "",
    extractmethod: "",
    financmethod: "",
    ambientimpact: false,
    legacypermisions: "",
    entitydateofbirth: "",
    createdbyid: userId,
    createdbyname: "",
    legalrepdnitype: "V",
    cvmposition: null,
    percentpayment: "1",
    paymentvalue: "",
    circulationaccesibility: ""

  });

  useEffect(() => {
    if (recordId) {
      setLoadingFetch(true);
      getRequest("affiliates/getAffiliate?id=" + recordId, token)
        .then((res) => {
          console.log("result", res);
          setLicenseList(res.data.licenseList);
          setInitState(res.data.userData);
          setAuthorizedPersons(res.data.authorizedList);
          setLoadingFetch(false);
        })
        .catch((err) => {
          console.log("Algo pasó al intentar conectar con el servidor.", err);
        });
    }
  }, [recordId]);
  useEffect(() => {
    if (params.recordId) setRecordId(params.recordId);
  }, []);
  const submit = (lic = null, authorized = null, evt = null) => {
    console.log("r1", recordId);
    postRequest(
      recordId ? "affiliates/updateAffiliate" : "affiliates/createAffiliate",
      {
        data: initState,
        license: lic,
        authorized: authorized,
      },
      token
    )
      .then((res) => {
        //setCommitRequest(res);
        if (!res.data.hasError && res.data.recordId)
          setRecordId(res.data.recordId);
        if (evt) evt(res);
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };

  let Stps = () => {
    switch (step) {
      case 0:
        return (
          <Dni
            setInitState={setInitState}
            setStep={setStep}
            values={initState}
          />
        );

      case 1:
        return (
          <CompanyInfo
            isNew={recordId ? false : true}
            setStep={setStep}
            values={initState}
            setInitState={setInitState}
            submit={submit}
            loadingFetch={loadingFetch}
          />
        );
      case 2:
        return (
          <Carnet
            isNew={recordId ? false : true}
            setStep={setStep}
            values={initState}
            setInitState={setInitState}
            submit={submit}
            licenseList={licenseList}
            setLicenseList={setLicenseList}
            setRecordId={setRecordId}
            recordId={recordId}
            authorizedPersons={authorizedPersons}
            setAuthorizedPersons={setAuthorizedPersons}
            initState={initState}
          />
        );
      case 3:
        return (
          <Redirect
            to={{
              pathname: "/affiliate",
              state: commitRequest,
            }}
          />
        );
      case 4:
        <></>;
      default:
        break;
    }
  };

  return (
    <>
      <div className={classes.container1}>
        {step > 0 ? (
          <Card className={classes.card}>
            <CardContent>
              <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                  <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link
                          eventKey="first"
                          onClick={() => {
                            setShowState(false);
                          }}
                        >
                          Perfil
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="second"
                          onClick={() => {
                            setShowState(true);
                          }}
                        >
                          Estado de cuenta
                        </Nav.Link>
                      </Nav.Item>
                      <div>
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <div className={classes.heading}>Documentos</div>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div>
                              <ListItem
                                component={Link}
                                // to="/resources/affiliates/printcertificate/0"
                                //target="_blank"
                                button
                                onClick={() => {
                                  setPrint(true);
                                }}

                              >
                                <Folder />
                                Certificado
                            </ListItem>
                              <ListItem
                                button
                                onClick={() => {
                                  setPrintBanner(true);
                                }}

                              >
                                <Folder />
                                Banner
                            </ListItem>
                            </div>
                          </AccordionDetails>
                        </Accordion>

                      </div>
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="first">{Stps()}</Tab.Pane>
                      <Tab.Pane eventKey="second">
                        {showState && <UserAccount affiliateId={recordId} />}
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </CardContent>
          </Card>
        ) : (
          Stps()
        )}
      </div>
      <Modal
        show={print}
        onHide={() => {

          setPrint(false);
        }}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Impresión de Certificado</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <iframe scrolling="yes" title=""
            width="100%" height="485" src={"/resources/print/affiliates/printcertificate/" + recordId + "/70"}> </iframe>
          <iframe style={{ display: "none" }} scrolling="yes" id="ifmcontentstoprint" title=""
            width="100%" height="485" src={"/resources/print/affiliates/printcertificate/" + recordId + "/180"}> </iframe>
          <div id="divcontents" />
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

              setPrint(false);
            }}
          >
            Salir
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={printBanner}
        onHide={() => {

          setPrintBanner(false);
        }}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Impresión de Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <iframe scrolling="yes" title=""
            width="100%" height="485" src={"/resources/print/affiliates/printbanner/" + recordId + "/70"}> </iframe>
          <iframe style={{ display: "none" }} scrolling="yes" id="ifmcontentstoprint" title=""
            width="100%" height="485" src={"/resources/print/affiliates/printbanner/" + recordId + "/180"}> </iframe>
          <div id="divcontents" />
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

              setPrintBanner(false);
            }}
          >
            Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
const mapStateToProps = ({ authStorage }) => {
  return {
    token: authStorage.token,
    userId: authStorage.user.id,
  };
};
export default connect(mapStateToProps)(detail);
