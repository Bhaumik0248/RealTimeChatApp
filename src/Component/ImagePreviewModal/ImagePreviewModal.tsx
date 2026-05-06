import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { styles, width } from './ImagePreviewModal.styles';

interface ImagePreviewModalProps {
  visible: boolean;
  imageList: string[];
  currentIndex: number;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  visible,
  imageList,
  currentIndex,
  onClose,
}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: currentIndex,
          animated: false,
        });
      }, 100);
    }
  }, [visible, currentIndex]);

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
    </View>
  );

  return (
    <Modal visible={visible} animationType="fade">
      <StatusBar hidden />

      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={28} color="#fff" />
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={imageList}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}_${index}`}
          getItemLayout={(_data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>
    </Modal>
  );
};

export default ImagePreviewModal;
