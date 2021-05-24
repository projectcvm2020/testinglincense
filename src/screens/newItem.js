import React from 'react'
import {useLocation,Redirect,useParams} from 'react-router-dom'
import { connect } from 'react-redux';

import { View } from 'react-native';
 function mewItem({Component}){
    let params = useParams();
    let location = useLocation();
    console.log("componente",Component)
    var srcRedir="";
    try{
      srcRedir=location.state.srcRedir?location.state.srcRedir:""
    }
    catch{
      //return<Redirect to={"/"+params.recordId}/>
    }
    return (
      <div
       
        >
        
        
        {Component?  <Component/>:<Redirect to={"/"+srcRedir} />}
        
      </div>
    );
  }

  const mapStateToProps = ({ auxStorage }) => {
     
    return {
      Component: auxStorage.comp,
      
    };
  };

  export default connect(
    mapStateToProps,
   
  )(mewItem);
  