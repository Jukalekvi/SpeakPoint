import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';

export default function DiaryScreen() {

  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  const addEntry = () => {
    if (entry.trim()) {
      const newEntry = {
        id: Date.now().toString(),
        text: entry,
        date: new Date().toLocaleDateString(),
      };
      setEntries([...entries, newEntry]);
      setEntry('');
    }
  };



  return (
    <View style={styles.container}>
      <Text>Welcome to the Diary section! Here you can save the text(for now) for the day which you can also view later</Text>
      <TextInput
        style={styles.textscreen}
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
          <Text style={styles.date}>{item.date}</Text>
          <Text>{item.text}</Text>
        </View>
      )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    paddingTop:10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textscreen:{
    borderWidth:1,
    width:'95%',
    height:'40%',
    marginTop: 10,
    marginBottom: 10,
    textAlign:'center',
  },
  date:{
    fontWeight:'bold',
    marginBottom: 5,
  },
});