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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingRating, setEditingRating] = useState(null);
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
        date: new Date().toLocaleDateString(),
      });
      setText('');
      setRating(null);
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
  const startEditing = (id, text, rating) => {
    setEditingId(id);
    setEditingText(text);
    setEditingRating(rating);
    setIsModalVisible(true);
  };

  // Tallennetaan muokattu merkintä
  const saveEdit = () => {
    if (editingText.trim() && editingRating) {
      const entryRef = ref(database, `entries/${editingId}`);
      set(entryRef, {
        text: editingText,
        rating: editingRating,
        date: new Date().toLocaleDateString(),
      });
      setEditingId(null);
      setEditingText('');
      setEditingRating(null);
      setIsModalVisible(false);
    }
  };

  // Peruuta muokkaus
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
    setEditingRating(null);
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

      <Text style={styles.label}>Choose your day's rating from here:</Text>
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
                onPress={() => startEditing(item.id, item.text, item.rating)}
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
            <Text style={styles.label}>Choose your day's rating from here:</Text>
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
