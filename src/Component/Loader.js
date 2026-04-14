import React from 'react';
import { View, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { getTheme } from '../utils/ThemeColors';

const Loader = ({ visible = true }) => {
  const isDark = useSelector(state => state.theme?.isDark);
  const theme = getTheme(isDark);

  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={[styles.activityIndicatorWrapper, { backgroundColor: theme.card }]}>
          <ActivityIndicator animating={visible} color={theme.primary} size="large" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Loader;
