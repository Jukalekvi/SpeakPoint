import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import RatingPicker from './RatingPicker';
import DateSelector from './DateSelector';

const EditEntryModal = ({
  visible,
  text,
  setText,
  rating,
  setRating,
  date,
  setDate,
  showPicker,
  setShowPicker,
  onSave,
  onCancel,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={onCancel}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text>Edit Entry</Text>

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          multiline
        />

        <Text style={styles.label}>Choose rating:</Text>
        <RatingPicker selectedValue={rating} onValueChange={setRating} />

        <Text style={styles.label}>Edit date:</Text>
        <Text>Selected: {date.toLocaleDateString()}</Text>

        <DateSelector
          date={date}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
          onChange={setDate}
        />

        <View style={styles.buttonRow}>
          <Button title="Save" onPress={onSave} />
          <Button title="Cancel" onPress={onCancel} color="gray" />
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
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
  input: {
    height: 100,
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    textAlignVertical: 'top',
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default EditEntryModal;
