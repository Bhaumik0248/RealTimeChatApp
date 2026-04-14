import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { getTheme } from '../utils/ThemeColors';

const UserProfileView = ({ user = {}, size = 50, paddingRight = 0 }) => {
  const isDark = useSelector(state => state.theme?.isDark);
  const theme = getTheme(isDark);
  const { firstName = '', lastName = '', profileImage = '' } = user;

  // 🧠 Get initials
  const getInitials = () => {
    const f = firstName?.charAt(0) || '';
    const l = lastName?.charAt(0) || '';
    return (f + l).toUpperCase();
  };

  return (
    <View style={{ paddingRight }}>
      {profileImage ? (
        <Image
          source={{ uri: profileImage }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.primary },
          ]}
        >
          <Text style={[styles.initials, { color: theme.primaryBtnText }]}>{getInitials()}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserProfileView;
