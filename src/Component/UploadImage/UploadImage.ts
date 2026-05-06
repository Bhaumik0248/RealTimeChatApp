import { launchImageLibrary, launchCamera, Asset, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { showSnackbar, Constant } from '@utils';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dguaazt2a/image/upload';
const UPLOAD_PRESET = 'chat-app-upload';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('requestCameraPermission Error:', err);
      return false;
    }
  }
  return true;
};

export const pickImage = async () => {
  try {
    console.log('pickImage: initiating launchImageLibrary');
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
      includeExtra: true,
    };

    const result = await launchImageLibrary(options);
    console.log('pickImage result:', JSON.stringify(result));

    if (result.didCancel) {
      console.log('pickImage: User cancelled image picker');
      return null;
    }

    if (result.errorCode) {
      console.error('pickImage Error Code:', result.errorCode);
      console.error('pickImage Error Message:', result.errorMessage);

      showSnackbar({
        msg: result.errorMessage || 'Failed to pick image from gallery',
        type: 'error',
      });
      return null;
    }

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      console.log('pickImage: Selected asset:', asset.uri);
      return asset;
    }

    return null;
  } catch (error) {
    console.error('pickImage Critical Error:', error);
    showSnackbar({
      msg: 'An unexpected error occurred while picking image.',
      type: 'error',
    });
    return null;
  }
};

export const takePhoto = async () => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      showSnackbar({
        msg: 'Camera permission denied',
        type: 'error',
      });
      return null;
    }

    console.log('takePhoto: initiating launchCamera');
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
      includeExtra: true,
    };

    const result = await launchCamera(options);
    console.log('takePhoto result:', JSON.stringify(result));

    if (result.didCancel) {
      console.log('takePhoto: User cancelled camera');
      return null;
    }

    if (result.errorCode) {
      console.error('takePhoto Error Code:', result.errorCode);
      showSnackbar({
        msg: result.errorMessage || 'Failed to take photo',
        type: 'error',
      });
      return null;
    }

    if (result.assets && result.assets.length > 0) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    console.error('takePhoto Critical Error:', error);
    showSnackbar({
      msg: 'An unexpected error occurred while opening camera.',
      type: 'error',
    });
    return null;
  }
};

export const uploadImage = async (imageInput: Asset | string | null) => {
  if (!imageInput) return null;

  try {
    const data = new FormData();

    // 🧠 Handle both asset object and URI string
    const uri = typeof imageInput === 'string' ? imageInput : imageInput.uri;
    const type =
      typeof imageInput === 'string'
        ? 'image/jpeg'
        : imageInput.type || 'image/jpeg';
    const name =
      typeof imageInput === 'string'
        ? 'upload.jpg'
        : imageInput.fileName || 'upload.jpg';

    if (!uri) return null;

    data.append('file', {
      uri,
      type,
      name,
    });
    data.append('upload_preset', UPLOAD_PRESET);
    data.append('cloud_name', 'dguaazt2a');

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await response.json();
    if (result.secure_url) {
      return result.secure_url;
    } else {
      console.log('Cloudinary Upload Error:', result);
      Alert.alert(
        'Upload Failed',
        result.error?.message || 'Could not upload image.',
      );
      return null;
    }
  } catch (error) {
    console.log('uploadImage Error:', error);
    Alert.alert('Upload Failed', 'A network error occurred while uploading.');
    return null;
  }
};
