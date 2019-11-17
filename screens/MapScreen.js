import React from 'react';
import MapView from 'react-native-maps';
import { ExpoConfigView } from '@expo/samples';
import { StyleSheet, Text, View, Dimensions, Modal, Image, Button} from 'react-native';
import axios from 'axios';

class MapScreen extends React.Component {
    constructor() {
      super();
      this.getFBData();
      this.state = {
        markers: [],
      };
    }


    async getFBData() {
      fetch('https://facebook-wecreate.herokuapp.com/files')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('res', responseJson)
        console.log('res', responseJson.length)

        // this.setState({content: responseJson});
        var marker = []
        for (element of responseJson){
          console.log(element.filename)

          // -122.409034
          // -122.400566

          // 37.725302
          // 37.729375

          // const min_lng = -122.409034
          // const min_lat = 37.725302
          // const max_lng = -122.400566
          // const max_lat = 37.729375

          var center_lat = 37.758111
          var center_lon = -122.452448


          // var ran_lat = (Math.random() * (37.800231 - 37.696530 + 0.10000)) + 37.696530;
          // var ran_lon = (Math.random() * (-122.407710 - -122.481149 + 0.10000)) + -122.481149;

          var add_lat = parseFloat((Math.random() * (0.032000 - 0.020000) + 0.020000).toFixed(6));
          var add_lng = parseFloat((Math.random() * (0.032000 - 0.020000) + 0.020000).toFixed(6));

          var ran_lat = center_lat + add_lat
          var ran_lon = center_lon + add_lng
          // let success = false;
          // while (!success) {
          //   const ran_lat = center_lat + Math.random() / 1000;
          //   const ran_lon = center_lon + Math.random() / 1000;
          //   if (ran_lat < max_lat && ran_lat > min_lat && ran_lon < max_lng && ran_lon > min_lng) {
          //     success = true;
          //   }
          // }

          console.log(ran_lat, ran_lon);


          var img_url = 'https://facebook-wecreate.herokuapp.com/image/'+element.filename
          var temp = {
            coordinate: {latitude: ran_lat, longitude: ran_lon},
            title: 'SF',
            description: 'whatever',
            key: element._id,
            image_url: img_url,
            user: 'akshay'
          };
          console.log(temp);
          marker.push(temp)
          // this.state.markers.push(temp)
          // this.state.markers = temp;
        }
        this.setState({markers: marker});

       })
       .catch((error) => {
         console.error(error);
       });
    };

    // getFBData();

    render() {


      return (
        <View style={styles.container}>
          {/* <Button onPress={this.getFBData()/> */}
            {/* <Button
              onPress={getFBData()}
              title="Load Data"
              color="#841584"
            /> */}


          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
          {this.state.markers.map(marker => (
              <MapView.Marker
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                onPress={handleMarkerPress(marker.key)}
                key={marker.key}>
                  <MapView.Callout>
                    <View
                      style={{
                        width: 190,
                        height: 200,
                        backgroundColor: 'white'
                      }}
                    >
                      <Image
                        source={{
                          uri:marker.image_url
                        }}
                        style={{
                          width: 190,
                          height: 190,
                          backgroundColor: 'white',
                          resizeMode: 'cover'
                        }}
                      />
                      <Text
                        style={{textAlign: 'center'}}
                      >{marker.user}</Text>
                    </View>
                  </MapView.Callout>
                </MapView.Marker>
            ))}

          </MapView>

        </View>
      );
    }
}

function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

const fetchDataFromServer = async () => {
  await axios.get('https://facebook-wecreate.herokuapp.com/files')
  .then(function (response) {
    var marker = []
    for (element of response.data){
      console.log(element.filename)

      var img_url = 'https://facebook-wecreate.herokuapp.com/image/'+element.filename
      var temp = {
        coordinate: {latitude: 37.78825, longitude: -122.4324},
        title: 'SF',
        description: 'whatever',
        key: element._id,
        image_url: img_url,//'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_1280.jpg',
        user: 'akshay'
      }
      // this.state.markers.push(temp)
      this.setState({markers: this.state.markers.push(temp)});
    }
    console.log(this.state.markers)

    // handle success
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
}

function testFillMarkers() {
  return [
    {
      coordinate: {latitude: 37.78825, longitude: -122.4324},
      title: 'SF',
      description: 'whatever',
      key: '123',
      image_url: 'https://facebook-wecreate.herokuapp.com/image/728299cd469dddf09929ed95c82828ab.jpg',
      user: 'akshay'
    },
    {
      coordinate: {latitude: 37.81825, longitude: -122.4024},
      title: 'San Jose',
      description: 'lol',
      key: '254',
      image_url: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_1280.jpg',
      user: 'silas'
    },
    {
      coordinate: {latitude: 37.8225, longitude: -122.4824},
      title: 'Half Moon',
      description: 'cool',
      key: '918',
      image_url: 'https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_1280.jpg',
      user:'alison'
    }
  ]
}

function handleMarkerPress(id) {
  console.log('it worked the click', id)
}

function getInitialState() {
  return {
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };
}

function onRegionChange(region) {
  this.setState({ region });
}

MapScreen.navigationOptions = {
  title: 'Explore The World',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  imageOverlay: {

  }
});


export default MapScreen;