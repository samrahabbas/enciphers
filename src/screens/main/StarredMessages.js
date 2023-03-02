import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import MainHeader from '../../components/MainHeader';
import {common} from '../../styles/styles';
import {
  Copy,
  DeleteFill,
  InfoSquareFill,
  SearchBig,
  Share,
  StarBlue,
  StarFill,
  StarWhite,
} from '../../assets/icons/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MessageContainer1 from '../../components/MessageContainer1';
import MessageContainer2 from '../../components/MessageContainer2';
import AudioContainer from '../../components/AudioContainer';
import ImageContainer from '../../components/ImageContainer';
import {useSelector} from 'react-redux';
import {useState} from 'react';

const StarredMessages = () => {
  const colorMode = useSelector(state => state.color.color);
  const [selected, setSelected] = useState(false);
  const [options, setOptions] = useState(false);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={selected ? '1' : 'Starred Messages'}
        right={
          selected ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity style={{marginRight: 20}}>
                <InfoSquareFill />
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight: 20}}>
                <StarFill />
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight: 20}}>
                <Copy />
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight: 20}}>
                <DeleteFill />
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight: 20}}>
                <Share />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOptions(prev => !prev)}>
                <Ionicons
                  name="ellipsis-horizontal-circle"
                  color={colors.WHITE}
                  size={26}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity style={{marginRight: 20}}>
                <SearchBig />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOptions(prev => !prev)}>
                <Ionicons
                  name="ellipsis-horizontal-circle"
                  color={colors.WHITE}
                  size={26}
                />
              </TouchableOpacity>
            </View>
          )
        }
      />
      <ScrollView
        style={{flex: 1, paddingHorizontal: 20}}
        showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            style={
              selected && {
                backgroundColor: colors.primary_500_8,
                paddingBottom: 15,
              }
            }
            onPress={() => setSelected(false)}
            onLongPress={() => setSelected(true)}>
            <MessageContainer1
              message={'Hi, good morning Jenny... 😁😁'}
              star={<StarWhite />}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MessageContainer1
              message={
                "Haven't seen you in a long time since we were in college 😂"
              }
              star={<StarWhite />}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MessageContainer2
              message={'Hello, morning to Andrew'}
              star={<StarBlue />}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MessageContainer2
              message={
                "Haha, yes it's been about 5 years we haven't seen each other 🤣🤣"
              }
              star={<StarBlue />}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <ImageContainer />
          </TouchableOpacity>
          <TouchableOpacity>
            <AudioContainer star={<StarBlue />} />
          </TouchableOpacity>
        </View>
        <View style={{height: 30}}></View>
      </ScrollView>
    </View>
  );
};

export default StarredMessages;

const styles = StyleSheet.create({});
