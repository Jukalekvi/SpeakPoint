import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, onValue, remove, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import EditEntryModal from '../components/EditEntryModal';

const Diarylist = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filterDate, setFilterDate] = useState(null);  // Suodatuspäivämäärä
  const [editingEntryDate, setEditingEntryDate] = useState(null);  // Muokattavan merkinnän päivämäärä
  const [showFilterDatePicker, setShowFilterDatePicker] = useState(false);  // Suodatus-päivämäärän picker
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);  // Muokkaus-päivämäärän picker
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const navigation = useNavigation();

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

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setEditingEntryDate(new Date(entry.date));  // Asetetaan muokattavan merkinnän päivämäärä
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (editingEntry && editingEntryDate) {
      const updatedEntry = {
        ...editingEntry,
        date: editingEntryDate.toLocaleDateString(),  // Päivitetään päivämäärä
      };

      set(ref(database, `entries/${editingEntry.id}`), updatedEntry);
      setIsModalVisible(false);
      setEditingEntry(null);
      setEditingEntryDate(null); // Tyhjennetään muokattavan merkinnän päivämäärä
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Poista merkintä', 'Haluatko varmasti poistaa merkinnän?', [
      { text: 'Peruuta', style: 'cancel' },
      {
        text: 'Poista',
        style: 'destructive',
        onPress: () => {
          const entryRef = ref(database, `entries/${id}`);
          remove(entryRef);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Diary Entries</Text>

      <Button
        title={filterDate ? `Filter: ${filterDate.toLocaleDateString()}` : 'Choose Filter Date'}
        onPress={() => setShowFilterDatePicker(true)}  // Näyttää DatePickerin suodatusta varten
      />

      {filterDate && (
        <Button
          title="Clear Filter"
          color="gray"
          onPress={() => setFilterDate(null)}
        />
      )}

      {/* Suodatus-päivämäärän DateTimePicker */}
      {showFilterDatePicker && !editingEntryDate && (  // Vain jos ei ole muokkaustilassa
        <DateTimePicker
          value={filterDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowFilterDatePicker(false);
            if (selectedDate) setFilterDate(selectedDate);  // Suodattaminen
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
            <View style={styles.buttonRow}>
              <Button title="Muokkaa" onPress={() => handleEdit(item)} />
              <Button
                title="Poista"
                color="red"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        )}
      />

      {isModalVisible && editingEntry && (
        <EditEntryModal
          visible={isModalVisible}
          text={editingEntry.text}
          setText={(text) => setEditingEntry((prev) => ({ ...prev, text }))}
          rating={editingEntry.rating}
          setRating={(rating) => setEditingEntry((prev) => ({ ...prev, rating }))}
          date={editingEntryDate || new Date()}  // Käytetään erillistä päivämäärää muokattavalle merkinnälle
          setDate={(date) => setEditingEntryDate(date)} // Päivitetään vain editointiin käytettävä päivämäärä
          showPicker={showEditDatePicker}  // Välitetään showPicker EditEntryModalille
          setShowPicker={setShowEditDatePicker}  // Välitetään setShowPicker
          onSave={handleSave}  // Tallennusfunktio
          onCancel={() => setIsModalVisible(false)}
        />
      )}
    </View>
  );
};

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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default Diarylist;
