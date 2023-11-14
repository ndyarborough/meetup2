import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyEvents from './MyEvents';
import MyRsvps from './MyRsvps';
import userApi from '../api/userApi';

const ViewProfile = ({ route, navigation, updateUser, userInfo }) => {

  // Set State information for MyEvents and MyRsvps components
  const [myEvents, setMyEvents] = useState(null);
  const [myRsvps, setMyRsvps] = useState(null);
  
    // Get Userinfo
  useEffect(() => { // Use Effects happen when the component mounts
    const fetchUserInfo = async () => {
      if (route.params) {
        console.log('there were route params')
        updateUser(JSON.parse(route.params.user));
      } else {
        console.log('no route params')
        const user = await AsyncStorage.getItem('@user');
        updateUser(JSON.parse(user));
      }
    };
    // Add an event listener for the focus event
    const unsubscribe = navigation.addListener('focus', fetchUserInfo);
    // Clean up the event listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  // Get User Events
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        if(userInfo) {
          const eventsData = await userApi.getMyEvents(userInfo._id);
          console.log(eventsData)
          setMyEvents(eventsData);
        }
      } catch (error) {
        console.error('Error fetching user data or events:', error);
      }
    };
    fetchUserEvents();
  }, [userInfo]);

  // GetUserRsvps on Mount
  useEffect(() => {
    const fetchUserRsvps = async () => {
      try {
        if (userInfo) {
          const rsvpsData = await userApi.getMyRsvps(userInfo._id);
          setMyRsvps(rsvpsData);
        }
      } catch (error) {
        console.error('Error fetching user data or RSVPs:', error);
      }
    };
    fetchUserRsvps();
  }, [userInfo]);


  // Event Handler Functions

  const handleDeleteEvent = (eventId) => {
    // Remove the deleted event from the local state
    setMyEvents((prevEvents) => prevEvents.filter((e) => e._id !== eventId));
  };

  const deleteUserSession = () => {
    AsyncStorage.removeItem('@user').then(() => {
      navigation.navigate('SignIn');
    });
    setMyEvents(null);
    setMyRsvps(null)
  };
  
  const handlePreferences = () => {
    navigation.navigate('Preferences', {userInfo});
  };

  // HTML for ViewProfile component
  return (
    <View style={styles.container}>
      {!userInfo ? (
        <Text>No user info</Text>
      ) : (
        <View style={styles.profile}>
          <Pressable style={styles.button} onPress={() => deleteUserSession()}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => handlePreferences()}>
            <Text style={styles.buttonText}>Preferences</Text>
          </Pressable>

          <Text>Username: {userInfo.username}</Text>
          <Text>Email: {userInfo.email}</Text>
          <Text>Full Name: {userInfo.fullName}</Text>

          {/* Pass myEvents from ViewProfile state as a prop to MyEvents */}
          <MyEvents 
            navigation={navigation} 
            myEvents={myEvents} 
            userId={userInfo._id}
            onDeleteEvent={handleDeleteEvent} // Pass the function to MyEvents
          />

          {/* Pass myRsvps from ViewProfile state as a prop to MyRsvps */}
          <MyRsvps
            navigation={navigation}
            myRsvps={myRsvps}
            userId={userInfo._id}
            setRsvps={setMyRsvps}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
    padding: 20,
    minWidth: '90vw'
  },
  profile: {
    minWidth: '90%'
  },
  button: {
    border: 'solid black 1px',
    marginBottom: '2vh',
    borderRadius: 8,
    maxWidth: '12vh',
    alignItems: 'center'
  },
});

export default ViewProfile;
