//React Imports
import React, { useMemo } from 'react';
//React Native Imports
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

//Component or Local Imports
import { Loader, SafeView, UserProfileView } from '@components';
import { formatTime } from '@utils';
import { User } from '@types';
import { Routes } from '@navigation';
import getHomeScreenStyles from './HomeScreenStyles';
import { useHomeHooks } from './HomeScreen.hooks';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const {
    isLoading,
    isDark,
    theme,
    getFilteredList,
  } = useHomeHooks(navigation);

  const homeScreenStyles = useMemo(() => getHomeScreenStyles(theme), [theme]);

  const renderItem = ({ item }: { item: User }) => {
    if (!item) return null;
    const unreadCount = item.unreadCount || 0;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate(Routes.ChatScreen, { user: item })}
      >
        <View style={homeScreenStyles.chatItem}>
          <UserProfileView user={item} size={55} />

          <View style={homeScreenStyles.middle}>
            <View style={homeScreenStyles.nameTimeRow}>
              <Text numberOfLines={1} style={homeScreenStyles.name}>
                {item.firstName} {item.lastName}
              </Text>
              {item.timestamp ? (
                <Text
                  style={unreadCount > 0 ? homeScreenStyles.timeUnread : homeScreenStyles.time}
                >
                  {formatTime(item.timestamp)}
                </Text>
              ) : null}
            </View>

            <View style={homeScreenStyles.msgBadgeRow}>
              <Text numberOfLines={1} style={homeScreenStyles.lastMsg}>
                {item.lastMessage || 'Start a conversation'}
              </Text>

              {unreadCount > 0 && (
                <View style={homeScreenStyles.badge}>
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
      <Text style={homeScreenStyles.emptyTitle}>
        No conversations yet
      </Text>
      <Text style={homeScreenStyles.emptySub}>
        Tap on a friend to start chatting. Your conversations will appear here.
      </Text>
    </View>
  );

  return (
    <SafeView backgroundColor={theme.background} edges={['top', 'bottom']}>
      <FlatList
        data={getFilteredList()}
        keyExtractor={item => item.uid}
        renderItem={renderItem}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        contentContainerStyle={homeScreenStyles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {isLoading && <Loader />}
    </SafeView>
  );
};

export default HomeScreen;
