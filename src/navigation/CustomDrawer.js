import React from 'react';
import { View, Text, TouchableOpacity, Image, Switch } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import { CLEAR_USER } from '../redux/userInfo/userAction';
import { getTheme } from '../utils/ThemeColors';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import customDrawerStyles from './CustomDrawerStyles';
import { saveUser } from '../redux/userInfo/userAction';
import { setTheme } from '../redux/theme/themeAction';
const CustomDrawer = props => {
  const { isDark } = useSelector(state => state.theme);
  const theme = getTheme(isDark);
  const user = useSelector(state => state.user);
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
            props.navigation.navigate('OnBoarding', { forEditProfile: true });
          }}
          style={[customDrawerStyles.header]}
        >
          <Image
            source={{
              uri: user?.profileImage || 'https://via.placeholder.com/150',
            }}
            style={customDrawerStyles.profileImg}
          />
          <View style={customDrawerStyles.headerInfo}>
            <Text style={[customDrawerStyles.name, { color: theme.text }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[customDrawerStyles.email, { color: theme.subText }]}>
              {user?.email}
            </Text>
          </View>
        </TouchableOpacity>
        {/* 
        <View style={customDrawerStyles.drawerItems}>
          <DrawerItemList
            {...props}
            activeTintColor={theme.primary}
            inactiveTintColor={theme.text}
            labelStyle={[customDrawerStyles.drawerLabel, { color: theme.text }]}
          />
        </View> */}

        {/* Theme Settings Section */}
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

export default CustomDrawer;
