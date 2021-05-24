import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { View } from "react-native-web";
export default function payments({ setCurrentReport, daily,transactiontype ,title }) {
  const [since, setSince] = useState(null);
  const [until, setUntil] = useState(null);
  const [print, setPrint] = useState(false);
  const [validating, setValidating] = useState(false);
  
  console.log("/resources/print/affiliates/report/payment/"+transactiontype+"/"+daily+"/"+JSON.stringify({since,until})+
  "/180/"+title)
  
  return (
    <>
      <Modal
        show={true}
        onHide={() => {
          setCurrentReport(null);
        }}
        animation={true}
       
      >
        <Modal.Header closeButton>
          <Modal.Title>Pagos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!print ? (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <div>
                <TextField
                  style={{ margin: 10 }}
                  id="date"
                  label={daily ? "Fecha" : "Fecha desde"}
                  error={validating&&!since?true:false}
                  type="date"
                  value={since}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  onChange={(t) => {
                    setSince(t.target.value);
                    if(daily)
                      setUntil(t.target.value)
                  }}
                />
                {!daily && (
                  <TextField
                    style={{ margin: 10 }}
                    id="date"
                    label={"Fecha hasta"}
                    error={validating&&!until?true:false}
                    type="date"
                    value={until}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    onChange={(t) => {
                      setUntil(t.target.value);
                    }}
                  />
                )}
              </div>
            </View>
          ) : (
            <>
              <iframe
                scrolling="yes"
                title=""
                width="100%"
                height="485"
                src={
                  "/resources/print/affiliates/report/payment/"+transactiontype+"/"+daily+"/"+JSON.stringify({since,until})+
                  "/70/"+title
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
                  "/resources/print/affiliates/report/payment/"+transactiontype+"/"+daily+"/"+JSON.stringify({since,until})+
                  "/180/"+title
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
              setValidating(true)
              if((since&&until&&!daily)||(since&&daily))
                setPrint(!print);
            }}
          >
            {!print?"Consultar":"Volver"}
          </Button>
          {print&&<Button
            variant="secondary"
            onClick={() => {
              
               var iframe = document.getElementById("ifmcontentstoprint");
               var pri = iframe.contentWindow;
               pri.focus();
               pri.print();
            }}
          >
            Imprimir
          </Button>}
          <Button
            variant="primary"
            onClick={() => {
              setCurrentReport(null);
            }}
          >
            Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
