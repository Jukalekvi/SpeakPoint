import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';

export default function DiaryScreen() {

  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  const addEntry = () => {
    if (entry.trim()) {
      const newEntry = {
        id: Date.now().toString(),
        text: entry
      }
      setEntries([...entries, newEntry]);
      setEntry('');
  }
};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to the Diary section! Here you can save the text(for now) for the day which you can also view later</Text>
      <TextInput
        placeholder='Write todays thoughts here'
        value={entry}
        onChangeText={setEntry}
        multiline={true}
      />
      <Button title="Add a daily entry" onPress={addEntry} />
      <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <View>
          <Text>{item.text}</Text>
        </View>
      )}
      />
    </View>
  );
}

