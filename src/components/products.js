import { postRequest, ipProd } from "../utility/net/urls";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  ActivityIndicator,
  Switch,
  Picker,
  TextInput,
  Image,
  AsyncStorage,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";

import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../assets/styles.css";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const styles={

  arrow:{shadowColor: "#000",backgroundColor:"#fff",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5,


  width:60,height:60,borderRadius:30,justifyContent:"center",alignItems:"center",margin:10,marginTop:0}

}
const Arrow1 = ({ className, style, onClick, arrowVisible }) => {
  return arrowVisible ? (
    <div
      className={className}
      style={{ display: "block", marginLeft: 0 ,zIndex:100,marginLeft:-10,marginTop:-20}}
      onClick={onClick}
    >
      <button className="slickbtn">
      <TouchableOpacity
          style={ [styles.arrow] }
        >
          <ArrowBackIosIcon fontSize="large" />
        </TouchableOpacity>
      </button>
    </div>
  ) : null;
};
const Arrow2 = ({ className, style, onClick, arrowVisible }) => {
  return arrowVisible ? (
    <div className={className} 
    style={{ display: "block" ,marginRight:50,marginTop:-20}} onClick={onClick}>
      <button className="slickbtn">
        <TouchableOpacity
          style={ styles.arrow }
        >
          <ArrowForwardIosIcon fontSize="large" />
        </TouchableOpacity>
      </button>
    </div>
  ) : null;
};
export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      lim1: 1,
      lim2: 15,
      lim1aux: 15,
      cantfind: true,
      arrowVisible: false,
      loading: false,
      itemWidth: 150,
      mitems: 5,
      continerw: 1250,
      fsize:25
    };

    this.updateSize = this.updateSize.bind(this);
    this.next = this.next.bind(this);
  }
  next() {
    this.slider.slickNext();
  }
  async componentWillMount() {
    this.updateSize();
    this.getdata();
    window.addEventListener("resize", this.updateSize);
  }
  async updateSize() {
    let ni = 7;
    let iw = 150;
    let Continerw = 1250;
    let fs=30;
    if (window.innerWidth < 1400) {
      ni = 6;
      Continerw = 1040;
    }
    if (window.innerWidth < 1250) {
      ni = 5;
      Continerw = 870;
    }
    if (window.innerWidth < 1130) {
      ni = 4;
      Continerw = 700;
    }
    if (window.innerWidth < 880) {
      ni = 3;
      Continerw = 500;
    }
    if (window.innerWidth < 700) {
      ni = 3;
      iw = 100;
      Continerw = 370;
      fs=25
    }
    if (window.innerWidth < 548) {
      ni = 2;
      iw = 100;
      Continerw = 240;
      fs=25
    }
    if (window.innerWidth < 400) {
      ni = 2;
      iw = 100;
      Continerw = 240;
      fs=20;
    }
    /*
    if (window.innerWidth < 890) ni = 3;
    if (window.innerWidth < 700) iw = 100;
    if (window.innerWidth < 460) ni = 2;*/
    await this.setState({ nitems: ni, itemWidth: iw, continerw: Continerw,fsize:fs });
  }
  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    let v =
      layoutMeasurement.width + contentOffset.x >=
      contentSize.width - paddingToBottom;
    if (this.state.full)
      v = layoutMeasurement.height + contentOffset.y >= contentSize.height - 10;
    return v;
  }

  getdata() {
    console.log("datos", this.props.path);
    this.setState({ loading: true });
    postRequest(this.props.path, {
      locationname: "",
      l1: this.state.lim1,
      l2: this.state.lim2,
    })
      .then((res) => {
        console.log("datos", res);
        if (res.length > 0) {
          this.re = false;

          this.setState({
            Data: res,
            lim1: this.state.lim1 + this.state.lim1aux,
            loading: false,
          });

          setTimeout(() => this.setState({ cantfind: true }), 2000);
        }
      })
      .catch((err) => {
        console.log("Algo pasó al intentar conectar con el servidor.", err);
      });
  }
  onScroll({ nativeEvent }) {
    if (this.isCloseToBottom(nativeEvent) && this.state.cantfind) {
      const run = async () => {
        await this.setState({ cantfind: false });
        setTimeout(() => this.getdata(), 1000);
      };

      run();
    }
  }
  precios(item) {
    let precios = null;
    if (this.props.path == "indexpage/masvendidos") {
      precios = (
        <View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "#ccc" }} />
          <Text
            style={{
              color: "#1E96D3",
              margin: 2,
              textAlign: "right",
              marginTop: 0,
              fontSize: 20,
            }}
          >
            {item.moneda == 0 ? "Bs." + item.fprecio : "$." + item.fprecio}
          </Text>
          {item.oferta == 3 ? (
            <Text
              style={{
                color: "#BB0000",
                margin: 2,
                textAlign: "right",
                fontSize: 20,
                marginTop: -3,
                textDecorationLine: "line-through",
              }}
            >
              {item.moneda == 0
                ? "Bs." + item.fprecio
                : "$." + item.fofertamonto}
            </Text>
          ) : null}
        </View>
      );
    }
    if (this.props.path == "indexpage/productscroll") {
      precios = (
        <View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "#ccc" }} />
          <Text
            style={{
              color: "#BB0000",
              margin: 2,
              textAlign: "right",
              fontSize: 11,
              textDecorationLine: "line-through",
            }}
          >
            {item.moneda == 0 ? "Bs." + item.fprecio : "$." + item.fprecio}
          </Text>
          <Text
            style={{
              color: "#1E96D3",
              margin: 2,
              textAlign: "right",
              fontSize: 11,
              marginTop: -3,
            }}
          >
            {item.moneda == 0 ? "Bs." + item.fprecio : "$." + item.fofertamonto}
          </Text>
        </View>
      );
    }
    return precios;
  }
  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: this.state.nitems,
      slidesToScroll: this.state.nitems + 1,
      nextArrow: <Arrow2 arrowVisible={this.state.arrowVisible} />,
      prevArrow: <Arrow1 arrowVisible={this.state.arrowVisible} />,
    };
    console.log(this.state.Data);
    let items = this.state.Data.map((item, index) => {
      return (
        <View style={{ margin: 10 }}>
          <div className="m-3 bg-white rounded divCarousel"
            
          >
            <Image
              style={{
                width: this.state.itemWidth,
                height: this.state.itemWidth,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
              source={{
                uri:
                  ipProd.replace("/index.php", "") +
                  "/assets/img/" +
                  item.img +
                  ".png",
              }}
            />

            {this.precios(item)}
          </div>
        </View>
      );
    });
    let w=window.innerWidth>500?250:0;
    return (
      <div className="slider-parent">
        <div className="slider" style={{ width: this.state.continerw }}>
          {!this.state.loading ? (
            <div style={{fontSize:this.state.fsize,color:"#A9A8A8"}}> {this.props.title + " " + window.innerWidth} </div>
          ) : null}{" "}
        </div>
        <div
          className="slider"
          style={{ width: this.state.continerw + w }}
          onMouseEnter={() => this.setState({ arrowVisible: true })}
          onMouseLeave={() => this.setState({ arrowVisible: false })}
        >
          <div className="slider" style={{ width: this.state.continerw }}>
            <Slider {...settings} ref={(c) => (this.slider = c)}>
              {items}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}
