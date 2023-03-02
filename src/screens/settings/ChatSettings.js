import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {useSelector} from 'react-redux';
import MainHeader from '../../components/MainHeader';
import {common} from '../../styles/styles';
import RowComponent from '../../components/RowComponent';
import {
  Arrow,
  ArrowBlack,
  ArrowDownBlack,
  ArrowDownWhite,
  DownloadBigBlack,
  DownloadBigWhite,
  KeyboardBlack,
  KeyboardWhite,
  Show,
  ShowBlack,
  TimeBig,
  TimeBigBlack,
  UploadBlack,
  UploadWhite,
  WallpaperBig,
  WallpaperBigBlack,
} from '../../assets/icons/icons';
import {Switch} from 'react-native-paper';

const ChatSettings = () => {
  const colorMode = useSelector(state => state.color.color);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader title={'Chats'} />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <RowComponent
          icon={colorMode === 'Dark' ? <WallpaperBig /> : <WallpaperBigBlack />}
          text={'Wallpaper'}
          style={{marginTop: 20}}
        />
        <View
          style={[
            colorMode === 'Dark' ? common.line : common.line_light,
            {marginVertical: 20},
          ]}
        />
        <Text
          style={
            colorMode === 'Dark'
              ? common.white_Medium_18
              : common.gray3_Medium_18
          }>
          Chat Settings
        </Text>
        <RowComponent
          icon={colorMode === 'Dark' ? <ArrowDownWhite /> : <ArrowDownBlack />}
          text={'Enter is send'}
          style={{marginTop: 20}}
          iconRight={
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              color={colors.primary_500}
            />
          }
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <Show /> : <ShowBlack />}
          text={'Media Visibility'}
          style={{marginTop: 20}}
          iconRight={
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              color={colors.primary_500}
            />
          }
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <KeyboardWhite /> : <KeyboardBlack />}
          text={'Font Size'}
          number="Medium"
          style={{marginTop: 20}}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <View
          style={[
            colorMode === 'Dark' ? common.line : common.line_light,
            {marginVertical: 20},
          ]}
        />
        <Text
          style={
            colorMode === 'Dark'
              ? common.white_Medium_18
              : common.gray3_Medium_18
          }>
          Archived Chats
        </Text>
        <RowComponent
          icon={
            colorMode === 'Dark' ? <DownloadBigWhite /> : <DownloadBigBlack />
          }
          text={'Keep Chats Archived'}
          style={{marginTop: 20}}
          iconRight={
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              color={colors.primary_500}
            />
          }
        />
        <View
          style={[
            colorMode === 'Dark' ? common.line : common.line_light,
            {marginVertical: 20},
          ]}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <UploadWhite /> : <UploadBlack />}
          text={'Chat Backup'}
          style={{marginTop: 20}}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <TimeBig /> : <TimeBigBlack />}
          text={'Chat History'}
          style={{marginTop: 20}}
        />
      </View>
    </View>
  );
};

export default ChatSettings;

const styles = StyleSheet.create({});
