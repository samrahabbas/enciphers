import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../constants/colors';
import Feather from 'react-native-vector-icons/Feather';
import {common} from '../styles/styles';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Attach,
  AttachBlue,
  AttachGray,
  Camera,
  CameraBlue,
  CameraGray,
  Image1,
} from '../assets/icons/icons';

const InputTextContainer = ({
  width,
  onPressAttach,
  onPressCamera,
  onPressEmoji,
  placeholder,
  photos,
  right,
  rightIcon2,
  leftIcon,
  noLeft,
  textInputStyle,
  ...otherProps
}) => {
  const [focus, setFocus] = useState(false);
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={[
        colorMode === 'Dark' ? styles.container : styles.container_light,
        width && {width: width},
        focus && {borderColor: colors.primary_500},
      ]}>
      <View style={common.row}>
        {!noLeft && (
          <TouchableOpacity onPress={onPressEmoji}>
            {leftIcon ? (
              leftIcon
            ) : (
              <Feather
                name="smile"
                size={20}
                color={focus ? colors.primary_500 : colors.GRAY}
              />
            )}
          </TouchableOpacity>
        )}
        <View style={[{marginLeft: 10, width: '69%'}, {...textInputStyle}]}>
          <TextInput
            placeholder={placeholder ? placeholder : 'Type a message ..'}
            style={
              colorMode === 'Dark'
                ? common.white_Medium_14
                : common.black_Medium_14
            }
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholderTextColor={colors.GRAY}
            {...otherProps}
          />
        </View>
      </View>
      {right ? (
        right
      ) : (
        <View style={common.row}>
          <View>
            {photos ? (
              focus ? (
                <TouchableOpacity>
                  <Image1 fill={colors.primary_500} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <Image1 fill={colors.GRAY} />
                </TouchableOpacity>
              )
            ) : focus ? (
              <TouchableOpacity onPress={onPressAttach}>
                <AttachBlue />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onPressAttach}>
                <AttachGray fill={colors.GRAY} />
              </TouchableOpacity>
            )}
          </View>
          <View style={{marginLeft: 10}}>
            {rightIcon2 ? (
              rightIcon2
            ) : focus ? (
              <TouchableOpacity onPress={onPressCamera}>
                <CameraBlue />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onPressCamera}>
                <CameraGray fill={colors.GRAY} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default InputTextContainer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderColor: colors.DARK_3,
    backgroundColor: colors.DARK_2,
  },
  container_light: {
    width: '100%',
    height: 56,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: colors.Gray_100,
  },
});
