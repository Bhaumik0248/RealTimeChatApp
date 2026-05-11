//React Native Imports
import { StyleSheet, Platform } from 'react-native';
import { Layout } from '@resources';

const { width } = Layout.window;

const loginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 15,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  image: {
    marginTop: 40,
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 24,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headingText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
  },

  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },

  footerText: {
    fontSize: 14,
    opacity: 0.7,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default loginScreenStyles;
