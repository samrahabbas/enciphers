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
  CallBigBlack,
  CallBigWhite,
  FolderBlack,
  FolderWhite,
  SwapBlack,
  SwapWhite,
} from '../../assets/icons/icons';
import {Switch} from 'react-native-paper';

const StorageAndData = () => {
  const colorMode = useSelector(state => state.color.color);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader title={'Security and Data'} />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <RowComponent
          style={{marginTop: 20}}
          text={'Manage Storage'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          icon={colorMode === 'Dark' ? <FolderWhite /> : <FolderBlack />}
        />
        <RowComponent
          style={{marginTop: 20}}
          text={'Network Usage'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          icon={colorMode === 'Dark' ? <SwapWhite /> : <SwapBlack />}
        />
        <RowComponent
          style={{marginTop: 20}}
          text={'Use Less Data for Calls'}
          iconRight={
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              color={colors.primary_500}
            />
          }
          icon={colorMode === 'Dark' ? <CallBigWhite /> : <CallBigBlack />}
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
          Media Auto-Download
        </Text>
        <RowComponent
          text={'When Using Mobile Data'}
          style={{marginTop: 20}}
          number="Photos"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          text={'When Connected on Wi-fi'}
          style={{marginTop: 20}}
          number="All Media"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          text={'When Roaming'}
          style={{marginTop: 20}}
          number="No Media"
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
          Media Upload Quality
        </Text>
        <RowComponent
          text={'Photo Upload Quality'}
          style={{marginTop: 20}}
          number="Auto"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          text={'Video Upload Quality'}
          style={{marginTop: 20}}
          number="Best Quality"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          text={'Document Upload Quality'}
          style={{marginTop: 20}}
          number="Data Saver"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
      </View>
    </View>
  );
};

export default StorageAndData;

const styles = StyleSheet.create({});
