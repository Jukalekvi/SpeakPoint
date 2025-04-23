import React, { useEffect, useState } from 'react';
import { View, FlatList, Platform, Alert } from 'react-native';
import { Button, Text, Card, Title, Paragraph } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, onValue, remove, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import EditEntryModal from '../components/EditEntryModal';
import styles from '../styles'; // Oletetaan, että tyylitiedosto on tässä polussa

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
        mode="contained"
        onPress={() => setShowFilterDatePicker(true)}
        style={styles.button}
      >
        {filterDate ? `Filter: ${filterDate.toLocaleDateString()}` : 'Choose Filter Date'}
      </Button>

      {filterDate && (
        <Button
          mode="text"
          color="gray"
          onPress={() => setFilterDate(null)}
          style={styles.button}
        >
          Clear Filter
        </Button>
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
          <Card style={styles.entry}>
            <Card.Content>
              <Title>{item.date}</Title>
              <Paragraph>{item.text}</Paragraph>
              <Text style={styles.rating}>Rating: {item.rating}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleEdit(item)}>Muokkaa</Button>
              <Button color="red" onPress={() => handleDelete(item.id)}>Poista</Button>
            </Card.Actions>
          </Card>
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

export default Diarylist;
