import { StyleSheet, Dimensions, ViewStyle, ImageStyle } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Styles {
  container: ViewStyle;
  closeButton: ViewStyle;
  imageContainer: ViewStyle;
  image: ImageStyle;
}

export const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
});

export { width, height };
