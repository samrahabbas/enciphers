import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import MainHeader from '../../components/MainHeader';
import {BlueEdit, EmailBlack, EmailWhite} from '../../assets/icons/icons';
import Input from '../../components/Input';
import DateInput from '../../components/DateInput';
import InputPhone from '../../components/InputPhone';

const Profile = () => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <ScrollView
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader title={'Profile'} />
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <View>
            <Image
              source={require('../../assets/images/chat/Boy.png')}
              style={styles.image}
            />
            <View style={styles.indicator_square}>
              <BlueEdit />
            </View>
          </View>
        </View>
        <View
          style={[
            colorMode === 'Dark' ? common.line : common.line_light,
            {marginVertical: 20},
          ]}
        />
        <Input value="Andrew Ainsely" />
        <Input value="Andrew" containerStyle={{marginTop: 20}} />
        <DateInput style={{marginTop: 20}} placeholder="12/27/1998" />
        <InputPhone placeholder={'+1 000 000 000'} style={{marginTop: 20}} />
        <Input
          containerStyle={{marginTop: 20}}
          value="andrew_ainsley@yourdomain.com"
          IconRight={colorMode === 'Dark' ? <EmailWhite /> : <EmailBlack />}
        />
        <Input value="Always available" containerStyle={{marginTop: 20}} />
      </View>
      <View style={{height: 30}} />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 160,
    borderRadius: 200,
  },
  indicator_square: {
    top: 125,
    left: 125,
    position: 'absolute',
  },
});
