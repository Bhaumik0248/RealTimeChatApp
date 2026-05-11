import { StyleSheet } from 'react-native';

export const getCustomSubmitButtonStyles = (theme: any) => StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    backgroundColor: theme.primaryBtnBg,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.primaryBtnText,
  },
});
