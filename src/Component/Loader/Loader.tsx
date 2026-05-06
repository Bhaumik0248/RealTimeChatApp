import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { getTheme } from '@utils';
import { styles } from './Loader.styles';

interface LoaderProps {
  visible?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ visible = true }) => {
  const isDark = useSelector((state: any) => state.theme?.isDark);
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

export default Loader;
