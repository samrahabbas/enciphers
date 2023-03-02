import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import MainHeader from '../../components/MainHeader';
import {useSelector} from 'react-redux';
import {GroupChatIcon, Link, SearchBig} from '../../assets/icons/icons';
import ContactCard from '../../components/ContactCard';

const GroupParticipants = ({navigation, route}) => {
  const colorMode = useSelector(state => state.color.color);
  const {GroupInfo, AllParticipants, Participants} = route.params;

  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={`Group Participants ${AllParticipants.length}`}
        right={
          <TouchableOpacity>
            <SearchBig />
          </TouchableOpacity>
        }
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}
        ListHeaderComponent={() => (
          <View>
            <TouchableOpacity
              style={common.row}
              onPress={() =>
                navigation.navigate('AddParticipants', {
                  GroupInfo: GroupInfo,
                  Participants: Participants,
                })
              }>
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
                  Add Participants
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('InviteViaLink')}
              style={[
                common.row,
                {
                  marginTop: 20,
                  justifyContent: 'space-between',
                  marginBottom: 10,
                },
              ]}>
              <View style={common.row}>
                <View style={common.iconContainer}>
                  <Link />
                </View>
                <View style={{marginLeft: 20}}>
                  <Text
                    style={
                      colorMode === 'Dark'
                        ? common.white_Bold_18
                        : common.black_Bold_18
                    }>
                    Invite via Link
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        data={AllParticipants}
        keyExtractor={item => item.userId}
        renderItem={({item}) => (
          <ContactCard
            image={item.avatar}
            title={item.username}
            admin={item.userId === GroupInfo.groupAdmin ? true : false}
            //onPress={() => navigation.navigate('Chat')}
          />
        )}
      />
    </View>
  );
};

export default GroupParticipants;

const styles = StyleSheet.create({});
