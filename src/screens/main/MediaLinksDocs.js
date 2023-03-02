import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import React from 'react';
import MainHeader from '../../components/MainHeader';
import {common} from '../../styles/styles';
import colors from '../../constants/colors';
import {SearchBig} from '../../assets/icons/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useSelector} from 'react-redux';

const MediaLinksDocs = ({navigation}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'media', title: 'Media'},
    {key: 'links', title: 'Links'},
    {key: 'documents', title: 'Documents'},
  ]);
  const colorMode = useSelector(state => state.color.color);

  const MediaRoute = () => (
    <ScrollView
      style={
        colorMode === 'Dark' ? styles.container_dark : styles.container_light
      }>
      <View style={{paddingHorizontal: 20, paddingTop: 20}}>
        <Text
          style={
            colorMode === 'Dark' ? common.white_Bold_18 : common.black_Bold_18
          }>
          Recent
        </Text>
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
        <View style={{marginTop: 20}}>
          <Text
            style={
              colorMode === 'Dark' ? common.white_Bold_18 : common.black_Bold_18
            }>
            This week
          </Text>
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
        <View style={{marginVertical: 20}}>
          <Text
            style={
              colorMode === 'Dark' ? common.white_Bold_18 : common.black_Bold_18
            }>
            Last month
          </Text>
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
      </View>
    </ScrollView>
  );
  const LinksRoute = () => (
    <View
      style={
        colorMode === 'Dark' ? styles.container_dark : styles.container_light
      }
    />
  );
  const DocumentsRoute = () => (
    <View
      style={
        colorMode === 'Dark' ? styles.container_dark : styles.container_light
      }
    />
  );

  const renderScene = SceneMap({
    media: MediaRoute,
    links: LinksRoute,
    documents: DocumentsRoute,
  });

  return (
    <View style={common.container_dark}>
      <LinearGradient
        colors={[colors.Gradient1, colors.Gradient2]}
        style={styles.linearGradient}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign
              name="arrowleft"
              color={colors.WHITE}
              size={26}
              onPress={() => navigation.goBack()}
            />
            <TouchableOpacity style={{marginLeft: 20}}>
              <Text style={common.headerText}>Jenny Wilson</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SearchBig />
            <Ionicons
              name="ellipsis-horizontal-circle"
              color={colors.WHITE}
              size={26}
              style={{marginLeft: 20}}
            />
          </View>
        </View>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{
                height: 2.5,
                borderRadius: 20,
                backgroundColor: colors.WHITE,
              }}
              style={{backgroundColor: colors.primary_500, width: '100%'}}
              renderLabel={({route, focused, color}) => (
                <Text
                  style={
                    focused ? common.white_Bold_17 : common.white_Regular_18
                  }>
                  {route.title}
                </Text>
              )}
            />
          )}
        />
      </LinearGradient>
    </View>
  );
};

export default MediaLinksDocs;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    backgroundColor: colors.primary_500,
  },
  container_dark: {flex: 1, backgroundColor: colors.DARK_1},
  container_light: {flex: 1, backgroundColor: colors.WHITE},
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  image: {
    width: 120,
    height: 120,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
