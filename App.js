import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './screens/Homescreen'; // Tuodaan HomeScreen
import CalendarScreen from './screens/Calendarscreen'; // Tuodaan CalendarScreen
import Diaryscreen from './screens/Diaryscreen';
import Diarylist from './screens/Diarylist';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Calendar" component={CalendarScreen} />
        <Drawer.Screen name="Diary" component={Diaryscreen}/>
        <Drawer.Screen name="List" component={Diarylist}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
