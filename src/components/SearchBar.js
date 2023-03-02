import React from 'react';
import {StyleSheet} from 'react-native';
import colors from '../constants/colors';
import {Searchbar} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import {Search} from '../assets/icons/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchBar = ({
  width,
  color,
  placeholder,
  onChangeSearch,
  placeholderColor,
  iconColor,
  height,
  style,
}) => {
  const colorMode = useSelector(state => state.color.color);
  const [focus, setFocus] = useState(false);
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeSearch}
      style={[
        styles.searchBar,
        {width, backgroundColor: color},
        height && {height: height},
        {...style},
        focus && {
          backgroundColor: colors.primary_500_8,
          borderWidth: 1,
          borderColor: colors.primary_500,
        },
      ]}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      clearButtonMode="unless-editing"
      iconColor={
        focus
          ? colors.primary_500
          : colorMode === 'Dark'
          ? colors.GRAY_2
          : colors.GRAY_4
      }
      clearIcon={<Ionicons name="close" size={20} color={colors.primary_500} />}
      placeholderTextColor={placeholderColor ? placeholderColor : colors.WHITE}
      inputStyle={colorMode === 'Dark' ? styles.input : styles.input_light}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: colors.DARK_2,
    height: 56,
    elevation: 0,
    borderRadius: 12,
  },
  input: {
    color: colors.WHITE,
    fontSize: 16,
    fontFamily: 'Urbanist-Medium',
    padding: 0,
  },
  input_light: {
    color: colors.BLACK,
    fontSize: 16,
    fontFamily: 'Urbanist-Medium',
    padding: 0,
  },
});

export default SearchBar;
