import { StyleSheet } from 'react-native';
import { Layout } from '@resources';

const customDrawerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'flex-start',
    marginBottom: 20,
    borderBottomRightRadius: 30,
  },
  headerInfo: {
    marginTop: 15,
  },
  profileImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
  drawerItems: {
    paddingHorizontal: 10,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: -10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutText: {
    color: '#ff3b30',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 15,
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.5,
  },
});

export default customDrawerStyles;
