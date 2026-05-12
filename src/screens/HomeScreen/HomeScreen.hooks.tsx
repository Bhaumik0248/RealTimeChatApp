//React Imports
import React, { useEffect, useState } from 'react';
//Third Party Imports
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';
//Component or Local Imports
import { getTheme } from '@utils';
import { User, RootState } from '@types';

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
  };
};
