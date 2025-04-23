import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 120, // Kenttä on isompi
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f5f5f5',
    textAlignVertical: 'top',  // Teksti alkaa aina ylhäältä
  },
  picker: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default styles;
