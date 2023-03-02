import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {common} from '../styles/styles';
import {useNavigation} from '@react-navigation/native';

const MainHeader = ({right, title, onPressTitle, children, onPressLeft}) => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={[colors.Gradient1, colors.Gradient2]}
      style={!children && styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AntDesign
            name="arrowleft"
            color={colors.WHITE}
            size={26}
            onPress={onPressLeft ? onPressLeft : () => navigation.goBack()}
          />
          <TouchableOpacity
            style={{marginLeft: 20, width: '57%'}}
            onPress={onPressTitle}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={common.headerText}>
              {title}
            </Text>
          </TouchableOpacity>
        </View>
        {right}
      </View>
      {children && <View style={{marginTop: 10}}>{children}</View>}
    </LinearGradient>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
