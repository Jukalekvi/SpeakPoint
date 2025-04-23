import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

import RatingPicker from '../components/RatingPicker';
import DateSelector from '../components/DateSelector';
import EntryItem from '../components/EntryItem';
import EditEntryModal from '../components/EditEntryModal';

import styles from '../styles';  // Tuo tyylit

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
      
      {/* TextInput component from Paper */}
      <TextInput
        style={styles.input}
        placeholder="Write your thoughts..."
        value={text}
        onChangeText={setText}
        multiline
        mode="outlined"  // Paper style
      />

      {/* RatingPicker and DateSelector components */}
      <RatingPicker selectedValue={rating} onValueChange={setRating} style={styles.picker} />
      <DateSelector date={date} showPicker={showDatePicker} setShowPicker={setShowDatePicker} onChange={setDate} />

      {/* Save Button from Paper */}
      <Button mode="contained" onPress={saveEntry} style={styles.button}>
        Save
      </Button>

      {/* Entries List */}
      <FlatList
        data={entries.slice(0, 3)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.entry}>
            <Card.Content>
              <Text>{item.date}</Text>
              <Text>{item.text}</Text>
              <Text>Rating: {item.rating}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => startEditing(item)}>Edit</Button>
              <Button color="red" onPress={() => confirmDelete(item.id)}>Delete</Button>
            </Card.Actions>
          </Card>
        )}
      />

      {/* Go to Diary List Button */}
      <Button mode="contained" onPress={() => navigation.navigate('List')} style={styles.button}>
        Go to Diary List
      </Button>

      {/* EditEntryModal for editing an entry */}
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
