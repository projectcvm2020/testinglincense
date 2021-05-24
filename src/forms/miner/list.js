import React from 'react'
import {TouchableOpacity} from 'react-native-web'
import { makeStyles,useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
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
  col:{

    display:"none",
    [theme.breakpoints.up("sm")]: {
      display:"block"
    },
  }
}));
 function List({item,index,  width}){
    const classes = useStyles();
   const {breakpoints}=useTheme()
  
    function FormRow() {
        return (
          <React.Fragment>
            <Grid item xs={isWidthUp("sm",width)?4:12}>

            <div>{item.entitytype=="J"?item.entityname:item.entityname+" "+item.entitylastname}</div>
            </Grid>
            {isWidthUp("sm",width)&&<><Grid item xs={4}>
             <div>{item.entitytype=="J"?"Figura comercial":"Figura Personal"}</div>
            </Grid>
            <Grid  item xs={4}>
              <div>{item.entitytype+item.entityrif}</div>
            </Grid></>}
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

export default withWidth()(List);
