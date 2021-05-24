import React, { useState, useEffect,  } from "react";
import { View } from "react-native-web";
import { makeStyles, responsiveFontSizes } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { postRequest } from "../../utility/net/urls";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import { connect } from "react-redux";
import { validateRegex,validateDocument } from "../../utility/formValidation";
import { set } from "date-fns";
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
  }));
 function Dni({ values,setStep ,token,setInitState}) {
  const classes = useStyles();
  const [step, SetStep] = useState(0);
  const [validDocument, setValidDocument] = useState(0);
  const [personType, setPersonType] = useState("V");
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);

  const search = (value) => {
  //  setDni(value);
    const timeout = setTimeout(() => {
     
      validateDocument(value,setLoading,setValidDocument)   
    }, 100);
    return () => clearTimeout(timeout);
  };

  
 
  const TypePerson = () => {
    return (
    
      <View>
        <div>
        <form className={classes.root} autoComplete="off">
          {step==0&&
          <TextField
            style={{width:50,marginTop:24}}
            id="standard-select-currency"
            select
            
            value={personType}
            onChange={(v) => {
             
              setDni("")
              setPersonType(v.target.value);
              
            }}
          >
            <MenuItem key={0} value={"J"}>
              J
            </MenuItem>

            <MenuItem key={1} value={"V"}>
              V
            </MenuItem>
            <MenuItem key={2} value={"E"}>
              E
            </MenuItem>
            <MenuItem key={3} value={"G"}>
              G
            </MenuItem>
          </TextField>}
          <TextField
            error={
              false
            }
            id="standard-error-helper-text"
            helperText={
              ""
            }
            required
            label={( step==0&& ['E', 'V'].indexOf(personType) >= 0 )?"RIF personal":
                   "RIF de empresa"

                    }
            value={dni}
            onKeyPress={(e) => {
                validateRegex(e, /[0-9]|\./);
              }}
            onChange={(t) => {
              setValidDocument(0);
             
              setDni(t.target.value);
              

              setLoading(true);
              search({value:t.target.value,entitytype:personType}); 
            }}
          />
          </form>
        </div>
      </View>
    );
  };
 
  const delay = ms => new Promise(res => setTimeout(res, ms));
  return (
    <div className={classes.container1}
        style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)'
      }}
    >  
    <View>
      <Card>
        <CardContent>
         
          {TypePerson()}
          
          <div>
          <View style={{ flexDirection: "row" }}>
            <Button
              type="submit"
             
              disabled={validDocument == 2 || dni == "" ? true : false}
              style={{ marginTop: 20 }}
              variant="contained"
              color="primary"
              //^[A-Za-z0-9_.]+$
              onClick={() => {
                
                validateDocument(dni,setLoading,setValidDocument,() => {
                  
                  setInitState(Object.assign({},values,{entitytype:personType,entityrif:dni}))
                  setStep(1)
                   
                  })   
                
              }}
            >
              Siguiente
            </Button>
            {loading && (
                <View style={{ paddingTop: 30, paddingLeft: 20 }}>
                  <CircularProgress color="secondary" size={20} />
                </View>
              )}
           </View>  
          </div>
        </CardContent>
      </Card>
    </View>
    </div>
  );
}
const mapStateToProps = ({ authStorage }) => {
    return {
      token: authStorage.token,
    };
  };
  export default connect(mapStateToProps)(Dni);
