import React from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { getTheme } from '@utils';
import { RootState } from '@types';
import { useSelector } from 'react-redux';
import styles from './CustomSubmitButton.styles';

export interface CustomSubmitButtonProps extends TouchableOpacityProps {
  label?: string;
  isLoading?: boolean;
}

const CustomSubmitButton: React.FC<CustomSubmitButtonProps> = ({
  label,
  isLoading,
  style,
  children,
  ...rest
}) => {
  const isDark = useSelector((state: RootState) => state.theme?.isDark);
  const theme = getTheme(isDark);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, { backgroundColor: theme.primaryBtnBg }, style]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.primaryBtnText} />
      ) : children ? (
        children
      ) : (
        <Text style={[styles.buttonText, { color: theme.primaryBtnText }]}>
          {label || 'Submit'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomSubmitButton;
