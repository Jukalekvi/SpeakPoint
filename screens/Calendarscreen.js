import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import { Text, Button, Card } from 'react-native-paper';  // Tuotu Paper-komponentteja
import styles from '../styles';  // Tuodaan ulkopuoliset tyylit

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [entries, setEntries] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    const entriesRef = ref(database, 'entries');

    onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const allEntries = Object.values(data);
      setEntries(allEntries);

      const newMarkedDates = {};

      allEntries.forEach(entry => {
        if (!entry.date || !entry.rating) return;

        const [day, month, year] = entry.date.split('.');
        if (!day || !month || !year) return;

        const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        let color;
        switch (entry.rating) {
          case 1: color = '#ff4d4d'; break; // punainen
          case 2: color = '#ffa64d'; break; // oranssi
          case 3: color = '#ffff66'; break; // keltainen
          case 4: color = '#85e085'; break; // vihreä
          case 5: color = '#4da6ff'; break; // sininen
          default: color = '#d3d3d3';
        }

        newMarkedDates[formatted] = {
          customStyles: {
            container: {
              backgroundColor: color,
              borderRadius: 50,
            },
            text: {
              color: 'black',
              fontWeight: 'bold',
            },
          },
        };
      });

      setMarkedDates(newMarkedDates);
    });
  }, []);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);

    const [year, month, dayNum] = day.dateString.split('-');
    const formatted = `${parseInt(dayNum)}.${parseInt(month)}.${year}`;

    const filtered = entries.filter(entry => entry.date === formatted);
    setFilteredEntries(filtered);
  };

  // Yhdistetään merkityt ja valittu päivä
  const combinedMarkedDates = {
    ...markedDates,
    ...(selectedDate && {
      [selectedDate]: {
        ...(markedDates[selectedDate]?.customStyles
          ? { customStyles: { ...markedDates[selectedDate].customStyles } }
          : {}),
        selected: true,
        selectedColor: 'black',
      },
    }),
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar with Ratings</Text>

      <Calendar
        markingType={'custom'}
        markedDates={combinedMarkedDates}
        onDayPress={onDayPress}
        style={styles.calendar}
        theme={{
          textDayFontWeight: '600',
          textMonthFontWeight: 'bold',
          arrowColor: 'black',
        }}
      />

      {selectedDate && (
        <View style={styles.entrySection}>
          <Text style={styles.entryTitle}>Entries on {selectedDate}:</Text>
          {filteredEntries.length > 0 ? (
            <FlatList
              data={filteredEntries}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Card style={styles.entryBox}>
                  <Card.Content>
                    <Text>Rating: {item.rating}</Text>
                    <Text>{item.text}</Text>
                  </Card.Content>
                </Card>
              )}
            />
          ) : (
            <Text>No entries</Text>
          )}
        </View>
      )}

      {/* Button component from Paper */}
      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
        Go Back
      </Button>
    </View>
  );
};

export default CalendarScreen;
