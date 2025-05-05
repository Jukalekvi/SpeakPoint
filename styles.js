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
  entryBox: {
    marginVertical: 8,
    borderRadius: 12,  // Pyöreät kulmat
    backgroundColor: '#FFFFFF',  // Valkoinen tausta
    elevation: 0,  // Poistaa varjon
    borderWidth: 0,  // Poistaa mahdolliset reunat
    borderColor: 'transparent',  // Poistaa mahdolliset näkyvät reunat
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
  entryCard: {
    marginBottom: 12,  // Lisää tilaa korttien väliin
    elevation: 3,  // Lisää varjo kortille, jos haluat
    backgroundColor: '#ffffff',  // Varmista, että kortin taustaväri on valkoinen
  },
  entryActions: {
    flexDirection: 'row',  // Asetetaan nappulat vaakasuunnassa
    justifyContent: 'space-between',  // Jaa tilaa tasaisesti nappuloiden välillä
    width: '100%',  // Varmistetaan, että nappulat vievät koko tilan
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#4B5563',  // Tummanharmaa väri
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
  button: {
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
  editButtonLabel: {
    color: '#FFFFFF',  // Tekstin väri valkoinen
  },
  deleteButton: {
    backgroundColor: '#D32F2F',  // Punainen väri varoitukselle
    borderRadius: 10,
    paddingVertical: 6,
    width: '40%',
    marginLeft: '10%',
  },
  filterDateButton: {
    marginBottom: 10,  // Voit säätää välejä
    alignSelf: 'stretch',  // Voit halutessasi tehdä painikkeesta laajentuvan
  },
});

export default styles;
