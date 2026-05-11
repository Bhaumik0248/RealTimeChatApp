//React Imports
import React, { useEffect, useState } from 'react';
//Third Party Imports
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
//Component or Local Imports
import { formatTime, getTheme } from '@utils';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserProfileView } from '@components';
import { User, RootState } from '@types';
import { Routes } from '@navigation';
import homeScreenStyles from './HomeScreenStyles';

export const useHomeHooks = (navigation: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isDark = useSelector((state: RootState) => state.theme?.isDark);
  const theme = getTheme(isDark);

  useEffect(() => {
    setIsLoading(true);
    const currentUid = auth().currentUser?.uid;
    if (!currentUid) {
      setIsLoading(false);
      return;
    }

    database()
      .ref(`/users/${currentUid}`)
      .once('value')
      .then(snapshot => {
        setCurrentUser(snapshot.val());
      });

    const usersRef = database().ref('/users');
    const onValueChange = usersRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.values(data).filter(
          (user: any) =>
            (user as User)?.uid && (user as User).uid !== currentUid,
        ) as User[];
        setIsLoading(false);
        setUsers(userList);
      } else {
        setIsLoading(false);
        setUsers([]);
      }
    });

    return () => usersRef.off('value', onValueChange);
  }, []);

  const [chatMap, setChatMap] = useState<Record<string, User>>({});

  useEffect(() => {
    const currentUid = auth().currentUser?.uid;
    if (!currentUid) return;

    const ref = database().ref(`chatList/${currentUid}`);
    ref.on('value', snapshot => {
      setChatMap(snapshot.val() || {});
    });

    return () => ref.off();
  }, []);

  const getFilteredList = () => {
    const list = users.map(user => {
      const chat = chatMap[user.uid] || {};
      return {
        ...user,
        lastMessage: chat.lastMessage || '',
        unreadCount: chat.unreadCount || 0,
        timestamp: chat.timestamp || 0,
      };
    });

    const filtered = list.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });

    return filtered.sort((a, b) => {
      const aTime = a.timestamp || 0;
      const bTime = b.timestamp || 0;
      return bTime - aTime;
    });
  };

  const renderItem = ({ item }: { item: User }) => {
    if (!item) return null;
    const unreadCount = item.unreadCount || 0;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate(Routes.ChatScreen, { user: item })}
      >
        <View
          style={[
            homeScreenStyles.chatItem,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <UserProfileView user={item} size={55} />

          <View style={homeScreenStyles.middle}>
            <View style={homeScreenStyles.nameTimeRow}>
              <Text
                numberOfLines={1}
                style={[homeScreenStyles.name, { color: theme.text }]}
              >
                {item.firstName} {item.lastName}
              </Text>
              {item.timestamp ? (
                <Text
                  style={[
                    homeScreenStyles.time,
                    {
                      color: unreadCount > 0 ? theme.success : theme.subText,
                    },
                  ]}
                >
                  {formatTime(item.timestamp)}
                </Text>
              ) : null}
            </View>

            <View style={homeScreenStyles.msgBadgeRow}>
              <Text
                numberOfLines={1}
                style={[homeScreenStyles.lastMsg, { color: theme.subText }]}
              >
                {item.lastMessage || 'Start a conversation'}
              </Text>

              {unreadCount > 0 && (
                <View
                  style={[
                    homeScreenStyles.badge,
                    { backgroundColor: theme.success },
                  ]}
                >
                  <Text style={homeScreenStyles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={homeScreenStyles.emptyContainer}>
      <IoniconsIcon name="chatbubbles-outline" size={80} color={theme.border} />
      <Text style={[homeScreenStyles.emptyTitle, { color: theme.text }]}>
        No conversations yet
      </Text>
      <Text style={[homeScreenStyles.emptySub, { color: theme.subText }]}>
        Tap on a friend to start chatting. Your conversations will appear here.
      </Text>
    </View>
  );

  return {
    users,
    setUsers,
    searchQuery,
    setSearchQuery,
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    isDark,
    theme,
    getFilteredList,
    renderItem,
    renderEmptyState,
  };
};
