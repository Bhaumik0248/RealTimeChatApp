//React Native Imports
import { StyleSheet, Platform } from 'react-native';

const getHomeScreenStyles = (theme: any) => StyleSheet.create({
  mainBackground: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.background,
    borderBottomColor: theme.border,
  },
  middle: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
    color: theme.text,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.subText,
  },
  timeUnread: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.success,
  },
  msgBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMsg: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
    color: theme.subText,
  },
  badge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    backgroundColor: theme.success,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    color: theme.text,
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.6,
    lineHeight: 20,
    color: theme.subText,
  },
});

export default getHomeScreenStyles;
