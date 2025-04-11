import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '../firebaseConfig';

// Arvion selitteet
const ratingLabels = {
  1: 'Very Bad',
  2: 'Bad',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
};

// Päiväkirjakomponentti
const DiaryScreen = () => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingRating, setEditingRating] = useState(null);
  const [editingDate, setEditingDate] = useState(new Date()); // Alkuperäinen päivämäärä
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Haetaan merkinnät tietokannasta
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

  // Tallennetaan uusi merkintä
  const saveEntry = () => {
    if (text.trim() && rating) {
      const newEntryRef = ref(database, 'entries/' + Date.now());
      set(newEntryRef, {
        text,
        rating,
        date: date.toLocaleDateString(),
      });
      setText('');
      setRating(null);
      setDate(new Date());
    }
  };

  // Vahvistetaan poisto
  const confirmDelete = (id) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          const entryRef = ref(database, `entries/${id}`);
          remove(entryRef);
        },
        style: 'destructive',
      },
    ]);
  };

  // Muokkauksen aloitus
  const startEditing = (id, text, rating, dateString) => {
    setEditingId(id);
    setEditingText(text);
    setEditingRating(rating);
    setEditingDate(new Date()); // Asetetaan nykyinen päivämäärä automaattisesti
    setIsModalVisible(true);
  };

  // Tallennetaan muokattu merkintä
  const saveEdit = () => {
    if (editingText.trim() && editingRating) {
      const entryRef = ref(database, `entries/${editingId}`);
      set(entryRef, {
        text: editingText,
        rating: editingRating,
        date: editingDate.toLocaleDateString(),
      });
      setEditingId(null);
      setEditingText('');
      setEditingRating(null);
      setEditingDate(new Date());
      setIsModalVisible(false);
    }
  };

  // Peruuta muokkaus
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
    setEditingRating(null);
    setEditingDate(new Date());
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Diary</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your thoughts..."
        value={text}
        onChangeText={setText}
        multiline
      />

      <Text style={styles.label}>Choose your day's rating:</Text>
      <Picker
        selectedValue={rating}
        onValueChange={(itemValue) => setRating(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="-- Select rating --" value={null} />
        {Object.entries(ratingLabels).map(([value, label]) => (
          <Picker.Item
            key={value}
            label={`${value} - ${label}`}
            value={parseInt(value)}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Select date:</Text>
      <Button
        title={date.toLocaleDateString()}
        onPress={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Button title="Save" onPress={saveEntry} />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.entryText}>{item.text}</Text>
            <Text style={styles.rating}>
              Rating: {item.rating} - {ratingLabels[item.rating]}
            </Text>
            <View style={styles.buttonRow}>
              <Button
                title="Edit"
                onPress={() => startEditing(item.id, item.text, item.rating, item.date)}
              />
              <Button
                title="Delete"
                color="red"
                onPress={() => confirmDelete(item.id)}
              />
            </View>
          </View>
        )}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={cancelEditing}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit Entry</Text>
            <TextInput
              style={styles.modalInput}
              value={editingText}
              onChangeText={setEditingText}
              multiline
            />
            <Text style={styles.label}>Choose rating:</Text>
            <Picker
              selectedValue={editingRating}
              onValueChange={(itemValue) => setEditingRating(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="-- Select rating --" value={null} />
              {Object.entries(ratingLabels).map(([value, label]) => (
                <Picker.Item
                  key={value}
                  label={`${value} - ${label}`}
                  value={parseInt(value)}
                />
              ))}
            </Picker>

            <Text style={styles.label}>Edit date:</Text>
            <Button
              title={editingDate.toLocaleDateString()}
              onPress={() => setShowEditDatePicker(true)}
            />
            {showEditDatePicker && (
              <DateTimePicker
                value={editingDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowEditDatePicker(false);
                  if (selectedDate) setEditingDate(selectedDate);
                }}
              />
            )}

            <View style={styles.buttonRow}>
              <Button title="Save" onPress={saveEdit} />
              <Button title="Cancel" onPress={cancelEditing} color="gray" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DiaryScreen;

// Tyylit
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  entry: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  entryText: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  rating: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalInput: {
    height: 100,
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    textAlignVertical: 'top',
  },
});
