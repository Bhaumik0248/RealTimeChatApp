//React Imports
import React from 'react';
//React Native Imports
import { View, ActivityIndicator, Modal } from 'react-native';
//Third Party Imports
import { useSelector } from 'react-redux';
//Component or Local Imports
import { RootState } from '@types';
import { getTheme } from '@utils';
import { styles } from './loader.styles';

interface LoaderProps {
  visible?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ visible = true }) => {
  const isDark = useSelector((state: RootState) => state.theme?.isDark);
  const theme = getTheme(isDark);

  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={styles.modalBackground}>
        <View
          style={[
            styles.activityIndicatorWrapper,
            { backgroundColor: theme.card },
          ]}
        >
          <ActivityIndicator
            animating={visible}
            color={theme.primary}
            size="large"
          />
        </View>
      </View>
    </Modal>
  );
};
