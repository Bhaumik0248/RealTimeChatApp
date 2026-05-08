import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export const Layout = {
  window: {
    width,
    height,
  },
  screen: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  },
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

export const useBottomInsets = () => {
  const insets = useSafeAreaInsets();
  return insets.bottom;
};
