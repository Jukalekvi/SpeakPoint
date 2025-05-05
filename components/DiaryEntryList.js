// components/DiaryEntryList.js
import React from 'react';
import { FlatList, Alert } from 'react-native';
import { Card, Title, Paragraph, Text, Button } from 'react-native-paper';
import styles from '../styles';

const DiaryEntryList = ({ entries, onEdit, onDelete }) => {
  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card style={styles.entryCard}>
          <Card.Content>
            <Title style={styles.entryTitle}>{item.date}</Title>
            <Paragraph style={styles.entryText}>{item.text}</Paragraph>
            <Text style={styles.entryRating}>Rating: {item.rating}</Text>
          </Card.Content>
          <Card.Actions style={styles.entryActions}>
            {onEdit && (
              <Button onPress={() => onEdit(item)} style={styles.editButton} labelStyle={styles.editButtonLabel}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button onPress={() => onDelete(item.id)} style={styles.deleteButton} color="red">
                Delete
              </Button>
            )}
          </Card.Actions>
        </Card>
      )}
    />
  );
};

export default DiaryEntryList;
