import React, { useState } from "react";
import AuthorizedPerson from "./authorized/authorizedPerson";
export default function licenseCompany(props) {
  return (
    <div>
      <AuthorizedPerson {...props} />
    </div>
  );
}
