//Third Party Imports
import Toast from 'react-native-toast-message';

export const showSnackbar = ({
  msg,
  position = 'bottom',
  type = 'success',
}: {
  msg: string;
  position?: 'top' | 'bottom';
  type?: 'success' | 'error' | 'info';
}) => {
  Toast.show({
    type,
    text1: msg,
    position,
    visibilityTime: 2000,
  });
};
