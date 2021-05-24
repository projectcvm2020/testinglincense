import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Payments from "./payments";
import License from "./license";
import Debtor from "./payments/debtor"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";
const Accordion = withStyles({
  root: {
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 1,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: 1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = useState(null);
  const [currentReport, setCurrentReport] = useState(null);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const Step = () => {
    switch (currentReport) {
      case "dialyPayMin":
        return (
          <Payments
            title={"Reporte de arrime"}
            daily={true}
            transactiontype="PAGAF"
            setCurrentReport={setCurrentReport}
          />
        );
      case "periodPayMin":
        return (
          <Payments
            title={"Reporte de arrime"}
            daily={false}
            transactiontype="PAGAF"
            setCurrentReport={setCurrentReport}
          />
        );
      case "dialyPayDiv":
        return (
          <Payments
            title={"Reporte de divisa"}
            daily={true}
            transactiontype="PAGCA"
            setCurrentReport={setCurrentReport}
          />
        );
      case "periodPayDiv":
        return (
          <Payments
            title={"Reporte de divisa"}
            daily={false}
            transactiontype="PAGCA"
            setCurrentReport={setCurrentReport}
          />
        );
      case "LicenseList":
        return (
          <License
            title={"Listado de carnet"}
            setCurrentReport={setCurrentReport}
          />
        );
    }
  };
  const Body = (
    <div>
      <Accordion
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Resumen</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: "100%" }}>
            <span style={{ fontWeight: "bold" }}>Pagos</span>
            <Divider />
            <ListItem
              button
              divider
              onClick={() => setCurrentReport("dialyPayMin")}
            >
              <span>Diario de pagos (Min.)</span>
            </ListItem>
            <ListItem
              button
              divider
              onClick={() => setCurrentReport("periodPayMin")}
            >
              <span>Pagos por período (Min.)</span>
            </ListItem>
            <ListItem
              button
              divider
              onClick={() => setCurrentReport("dialyPayDiv")}
            >
              <span>Diario de pagos (Div.)</span>
            </ListItem>
            <ListItem
              button
              divider
              onClick={() => setCurrentReport("periodPayDiv")}
            >
              <span>Pagos por período (Div.)</span>
            </ListItem>
            <ListItem button divider component={Link} to={"/debtorlist"}>
              <span>Deudores </span>
            </ListItem>
           

            <div style={{ fontWeight: "bold", marginTop: 10 }}>Transito</div>
            <Divider />
            <ListItem button divider>
              <span>Reporte diario</span>
            </ListItem>
            <ListItem button divider>
              <span>Reporte por período</span>
            </ListItem>
            <ListItem button divider>
              <span>Reporte por afiliado</span>
            </ListItem>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          aria-controls="panel2d-content"
          id="panel2d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Afiliados</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: "100%" }}>
            <ListItem
              button
              divider
              onClick={() => setCurrentReport("LicenseList")}
            >
              <span>Listado de carnet</span>
            </ListItem>
            <ListItem button divider>
              <span>Estado de cuenta</span>
            </ListItem>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          aria-controls="panel3d-content"
          id="panel3d-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>Listas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada
            lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      {currentReport && <Step />}
    </div>
  );
  useEffect(()=>{console.log("dkdfjfjfjfj")},[])
  return (
    <Router basename="/cvm/lic/reports">
      <Switch>
      <Route exact path="/">
          {Body}
        </Route>
        <Route path="/debtorlist">
          <Debtor/>

        </Route>

        
      </Switch>
    </Router>
  );
}
