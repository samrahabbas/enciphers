import React, {useRef, useState, useEffect} from 'react';
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Portal} from 'react-native-paper';
import {useSelector} from 'react-redux';
import colors from '../constants/colors';
import {common} from '../styles/styles';

const BottomPopup = ({
  show,
  onDismiss,
  children,
  enableBackdropDismiss,
  text,
  style,
  Height,
  background,
  topOff,
}) => {
  const bottomSheetHeight = Height
    ? Height
    : Dimensions.get('window').height * 0.5;
  const deviceWidth = Dimensions.get('window').width;
  const bottom = useRef(new Animated.Value(-bottomSheetHeight)).current;
  const colorMode = useSelector(state => state.color.color);
  const [open, setOpen] = useState(show);

  const onGesture = event => {
    if (event.nativeEvent.translationY > 0) {
      bottom.setValue(-event.nativeEvent.translationY);
    }
  };

  const onGestureEnd = event => {
    if (event.nativeEvent.translationY > bottomSheetHeight / 2) {
      onDismiss();
    } else {
      bottom.setValue(0);
    }
  };

  useEffect(() => {
    if (show) {
      setOpen(show);
      Animated.timing(bottom, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(bottom, {
        toValue: -bottomSheetHeight,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        setOpen(false);
      });
    }
  }, [show]);

  if (!open) {
    return null;
  }
  return (
    <Portal>
      <Pressable
        onPress={enableBackdropDismiss ? onDismiss : undefined}
        style={styles.backDrop}
      />

      <Animated.View
        style={[
          styles.root,
          {
            height: bottomSheetHeight,
            bottom: bottom,
            shadowOffset: {
              height: -3,
            },
          },
          {...styles.common, ...style},
          background && {backgroundColor: background},
        ]}>
        <GestureHandlerRootView>
          <PanGestureHandler onGestureEvent={onGesture} onEnded={onGestureEnd}>
            <Animated.View
              style={[
                styles.header,
                topOff && {height: 0},
                {
                  position: 'relative',
                  shadowOffset: {
                    height: 3,
                  },
                },
                {...styles.common, ...style},
                background && {backgroundColor: background},
              ]}>
              <View
                style={{alignItems: 'center', marginTop: 30, marginBottom: 10}}>
                <Text style={common.red_bold_24}>{text}</Text>
              </View>
              <View
                style={
                  colorMode === 'Dark'
                    ? common.line
                    : [common.line_light, {backgroundColor: colors.SHADOW}]
                }
              />
              {!topOff && (
                <View
                  style={[
                    {
                      width: 38,
                      height: 3,
                      borderRadius: 10,
                      position: 'absolute',
                      top: 8,
                      left: (deviceWidth - 35) / 2,
                      zIndex: 10,
                      backgroundColor: colors.SHADOW,
                    },
                    colorMode === 'Dark'
                      ? {backgroundColor: colors.DARK_3}
                      : {backgroundColor: colors.GRAY_300},
                  ]}
                />
              )}
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
        {children}
      </Animated.View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray_600,
  },
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: colors.gray_600,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  header: {
    height: 100,
    paddingHorizontal: 20,
    backgroundColor: colors.gray_600,
  },
  common: {
    // shadowColor: colors.BLACK,
    // shadowOffset: {
    //   width: 0,
    // },
    // shadowOpacity: 0.24,
    // shadowRadius: 4,
    // elevation: 0.5,
  },
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 80,
    backgroundColor: colors.blurBG,
  },
});

export default BottomPopup;
