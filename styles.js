import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Laatikot
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 5,
    backgroundColor: '#E0F2F1',
  },
  entryBox: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  entryCard: {
    marginBottom: 12,
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  entryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    height: '30%',
  },

  // Teksti
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#4B5563',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  entryTitle: {
    fontSize: 20,
    color: '#1E293B',
    fontWeight: '700',
  },
  entryText: {
    fontSize: 15,
    fontWeight: '500',
  },
  entryRating: {
    fontSize: 15,
    fontWeight: '500',
  },
  editButtonLabel: {
    color: '#FFFFFF',
  },

  // Painikkeet
  button: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 12,
    paddingVertical: 6,
    width: '80%',
    backgroundColor: '#008080',
  },
  filterButton: {
    marginTop: 10,
    marginBottom: 10,
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
    marginRight: '10%',
    width: '40%',
    color: '#FFFFFF',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    paddingVertical: 6,
    width: '40%',
    marginLeft: '10%',
  },
  filterDateButton: {
    marginBottom: 10,
    alignSelf: 'stretch',
  },

  // Muut komponentit
  calendar: {
    marginBottom: 10,
  },
  picker: {
    textAlign: 'center',
    borderWidth: 1,
  },
});

export default styles;