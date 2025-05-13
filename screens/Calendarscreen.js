import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import { Text, Button, Card } from 'react-native-paper';
import styles from '../styles';

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [entries, setEntries] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [latestEntry, setLatestEntry] = useState(null);

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
          case 1:
            color = '#ff0000';
            break;
          case 2:
            color = '#ff7f00';
            break;
          case 3:
            color = '#ffff00';
            break;
          case 4:
            color = '#ccff66';
            break;
          case 5:
            color = '#00cc44';
            break;
          default:
            color = '#d3d3d3';
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

    const filteredEntries = entries
      .filter(entry => entry.date === formatted)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (filteredEntries.length > 0) {
      setLatestEntry(filteredEntries[0]);
    } else {
      setLatestEntry(null);
    }
  };

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

      <Text style={styles.subTitle}>
        Welcome to the calendar! You can click on any day to see the latest entry for that date. Each day is marked with a color based on the rating of your entry. 
      </Text>

      <Calendar
        markingType={'custom'}
        markedDates={combinedMarkedDates}
        onDayPress={onDayPress}
        style={styles.calendar}
        theme={{
          textDayFontWeight: '600',
          textMonthFontWeight: 'bold',
          arrowColor: 'black',
          monthTextColor: '#1E293B',
        }}
      />

      {selectedDate && (
        <View style={styles.entrySection}>
          <Text style={styles.entryTitle}>Latest entry on {selectedDate}:</Text>
          {latestEntry ? (
            <Card style={styles.entryBox}>
              <Card.Content>
                <Text style={styles.entryText}>Rating: {latestEntry.rating}</Text>
                <Text>{latestEntry.text}</Text>
              </Card.Content>
            </Card>
          ) : (
            <Text>No entries</Text>
          )}
        </View>
      )}

      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
        Go Back
      </Button>
    </View>
  );
};

export default CalendarScreen;
