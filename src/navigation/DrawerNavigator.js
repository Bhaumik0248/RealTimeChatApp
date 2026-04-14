import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { getTheme } from '../utils/ThemeColors';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import CustomDrawer from '../navigation/CustomDrawer';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const isDark = useSelector(state => state.theme?.isDark);
  const theme = getTheme(isDark);

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        drawerType: 'slide',
        drawerStyle: {
          backgroundColor: theme.background,
          width: '75%',
        },
        headerStyle: {
          backgroundColor: theme.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 20 }}
          >
            <Icon name="menu" size={24} color={theme.text} />
          </TouchableOpacity>
        ),
        drawerActiveBackgroundColor: isDark ? '#333' : '#eef7ff',
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.subText,
      })}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
