import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import MainHeader from '../../components/MainHeader';
import {common} from '../../styles/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import {GroupChatIcon} from '../../assets/icons/icons';
import ContactCard from '../../components/ContactCard';
import {useSelector} from 'react-redux';

const CommonGroups = () => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'Groups in Commons'}
        right={
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-horizontal-circle"
              color={colors.WHITE}
              size={26}
            />
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
          <View style={common.row}>
            <View style={common.iconContainer}>
              <GroupChatIcon />
            </View>
            <View style={{marginLeft: 20}}>
              <Text
                style={
                  colorMode === 'Dark'
                    ? common.white_Bold_18
                    : common.black_Bold_18
                }>
                New Group with Jenny Wilson
              </Text>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <ContactCard
              title={'College Student 🔥'}
              image={require('../../assets/images/media/Ellipse.png')}
              description={'You, Henry, Arthur, James, Hellen, & 20 others'}
            />
            <ContactCard
              title={'College Student 🔥'}
              image={require('../../assets/images/media/Ellipse.png')}
              description={'You, Henry, Arthur, James, Hellen, & 20 others'}
            />
            <ContactCard
              title={'College Student 🔥'}
              image={require('../../assets/images/media/Ellipse.png')}
              description={'You, Henry, Arthur, James, Hellen, & 20 others'}
            />
            <ContactCard
              title={'College Student 🔥'}
              image={require('../../assets/images/media/Ellipse.png')}
              description={'You, Henry, Arthur, James, Hellen, & 20 others'}
            />
            <ContactCard
              title={'College Student 🔥'}
              image={require('../../assets/images/media/Ellipse.png')}
              description={'You, Henry, Arthur, James, Hellen, & 20 others'}
            />
            <ContactCard
              title={'College Student 🔥'}
              image={require('../../assets/images/media/Ellipse.png')}
              description={'You, Henry, Arthur, James, Hellen, & 20 others'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CommonGroups;

const styles = StyleSheet.create({});
