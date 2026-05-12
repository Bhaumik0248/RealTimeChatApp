//React Imports
import React, { useState, useMemo } from 'react';
//React Native Imports
import { View, Image, Text } from 'react-native';
//Third Party Imports
import { useSelector } from 'react-redux';
//Component or Local Imports
import { RootState } from '@types';
import { getTheme } from '@utils';
import { getUserProfileViewStyles } from './userProfileView.styles';

interface UserProfileViewProps {
  user?: {
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
  size?: number;
  paddingRight?: number;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user = {},
  size = 50,
  paddingRight = 0,
}) => {
  const isDark = useSelector((state: RootState) => state.theme?.isDark);
  const theme = getTheme(isDark);
  const styles = useMemo(
    () => getUserProfileViewStyles(theme, size),
    [theme, size],
  );

  const { firstName = '', lastName = '', profileImage = '' } = user;

  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🧠 Get initials
  const getInitials = () => {
    const f = firstName?.charAt(0) || '';
    const l = lastName?.charAt(0) || '';
    return (f + l).toUpperCase();
  };

  const handleImageLoad = () => setIsLoaded(true);
  const handleImageError = () => setImageError(true);

  return (
    <View style={{ paddingRight }}>
      <View style={styles.placeholder}>
        {(!profileImage || imageError || !isLoaded) && (
          <Text style={styles.initials}>{getInitials()}</Text>
        )}

        {!!profileImage && !imageError && (
          <Image
            source={{ uri: profileImage }}
            style={styles.image}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </View>
    </View>
  );
};
