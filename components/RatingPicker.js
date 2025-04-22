import React from 'react';
import { Picker } from '@react-native-picker/picker';

const RatingPicker = ({ selectedValue, onValueChange, style }) => {
  const ratingLabels = {
    1: 'Very Bad',
    2: 'Bad',
    3: 'Okay',
    4: 'Good',
    5: 'Excellent',
  };

  return (
    <Picker selectedValue={selectedValue} onValueChange={onValueChange} style={style}>
      <Picker.Item label="-- Select rating --" value={null} />
      {Object.entries(ratingLabels).map(([value, label]) => (
        <Picker.Item
          key={value}
          label={`${value} - ${label}`}
          value={parseInt(value)}
        />
      ))}
    </Picker>
  );
};

export default RatingPicker;
