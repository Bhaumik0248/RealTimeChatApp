# Real-Time Chat App 🚀

A premium, high-performance real-time chat application built with **React Native** and **Firebase**. This app features a robust notification system, direct reply capabilities, and granular chat controls.

## ✨ Features

- **Real-Time Messaging**: Instant message delivery powered by Firebase Realtime Database.
- **Premium Notification System**:
  - **Direct Reply**: Respond to messages directly from the notification tray (Foreground & Background).
  - **Smart Suppression**: Automatically silences notifications for the sender or when the chat is active.
  - **Deep Linking**: Tap notifications to jump directly into the conversation.
- **Granular Controls**:
  - **Per-Chat Mute**: Silence specific conversations to focus on what matters.
  - **Unread Counters**: Real-time tracking of missed messages across all chats.
- **Premium UI/UX**:
  - **Dynamic Themes**: Smooth animated transitions between Light and Dark modes.
  - **Auto-Scrolling**: Intelligently scrolls to the latest message.
  - **Keyboard Handling**: Seamless input experience optimized for iOS and Android.
- **Multimedia Support**: Send and receive high-quality images from camera or gallery.

## 🛠️ Technology Stack

- **Framework**: React Native
- **Database**: Firebase Realtime Database
- **Auth**: Firebase Authentication
- **Notifications**: Notifee & Firebase Cloud Messaging (FCM)
- **State Management**: Redux Toolkit & Persist
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

## 📄 License

This project is licensed under the MIT License.
