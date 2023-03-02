import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {useSelector} from 'react-redux';
import MainHeader from '../../components/MainHeader';
import {common} from '../../styles/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatCard from '../../components/ChatCard';
import {useState} from 'react';
import {
  DeleteRed,
  PaperBlack,
  PaperWhite,
  SquareTickBlack,
  SquareTickWhite,
  UploadFillWhite,
} from '../../assets/icons/icons';

const Archived = ({navigation}) => {
  const colorMode = useSelector(state => state.color.color);
  const [options, setOptions] = useState(false);
  const [selected, setSelected] = useState([]);

  return (
    <Pressable
      onPress={() => setOptions(false)}
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'Archived (278)'}
        right={
          selected.length !== 0 ? (
            <View style={common.row}>
              <TouchableOpacity style={{marginRight: 20}}>
                <UploadFillWhite />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  name="ellipsis-horizontal-circle"
                  color={colors.WHITE}
                  size={26}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setOptions(prev => !prev)}>
              <Ionicons
                name="ellipsis-horizontal-circle"
                color={colors.WHITE}
                size={26}
              />
            </TouchableOpacity>
          )
        }
      />
      <View style={{marginTop: 10, paddingHorizontal: 20}}></View>
      {options && (
        <Pressable
          style={
            colorMode === 'Dark'
              ? styles.optionContainer
              : styles.optionContainer_light
          }>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <PaperWhite /> : <PaperBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Mark as Read
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            {colorMode === 'Dark' ? <SquareTickWhite /> : <SquareTickBlack />}
            <View style={{marginLeft: 10}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Medium_14
                    : common.black_Medium_14
                }>
                Select All
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowContainer}>
            <DeleteRed />
            <View style={{marginLeft: 10}}>
              <Text style={common.red_Medium_14}>Delete Chats</Text>
            </View>
          </TouchableOpacity>
        </Pressable>
      )}
    </Pressable>
  );
};

export default Archived;

const styles = StyleSheet.create({
  optionContainer: {
    width: 169,
    height: 165,
    borderRadius: 16,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    right: 20,
    top: 80,
    paddingTop: 10,
    backgroundColor: colors.DARK_2,
    position: 'absolute',
  },
  optionContainer_light: {
    width: 169,
    height: 165,
    borderRadius: 16,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    right: 20,
    top: 80,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: colors.Gray_100,
    backgroundColor: colors.WHITE,
    position: 'absolute',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.GRAY_2,
    paddingVertical: 15,
  },
});
