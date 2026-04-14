import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const ImagePreviewModal = ({ visible, imageList, currentIndex, onClose }) => {
  const flatListRef = useRef();

  useEffect(() => {
    if (visible && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: false,
        });
      }, 100);
    }
  }, [visible]);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }} // ✅ FIXED
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <Modal visible={visible} animationType="fade">
      <StatusBar hidden />

      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Image slider */}
        <FlatList
          ref={flatListRef}
          data={imageList}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}_${index}`}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
});

export default ImagePreviewModal;
