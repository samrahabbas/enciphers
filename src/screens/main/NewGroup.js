import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../constants/colors';
import {common} from '../../styles/styles';
import MainHeader from '../../components/MainHeader';
import {useDispatch, useSelector} from 'react-redux';
import {SearchBig} from '../../assets/icons/icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ContactCard from '../../components/ContactCard';
import AntDesign from 'react-native-vector-icons/AntDesign';

const NewGroup = ({navigation}) => {
  const colorMode = useSelector(state => state.color.color);
  const contacts = useSelector(state => state.contact.contacts);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);

  const selectUser = item => {
    if (selected.length === 0) {
      setSelected(array => [...array, item]);
    }
    // check if already in selected array
    if (selected.length !== 0) {
      const find = selected.find(el => el._id === item._id);
      if (find) {
        let array = [...selected];
        let index = array.indexOf(find);
        if (index !== -1) {
          array.splice(index, 1);
          setSelected(array);
        }
      } else {
        setSelected(array => [...array, item]);
      }
    }
  };

  const removeFromSelected = item => {
    const find = selected.find(el => el._id === item._id);
    if (find) {
      let array = [...selected];
      let index = array.indexOf(find);
      if (index !== -1) {
        array.splice(index, 1);
        setSelected(array);
      }
    }
  };

  const isSelected = item => {
    if (selected.length !== 0) {
      const find = selected.find(el => el._id === item._id);
      if (find) {
        return true;
      }
    } else return false;
  };

  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader
        title={'New Group'}
        right={
          <TouchableOpacity>
            <SearchBig />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={contacts}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
            <Text
              style={
                colorMode === 'Dark'
                  ? common.white_Medium_18
                  : common.gray3_Medium_18
              }>
              {selected.length} of {contacts.length} selected
            </Text>
            <View
              style={
                colorMode === 'Dark'
                  ? styles.horizontal
                  : styles.horizontal_light
              }>
              <FlatList
                horizontal
                data={selected}
                keyExtractor={item => item._id}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <View style={{marginRight: 10}}>
                    <Image source={{uri: item.avatar}} style={styles.image} />
                    <TouchableOpacity
                      onPress={() => removeFromSelected(item)}
                      style={styles.indicator_cross}>
                      <Ionicons
                        size={10}
                        name="close"
                        color={
                          colorMode === 'Dark' ? colors.BLACK : colors.WHITE
                        }
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </View>
        )}
        renderItem={({item}) => {
          if (selected.find(p => p._id === item._id)) {
          } else
            return (
              <View style={{paddingHorizontal: 20}}>
                <ContactCard
                  image={item.avatar}
                  title={item.username}
                  indicator={isSelected(item)}
                  onPress={() => selectUser(item)}
                />
              </View>
            );
        }}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.messageContainer}
          onPress={() => {
            if (selected.length <= 1) {
              alert('Select more users');
            } else navigation.navigate('NewGroupSubject', {selected: selected});
          }}>
          <AntDesign name="arrowright" color={colors.WHITE} size={22} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewGroup;

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
