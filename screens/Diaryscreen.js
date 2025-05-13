import { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

import RatingPicker from '../components/RatingPicker';
import DateSelector from '../components/DateSelector';
import EditEntryModal from '../components/EditEntryModal';

import styles from '../styles';

const DiaryScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [rating, setRating] = useState(null);
  const [date, setDate] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(false);
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

      const sortedEntries = entryList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEntries(sortedEntries.slice(0, 1));
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
      setDateSelected(false); 
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
      <Text style={styles.title}>Diary</Text>

      <Text style={styles.infoText}>
        Here you can add new diary entries, edit or delete existing entries.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Write your thoughts..."
        value={text}
        onChangeText={setText}
        multiline
        mode="outlined"
      />

      <RatingPicker selectedValue={rating} onValueChange={setRating} style={styles.picker} />

      <DateSelector
        date={date}
        dateSelected={dateSelected}
        setDateSelected={setDateSelected}
        showPicker={showDatePicker}
        setShowPicker={setShowDatePicker}
        onChange={(selectedDate) => {
          setDate(selectedDate);
          setDateSelected(true);
        }}
      />

      <Button mode="contained" onPress={saveEntry} style={styles.button}>
        Save the diary entry
      </Button>

      <Button mode="contained" onPress={() => navigation.navigate('List')} style={[styles.button, { marginTop: 50 }]}>
        Go to Diary List
      </Button>

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