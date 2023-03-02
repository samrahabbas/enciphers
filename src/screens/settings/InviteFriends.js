import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {useSelector} from 'react-redux';
import MainHeader from '../../components/MainHeader';
import {common} from '../../styles/styles';
import ContactCard from '../../components/ContactCard';

const InviteFriends = () => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader title={'Invite Friends'} />
      <ScrollView style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
        <ContactCard
          button={
            <View style={styles.button}>
              <Text style={common.p500_Bold_14}>Invited</Text>
            </View>
          }
        />
        <ContactCard
          button={
            <View style={styles.fill_Button}>
              <Text style={common.white_Bold_14}>Invite</Text>
            </View>
          }
        />
        <ContactCard
          button={
            <View style={styles.button}>
              <Text style={common.p500_Bold_14}>Invited</Text>
            </View>
          }
        />
        <ContactCard
          button={
            <View style={styles.button}>
              <Text style={common.p500_Bold_14}>Invited</Text>
            </View>
          }
        />
        <ContactCard
          button={
            <View style={styles.fill_Button}>
              <Text style={common.white_Bold_14}>Invite</Text>
            </View>
          }
        />
        <ContactCard
          button={
            <View style={styles.fill_Button}>
              <Text style={common.white_Bold_14}>Invite</Text>
            </View>
          }
        />
        <ContactCard
          button={
            <View style={styles.fill_Button}>
              <Text style={common.white_Bold_14}>Invite</Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
};

export default InviteFriends;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary_500,
  },
  fill_Button: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary_500,
  },
});
