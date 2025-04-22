import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

import RatingPicker from '../components/RatingPicker';
import DateSelector from '../components/DateSelector';
import EntryItem from '../components/EntryItem';
import EditEntryModal from '../components/EditEntryModal';

const DiaryScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [rating, setRating] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [entries, setEntries] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingRating, setEditingRating] = useState(null);
  const [editingDate, setEditingDate] = useState(new Date());
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const entriesRef = ref(database, 'entries');
    const unsubscribe = onValue(entriesRef, snapshot => {
      const data = snapshot.val();
      const entryList = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setEntries(entryList.reverse());
    });
    return () => unsubscribe();
  }, []);

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

  const confirmDelete = (id) => {
    Alert.alert('Delete Entry', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => remove(ref(database, `entries/${id}`)),
        style: 'destructive',
      },
    ]);
  };

  const startEditing = ({ id, text, rating, date }) => {
    setEditingId(id);
    setEditingText(text);
    setEditingRating(rating);
    setEditingDate(new Date(date));
    setIsModalVisible(true);
  };

  const saveEdit = () => {
    if (editingText.trim() && editingRating) {
      set(ref(database, `entries/${editingId}`), {
        text: editingText,
        rating: editingRating,
        date: editingDate.toLocaleDateString(),
      });
      cancelEditing();
    }
  };

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
      <RatingPicker selectedValue={rating} onValueChange={setRating} style={styles.picker} />
      <DateSelector date={date} showPicker={showDatePicker} setShowPicker={setShowDatePicker} onChange={setDate} />
      <Button title="Save" onPress={saveEntry} />
      <FlatList
        data={entries.slice(0, 3)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryItem item={item} onEdit={startEditing} onDelete={confirmDelete} />
        )}
      />
      <Button title="Go to Diary List" onPress={() => navigation.navigate('List')} />
      <EditEntryModal
        visible={isModalVisible}
        text={editingText}
        setText={setEditingText}
        rating={editingRating}
        setRating={setEditingRating}
        date={editingDate}
        setDate={setEditingDate}
        showPicker={showEditDatePicker}
        setShowPicker={setShowEditDatePicker}
        onSave={saveEdit}
        onCancel={cancelEditing}
      />
    </View>
  );
};

export default DiaryScreen;

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
});
