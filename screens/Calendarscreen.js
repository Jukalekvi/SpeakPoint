import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const entriesRef = ref(database, 'entries');
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      const entriesList = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];

      const newMarkedDates = {};

      entriesList.forEach(entry => {
        const entryDate = entry.date;
        const entryRating = entry.rating;

        if (entryDate && entryDate.includes('.')) {
          const [day, month, year] = entryDate.split('.');
          const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

          let selectedColor;
          switch (entryRating) {
            case 1:
              selectedColor = 'red';
              break;
            case 2:
              selectedColor = 'orange';
              break;
            case 3:
              selectedColor = 'yellow';
              break;
            case 4:
              selectedColor = 'green';
              break;
            case 5:
              selectedColor = 'blue';
              break;
            default:
              selectedColor = 'gray';
              break;
          }

          newMarkedDates[formattedDate] = {
            selected: true,
            selectedColor,
            marked: false,
          };
        }
      });

      setMarkedDates(newMarkedDates);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the Calendar!</Text>

      <View style={styles.calendarWrapper}>
        <Calendar markedDates={markedDates} style={styles.calendar} />
      </View>

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  calendarWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  calendar: {
    height: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
});
