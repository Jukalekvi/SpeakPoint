import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';  // Tuo yhteinen tyylitiedosto

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SpeakPoint 👋</Text>
      <Text style={styles.description}>
        Save your daily thoughts through speech or text. Let your mind speak freely.
      </Text>

      {/* Käytetään Paperin Button-komponenttia */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Calendar')}
        style={styles.button}
      >
        📅 Go to Calendar
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Diary')}
        style={styles.button}
      >
        📖 Go to Diary
      </Button>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('List')}
        style={styles.button}
      >
        📖 Go to the list of entries
      </Button>
    </View>
  );
};

export default HomeScreen;
