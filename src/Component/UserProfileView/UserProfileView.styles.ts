import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';

interface Styles {
  image: ImageStyle;
  placeholder: ViewStyle;
  initials: TextStyle;
}

export const getUserProfileViewStyles = (theme: any, size: number) => StyleSheet.create<Styles>({
  image: {
    resizeMode: 'cover',
    width: size,
    height: size,
    borderRadius: size / 2,
    position: 'absolute',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: theme.primary,
    overflow: 'hidden',
  },
  initials: {
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.primaryBtnText,
    position: 'absolute',
  },
});
