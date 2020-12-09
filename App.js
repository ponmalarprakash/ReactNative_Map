import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  BackHandler, 
  Image,
} from 'react-native';
import MapView,{Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
            buttonPositive: "OK"
        },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
           console.log('Permission Granted')
    } else {
          console.log('Permission Denied')
          BackHandler.exitApp();
    }
} catch (err) {
    alert('error', err);
}
}

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      initialPosition:
        {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
          headingVlaue:0
        }
      }
  }

async componentDidMount() {
await requestLocationPermission();
Geolocation.watchPosition((position) => {
  var initialRegion = {
   latitude: parseFloat(position.coords.latitude),
   longitude: parseFloat(position.coords.longitude),
   latitudeDelta: LATITUDE_DELTA,
   longitudeDelta: LONGITUDE_DELTA,
   headingVlaue:position.coords.heading
  }
  this.setState({initialPosition: initialRegion})
},
(error) => alert(JSON.stringify(error.message)),
{
 enableHighAccuracy: true,
 timeout: 15000,
 distanceFilter: 100
},
);
}
  
  render() {
    return (
    <View style={styles.container}>
        <MapView
         style={styles.map}
         region={this.state.initialPosition}>
            {/*  <Marker coordinate={this.state.initialPosition}
                    image={require('./images/car_movement_icon_mdpi.png')}
                    title="You are here!"
                    style={{
                      transform: [{rotate: `${this.state.initialPosition.headingVlaue}deg`}]
                    }}
                    tracksViewChanges={true}
             /> */}
             <Marker coordinate={this.state.initialPosition}
                     title="You are here!"
                     style={{
                      transform: [{rotate: `${this.state.initialPosition.headingVlaue}deg`}]
                    }}
                    >
             <Image source={require("./images/car_movement_icon_ldpi.png")}/>
             </Marker>
        </MapView>  
    </View> 
    );
  }
}
const styles = StyleSheet.create({
  container: {
   flex:1
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageStyle:{
    width:30,
    height:30
  }
});








// /*  async function requestLocationPermission() {
//         try {
//           const granted = await PermissionsAndroid.request(
//               PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//               {
//                   title: 'Location Access Required',
//                   message: 'This App needs to Access your location',
//                   buttonPositive: "OK"
//               },
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             Geolocation.watchPosition((position) => {
//                 var initialRegion = {
//                  latitude: parseFloat(position.coords.latitude),
//                  longitude: parseFloat(position.coords.longitude),
//                  latitudeDelta: LATITUDE_DELTA,
//                  longitudeDelta: LONGITUDE_DELTA,
//                 }
//                 this.setState({initialPosition: initialRegion})
//            },
//            error => {
//              console.log("error",error);
//            },
//            {
//              enableHighAccuracy: true,
//              distanceFilter:100,
//              interval: 15000,
//              fastestInterval: 10000,
//            },
//          );
//           } else {
//               console.log('Permission Denied')
//               BackHandler.exitApp();
//           }
//       } catch (err) {
//           alert('error', err);
//       }
//       }
//       requestLocationPermission();  
//  */

/* //Current Location 
 Geolocation.getCurrentPosition((position) => {
     var lat = parseFloat(position.coords.latitude)
     var lng = parseFloat(position.coords.longitude)
     var initialRegion = {
       latitude: lat,
       longitude: lng,
       latitudeDelta: LATITUDE_DELTA,
       longitudeDelta: LONGITUDE_DELTA,
     }
     this.setState({initialPosition: initialRegion})
   },
   (error) => alert(JSON.stringify(error)),
   {enableHighAccuracy: true, timeout: 15000, maximumAge: 15000});  */