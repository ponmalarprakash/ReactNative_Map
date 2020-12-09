import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Dimensions,
  Image,
  BackHandler
} from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      latitude: 0,
      longitude: 0,
      heading:0,
      coordinate: new AnimatedRegion({   
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      })
    };
  }

getLocation(){
  const { coordinate } = this.state;
  this.watchID = Geolocation.watchPosition(
    position => {
      const { latitude, longitude, heading } = position.coords;

      const newCoordinate = {latitude,longitude};
      if (Platform.OS === "android") {
        if (this.marker) {
          this.marker.animateMarkerToCoordinate(
            newCoordinate,
            500
          );
        }
      } else {
        coordinate.timing(newCoordinate).start();
      }
      this.setState({
        latitude,
        longitude,
        heading,
      });
    },
    error => alert(error.message),
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 1000,
      distanceFilter: 100
    }
  );
}

  async componentDidMount() {
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
                this.getLocation()
        } else {
              console.log('Permission Denied')
              BackHandler.exitApp();
        }
      } catch (err) {
        alert('error', err);
      }
      }

  componentWillUnmount() {
   Geolocation.clearWatch(this.watchID);
   console.log("componentWillUnmount");
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  render() {
    return (
    <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={this.getMapRegion()}>
              <Marker.Animated 
                    ref={marker => {
                          this.marker = marker;
                    }}
                    coordinate={this.state.coordinate}
                     title="You are here!"
                      style={{
                        transform: [{rotate: `${this.state.heading}deg`}]
                    }}
                    >
                    <Image source={require("./images/car_movement_icon_ldpi.png")}/>
              </Marker.Animated>
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
      }
  
});




// import React, { Component } from 'react';
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   PermissionsAndroid,
//   BackHandler, 
//   Image,
//   TouchableOpacity,
//   Text
// } from 'react-native';
// import MapView,{Marker,AnimatedRegion,ProviderPropType} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// const {width, height} = Dimensions.get('window')
// const ASPECT_RATIO = width / height
// const LATITUDE_DELTA = 0.0922
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

// export default class App extends Component {
//   constructor() {
//     super()
//      this.state = {
//       initialPosition:
//         {
//           latitude: 0,
//           longitude: 0,
//           latitudeDelta: 0,
//           longitudeDelta: 0,
//           headingVlaue:0
//         },
//       } 
//   }
  
// getLocation(){
//   Geolocation.watchPosition((position) => {
//     var initialRegion = {
//      latitude: parseFloat(position.coords.latitude),
//      longitude: parseFloat(position.coords.longitude),
//      latitudeDelta: LATITUDE_DELTA,
//      longitudeDelta: LONGITUDE_DELTA,
//      headingVlaue:position.coords.heading
//     }
//        this.setState({initialPosition: initialRegion})
//        console.log("InitialRegion",initialRegion.latitude,initialRegion.longitude)
//   },
//       (error) => alert(JSON.stringify(error.message)),
//   {
//    enableHighAccuracy: true,
//    timeout: 15000,
//    distanceFilter: 100
//   },
//   ); 
// }

// async componentDidMount() {
//   console.log("componentDidMount");
//  try {
//   const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//           title: 'Location Access Required',
//           message: 'This App needs to Access your location',
//           buttonPositive: "OK"
//       },
//   );
//   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log('Permission Granted')
//           this.getLocation()
//   } else {
//         console.log('Permission Denied')
//         BackHandler.exitApp();
//   }
// } catch (err) {
//   alert('error', err);
// }
// }

// componentDidUpdate() {
//   const { initialPosition } = this.state;
//   const newCoordinate = {
//     latitude: this.state.initialPosition.latitude,
//     longitude: this.state.initialPosition.longitude,
//   };
//         console.log("componentDidUpdate",newCoordinate)
//   if (Platform.OS === 'android') {
//     if (this.marker) {
//       this.marker.animateMarkerToCoordinate(newCoordinate, 500);
//     }
//   } else {
//     initialPosition.timing(newCoordinate).start();
//   }
// }

//   render() {
//     return (
//     <View style={styles.container}>
//       <MapView
//          style={styles.map}
//          region={this.state.initialPosition}
//          zoomEnabled={true}
//          maxZoomLevel={100}>
//              <Marker.Animated 
//                     ref={marker => {
//                           this.marker = marker;
//                     }}
//                     coordinate={this.state.initialPosition}
//                      title="You are here!"
//                       style={{
//                         transform: [{rotate: `${this.state.initialPosition.headingVlaue}deg`}]
//                     }}
//                     >
//              <Image source={require("./images/car_movement_icon_ldpi.png")}/>
//              </Marker.Animated>
//         </MapView>  
//     </View> 
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//    flex:1
//   },
//   map: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
// });  

// /* animate() {
//   const { initialPosition } = this.state;
//   const newCoordinate = {
//     latitude: this.state.initialPosition.latitude + (Math.random() - 0.5) * (LATITUDE_DELTA / 2),
//     longitude: this.state.initialPosition.longitude + (Math.random() - 0.5) * (LONGITUDE_DELTA / 2),
//   };
//   if (Platform.OS === 'android') {
//     if (this.marker) {
//       this.marker.animateMarkerToCoordinate(newCoordinate, 500);
//     }
//   } else {
//     initialPosition.timing(newCoordinate).start();
//   }
// }


//   <TouchableOpacity style={{position:'absolute',bottom:10,padding:10,backgroundColor:'blue'}}
//          onPress={() => this.animate()}>
//           <Text>Click</Text>
//         </TouchableOpacity>*/


