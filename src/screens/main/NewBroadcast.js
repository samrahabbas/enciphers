import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import MainHeader from '../../components/MainHeader';
import {useSelector} from 'react-redux';
import {SearchBig} from '../../assets/icons/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ContactCard from '../../components/ContactCard';
import AntDesign from 'react-native-vector-icons/AntDesign';

const NewBroadcast = ({navigation}) => {
  const colorMode = useSelector(state => state.color.color);
  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'New Broadcast'}
        right={
          <TouchableOpacity>
            <SearchBig />
          </TouchableOpacity>
        }
      />
      <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
        <Text
          style={
            colorMode === 'Dark'
              ? common.white_Medium_18
              : common.gray3_Medium_18
          }>
          4 of 1550 selected
        </Text>
        <View style={{marginTop: 10}}>
          {/* <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={() => (
              <View>
                <Image
                  source={require('../../assets/images/Groupchat/Ellipse.png')}
                  style={styles.image}
                />
              </View>
            )}
          /> */}
          <View
            style={
              colorMode === 'Dark' ? styles.horizontal : styles.horizontal_light
            }>
            <View style={{marginRight: 15}}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse.png')}
                style={styles.image}
              />
              <View style={styles.indicator_cross}>
                <Ionicons
                  size={10}
                  name="close"
                  color={colorMode === 'Dark' ? colors.BLACK : colors.WHITE}
                />
              </View>
            </View>
            <View style={{marginRight: 15}}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(1).png')}
                style={styles.image}
              />
              <View style={styles.indicator_cross}>
                <Ionicons
                  size={10}
                  name="close"
                  color={colorMode === 'Dark' ? colors.BLACK : colors.WHITE}
                />
              </View>
            </View>
            <View style={{marginRight: 15}}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(2).png')}
                style={styles.image}
              />
              <View style={styles.indicator_cross}>
                <Ionicons
                  size={10}
                  name="close"
                  color={colorMode === 'Dark' ? colors.BLACK : colors.WHITE}
                />
              </View>
            </View>
            <View style={{marginRight: 15}}>
              <Image
                source={require('../../assets/images/Groupchat/Ellipse(3).png')}
                style={styles.image}
              />
              <View style={styles.indicator_cross}>
                <Ionicons
                  size={10}
                  name="close"
                  color={colorMode === 'Dark' ? colors.BLACK : colors.WHITE}
                />
              </View>
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <ContactCard indicator />
            <ContactCard />
            <ContactCard indicator />
            <ContactCard />
            <ContactCard indicator />
            <ContactCard />
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.messageContainer}
          onPress={() => navigation.navigate('BroadcastChat')}>
          <AntDesign name="arrowright" color={colors.WHITE} size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewBroadcast;

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.DARK_3,
  },
  horizontal_light: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_8,
  },
  indicator_cross: {
    top: 45,
    left: 45,
    width: 15,
    height: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: colors.endCall,
  },
  indicator_tick: {
    top: 45,
    left: 45,
    width: 15,
    height: 15,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: colors.primary_500,
  },
  footer: {
    flex: 1,
    bottom: 30,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    right: 20,
  },
  messageContainer: {
    width: 60,
    height: 60,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary_500,
  },
});
