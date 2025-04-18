import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

const Diarylist = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const entriesRef = ref(database, 'entries');
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      const entryList = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setEntries(entryList.reverse());
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (filterDate) {
      const dateStr = filterDate.toLocaleDateString();
      setFilteredEntries(entries.filter(entry => entry.date === dateStr));
    } else {
      setFilteredEntries(entries);
    }
  }, [filterDate, entries]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Diary Entries</Text>

      <Button
        title={filterDate ? `Filter: ${filterDate.toLocaleDateString()}` : 'Choose Filter Date'}
        onPress={() => setShowDatePicker(true)}
      />

      {filterDate && (
        <Button
          title="Clear Filter"
          color="gray"
          onPress={() => setFilterDate(null)}
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          value={filterDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setFilterDate(selectedDate);
          }}
        />
      )}

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.rating}>Rating: {item.rating}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Diarylist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  entry: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  text: {
    fontSize: 16,
    marginTop: 5,
  },
  rating: {
    marginTop: 5,
    fontStyle: 'italic',
  },
});
