import React from 'react';
import { StyleSheet, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS } from '../utils/constants';
import { ms, mvs } from '../utils/helper/metric';
import normalize from '../utils/helper/normalize';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  activeOpacity?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  containerStyle,
  buttonStyle,
  textStyle,
  disabled = false,
  activeOpacity = 1
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, disabled && styles.disabledButton, containerStyle]}
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: COLORS.primaryLight,
    height: mvs(54),
    borderRadius: ms(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGradient: {
    height: mvs(56),
    borderRadius: ms(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: FONTS.semiBold,
    fontSize: normalize(14),
    color: COLORS.white,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.5,
  },
});
