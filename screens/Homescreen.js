import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SpeakPoint 👋</Text>
      <Text style={styles.subTitle}>
        Save your daily thoughts through speech or text. Let your mind speak freely.
      </Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Calendar')}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        📅 Go to Calendar
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Diary')}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        📖 Go to Diary
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('List')}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        🗒️ Entry List
      </Button>
    </View>
  );
};

export default HomeScreen;
