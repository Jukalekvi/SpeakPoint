# 📔 React Native Diary App

This is a simple diary application built with **React Native** and **Firebase Realtime Database**. The app allows users to create daily diary entries with a rating and a date. Users can also view, edit, and delete entries.

## ✨ Features

- ✍️ Add new diary entries with a thought, rating, and date
- 📅 Select the date using a calendar-style **date picker**
- ⭐ Rate your mood or experience (1–5)
- 📝 View only the **most recent** diary entry on the home screen
- 🔄 Edit or delete existing entries
- 📜 View a full list of all entries on a separate screen

## 📱 Screens

- **DiaryScreen**:  
  - Main screen to create a new entry  
  - Displays the latest entry  
  - Includes a calendar date picker  
- **ListScreen**:  
  - Shows a list of all saved entries in descending order  
- **EditEntryModal**:  
  - Modal that allows users to edit existing entries  
- **Calendar (DateSelector)**:  
  - Used on both create and edit views to select or update the date of an entry

## 🛠️ Tech Stack

- React Native
- Firebase Realtime Database
- React Native Paper (UI components)
- React Navigation

## 🔧 Setup Instructions

### 1. Clone the repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/yourusername/diary-app.git
cd diary-app
npm install
npx expo start
```

### 2. Set up Firebase

To store your diary entries in the Firebase Realtime Database, you'll need to set up Firebase. Here's how:

Go to the Firebase Console.

Create a new project or use an existing one.

Navigate to Realtime Database and create a new database.

Set the read and write rules to public for development purposes (you can change this later to more secure rules):

```bash
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
In the Firebase Console, go to Project Settings > General > Your Apps and copy the Firebase configuration details.

In your project, create a new file firebaseConfig.js in the root directory of the app and add the following code (replace the placeholder values with your Firebase project's actual values):

```bash
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
```
3. Run the project (Expo)
If you're using Expo to run your project, use the following command:

```bash
npx expo start
```
This will start the Expo development server, and you can scan the QR code using the Expo Go app to see the app on your device.

4. Alternatively, if you're using plain React Native (without Expo):
If you're running the project using React Native without Expo, use the following commands depending on your target platform:

For Android:
```bash
npx react-native run-android
```
For iOS:
```bash
npx react-native run-ios
```

If you have any questions or things you want to talk about this application, please contact this applications creator via email. Have a good day!
