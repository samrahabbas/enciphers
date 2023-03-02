import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import Header from '../../components/Header';
import Button from '../../components/Button';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Input from '../../components/Input';
import DateInput from '../../components/DateInput';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {EmailBlack, EmailWhite} from '../../assets/icons/icons';
import InputPhone from '../../components/InputPhone';

const FillProfile = () => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={[
        colorMode === 'Dark' ? common.container_dark : common.container_light,
        {paddingTop: StatusBar.currentHeight},
      ]}>
      <Header title={'Fill Your Profile'} />
      <ScrollView
        style={{marginTop: 20, paddingHorizontal: 20}}
        contentContainerStyle={{alignItems: 'center'}}>
        <View style={{marginTop: 10}}>
          {colorMode === 'Dark' ? (
            <Image
              source={require('../../assets/images/avatars/NoProfile.png')}
            />
          ) : (
            <Image
              source={require('../../assets/images/avatars/NoProfile_light.png')}
            />
          )}
          <View style={styles.iconContainer}>
            <FontAwesome5
              name="pen"
              color={colorMode === 'Dark' ? colors.DARK_1 : colors.WHITE}
              size={20}
            />
          </View>
        </View>

        <View style={{marginTop: 20}}>
          <Input placeholder={'Full Name'} />
        </View>
        <View style={{marginTop: 20}}>
          <Input placeholder={'Nickname'} />
        </View>
        <View style={{marginTop: 20, width: '100%'}}>
          <DateInput placeholder={'Date of Birth'} />
        </View>
        <View style={{marginTop: 20}}>
          <Input
            placeholder={'Email'}
            IconRight={colorMode === 'Dark' ? <EmailWhite /> : <EmailBlack />}
          />
        </View>
        <View style={{marginTop: 20}}>
          <InputPhone placeholder={'+1 000 000 000'} />
        </View>
        <View style={{marginTop: 20}}>
          <Input placeholder={'About'} multiline />
        </View>
        <View style={styles.buttonContainer}>
          <Button title={'Continue'} />
        </View>
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
};

export default FillProfile;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    marginTop: 50,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary_500,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 150,
    top: 150,
  },
});
