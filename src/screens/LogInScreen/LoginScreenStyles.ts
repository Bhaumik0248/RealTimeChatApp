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
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
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

  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: '#ff5252',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 8,
    fontWeight: '500',
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
