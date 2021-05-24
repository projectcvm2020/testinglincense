import React, { useEffect, useState } from "react";
import {View} from 'react-native-web'
import List from "../../../components/list";
import { connect } from "react-redux";
import { getRequest } from "../../../utility/net/urls";
import ListF from "../../../forms/affiliates/list";
import Detail from "../../../forms/affiliates/detail";
import { ToastContainer, toast } from 'react-toastify';

import { useLocation ,useHistory} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
function affiliate({ token }) {
  const location = useLocation();
  const history=useHistory()
  const [items, setItems] = useState([]);
  const [offSet, setOffSet] = useState(0);
  const [search,setSearch] = useState(null);
  const [showSaveButton,setShowSaveButton] = useState(true);
  useEffect(() => {
    getItems();
   
    
  }, []);
  useEffect(() => {
    if (search !== null) {
     // setIsFetching(true);
      const timeout = setTimeout(() => {
        setOffSet(0)
        setItems([])
        getItems();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [search]);
  const getItems = () => {
    let s=""
    if(search)
        s="search="+search
    getRequest("affiliates/getaffiliateslist?"+s+"&offSet="+offSet, token)
      .then((res) => {
        if (res.data) {
          console.log(res.data)

          if(items.length>0)
            setItems(items=>items.concat(res.data));
          else
            setItems(res.data);  
          if(res.data.length<10)
            setShowSaveButton(false)
          else 
            setShowSaveButton(true)  
        }
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  };
  const setOffSetList=()=>{
        setOffSet(offSet+10)
  }
  useEffect(() => {
    if(offSet>0)
       getItems(); 
  }, [offSet]);
  return (
    <div>
      <h3>Afiliados del sistema</h3>

      {items ? (
        
        <List
        ListForm={(props) => <ListF {...props} />}
        title="afiliados"
        srcRedir="affiliate"
        idFieldName="id"
        list={items}
        setOffSet={setOffSetList}
        showSaveButton={showSaveButton}
        setSearch={setSearch}
        Form={() => <Detail />}
       
        
      />
      ):<View style={{justifyContent:"center",alignItems:"center",height:window.innerHeight-150}}><CircularProgress color="primary" size={40} /></View>}
    
        <ToastContainer 
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
          />
    </div>
  );
}

const mapStateToProps = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};

export default connect(mapStateToProps)(affiliate);
