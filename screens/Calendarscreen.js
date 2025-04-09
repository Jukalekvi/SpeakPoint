import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const navigation = useNavigation();
  //Testdata to see the different colored circles
  const markedDates = {
    '2025-04-09': { marked: true, dotColor: 'blue' },
    '2025-04-08': { marked: true, dotColor: 'green' },
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to the Calendar!</Text>
      <Calendar
        markedDates={markedDates}
      />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default CalendarScreen;
