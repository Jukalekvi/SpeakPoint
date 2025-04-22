import React from 'react';
import { Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateSelector = ({ date, showPicker, setShowPicker, onChange }) => {
  // Varmistetaan, että date on Date-objekti
  const validDate = date instanceof Date && !isNaN(date) ? date : new Date();

  return (
    <>
      <Button
        title={validDate.toLocaleDateString()} // Näytetään oikea päivämäärä
        onPress={() => setShowPicker(true)}  // Avaa päivämäärävalitsin
      />
      {showPicker && (
        <DateTimePicker
          value={validDate}  // Käytetään validia päivämäärää
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) onChange(selectedDate);  // Päivitetään valittu päivämäärä
          }}
        />
      )}
    </>
  );
};

export default DateSelector;
