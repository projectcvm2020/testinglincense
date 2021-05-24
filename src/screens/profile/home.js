import React from 'react';
import {Form,FormControl,Button,NavDropdown,Nav,Navbar} from 'react-bootstrap'
import {View} from 'react-native-web'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home(){
    return <View style={{flex:1,justifyContent:"center",alignItems:"center",height:window.innerHeight-150}}>
                <img  style={{width:300,height:300,marginBottom:20}}src={require('../../assets/img/logocvm.png')} />
            </View>
}