import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar,
  PermissionsAndroid,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../constants/colors';
// import CameraRoll from '@react-native-community/cameraroll';
import {common} from '../../styles/styles';
import {
  CameraChange,
  Crop,
  EditWhiteFill,
  Emoji,
  Flash,
  Image1,
  Paint,
  SendBlue,
  SendWhite,
  TextWhite,
} from '../../assets/icons/icons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputTextContainer from '../../components/InputTextContainer';
import LinearGradient from 'react-native-linear-gradient';

const AddStatus = ({navigation}) => {
  const [image, setImage] = useState();
  const [photos, setPhotos] = useState([]);
  const [write, setWrite] = useState(false);
  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  // useEffect(() => {
  //   hasAndroidPermission().then(res => {
  //     if (res) {
  //       CameraRoll.getPhotos({
  //         first: 20,
  //         assetType: 'Photos',
  //       })
  //         .then(r => {
  //           setPhotos(r.edges);
  //           //setImage(r.edges[0].node.image.uri);
  //         })
  //         .catch(err => {
  //           console.log(err);
  //         });
  //     }
  //   });
  // }, []);

  return (
    <>
      {write ? (
        <LinearGradient
          colors={[colors.Gradient1, colors.Gradient2]}
          style={{flex: 1, paddingHorizontal: 20}}>
          <View style={styles.container}>
            <View style={[common.row, {justifyContent: 'space-between'}]}>
              <AntDesign
                name="arrowleft"
                color={colors.WHITE}
                size={26}
                onPress={() => navigation.goBack()}
              />
              <Ionicons
                name="ellipsis-horizontal-circle"
                color={colors.WHITE}
                size={26}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TextInput
              placeholder="Type a Status "
              placeholderTextColor={colors.primary_200}
              style={[common.white_Bold_40, {textAlign: 'center'}]}
              multiline
            />
          </View>
          <View style={[styles.footer, {height: 60, flex: 0}]}>
            <View
              style={[
                common.row,
                {justifyContent: 'space-between', width: '100%'},
              ]}>
              <View style={common.row}>
                <View style={{marginRight: 20}}>
                  <Emoji />
                </View>
                <TouchableOpacity style={{marginRight: 20}}>
                  <TextWhite />
                </TouchableOpacity>
                <Paint />
              </View>
              <View
                style={[common.iconContainer, {backgroundColor: colors.WHITE}]}>
                <SendBlue />
              </View>
            </View>
          </View>
        </LinearGradient>
      ) : (
        <ImageBackground
          source={
            image
              ? {uri: image}
              : require('../../assets/images/status/Upload.png')
          }
          style={{flex: 1, paddingHorizontal: 20}}>
          <View style={styles.container}>
            {image ? (
              <View style={[common.row, {justifyContent: 'space-between'}]}>
                <Ionicons
                  name="close"
                  size={26}
                  color={colors.WHITE}
                  onPress={() => navigation.goBack()}
                />
                <View style={common.row}>
                  <View style={{marginRight: 20}}>
                    <Crop />
                  </View>
                  <View style={{marginRight: 20}}>
                    <Emoji />
                  </View>
                  <TouchableOpacity
                    style={{marginRight: 20}}
                    onPress={() => setWrite(true)}>
                    <TextWhite />
                  </TouchableOpacity>
                  <EditWhiteFill />
                </View>
              </View>
            ) : (
              <AntDesign
                name="arrowleft"
                color={colors.WHITE}
                size={26}
                onPress={() => navigation.goBack()}
              />
            )}
          </View>
          <View style={styles.footer}>
            {image ? (
              <View style={{alignItems: 'center'}}>
                <View style={{marginVertical: 10}}>
                  <Entypo
                    name="chevron-thin-up"
                    color={colors.WHITE}
                    size={20}
                  />
                </View>
                <Text style={common.white_Medium_16}>Filters</Text>
                <View style={styles.row}>
                  <InputTextContainer
                    width={'80%'}
                    placeholder="Add a caption ..."
                    photos
                  />
                  <View style={common.iconContainer}>
                    <SendWhite />
                  </View>
                </View>
              </View>
            ) : (
              <View style={{alignItems: 'center'}}>
                <View style={{marginVertical: 10}}>
                  <Entypo
                    name="chevron-thin-up"
                    color={colors.WHITE}
                    size={20}
                  />
                </View>
                <View style={styles.pictureContainer}>
                  <FlatList
                    data={photos}
                    key={item => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <View>
                        <TouchableOpacity
                          style={[styles.cameraContainer, {marginLeft: 10}]}
                          onPress={() => setImage(item.node.image.uri)}>
                          <Image
                            style={styles.cameraContainer}
                            source={{uri: item.node.image.uri}}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
                <View style={[common.row, {marginVertical: 20}]}>
                  <View style={styles.iconContainer}>
                    <Flash />
                  </View>
                  <View style={styles.button} />
                  <View style={styles.iconContainer}>
                    <CameraChange />
                  </View>
                </View>
                <Text style={common.white_Medium_16}>
                  Tap for photo, hold for video
                </Text>
              </View>
            )}
          </View>
        </ImageBackground>
      )}
    </>
  );
};

export default AddStatus;

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight + 20,
  },
  footer: {
    flex: 1,
    bottom: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparent,
  },
  button: {
    backgroundColor: 'rgba(240, 240, 240, 0.7)',
    borderWidth: 5,
    borderColor: colors.primary_500,
    width: 100,
    height: 100,
    borderRadius: 200,
    marginHorizontal: 30,
  },
  pictureContainer: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    //paddingHorizontal: 10,
  },
  cameraContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
});
