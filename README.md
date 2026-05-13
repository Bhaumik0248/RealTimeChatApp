# Real-Time Chat App 🚀

A premium, high-performance real-time chat application built with **React Native** and **Firebase**. This app features a local-first notification system, smooth theme transitions, and an optimized mobile experience.

## ✨ Features

- **Real-Time Messaging**: Instant message delivery powered by Firebase Realtime Database.
- **Local Notification System**: Smart notification handling using Notifee.
  - Suppresses notifications for the sender.
  - Automatically hides notifications if you are already viewing the chat.
  - Tap to navigate directly to the conversation.
- **Premium UI/UX**:
  - **Dynamic Themes**: Smooth animated transitions between Light and Dark modes.
  - **Auto-Scrolling**: Chat automatically scrolls to the newest message.
  - **Keyboard Optimization**: Seamless input handling for both iOS and Android.
- **Image Sharing**: Send photos directly from your camera or gallery.
- **Unread Counters**: Real-time tracking of missed messages.

## 🛠️ Technology Stack

- **Framework**: React Native
- **Database**: Firebase Realtime Database
- **Auth**: Firebase Authentication
- **Notifications**: Notifee & Firebase Cloud Messaging
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation

## 🚀 Getting Started

### Prerequisites
- Node.js & npm/yarn
- CocoaPods (for iOS)
- Firebase Account & Project

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Bhaumik0248/RealTimeChatApp.git
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Install iOS pods:
   ```bash
   cd ios && pod install && cd ..
   ```
4. Run the app:
   ```bash
   # Android
   npm run android
   # iOS
   npm run ios
   ```

## 📱 Screenshots
*(Add your own screenshots here to wow your visitors!)*

## 📄 License
This project is licensed under the MIT License.
