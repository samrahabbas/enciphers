import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {common} from '../../styles/styles';
import colors from '../../constants/colors';
import {Switch} from 'react-native-paper';
import MainHeader from '../../components/MainHeader';
import RowComponent from '../../components/RowComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Search,
  Phone,
  Video,
  VolumeUp,
  Show,
  Star,
  ThreeUsers,
  RedClose,
  RedDanger,
  WallpaperBig,
  BellBig,
  TimeBig,
  WallpaperBigBlack,
  ArrowBlack,
  BellBigBlack,
  SpeakerBlack,
  ShowBlack,
  StarBlack,
  TimeBigBlack,
  GroupBlack,
  SettingWhite,
  SettingBlack,
  SearchBig,
} from '../../assets/icons/icons';
import {useSelector} from 'react-redux';
import {Arrow, Bell, Wallpaper} from '../../assets/icons/icons';

const GroupDetails = ({navigation, route}) => {
  const {GroupInfo, AllParticipants, Participants} = route.params;
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const colorMode = useSelector(state => state.color.color);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        right={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={{marginRight: 20}}>
              <SearchBig />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginRight: 20}}
              onPress={() => navigation.navigate('VoiceCall')}>
              <Phone />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginRight: 20}}
              onPress={() => navigation.navigate('VideoCall')}>
              <Video />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="ellipsis-horizontal-circle"
                color={colors.WHITE}
                size={26}
              />
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/media/Ellipse.png')}
              style={{width: 140, height: 140}}
            />
            <View style={{marginTop: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Bold_24
                    : common.black_Bold_24
                }>
                {GroupInfo.chatName}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Regular_16
                    : common.black_Regular_16
                }>
                Group | {AllParticipants.length} participants
              </Text>
            </View>
          </View>
          <View
            style={{
              width: '100%',
              marginVertical: 15,
              height: 1,
              backgroundColor: colors.DARK_3,
            }}></View>
          <View>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Bold_20
                  : common.black_Bold_20
              }>
              Add group description ...
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_14
                  : common.black_Medium_14
              }>
              Created by James Williamson, 10/12/22
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            <RowComponent
              icon={
                colorMode === 'Dark' ? <WallpaperBig /> : <WallpaperBigBlack />
              }
              text={'Media, Links, & Documents'}
              number={'296'}
              iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
              onPress={() => navigation.navigate('MediaLinks')}
            />
            <RowComponent
              icon={colorMode === 'Dark' ? <BellBig /> : <BellBigBlack />}
              text={'Mute Notification'}
              iconRight={
                <Switch
                  value={isSwitchOn}
                  onValueChange={onToggleSwitch}
                  color={colors.primary_500}
                />
              }
              styleIconRight={{marginRight: -10}}
            />
            <RowComponent
              icon={colorMode === 'Dark' ? <VolumeUp /> : <SpeakerBlack />}
              text={'Custom Notification'}
              iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
            />
            <RowComponent
              icon={colorMode === 'Dark' ? <Show /> : <ShowBlack />}
              text={'Media Visibility'}
            />
            <RowComponent
              icon={colorMode === 'Dark' ? <TimeBig /> : <TimeBigBlack />}
              text={'Disappearing Messages'}
              number={'Off'}
              iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
            />
            <RowComponent
              icon={colorMode === 'Dark' ? <SettingWhite /> : <SettingBlack />}
              text={'Groups Settings'}
              iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
              onPress={() => navigation.navigate('GroupSettings')}
            />
            <RowComponent
              icon={colorMode === 'Dark' ? <ThreeUsers /> : <GroupBlack />}
              text={'Groups Participants'}
              number={AllParticipants.length}
              iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
              onPress={() =>
                navigation.navigate('GroupParticipants', {
                  GroupInfo: GroupInfo,
                  AllParticipants: AllParticipants,
                  Participants: Participants,
                })
              }
            />
            <RowComponent icon={<RedDanger />} text={'Report Group'} />
            <RowComponent icon={<RedClose />} text={'Block Group'} />
          </View>
        </View>
        <View style={{height: 20}}></View>
      </ScrollView>
    </View>
  );
};

export default GroupDetails;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    backgroundColor: colors.primary_500,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
