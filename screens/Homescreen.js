import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ textAlign: 'center' }}>
        Welcome to our expo app, the SpeakPoint! With this application, you can save your daily notes and thoughts through speaking and texting.
      </Text>
      <Button title="Go to Calendar" onPress={() => navigation.navigate('Calendar')} />
    </View>
  );
};

export default HomeScreen;
    