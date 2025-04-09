import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TextInput } from 'react-native';
import { database } from '../firebaseConfig';
import { ref, push, onValue } from 'firebase/database';

export default function DiaryScreen() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  // Hae merkinnät tietokannasta, kun näkymä latautuu
  useEffect(() => {
    const entriesRef = ref(database, 'entries');
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedEntries = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setEntries(loadedEntries);
      } else {
        setEntries([]);
      }
    });

    return () => unsubscribe(); // Puhdistetaan kuuntelija kun komponentti poistuu
  }, []);

  //Mahdollisuus lisätä uusia tekstejä tietokantaan
  const addEntry = () => {
    if (entry.trim()) {
      const newEntry = {
        text: entry,
        date: new Date().toLocaleDateString(),
      };

      const entriesRef = ref(database, 'entries');
      push(entriesRef, newEntry);

      setEntry('');
    }
  };

  return (
    <View style={styles.container}>
      <Text>
        Welcome to the Diary section! Here you can save the text (for now) for the day which you can also view later.
      </Text>
      <TextInput
        style={styles.textscreen}
        placeholder='Write today’s thoughts here'
        value={entry}
        onChangeText={setEntry}
        multiline={true}
      />
      <Button title="Add a daily entry" onPress={addEntry} />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryContainer}>
            <Text style={styles.date}>{item.date}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  textscreen: {
    borderWidth: 1,
    width: '100%',
    height: 150,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    padding: 10,
  },
  entryContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
