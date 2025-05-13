import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import styles from '../styles';

const DateSelector = ({
  date,
  dateSelected,
  setDateSelected,
  showPicker,
  setShowPicker,
  onChange,
}) => {
  const validDate = date instanceof Date && !isNaN(date) ? date : new Date();

  return (
    <>
      <Button
        mode="contained"
        onPress={() => setShowPicker(true)}
        style={styles.button}
      >
        {dateSelected ? validDate.toLocaleDateString() : 'Choose date for your entry'}
      </Button>

      {showPicker && (
        <DateTimePicker
          value={validDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowPicker(false);

            if (Platform.OS === 'android' && event.type === 'dismissed') {
              setDateSelected(false);
              return;
            }

            if (selectedDate) {
              onChange(selectedDate);
              setDateSelected(true);
            } else {
              setDateSelected(false);
            }
          }}
        />
      )}
    </>
  );
};

export default DateSelector;
