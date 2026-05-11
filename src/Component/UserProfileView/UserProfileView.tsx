import React, { useState } from 'react';
import { View, Image, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@types';
import { getTheme } from '@utils';
import { styles } from './UserProfileView.styles';

interface UserProfileViewProps {
  user?: {
    firstName?: string;
    lastName?: string;
    profileImage?: string;
  };
  size?: number;
  paddingRight?: number;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({
  user = {},
  size = 50,
  paddingRight = 0,
}) => {
  const isDark = useSelector((state: RootState) => state.theme?.isDark);
  const theme = getTheme(isDark);
  const { firstName = '', lastName = '', profileImage = '' } = user;

  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🧠 Get initials
  const getInitials = () => {
    const f = firstName?.charAt(0) || '';
    const l = lastName?.charAt(0) || '';
    return (f + l).toUpperCase();
  };

  return (
    <View style={{ paddingRight }}>
      <View
        style={[
          styles.placeholder,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.primary,
            overflow: 'hidden',
          },
        ]}
      >
        {(!profileImage || imageError || !isLoaded) && (
          <Text style={[styles.initials, { color: theme.primaryBtnText, position: 'absolute' }]}>
            {getInitials()}
          </Text>
        )}
        
        {!!profileImage && !imageError && (
          <Image
            source={{ uri: profileImage }}
            style={[
              styles.image,
              { width: size, height: size, borderRadius: size / 2, position: 'absolute' },
            ]}
            onLoad={() => setIsLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </View>
    </View>
  );
};

export default UserProfileView;
