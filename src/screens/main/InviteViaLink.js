import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import MainHeader from '../../components/MainHeader';
import {useSelector} from 'react-redux';
import {
  CopyBlack,
  CopyWhite,
  Link,
  ResetBlack,
  ResetWhite,
  ScanBlack,
  ScanWhite,
  SearchBig,
  SendLinkBlack,
  SendLinkWhite,
  ShareBlack,
  ShareWhite,
} from '../../assets/icons/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import RowComponent from '../../components/RowComponent';

const InviteViaLink = () => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'Invite via Link'}
        right={
          <TouchableOpacity>
            <SearchBig />
          </TouchableOpacity>
        }
      />
      <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
        <Text
          style={
            colorMode === 'Dark'
              ? common.white_Medium_18
              : common.gray3_Medium_18
          }>
          Anyone with Hichat can follow the following link to join the group.
          Please share with people you trust.
        </Text>
        <View style={styles.linkContainer}>
          <View style={common.row}>
            <View style={common.iconContainer}>
              <Link />
            </View>
            <View style={{marginLeft: 20}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Bold_18
                    : common.black_Bold_18
                }>
                https://hichat.com/hJ6jK8hfK29
              </Text>
            </View>
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <RowComponent
            icon={colorMode === 'Dark' ? <SendLinkWhite /> : <SendLinkBlack />}
            text={'Send Link via Enciphers'}
          />
          <RowComponent
            style={{marginTop: 20}}
            icon={colorMode === 'Dark' ? <CopyWhite /> : <CopyBlack />}
            text={'Copy Link'}
          />
          <RowComponent
            style={{marginTop: 20}}
            icon={colorMode === 'Dark' ? <ShareWhite /> : <ShareBlack />}
            text={'Share Link'}
          />
          <RowComponent
            style={{marginTop: 20}}
            icon={colorMode === 'Dark' ? <ScanWhite /> : <ScanBlack />}
            text={'QR Code'}
          />
          <RowComponent
            style={{marginTop: 20}}
            icon={colorMode === 'Dark' ? <ResetWhite /> : <ResetBlack />}
            text={'Reset Link'}
          />
        </View>
      </View>
    </View>
  );
};

export default InviteViaLink;

const styles = StyleSheet.create({
  linkContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.DARK_3,
  },
});
