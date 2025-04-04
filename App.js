import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to our expo app, the SpeakPoint!</Text>
      <Text style={{textAlign:"center"}}>In here, you can save your daily notes through speaking or texting</Text>
      <Text>Give it a try with this button:</Text>
      <Button title="SAVE"></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
