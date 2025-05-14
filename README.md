# Cleachtadh Laethúil - Irish Learning App

A React Native mobile application for learning Irish language through flashcards. This app is a conversion of a web-based Flask application to a mobile platform using React Native and Firebase.

## Features

- **Flashcard System**: Practice Irish vocabulary and phrases with an interactive flashcard system
- **User Authentication**: Register and login to track your progress
- **Score Tracking**: Keep track of your learning streak and success rate
- **Category Filtering**: Filter flashcards by category and type
- **Offline Support**: Basic functionality works without internet connection
- **Cross-Platform**: Works on both iOS and Android devices

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- Firebase account (for authentication and data storage)

### Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Get your Firebase configuration (apiKey, authDomain, etc.)
5. Update the `firebaseConfig.js` file with your credentials

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npx expo start
```

3. Run on a device or emulator:
   - Press `a` for Android
   - Press `i` for iOS (macOS only)
   - Scan the QR code with Expo Go app on your device

## Project Structure

- `/components` - Reusable UI components
- `/screens` - Main application screens
- `/navigation` - Navigation configuration
- `/services` - Firebase services
- `/data` - Local data storage

## Technologies Used

- React Native
- Expo
- Firebase (Authentication & Firestore)
- React Navigation

## License

This project is licensed under the MIT License.
