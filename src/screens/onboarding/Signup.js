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
import Input from '../../components/Input';
import LottieView from 'lottie-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useEffect} from 'react';
import {signup} from '../../redux/actions/authAction';

const Signup = ({navigation}) => {
  const dispatch = useDispatch();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideCPassword, setHideCPassword] = useState(true);
  const colorMode = useSelector(state => state.color.color);
  const [confirmPassword, setConfirmPassword] = useState('');

  function isValid() {
    if (/^([\w.-](?!\.(com|net|html?|js|jpe?g|png)$)){4,}$/.test(username))
      return true;
    else return false;
  }

  const checkUsername = () => {
    if (username.length >= 3) return true;
    else return false;
  };

  const validatePassword = () => {
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password,
      )
    )
      return true;
    else return false;
  };

  const matchPasswords = () => {
    if (password === confirmPassword) return true;
    else return false;
  };

  const SignUp = () => {
    setLoading(true);
    dispatch(signup(username, password, confirmPassword)).catch(error =>
      setLoading(false),
    );
  };

  if (loading) {
    return (
      <LottieView
        source={require('../../assets/Loading.json')}
        autoPlay
        loop
        style={
          colorMode === 'Dark'
            ? {backgroundColor: colors.DARK_1}
            : {backgroundColor: colors.WHITE}
        }
      />
    );
  }

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
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Image source={require('../../assets/images/onboarding/Exclude.png')} />
      </View>
      <View style={[common.subContainer, {justifyContent: 'flex-start'}]}>
        <View style={{marginVertical: 30}}>
          <Text
            style={
              colorMode === 'Dark' ? common.white_Bold_32 : common.black_Bold_32
            }>
            Create New Account
          </Text>
        </View>
        <Input
          value={username}
          placeholder={'Username'}
          check={checkUsername()}
          onChangeText={setUserName}
          error={username.length !== 0 && !isValid()}
          errorText={
            'Username can only have dash (-), underscore(_) or dot (.) Symbols and any alpha numeric value, should be at least 4 characters long'
          }
        />
        <Input
          value={password}
          placeholder={'Password'}
          check={validatePassword()}
          onChangeText={setPassword}
          secureTextEntry={hidePassword}
          containerStyle={{marginTop: 20}}
          error={password.length !== 0 && !validatePassword()}
          errorText={
            'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
          }
          IconRight={
            hidePassword ? (
              <Ionicons
                size={25}
                name="eye-off-outline"
                color={colorMode === 'Dark' ? colors.GRAY : colors.BLACK}
                onPress={() => setHidePassword(val => !val)}
              />
            ) : (
              <Ionicons
                size={25}
                name="eye-outline"
                color={colorMode === 'Dark' ? colors.GRAY : colors.BLACK}
                onPress={() => setHidePassword(val => !val)}
              />
            )
          }
        />
        <Input
          value={confirmPassword}
          check={matchPasswords()}
          onChangeText={setConfirmPassword}
          secureTextEntry={hideCPassword}
          placeholder={'Confirm Password'}
          containerStyle={{marginTop: 20}}
          error={confirmPassword.length !== 0 && !matchPasswords()}
          errorText={'Password does not match!'}
          IconRight={
            hideCPassword ? (
              <Ionicons
                size={25}
                name="eye-off-outline"
                color={colorMode === 'Dark' ? colors.GRAY : colors.BLACK}
                onPress={() => setHideCPassword(val => !val)}
              />
            ) : (
              <Ionicons
                size={25}
                name="eye-outline"
                color={colorMode === 'Dark' ? colors.GRAY : colors.BLACK}
                onPress={() => setHideCPassword(val => !val)}
              />
            )
          }
        />
        {/* <View style={{marginTop: 20}} />
        <InputPhone placeholder={'+1 000 000 000'} /> */}
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
                ? common.white_Bold_14
                : common.black_Bold_14,
              {marginLeft: 10},
            ]}>
            Remember Me
          </Text>
        </View>
        <Button
          title="Sign up"
          onPress={SignUp}
          disable={
            !checkUsername() ||
            !validatePassword() ||
            !matchPasswords() ||
            !isValid()
          }
        />
      </View>
      <View style={{alignItems: 'center', marginTop: 40}}>
        <View style={common.row}>
          <Text
            style={
              colorMode === 'Dark'
                ? common.white_Medium_14
                : common.black_Medium_14
            }>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LetsYouIn')}>
            <Text style={[common.p500_Medium_14, {marginLeft: 10}]}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
