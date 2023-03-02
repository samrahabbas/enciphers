import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import MainHeader from '../../components/MainHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import RowComponent from '../../components/RowComponent';
import {
  Arrow,
  ArrowBlack,
  Info,
  InfoBlack,
  Message,
  MessageBlack,
  TwoUser,
  TwoUserBlack,
} from '../../assets/icons/icons';

const GroupSettings = () => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'Group Settings'}
        right={
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-horizontal-circle"
              color={colors.WHITE}
              size={26}
            />
          </TouchableOpacity>
        }
      />
      <View style={{flex: 1, paddingHorizontal: 20, marginTop: 10}}>
        <RowComponent
          icon={colorMode === 'Dark' ? <Info /> : <InfoBlack />}
          text={'Edit Group Info'}
          number={'Everyone'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <Message /> : <MessageBlack />}
          text={'Send Messages'}
          number={'Everyone'}
          style={{marginTop: 20}}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <TwoUser /> : <TwoUserBlack />}
          text={'Edit Group Admin'}
          style={{marginTop: 20}}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
        />
      </View>
    </View>
  );
};

export default GroupSettings;

const styles = StyleSheet.create({});
