import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import colors from '../constants/colors';
import {common} from '../styles/styles';
import {useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CalendarBlack, CalendarWhite} from '../assets/icons/icons';

const DateInput = ({label, asterisk, placeholder, style}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const colorMode = useSelector(state => state.color.color);

  return (
    <View
      style={[
        colorMode === 'Dark'
          ? styles.textContainer
          : styles.textContainer_light,
        {...style},
      ]}>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center', width: '95%'}}
        onPress={() => setOpen(true)}>
        <DatePicker
          modal
          mode="date"
          open={open}
          date={date}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          style={{backgroundColor: 'red'}}
          onCancel={() => setOpen(false)}
        />
        {date.getDate() !== new Date().getDate() ? (
          <View style={styles.dateContainer}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_14
                  : common.black_Medium_14
              }>
              {date.toDateString()}
            </Text>
          </View>
        ) : (
          <View style={styles.dateContainer}>
            <Text style={common.placeholderText}>{placeholder}</Text>
          </View>
        )}
        {colorMode === 'Dark' ? <CalendarWhite /> : <CalendarBlack />}
      </TouchableOpacity>
    </View>
  );
};

export default DateInput;

const styles = StyleSheet.create({
  textContainer: {
    height: 60,
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.DARK_3,
    backgroundColor: colors.DARK_2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer_light: {
    height: 60,
    width: '100%',
    borderRadius: 20,
    backgroundColor: colors.FILL,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
