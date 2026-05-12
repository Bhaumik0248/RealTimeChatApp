import React from 'react';
import { View, Text, TouchableOpacity, Image, Switch } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { RootState } from '@types';
import { useSelector, useDispatch } from 'react-redux';
import { saveUser, setTheme, CLEAR_USER } from '@store';
import { getTheme } from '@utils';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserProfileView } from '@components';
import { Routes } from '@navigation/routes';
import customDrawerStyles from './customDrawerStyles';

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const { isDark } = useSelector((state: RootState) => state.theme);
  const theme = getTheme(isDark);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        dispatch(saveUser(null));
      });
  };

  const toggleTheme = () => {
    dispatch(setTheme(!isDark));
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {/* Premium Header - Clickable for Edit Profile */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate(Routes.OnBoarding, {
              forEditProfile: true,
            });
          }}
          style={[customDrawerStyles.header]}
        >
          <View style={[customDrawerStyles.profileImg, { justifyContent: 'center', alignItems: 'center', padding: 0 }]}>
            <UserProfileView user={user || {}} size={66} />
          </View>
          <View style={customDrawerStyles.headerInfo}>
            <Text style={[customDrawerStyles.name, { color: theme.text }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[customDrawerStyles.email, { color: theme.subText }]}>
              {user?.email}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={[customDrawerStyles.section, { borderTopColor: theme.border }]}
        >
          <Text
            style={[customDrawerStyles.sectionTitle, { color: theme.subText }]}
          >
            Preferences
          </Text>

          <TouchableOpacity
            onPress={toggleTheme}
            style={customDrawerStyles.row}
          >
            <View style={customDrawerStyles.rowLabel}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={22}
                color={theme.primary}
              />
              <Text style={[customDrawerStyles.rowText, { color: theme.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={isDark ? '#f4f3f4' : '#f4f3f4'}
            />
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Footer / Logout */}
      <View
        style={[customDrawerStyles.footer, { borderTopColor: theme.border }]}
      >
        <TouchableOpacity
          onPress={handleLogout}
          style={customDrawerStyles.logoutBtn}
        >
          <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
          <Text style={customDrawerStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={[customDrawerStyles.version, { color: theme.subText }]}>
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
};
