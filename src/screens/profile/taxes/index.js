import React, { useEffect, useState } from "react";
import {View} from 'react-native-web'
import List from "../../../components/list";
import { connect } from "react-redux";
import { getRequest } from "../../../utility/net/urls";
import ListF from "../../../forms/taxes/list";
import Detail from "../../../forms/taxes/detail";

import { useLocation ,useHistory} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function taxes({ token }) {
  const location = useLocation();
  const history=useHistory()
  const [items, setItems] = useState();
  useEffect(() => {
    getItems();
    
    if(location.state)
    {
      toast.success(location.state.message)
      history.replace()
    }
  }, []);
  const getItems = () => {
    
    getRequest("personresource/gettaxes", token)
      .then((res) => {
        if (res.data) {
          setItems(res.data);
        }
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
 
  return (
    <div>
      <h3>Tasas</h3>

      {items ? (
        <List
          ListForm={(props) => <ListF {...props} />}
          title="Tasas"
          srcRedir="taxes"
          idFieldName="id"
          list={items}
          Form={() => <Detail />}
         
          
        />
      ): <View style={{justifyContent:"center",alignItems:"center",height:window.innerHeight-150}}><CircularProgress color="primary" size={40} /></View>}
   
   
    </div>
  );
}

const mapStateToProps = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};

export default connect(mapStateToProps)(taxes);
