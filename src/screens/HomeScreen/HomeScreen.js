//React Imports
import React, { useEffect, useState, useLayoutEffect } from 'react';
//React Native Imports
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
//Third Party Imports
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
//Component or Local Imports
import { formatTime, Constant, getTheme } from '@utils';
import { UserProfileView, Loader } from '@components';
import homeScreenStyles from './HomeScreenStyles';

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isDark = useSelector(state => state.theme?.isDark);

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
          user => user?.uid && user.uid !== currentUid,
        );
        setIsLoading(false);
        setUsers(userList);
      } else {
        setIsLoading(false);
        setUsers([]);
      }
    });

    return () => usersRef.off('value', onValueChange);
  }, []);

  const [chatMap, setChatMap] = useState({});

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
      if (a.timestamp && !b.timestamp) return -1;
      if (!a.timestamp && b.timestamp) return 1;
      return b.timestamp - a.timestamp;
    });
  };

  const renderItem = ({ item }) => {
    if (!item) return null;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('ChatScreen', { user: item })}
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
          <UserProfileView user={item} isOnline={true} size={55} />

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
                      color:
                        item.unreadCount > 0 ? theme.success : theme.subText,
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

              {item.unreadCount > 0 && (
                <View
                  style={[
                    homeScreenStyles.badge,
                    { backgroundColor: theme.success },
                  ]}
                >
                  <Text style={homeScreenStyles.badgeText}>
                    {item.unreadCount}
                  </Text>
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

  return (
    <View
      style={[
        homeScreenStyles.mainBackground,
        { backgroundColor: theme.background },
      ]}
    >
      <FlatList
        data={getFilteredList()}
        keyExtractor={item => item.uid}
        renderItem={renderItem}
        contentContainerStyle={homeScreenStyles.listContent}
        ListEmptyComponent={!isLoading && renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
      {isLoading && <Loader />}
    </View>
  );
};

export default HomeScreen;
