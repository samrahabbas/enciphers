import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {useSelector} from 'react-redux';
import MainHeader from '../../components/MainHeader';
import {common} from '../../styles/styles';
import {Switch} from 'react-native-paper';
import RowComponent from '../../components/RowComponent';
import {Arrow, ArrowBlack} from '../../assets/icons/icons';

const NotificationSettings = () => {
  const colorMode = useSelector(state => state.color.color);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader title={'Notification'} />
      <ScrollView style={{flex: 1, paddingHorizontal: 20}}>
        <RowComponent
          text={'Conversation Tones'}
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
        <Text
          style={
            colorMode === 'Dark'
              ? common.white_Medium_18
              : common.gray3_Medium_18
          }>
          Messages
        </Text>
        <RowComponent
          text={'Notification Tones'}
          style={{marginTop: 20}}
          number="Default"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          text={'Vibrate'}
          style={{marginTop: 20}}
          number="Long"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          text={'Reaction Notifications'}
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
        <Text
          style={
            colorMode === 'Dark'
              ? common.white_Medium_18
              : common.gray3_Medium_18
          }>
          Groups
        </Text>
        <RowComponent
          text={'Notification Tones'}
          style={{marginTop: 20}}
          number="Default"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          text={'Vibrate'}
          style={{marginTop: 20}}
          number="Off"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          text={'Reaction Notifications'}
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
        <Text
          style={
            colorMode === 'Dark'
              ? common.white_Medium_18
              : common.gray3_Medium_18
          }>
          Calls
        </Text>
        <RowComponent
          text={'Notification Tones'}
          style={{marginTop: 20}}
          number="Default"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          text={'Vibrate'}
          style={{marginTop: 20}}
          number="Short"
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
};

export default NotificationSettings;

const styles = StyleSheet.create({});
