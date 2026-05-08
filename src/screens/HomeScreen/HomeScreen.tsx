//React Imports
import React from 'react';
//React Native Imports
import { View, FlatList } from 'react-native';

//Component or Local Imports
import { Loader, SafeView } from 'src/component';
import homeScreenStyles from './HomeScreenStyles';
import { useHomeHooks } from './HomeScreen.hooks';

const HomeScreen = ({ navigation }: { navigation: any }) => {
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
    <SafeView backgroundColor={theme.background} edges={['top', 'bottom']}>
      <FlatList
        data={getFilteredList()}
        keyExtractor={item => item.uid}
        renderItem={renderItem}
        contentContainerStyle={homeScreenStyles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {isLoading && <Loader />}
    </SafeView>
  );
};

export default HomeScreen;
