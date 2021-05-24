import React, { useState,useEffect } from "react";
import { Modal } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { View } from "react-native-web";
import { getParish, getSector } from "../../../../components/loadSelect";

import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      width: "45%",
    },
  
  },
  
}));
export default function payments({ setCurrentReport, title }) {
  const classes = useStyles();
  const [since, setSince] = useState(null);
  const [until, setUntil] = useState(null);
  const [print, setPrint] = useState(false);
  const [validating, setValidating] = useState(false);
  const [sector, setSector] = useState([]);
  const [parish, setParish] = useState([]);
  const [selectedParish, setSelectedParish] = useState("0");
  const [selectedSector, setSelectedSector] = useState("0");
  const [loadingSector, setLoadingSector] = useState(false);

  useEffect(() => {
    getParish(setParish);
  }, []);
  useEffect(() => {
    getSector(setSector, setLoadingSector, selectedParish);
  }, [selectedParish]);
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
    <>
      <Modal
        show={true}
        onHide={() => {
          setCurrentReport(null);
        }}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Listado de carnet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!print ? (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <div >
                <TextField
                  style={{width:180,marginRight:5 }}
                  id="standard-basic"
                  label={"Fecha desde"}
                  error={validating && !since ? true : false}
                  type="date"
                  value={since}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  onChange={(t) => {
                    setSince(t.target.value);
                  
                  }}
                />

                <TextField
                   style={{width:180 }}
                  id="standard-basic"
                  label={"Fecha hasta"}
                  error={validating && !until ? true : false}
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
              </div>
              <div>
                <TextField
                 id="standard-basic"
                 
                  style={{width:180,marginRight:5 }}
                  select
                  required
                  label="Municipio"
                  value={selectedParish}
                  onChange={(t) => {
                    setSelectedParish(t.target.value)
                  }}
                >
                  <MenuItem key={1} value={"0"}>
                   Seleccionar
                  </MenuItem>
                  {ListSelect(parish)}
                </TextField>
                {sector.length > 0 ? (
                  <TextField
                    id="standard-basic"
                    style={{ width:180}}
                    select
                    required
                    label="Sector"
                    value={loadingSector ? "Consultando..." : selectedSector}
                    onChange={(t) => {
                      setSelectedSector(t.target.value)
                    }}
                  >
                    {ListSelect(sector)}
                  </TextField>
                ) : (
                  <TextField
                    disabled
                    st style={{ width:180}}
                    id="standard-basic"
                    label="Sector"
                    value={loadingSector ? "Consultando..." : "N/A"}
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
                  "/resources/print/affiliates/report/license/" +

                  selectedSector +
                  "/" +
                  JSON.stringify({ since, until }) +
                  "/70/" +
                  title
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
                  "/resources/print/affiliates/report/license/" +
                  selectedSector +
                  "/" +
                  JSON.stringify({ since, until }) +
                  "/180/" +
                  title
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
              
              setValidating(true);
              if (since && until )
                setPrint(!print);
               
            }}
          >
            {!print ? "Consultar" : "Volver"}
          </Button>
          {print && (
            <Button
              variant="secondary"
              onClick={() => {
                var iframe = document.getElementById("ifmcontentstoprint");
                var pri = iframe.contentWindow;
                pri.focus();
                pri.print();
              }}
            >
              Imprimir
            </Button>
          )}
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
