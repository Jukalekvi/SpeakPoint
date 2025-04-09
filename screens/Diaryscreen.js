import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, Modal } from 'react-native';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '../firebaseConfig';

// DiaryScreen-komponentti hoitaa päiväkirjamerkintöjen näyttämisen, lisäämisen, muokkaamisen ja poistamisen
const DiaryScreen = () => {
  // Tilamuuttujat: tekstikenttä, merkinnät, muokkaustila ja modaalin näkyvyys
  const [text, setText] = useState('');
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Haetaan merkinnät tietokannasta, kun komponentti ladataan
  useEffect(() => {
    const entriesRef = ref(database, 'entries');
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      const entryList = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
      setEntries(entryList.reverse()); // Käännetään järjestys uusimmat ensin
    });
    return () => unsubscribe();
  }, []);

  // Tallennetaan uusi merkintä tietokantaan
  const saveEntry = () => {
    if (text.trim()) {
      const newEntryRef = ref(database, 'entries/' + Date.now());
      set(newEntryRef, {
        text,
        date: new Date().toLocaleDateString(),
      });
      setText('');
    }
  };

  // Näytetään varmistusikkuna ennen merkinnän poistamista
  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const entryRef = ref(database, `entries/${id}`);
            remove(entryRef);
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Avaa muokkausikkunan tietylle merkinnälle
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
    setIsModalVisible(true);
  };

  // Tallennetaan muokattu merkintä ja suljetaan modaali
  const saveEdit = () => {
    if (editingText.trim()) {
      const entryRef = ref(database, `entries/${editingId}`);
      set(entryRef, {
        text: editingText,
        date: new Date().toLocaleDateString(),
      });
      setEditingId(null);
      setEditingText('');
      setIsModalVisible(false);
    }
  };

  // Peruutetaan muokkaus ja suljetaan modaali
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Otsikko ja syöttökenttä */}
      <Text style={styles.header}>Diary</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your thoughts..."
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title="Save" onPress={saveEntry} />

      {/* Lista päiväkirjamerkinnöistä */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.entryText}>{item.text}</Text>
            <View style={styles.buttonRow}>
              <Button title="Edit" onPress={() => startEditing(item.id, item.text)} />
              <Button title="Delete" color="red" onPress={() => confirmDelete(item.id)} />
            </View>
          </View>
        )}
      />

      {/* Modaali muokkausta varten */}
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

// Tyylit käyttöliittymää varten
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
