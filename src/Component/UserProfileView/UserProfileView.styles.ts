import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';

interface Styles {
  image: ImageStyle;
  placeholder: ViewStyle;
  initials: TextStyle;
}

export const styles = StyleSheet.create<Styles>({
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
