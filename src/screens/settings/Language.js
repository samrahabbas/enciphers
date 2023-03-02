import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import {useSelector} from 'react-redux';
import MainHeader from '../../components/MainHeader';
import {common} from '../../styles/styles';
import RowComponent from '../../components/RowComponent';
import {RadioButton} from 'react-native-paper';

const Language = () => {
  const colorMode = useSelector(state => state.color.color);
  const [checked, setChecked] = React.useState('first');

  return (
    <View
      style={
        colorMode === 'Dark' ? common.container_dark : common.container_light
      }>
      <MainHeader title={'Language'} />
      <ScrollView style={{flex: 1, paddingHorizontal: 20}}>
        <View style={{marginTop: 20}}>
          <Text
            style={
              colorMode === 'Dark' ? common.white_Bold_20 : common.black_Bold_20
            }>
            Suggested
          </Text>
        </View>
        <RowComponent
          text={'English (US)'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="first"
              status={checked === 'first' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('first')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <RowComponent
          text={'English (UK)'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="second"
              status={checked === 'second' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('second')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <View
          style={[
            colorMode === 'Dark' ? common.line : common.line_light,
            {marginVertical: 20},
          ]}
        />
        <Text
          style={
            colorMode === 'Dark' ? common.white_Bold_20 : common.black_Bold_20
          }>
          Language
        </Text>
        <RowComponent
          text={'Mandarin'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="third"
              status={checked === 'third' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('third')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <RowComponent
          text={'Hindi'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="fourth"
              status={checked === 'fourth' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('fourth')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <RowComponent
          text={'Spanish'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="fifth"
              status={checked === 'fifth' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('fifth')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <RowComponent
          text={'French'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="sixth"
              status={checked === 'sixth' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('sixth')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <RowComponent
          text={'French'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="seventh"
              status={checked === 'seventh' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('seventh')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <RowComponent
          text={'Arabic'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="eighth"
              status={checked === 'eighth' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('eighth')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <RowComponent
          text={'Bengali'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="ninth"
              status={checked === 'ninth' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('ninth')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <RowComponent
          text={'Russian'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="tenth"
              status={checked === 'tenth' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('tenth')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <RowComponent
          text={'Indonesia'}
          style={{marginTop: 20}}
          iconRight={
            <RadioButton
              value="eleventh"
              status={checked === 'eleventh' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('eleventh')}
              color={colors.primary_500}
              uncheckedColor={colors.primary_500}
            />
          }
        />
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
};

export default Language;

const styles = StyleSheet.create({});
