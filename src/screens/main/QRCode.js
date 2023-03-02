import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React from 'react';
import MainHeader from '../../components/MainHeader';
import {common} from '../../styles/styles';
import colors from '../../constants/colors';
import {SearchBig, ShareBig} from '../../assets/icons/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useSelector} from 'react-redux';

const QRCode = ({navigation}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'code', title: 'My Code'},
    {key: 'scan', title: 'Scan Code'},
  ]);
  const colorMode = useSelector(state => state.color.color);

  const CodeRoute = () => (
    <ScrollView
      style={
        colorMode === 'Dark' ? styles.container_dark : styles.container_light
      }>
      <View
        style={
          colorMode === 'Dark' ? styles.subContainer : styles.subContainer_light
        }>
        <View style={{marginTop: 20}}>
          <Image
            source={require('../../assets/images/chat/Boy.png')}
            style={{width: 120, height: 120, borderRadius: 200}}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text
            style={
              colorMode === 'Dark' ? common.white_Bold_24 : common.black_Bold_24
            }>
            Andrew Ainsely
          </Text>
        </View>
        <View style={{marginTop: 10}}>
          <Text
            style={
              colorMode === 'Dark'
                ? common.white_Medium_14
                : common.black_Medium_14
            }>
            Enciphers Contact
          </Text>
        </View>
        <Image source={require('../../assets/images/QR/QR.png')} />
        <View style={{marginTop: 20, paddingHorizontal: 35}}>
          <Text
            style={[
              colorMode === 'Dark'
                ? common.gray3_Medium_16
                : common.gray7_Medium_16,
              {textAlign: 'center'},
            ]}>
            Your QR Code is private. Please share only with people you trust
          </Text>
        </View>
        <View style={{height: 20}} />
      </View>
    </ScrollView>
  );
  const ScanRoute = () => (
    <ImageBackground
      style={{flex: 1}}
      source={require('../../assets/images/QR/QRBG.png')}>
      <ImageBackground
        source={require('../../assets/images/QR/ShadowBG.png')}
        style={{flex: 1}}>
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Image
            source={require('../../assets/images/linked/QR.png')}
            style={{width: 370, height: 370}}
          />
        </View>
      </ImageBackground>
    </ImageBackground>
  );

  const renderScene = SceneMap({
    code: CodeRoute,
    scan: ScanRoute,
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
              <Text style={common.headerText}>QR Code</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ShareBig />
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

export default QRCode;

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
  subContainer: {
    marginHorizontal: 30,
    marginVertical: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.DARK_2_1,
    elevation: 3,
  },
  subContainer_light: {
    marginHorizontal: 30,
    marginVertical: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.WHITE_1,
    elevation: 3,
  },
});
