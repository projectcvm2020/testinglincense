import React, { useEffect, useState } from "react";
import {View} from 'react-native-web'
import List from "../../../components/list";
import { connect } from "react-redux";
import { getRequest } from "../../../utility/net/urls";
import ListF from "../../../forms/activitytypes/list";
import Detail from "../../../forms/activitytypes/detail";
import { useLocation ,useHistory} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function activitytypes({ token }) {
  const location = useLocation();
  const history=useHistory()
  const [items, setItems] = useState([]);
  const [offSet, setOffSet] = useState(0);
  const [search,setSearch] = useState(null);
  const [showSaveButton,setShowSaveButton] = useState(false);
  const [showModal,setShowModal] =  useState(false);
  
  useEffect(() => {
    getItems();
    
    if(location.state)
    {
      toast.success(location.state.message)
      history.replace()
    }
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
    
    getRequest("personresource/getactivitytypeslist?"+s+"&offSet="+offSet, token)
      .then((res) => {
        if (res.data) {
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
      <h3>Tipos de actividad</h3>

      {items ? (
        <List
          ListForm={(props) => <ListF {...props} />}
          title="Tipos de actividad"
          srcRedir="activitytypes"
          idFieldName="id"
          list={items}
          setOffSet={setOffSetList}
          showSaveButton={showSaveButton}
          setSearch={setSearch}
          showInModal={true}
          showModal={showModal}
          setShowModal={setShowModal}
          Form={Detail}
         
          
          
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

export default connect(mapStateToProps)(activitytypes);
