import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import InputPhone from '../../components/InputPhone';
import {Checkbox} from 'react-native-paper';
import Button from '../../components/Button';
import {useSelector} from 'react-redux';

const SigninPhone = ({navigation}) => {
  const [checked, setChecked] = React.useState(false);
  const colorMode = useSelector(state => state.color.color);

  return (
    <ScrollView
      style={[
        colorMode === 'Dark' ? common.container_dark : common.container_light,
        {paddingTop: StatusBar.currentHeight},
      ]}>
      <View style={common.header}>
        <AntDesign
          name="arrowleft"
          color={colorMode === 'Dark' ? colors.WHITE : colors.BLACK}
          size={26}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={{alignItems: 'center', marginTop: 50}}>
        <Image source={require('../../assets/images/onboarding/Exclude.png')} />
      </View>
      <View style={[common.subContainer, {justifyContent: 'flex-start'}]}>
        <View style={{marginVertical: 50}}>
          <Text
            style={
              colorMode === 'Dark' ? common.white_Bold_32 : common.black_Bold_32
            }>
            Login to your Account
          </Text>
        </View>
        <InputPhone placeholder={'+1 000 000 000'} />
        <View style={[common.row, {marginVertical: 30}]}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }}
            color={colors.primary_500}
            uncheckedColor={colorMode === 'Dark' ? colors.WHITE : colors.BLACK}
          />
          <Text
            style={[
              colorMode === 'Dark'
                ? common.white_Medium_14
                : common.black_Medium_14,
              {marginLeft: 10},
            ]}>
            Remember Me
          </Text>
        </View>
        <Button title="Sign in" />
      </View>
      <View style={{alignItems: 'center', marginTop: 40}}>
        <View style={common.row}>
          <Text
            style={
              colorMode === 'Dark'
                ? common.white_Medium_14
                : common.black_Medium_14
            }>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[common.p500_Medium_14, {marginLeft: 10}]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SigninPhone;

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
