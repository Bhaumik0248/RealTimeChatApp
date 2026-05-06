import { StyleSheet, ViewStyle } from 'react-native';

interface Styles {
  modalBackground: ViewStyle;
  activityIndicatorWrapper: ViewStyle;
}

export const styles = StyleSheet.create<Styles>({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
