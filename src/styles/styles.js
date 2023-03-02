import colors from '../constants/colors';
import {StyleSheet, StatusBar} from 'react-native';

export const common = StyleSheet.create({
  container_dark: {
    flex: 1,
    backgroundColor: colors.DARK_1,
  },
  container_light: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  marginTop: {marginTop: 20},
  header: {
    marginHorizontal: 20,
    height: 30,
    top: 20,
    justifyContent: 'center',
  },
  headerText: {
    color: colors.WHITE,
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
  },
  headerText_light: {
    color: colors.BLACK,
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary_500,
  },
  numContainer: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: colors.primary_500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.GRAY,
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
  },
  line: {
    height: 1,
    width: '100%',
    marginVertical: 10,
    backgroundColor: colors.DARK_3,
  },
  line_light: {
    height: 1,
    width: '100%',
    marginVertical: 10,
    backgroundColor: colors.GRAY_8,
  },
  red_Medium_14: {
    color: colors.red,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
  },
  white_Bold_10: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 10,
  },
  white_Bold_14: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 14,
  },
  white_Regular_12: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
  },
  white_Medium_12: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Medium',
    fontSize: 12,
  },
  white_Medium_14: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
  },
  white_Regular_16: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
  },
  white_Medium_16: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  white_Bold_16: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
  white_Bold_17: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 17,
  },
  white_Regular_18: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Regular',
    fontSize: 18,
  },
  white_Medium_18: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Medium',
    fontSize: 18,
  },
  white_Bold_18: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
  },
  white_Medium_20: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Medium',
    fontSize: 20,
  },
  white_Bold_20: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
  },
  white_Bold_24: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 24,
  },
  white_Bold_36: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 36,
  },
  white_Bold_40: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 40,
  },
  white_Bold_32: {
    color: colors.WHITE,
    fontFamily: 'Urbanist-Bold',
    fontSize: 32,
  },
  p500_Bold_36: {
    color: colors.primary_500,
    fontFamily: 'Urbanist-Bold',
    fontSize: 36,
  },
  headerStyle: {
    marginTop: StatusBar.currentHeight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  p500_Medium_12: {
    color: colors.primary_500,
    fontFamily: 'Urbanist-Medium',
    fontSize: 12,
  },
  p500_Medium_14: {
    color: colors.primary_500,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
  },
  p500_Medium_16: {
    color: colors.primary_500,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
  },
  p500_Bold_20: {
    color: colors.primary_500,
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
  },
  p500_Bold_10: {
    color: colors.primary_500,
    fontFamily: 'Urbanist-Bold',
    fontSize: 10,
  },
  p500_Bold_14: {
    color: colors.primary_500,
    fontFamily: 'Urbanist-Bold',
    fontSize: 14,
  },
  gray_Bold_18: {
    color: colors.GRAY,
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
  },
  gray2_Medium_14: {
    color: colors.GRAY_2,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
  },
  gray2_Medium_16: {
    color: colors.GRAY_2,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  //Black text
  black_Bold_10: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Bold',
    fontSize: 10,
  },
  black_Regular_12: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
  },
  black_Medium_14: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
  },
  black_Bold_14: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Bold',
    fontSize: 14,
  },
  black_Regular_16: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
  },
  black_Medium_16: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  black_Bold_16: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
  black_Bold_17: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Bold',
    fontSize: 17,
  },
  black_Regular_18: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Regular',
    fontSize: 18,
  },
  black_Medium_18: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Medium',
    fontSize: 18,
  },
  black_Bold_18: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
  },
  black_Bold_20: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
  },
  black_Bold_24: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Bold',
    fontSize: 24,
  },
  black_Bold_36: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Bold',
    fontSize: 36,
  },
  black_Bold_32: {
    color: colors.BLACK,
    fontFamily: 'Urbanist-Bold',
    fontSize: 32,
  },
  gray_Regular_12: {
    color: colors.GRAY,
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
  },
  gray_Medium_12: {
    color: colors.GRAY,
    fontFamily: 'Urbanist-Medium',
    fontSize: 12,
  },
  gray_Medium_14: {
    color: colors.GRAY,
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
  },
  gray3_Medium_16: {
    color: colors.GRAY_3,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  gray7_Medium_16: {
    color: colors.GRAY_7,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  gray3_Medium_18: {
    color: colors.GRAY_3,
    fontFamily: 'Urbanist-Medium',
    fontSize: 18,
  },
  gray_8_Medium_16: {
    color: colors.GRAY_8,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  gray_8_Medium_18: {
    color: colors.GRAY_8,
    fontFamily: 'Urbanist-Medium',
    fontSize: 18,
  },
  indicator_square: {
    top: 45,
    left: 45,
    width: 15,
    height: 15,
    borderRadius: 3,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: colors.primary_500,
  },
  red_medium_18: {
    color: colors.red,
    fontFamily: 'Urbanist-Medium',
    fontSize: 18,
  },
  red_bold_24: {
    color: colors.red,
    fontFamily: 'Urbanist-Bold',
    fontSize: 24,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
    resizeMode: 'contain',
  },
});
