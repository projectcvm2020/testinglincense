import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Form,FormControl,Button,NavDropdown,Nav,Navbar,Dropdown,ButtonGroup } from 'react-bootstrap'
import Header from '../components/header'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/styles.css'
import Products from '../components/products'
import AppBar from '../components/appBar'
import {Link ,NavLink} from "react-router-dom";
import { connect } from "react-redux";

function index({token}) {
  return (
    <View style={{backgroundColor:"#F7F7F7"}} >
      <AppBar/>
      <Header/>
      <Products title="En promoción" path="indexpage/productscroll"/>
      <Products title="Lo mas vendido" path="indexpage/masvendidos"/>
      <Products title="Categorias populares" path="indexpage/categoriaspopulares"/>
      <Products title="Categorias populares" path="indexpage/categoriaspopulares"/>
      <Products title="Categorias populares" path="indexpage/categoriaspopulares"/>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  links:{textDecoration: 'none',color:"rgba(0,0,0,.5)",marginTop:8}
};
const mapStateToProps = ({ authStorage }) => {
  return {
    token: authStorage.token,
  };
};

export default connect(mapStateToProps)(index);
