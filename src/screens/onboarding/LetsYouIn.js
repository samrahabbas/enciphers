import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {common} from '../../styles/styles';
import colors from '../../constants/colors';
import Button from '../../components/Button';
import LottieView from 'lottie-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Input from '../../components/Input';
import InputPhone from '../../components/InputPhone';
import {useDispatch, useSelector} from 'react-redux';
import {signIn} from '../../redux/actions/authAction';

const LetsYouIn = ({navigation}) => {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const colorMode = useSelector(state => state.color.color);

  function isValid() {
    if (/^([\w.-](?!\.(com|net|html?|js|jpe?g|png)$)){4,}$/.test(username))
      return true;
    else return false;
  }

  const checkUsername = () => {
    if (username.length >= 4) return true;
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

  const signin = () => {
    setLoading(true);
    dispatch(signIn(username, password)).catch(err => {
      setLoading(false);
      setError(err);
    });
  };

  if (loading) {
    return (
      <>
        {/* <StatusBar translucent backgroundColor="transparent" /> */}
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
      </>
    );
  }

  return (
    <ScrollView
      style={[
        colorMode === 'Dark' ? common.container_dark : common.container_light,
        {paddingTop: StatusBar.currentHeight},
      ]}>
      <View style={common.header}>
        {/* <AntDesign
          name="arrowleft"
          color={colorMode === 'Dark' ? colors.WHITE : colors.BLACK}
          size={26}
          onPress={() => navigation.goBack()}
        /> */}
      </View>
      <View style={{alignItems: 'center', marginTop: 30}}>
        <Image source={require('../../assets/images/onboarding/Frame1.png')} />
      </View>
      <View style={{alignItems: 'center', marginTop: 30}}>
        <Text
          style={
            colorMode === 'Dark' ? common.white_Bold_36 : common.black_Bold_36
          }>
          Let's you in
        </Text>
      </View>
      <View
        style={{alignItems: 'center', marginTop: 30, paddingHorizontal: 20}}>
        <Input
          value={username}
          placeholder={'Username'}
          onChangeText={setUserName}
          error={username.length !== 0 && !isValid()}
          errorText={
            'Username can only have dash (-), underscore(_) or dot (.) Symbols and any alpha numeric value, should be at least 4 characters long'
          }
        />
        <Input
          value={password}
          placeholder={'Password'}
          //check={validatePassword()}
          onChangeText={setPassword}
          secureTextEntry={hidePassword}
          containerStyle={{marginTop: 20}}
          //error={password.length !== 0 && !validatePassword()}
          // errorText={
          //   'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
          // }
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
        {/* <View style={styles.orText}>
          <View
            style={
              colorMode === 'Dark' ? styles.line : styles.line_light
            }></View>
          <Text
            style={
              colorMode === 'Dark'
                ? common.white_Medium_18
                : common.black_Medium_18
            }>
            or
          </Text>
          <View
            style={
              colorMode === 'Dark' ? styles.line : styles.line_light
            }></View>
        </View>
        {username.length === 0 ? (
          <Button
            title="Sign in with Phone Number"
            onPress={() => navigation.navigate('SignInPhone')}
          />
        ) : ( */}
        <Button
          title="Sign in"
          onPress={signin}
          style={{marginTop: 20}}
          disable={!isValid()}
        />
        {/* )} */}
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
      {/* <View style={styles.footer}>
        <View />
        <View style={[common.row, {bottom: 30}]}>
          <Text style={common.white_Medium_14}>Don't have an account?</Text>
          <Text style={[common.p500_Medium_14, {marginLeft: 10}]}>Sign up</Text>
        </View>
      </View> */}
      {error && (
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={() => setError()}
          style={styles.error}>
          <View style={styles.card}>
            <Text style={common.p500_Bold_20}>Error!</Text>
            <View style={{marginTop: 10}}>
              <Text style={common.white_Regular_16}>{error.message}</Text>
            </View>
            {/* <Button
                title="Try again"
                onPress={() => setError()}
                color={colors.primary}
                icon={
                  <Ionicons
                    name="reload"
                    size={20}
                    color={colors.WHITE}
                    style={{marginLeft: 5}}
                  />
                }
                style={{marginTop: 10, paddingHorizontal: 10}}
              /> */}
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default LetsYouIn;

const styles = StyleSheet.create({
  button: {
    height: 60,
    width: '100%',
    backgroundColor: colors.DARK_2,
    borderRadius: 16,
    borderColor: colors.DARK_3,
    borderWidth: 1,
  },
  line: {
    width: '40%',
    height: 1,
    backgroundColor: colors.DARK_3,
  },
  line_light: {
    width: '40%',
    height: 1,
    backgroundColor: colors.SHADOW,
  },
  orText: {
    marginVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    width: '100%',
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  error: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blurBG,
  },
  card: {
    backgroundColor: colors.DARK_2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    paddingVertical: 100,
    borderRadius: 48,
  },
});
