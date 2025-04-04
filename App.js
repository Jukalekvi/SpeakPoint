import * as React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <Text style={{textAlign: 'center'}}>Welcome to our expo app, the SpeakPoint! With this application, you can save your daily notes and thoughts through speaking and texting</Text>
      <Button onPress={() => navigation.navigate('Notifications')}>
        Go to notifications
      </Button>
    </View>
  );
}

function NotificationsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()}>Go back home</Button>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}