import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig'; // Muista varmistaa, että käytät oikeaa Firebase-tiedostoa

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({});

  // Haetaan tiedot Firebase-tietokannasta
  useEffect(() => {
    const entriesRef = ref(database, 'entries');
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      const entriesList = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];

      const newMarkedDates = {};

      entriesList.forEach(entry => {
        const entryDate = entry.date; // Firebase-tietokannasta haettu päivämäärä, muodossa '10.4.2025'
        const entryRating = entry.rating; // Arvosana

        // Tarkistetaan, että entryDate ei ole tyhjä ja se on oikeassa muodossa
        if (entryDate && entryDate.includes('.')) {
          const [day, month, year] = entryDate.split('.');  // Split tekee päivämäärän osiksi

          // Varmistetaan, että kaikki osat ovat olemassa ja padStart ei mene virheellisesti
          const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;  // Muotoillaan 'YYYY-MM-DD'

          // Aseta väri arvosanan mukaan
          let dotColor;
          switch(entryRating) {
            case 1:
              dotColor = 'red';
              break;
            case 2:
              dotColor = 'orange';
              break;
            case 3:
              dotColor = 'yellow';
              break;
            case 4:
              dotColor = 'green';
              break;
            case 5:
              dotColor = 'blue';
              break;
            default:
              dotColor = 'gray'; // Jos arvosana puuttuu
              break;
          }

          // Lisää merkitty päivämäärä
          newMarkedDates[formattedDate] = {
            marked: true,
            dotColor: dotColor,
          };
        } else {
          console.warn(`Invalid date format for entry: ${entryDate}`);
        }
      });

      console.log('newMarkedDates:', newMarkedDates); // Tarkista, että merkittyjen päivämäärien objekti on oikein muodostettu
      setMarkedDates(newMarkedDates);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to the Calendar!</Text>
      
      <Calendar
        markedDates={markedDates} // Kalenteri käyttää tätä objektiä, joka sisältää merkittyjä päivämääriä ja värejä
      />
      
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default CalendarScreen;
