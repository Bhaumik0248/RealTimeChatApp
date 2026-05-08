//React Native Imports
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');
const chatScreenStyles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    paddingLeft: 10,
  },
  container: {
    flex: 1,
  },
  msgContiner: {
    padding: 10,
    borderRadius: 12,
  },
  timeText: { fontSize: 11, marginTop: 2, textAlign: 'right' },
  header: {
    alignSelf: 'center',
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    opacity: 0.9,
  },
  sectiontext: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },

  inputContainer: {
    flex: 1,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,

    // softer shadow
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingRight: 8,
    maxHeight: 120,
  },

  iconButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,

    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingRight: 8,
    maxHeight: 120,
  },

  iconButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,

    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  noChat: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: width * 0.65, height: height * 0.35, resizeMode: 'cover' },
});

export default chatScreenStyles;
