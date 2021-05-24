import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {View} from 'react-native'




export  function Mtoast({msj,show}) {
 

  return (<>

    {show&&<View style={{position:"absolute",bottom:30,flexGrow: 1}}>
      <Alert severity="success" color="info">
        {msj}
      </Alert>
    </View>}
    </>
  );
}