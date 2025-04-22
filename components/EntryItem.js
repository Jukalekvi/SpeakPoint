import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ratingLabels = {
  1: 'Very Bad',
  2: 'Bad',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
};

const EntryItem = ({ item, onEdit, onDelete }) => (
  <View style={styles.entry}>
    <Text style={styles.date}>{item.date}</Text>
    <Text style={styles.entryText}>{item.text}</Text>
    <Text style={styles.rating}>
      Rating: {item.rating} - {ratingLabels[item.rating]}
    </Text>
    <View style={styles.buttonRow}>
      <Button title="Edit" onPress={() => onEdit(item)} />
      <Button title="Delete" color="red" onPress={() => onDelete(item.id)} />
    </View>
  </View>
);

const styles = StyleSheet.create({
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
});

export default EntryItem;
