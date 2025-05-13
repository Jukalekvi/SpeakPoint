import { useState, useEffect } from 'react';
import { View, Platform, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, onValue, remove, set } from 'firebase/database';
import { database } from '../firebaseConfig';

import EditEntryModal from '../components/EditEntryModal';
import DiaryEntryList from '../components/DiaryEntryList';

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

  useEffect(() => {
    const entriesRef = ref(database, 'entries');
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      const entryList = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];

      const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('.');
        if (!day || !month || !year) return new Date(0);
        return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      };

      const sortedEntries = entryList.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      setEntries(sortedEntries);
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
      <Text style={styles.subTitle}>
        Browse through your diary entries, and feel free to edit or delete them as you wish!
      </Text>

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

      {showFilterDatePicker && (
        <DateTimePicker
          value={filterDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            if (event.type === 'dismissed') {
              setShowFilterDatePicker(false);
              return;
            }
            if (selectedDate) {
              setFilterDate(selectedDate);
            }
            setShowFilterDatePicker(false);
          }}
        />
      )}

      <DiaryEntryList
        entries={filteredEntries}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
