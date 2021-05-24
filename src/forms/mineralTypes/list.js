import React from 'react'
import {TouchableOpacity} from 'react-native-web'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    borderWidth:1,
    borderColor:"#787878",
    padding:10,
    borderRadius:3,marginTop:5
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
}));
export default function List({item,index}){
    const classes = useStyles();
   
    function FormRow() {
        return (
          <React.Fragment>
            <Grid item xs={6}>

            <div>{item.name}</div>
            </Grid>
            
            <Grid item xs={6}>
              <div>{item.active==1?"Activo":"Inactivo"}</div>
            </Grid>
          </React.Fragment>
        );
      }
    return <div className={classes.root}style={{backgroundColor:index % 2 === 0 ?"#EAECF1":"#F2F4F7"}}>
               
                <Grid container spacing={1}>
                    <Grid container item xs={12} spacing={3}>
                        <FormRow />
                    </Grid>
                    
                </Grid>
               
            </div>
}
