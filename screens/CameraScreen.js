import React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
// import Camera from 'react-native-camera';

export default function CameraScreen() {
  this.state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  componentDidMount()

  const { hasCameraPermission } = this.state;
    // if (hasCameraPermission === null) {
    //   return <View />;
    // } else if (hasCameraPermission === false) {
    //   return <Text>No access to camera</Text>;
    // } else {
      return (
        <View style={{ flex: 1 }}>

          <Camera
          style={{ flex: 1 }}
          type={this.state.type}
          ref={ref => {
            this.camera = ref;
          }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }} onPress={() => snapPhoto()}>
                <Image style={{width: 50, height: 50, alignSelf: 'center'}} source={require('../assets/images/capture.png')}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    // }

}

async function snapPhoto() {
  console.log('Button Pressed');
  if (this.camera) {
     console.log('Taking photo');
     const options = { quality: 1, base64: true, fixOrientation: true,
     exif: true};
     await this.camera.takePictureAsync(options).then(photo => {
        photo.exif.Orientation = 1;
         console.log(photo);

         });
   }
  }

async function componentDidMount() {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  this.state.hasCameraPermission = status === 'granted'
}

CameraScreen.navigationOptions = {
  title: 'Make a Memory',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
