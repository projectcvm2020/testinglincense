import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import LicenseModule from "./licenseModule";
export default function licensePerson({
  licenseList,
  setLicenseList,
  isNew,
 
  setRecordId,
  submit,
  recordId
}) {
  return (
    <>
      <LicenseModule
        licenseList={licenseList}
        setLicenseList={setLicenseList}
        isNew={isNew}
        setRecordId={setRecordId}
        submit={submit}
        recordId={recordId}
        type={0}
        srcPrint="affiliates/printlicense"
      />
    </>
  );
}
