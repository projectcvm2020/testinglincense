import React, { useEffect, useState } from "react";
import {View} from 'react-native-web'
import List from "../../../components/list";
import { connect } from "react-redux";
import { getRequest } from "../../../utility/net/urls";
import ListF from "../../../forms/sector/list";
import Detail from "../../../forms/sector/detail";
import { useLocation ,useHistory} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function sector({ token }) {
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
  const getItems = (load=true) => {
    let s=""
    let limit="&offSet="+offSet
    if(search)
        s="search="+search
    if(!load)
      limit="&offset=0&limit="+items.length
    getRequest("personresource/getsectorlist?"+s+limit, token)
      .then((res) => {
        if (res.data) {
          if(items.length>0&&load)
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
      <h3>Sectores</h3>

      {items ? (
        <List
          ListForm={(props) => <ListF {...props} />}
          title="Sectores"
          srcRedir="sector"
          idFieldName="id"
          list={items}
          setOffSet={setOffSetList}
          showSaveButton={showSaveButton}
          setSearch={setSearch}
          showInModal={true}
          showModal={showModal}
          setShowModal={setShowModal}
          Form={Detail}
          getItems={getItems}
          
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
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export default connect(mapStateToProps)(sector);
