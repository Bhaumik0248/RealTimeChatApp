//React Imports
import React from 'react';
//React Native Imports
import { View, FlatList } from 'react-native';

//Component or Local Imports
import { Loader } from '@components';
import homeScreenStyles from './HomeScreenStyles';
import { useHomeHooks } from './HomeScreen.hooks';

const HomeScreen = ({ navigation }) => {
  const {
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
  } = useHomeHooks(navigation);

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
