import Toast from 'react-native-toast-message';

export const showSnackbar = ({
  msg,
  position = 'bottom',
  type = 'success',
}) => {
  Toast.show({
    type,
    text1: msg,
    position,
    visibilityTime: 2000,
  });
};
