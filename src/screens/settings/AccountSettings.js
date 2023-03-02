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
  ArrowRed,
  CallBigBlack,
  CallBigWhite,
  DeleteBigRed,
  Download,
  DownloadBigBlack,
  DownloadBigWhite,
  EmailBigBlack,
  EmailBigWhite,
  LockBlack,
  LockWhite,
} from '../../assets/icons/icons';

const AccountSettings = () => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader title={'Account'} />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <RowComponent
          icon={colorMode === 'Dark' ? <LockWhite /> : <LockBlack />}
          text={'Privacy'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <CallBigWhite /> : <CallBigBlack />}
          text={'Change Number'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
        />
        <RowComponent
          icon={colorMode === 'Dark' ? <EmailBigWhite /> : <EmailBigBlack />}
          text={'Change Email'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
        />
        <RowComponent
          icon={
            colorMode === 'Dark' ? <DownloadBigWhite /> : <DownloadBigBlack />
          }
          text={'Download Account Info'}
          iconRight={colorMode === 'Dark' ? <Arrow /> : <ArrowBlack />}
          style={{marginTop: 20}}
        />
        <RowComponent
          icon={<DeleteBigRed />}
          text={'Delete My Account'}
          red
          iconRight={<ArrowRed />}
          style={{marginTop: 20}}
        />
      </View>
    </View>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({});
