import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Login from "../screens/login";
import PasswordRecovery from "../screens/login/passwordRecovery";
import Profile from "../screens/profile";
import Home from "../screens";
import { connect } from "react-redux";

import LincencePrint from '../forms/affiliates/license/licenseView'
import PrintCertificate from '../forms/affiliates/license/printCertificate'
import PrintBanner from '../forms/affiliates/license/printBanner'
import PrintBild from '../screens/lic/affiliate/userAccount/printBild'
import Receipt from '../screens/lic/affiliate/userAccount/receipt'
import PaymentReport from '../screens/lic/reports/payments/report'
import LincencePrintEploye from '../forms/internaUsage/employe/licenseView'
import LicenseReport from '../screens/lic/reports/license/report'
import Cvm from '../screens/cvm'
function indexNav({ token }) {


  return (
    <Router  >


      {token ? (
        <Switch>


          <Route path="/cvm">
            <Cvm />
          </Route>
          <Route path="/resources/print/affiliates/printlicense/:recordId/:authid">
            <LincencePrint />
          </Route>
          <Route path="/resources/print/affiliates/printcertificate/:recordId/:zoom">
            <PrintCertificate />
          </Route>
          <Route path="/resources/print/affiliates/printbanner/:recordId/:zoom">
            <PrintBanner />
          </Route>
          <Route path="/resources/print/affiliates/printbild/:recordId/:zoom">
            <PrintBild />
          </Route>
          <Route path="/resources/print/affiliates/receipt/:recordId/:zoom">
            <Receipt />
          </Route>
          <Route path="/resources/print/affiliates/report/payment/:transactiontype/:daily/:date/:zoom/:title">
            <PaymentReport />
          </Route>
          <Route path="/resources/print/employes/printlicense/:recordId/:authid">
            <LincencePrintEploye />
          </Route>
          <Route path="/resources/print/affiliates/report/license/:sector/:date/:zoom/:title">
            <LicenseReport />
          </Route>
          <Route path="/">
            <Cvm />
          </Route>
        </Switch>

      ) : (
        <Switch>


          <Route path="/login">
            <Login />
          </Route>
          <Route path="/passwordrecovery">
            <PasswordRecovery />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      )}

      {/*<Route path="/">
          <Home />
        </Route>*/}

    </Router>
  );
}
const mapStateToProps = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};

export default connect(mapStateToProps)(indexNav);
