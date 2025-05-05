import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 20,
    backgroundColor: '#E0F2F1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E293B',
  },
  calendar: {
    marginBottom: 20,
  },
  entrySection: {
    marginTop: 20,
  },
  entryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
  },
  entryBox: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  entryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#4B5563',  // Tummanharmaa väri
  },
  filterButton: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 12,
    paddingVertical: 6,
    width: '80%',
    backgroundColor: '#008080',
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 12,
    paddingVertical: 6,
    width: '80%',
    backgroundColor: '#008080',
  },
  editButton: {
    backgroundColor: '#3182CE',
    borderRadius: 10,
    paddingVertical: 6,
    marginRight: 12,
    width: '40%',
    color: '#FFFFFF',
  },
  editButtonLabel: {
    color: '#FFFFFF',  // Tekstin väri valkoinen
  },
  deleteButton: {
    backgroundColor: '#D32F2F',  // Punainen väri varoitukselle
    borderRadius: 10,
    paddingVertical: 6,
    width: '40%',
  },
});

export default styles;
