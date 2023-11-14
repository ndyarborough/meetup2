import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './components/SignIn';
import ViewProfile from './components/ViewProfile';
import EventDetails from './components/EventDetails';
import BrowseEvents from './components/BrowseEvents';
import CreateEvent from './components/CreateEvent';
import Login from './components/Login';
import Preferences from './components/Preferences';
import Toast from 'react-native-toast-message';
import BottomNavbar from './components/BottomNavbar';

// const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const [userInfo, setUserInfo] = useState(null);

  const updateUser = (newUserInfo) => {
    setUserInfo(newUserInfo);
  };

  return (
    <View style={styles.app}>

      <NavigationContainer>
        <View style={styles.mainContainer}>
          <Stack.Navigator>
          <Stack.Screen name="SignIn">
            {(props) => <SignIn {...props} updateUser={updateUser} />}
          </Stack.Screen>
          <Stack.Screen name="ViewProfile">
            {(props) => <ViewProfile {...props} updateUser={updateUser} userInfo={userInfo} />}
          </Stack.Screen>
            <Stack.Screen name="Login">
            {(props) => <Login {...props} updateUser={updateUser} />}
          </Stack.Screen>
            <Stack.Screen name="Preferences" component={Preferences} />
            <Stack.Screen name="BrowseEvents">
            {(props) => <BrowseEvents {...props} updateUser={updateUser} userInfo={userInfo} />}
          </Stack.Screen>
            <Stack.Screen name="EventDetails" component={EventDetails} />
            <Stack.Screen name="CreateEvent" component={CreateEvent} />
            <Stack.Screen name="BottomNavbar" component={BottomNavbar} />
          </Stack.Navigator>
        </View>
        <View style={styles.navbar}>
          <BottomNavbar user={userInfo}/>
        </View>
      </NavigationContainer>




      <Toast />
    </ View>
  );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: 'white',
    width: '100vw',
    height: '100vh',
    flex: 1,
    alignItems: 'center'
  },
  mainContainer: {
    width: '100%',
    height: '90%',
    borderColor: 'black',
    borderWidth: 1
  },
  navbar: {
    width: '100%',
    height: '10%',
  }
})

export default App;
