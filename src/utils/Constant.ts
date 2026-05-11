export const Constant = {
  APP_NAME: 'Real-Time Chat App',
  VALIDATION_MESSAGES: {
    USER_ID_NOT_FOUND: 'User ID not found. Please log in again.',
    PROFILE_UPDATED: 'Profile updated successfully!',
    PROFILE_SAVED: 'Profile saved successfully!',
    FAILED_TO_SAVE_PROFILE: 'Failed to save profile. Please try again.',
    ENTER_ALL_DETAILS: 'Please enter all required details.',
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again later.',
    ACCOUNT_CREATED: 'Account created successfully!',
    LOGGED_IN: 'Logged in successfully!',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    INCORRECT_PASSWORD: 'The password you entered is incorrect.',
    USER_NOT_FOUND: 'No user found with this email.',
    PROFILE_IMAGE_NOT_UPLOADED: 'User have not uploaded profile image yet.',
  },
  SNACKBAR: {
    TOP: 'top',
    BOTTOM: 'bottom',
  },
  UPLOAD_URLS: {
    CLOUDINARY_URL: 'https://api.cloudinary.com/v1_1/dguaazt2a/image/upload',
    UPLOAD_PRESET: 'chat-app-upload',
  },
} as const;
