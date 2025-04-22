import React from 'react';
import { Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateSelector = ({ date, showPicker, setShowPicker, onChange }) => (
  <>
    <Button
      title={date.toLocaleDateString()}
      onPress={() => setShowPicker(true)}
    />
    {showPicker && (
      <DateTimePicker
        value={date}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, selectedDate) => {
          setShowPicker(false);
          if (selectedDate) onChange(selectedDate);
        }}
      />
    )}
  </>
);

export default DateSelector;
