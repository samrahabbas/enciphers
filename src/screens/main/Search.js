import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {useSelector} from 'react-redux';
import {common} from '../../styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SearchBar from '../../components/SearchBar';
import {
  LinkBlue,
  LinkWhite,
  PhotosBlue,
  PhotosWhite,
  TickSquare,
  TickSquareWhite,
  VideoBlue,
} from '../../assets/icons/icons';
import ChatCard from '../../components/ChatCard';
import {useState} from 'react';
import {set} from 'react-native-reanimated';

const Search = ({navigation}) => {
  const colorMode = useSelector(state => state.color.color);
  const [all, setAll] = useState(false);
  const [links, setLinks] = useState(false);
  const [photos, setPhotos] = useState(false);
  const [videos, setVideos] = useState(false);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <View style={{paddingHorizontal: 20}}>
        <View style={styles.header}>
          <AntDesign
            name="arrowleft"
            color={colorMode === 'Dark' ? colors.WHITE : colors.BLACK}
            size={26}
            onPress={() => navigation.goBack()}
          />
          <SearchBar
            style={{width: '85%'}}
            color={colorMode === 'Dark' ? colors.DARK_2 : colors.Gray_100}
          />
        </View>
      </View>
      <View style={{marginTop: 20, height: 38, marginLeft: 20}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={all ? styles.container_fill : styles.container}
            onPress={() => {
              setAll(true);
              setLinks(false);
              setPhotos(false);
              setVideos(false);
            }}>
            {all ? <TickSquareWhite /> : <TickSquare />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_16
                    : common.black_Medium_16
                }>
                All
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAll(false);
              setLinks(true);
              setPhotos(false);
              setVideos(false);
            }}
            style={[
              links ? styles.container_fill : styles.container,
              {marginLeft: 10},
            ]}>
            {links ? <LinkWhite /> : <LinkBlue />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_16
                    : common.black_Medium_16
                }>
                Links
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAll(false);
              setLinks(false);
              setPhotos(true);
              setVideos(false);
            }}
            style={[
              photos ? styles.container_fill : styles.container,
              {marginLeft: 10},
            ]}>
            {photos ? <PhotosWhite /> : <PhotosBlue />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_16
                    : common.black_Medium_16
                }>
                Photos
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAll(false);
              setLinks(false);
              setPhotos(false);
              setVideos(true);
            }}
            style={[
              videos ? styles.container_fill : styles.container,
              {marginLeft: 10},
            ]}>
            <VideoBlue />
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_16
                    : common.black_Medium_16
                }>
                Videos
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{width: 20}} />
        </ScrollView>
      </View>
      {!all && !photos && !links && !videos && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {/* <Image source={require('../../assets/images/onboarding/Frame.png')} /> */}
          <View style={{alignItems: 'center', paddingHorizontal: 20}}>
            <Image source={require('../../assets/images/search/Frame.png')} />
            <View style={{marginTop: 20}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Bold_24
                    : common.black_Bold_24
                }>
                Not found
              </Text>
            </View>
            <View style={{marginTop: 20}}>
              <Text
                style={[
                  colorMode === 'Dark'
                    ? common.white_Regular_18
                    : common.black_Regular_18,
                  {textAlign: 'center'},
                ]}>
                Sorry, the keyword you entered cannot be found, please check
                again or search with another keyword.
              </Text>
            </View>
          </View>
        </View>
      )}
      {links && (
        <View style={{paddingHorizontal: 20, marginTop: 10}}>
          <ChatCard indicator desc={'https://www.amazon.com/'} noNum />
          <ChatCard desc={'https://www.amazon.com/'} />
        </View>
      )}
      {photos && (
        <View style={{paddingHorizontal: 20, marginTop: 10}}>
          <View style={styles.row}>
            <Image
              source={require('../../assets/images/media/Image.png')}
              style={styles.image}
            />
            <Image
              source={require('../../assets/images/media/Image.png')}
              style={styles.image}
            />
            <Image
              source={require('../../assets/images/media/Image.png')}
              style={styles.image}
            />
          </View>
          <View style={styles.row}>
            <Image
              source={require('../../assets/images/media/Image.png')}
              style={styles.image}
            />
            <Image
              source={require('../../assets/images/media/Image.png')}
              style={styles.image}
            />
            <Image
              source={require('../../assets/images/media/Image.png')}
              style={styles.image}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  header: {
    marginTop: StatusBar.currentHeight + 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container_fill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: colors.primary_500,
  },
  container: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: colors.primary_500,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
