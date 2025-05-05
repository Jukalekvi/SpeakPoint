import React, { useState, useEffect } from 'react';
import { View, FlatList, Platform, Alert } from 'react-native';
import { Button, Text, Card, Title, Paragraph } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, onValue, remove, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import EditEntryModal from '../components/EditEntryModal';
import styles from '../styles';

const Diarylist = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [editingEntryDate, setEditingEntryDate] = useState(null);
  const [showFilterDatePicker, setShowFilterDatePicker] = useState(false);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
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
    setEditingEntryDate(new Date(entry.date));
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (editingEntry && editingEntryDate) {
      const updatedEntry = {
        ...editingEntry,
        date: editingEntryDate.toLocaleDateString(),
      };

      set(ref(database, `entries/${editingEntry.id}`), updatedEntry);
      setIsModalVisible(false);
      setEditingEntry(null);
      setEditingEntryDate(null);
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
      <Text style={styles.title}>All Diary Entries</Text>
      <Text style={styles.subTitle}>Browse through your diary entries, and feel free to edit or delete them as you wish!</Text>

      <Button
        mode="contained"
        onPress={() => setShowFilterDatePicker(true)}
        style={styles.filterButton}
      >
        {filterDate ? `Filter: ${filterDate.toLocaleDateString()}` : 'Choose Filter Date'}
      </Button>

      {filterDate && (
        <Button
          mode="contained"
          onPress={() => setFilterDate(null)}
          style={styles.button}
        >
          Clear Filter
        </Button>
      )}

      {/* Filter Date Picker */}
      {showFilterDatePicker && (
        <DateTimePicker
        value={filterDate || new Date()}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, selectedDate) => {
          // If the event type is 'dismissed', it means the user canceled the picker, so we don't change the date
          if (event.type === 'dismissed') {
            setShowFilterDatePicker(false);  // Close the picker without changing the date
            return;
          }

          // If the user selected a date, update the state
          if (selectedDate) {
            setFilterDate(selectedDate);
          }
          setShowFilterDatePicker(false);  // Close the picker after selection or cancellation
        }}
      />
    )}

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.entryCard}>
            <Card.Content>
              <Title style={styles.entryTitle}>{item.date}</Title>
              <Paragraph style={styles.entryText}>{item.text}</Paragraph>
              <Text style={styles.entryRating}>Rating: {item.rating}</Text>
            </Card.Content>
            <Card.Actions style={styles.entryActions}>
              <Button onPress={() => handleEdit(item)} style={styles.editButton} labelStyle={styles.editButtonLabel}>Edit</Button>
              <Button onPress={() => handleDelete(item.id)} style={styles.deleteButton}>Delete</Button>
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
          date={editingEntryDate || new Date()}
          setDate={(date) => setEditingEntryDate(date)}
          showPicker={showEditDatePicker}
          setShowPicker={setShowEditDatePicker}
          onSave={handleSave}
          onCancel={() => setIsModalVisible(false)}
        />
      )}
    </View>
  );
};

export default Diarylist;
