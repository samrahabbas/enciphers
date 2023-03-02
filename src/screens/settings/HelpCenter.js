import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {useSelector} from 'react-redux';
import MainHeader from '../../components/MainHeader';
import {common} from '../../styles/styles';
import RowComponent from '../../components/RowComponent';
import {
  Arrow,
  ArrowBlack,
  ChatBigBlack,
  ChatBigWhite,
  FaqBlack,
  FaqWhite,
  InfoBigBlack,
  InfoBigWhite,
  MoreBlack,
  MoreWhite,
} from '../../assets/icons/icons';

const HelpCenter = () => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader title={'Help Center'} />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <RowComponent
          style={{marginTop: 20}}
          text={'FAQ'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          icon={colorMode === 'Dark' ? <FaqWhite /> : <FaqBlack />}
        />
        <RowComponent
          style={{marginTop: 20}}
          text={'Contact us'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          icon={colorMode === 'Dark' ? <ChatBigWhite /> : <ChatBigBlack />}
        />
        <RowComponent
          style={{marginTop: 20}}
          text={'Terms & Privacy Policy'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          icon={colorMode === 'Dark' ? <MoreWhite /> : <MoreBlack />}
        />
        <RowComponent
          text={'App Info'}
          style={{marginTop: 20}}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          icon={colorMode === 'Dark' ? <InfoBigWhite /> : <InfoBigBlack />}
        />
      </View>
    </View>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({});
