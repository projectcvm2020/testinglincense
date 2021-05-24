import {Image,Dimensions, View} from 'react-native'
import React from 'react';
export default  function header(){
    let w=window.innerWidth>350?350:200
    let img=window.innerWidth>480?"../assets/img/vale logo 350 px .png":"../assets/img/vale logo 350 px .png"
    return <View><Image  style={{height:200}} source={ require("../assets/img/BANNER 1.jpg")}/>
       <Image style={{height:200,width:350,position:"absolute",left:window.innerWidth>350?0:(window.innerWidth/2)-100}} source={window.innerWidth>480? require("../assets/img/vale logo png.png"): require("../assets/img/BANNER 1.jpg")}/>
    </View> 
}