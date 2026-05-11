import React, { useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@types';
import { getTheme } from '@utils';
import { getCustomSubmitButtonStyles } from './customSubmitButton.styles';

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
  const styles = useMemo(() => getCustomSubmitButtonStyles(theme), [theme]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, style]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.primaryBtnText} />
      ) : children ? (
        children
      ) : (
        <Text style={styles.buttonText}>{label || 'Submit'}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomSubmitButton;
