import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import eventApi from '../api/eventApi';

// Import the delete icon
import deleteIcon from '../assets/delete.png';

const MyEvents = ({ navigation, myEvents, userId, onDeleteEvent }) => {
  const [pressedEvent, setPressedEvent] = useState(null);

  const handleEventPress = (eventId) => {
    setPressedEvent(eventId);
    navigation.navigate('EventDetails', { eventId });
  };

  const handleDeletePress = async (eventId) => {
    try {
      await eventApi.delete(eventId, userId);
      // Use the prop to update the state in ViewProfile
      onDeleteEvent(eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Events</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.container}>
        {myEvents ? (
          myEvents.map((event) => (
            <View key={event._id} style={styles.eventContainer}>
              {/* Event Details */}
              <RectButton
                onPress={() => handleEventPress(event._id, userId)}
                style={[
                  styles.eventContent,
                  event._id === pressedEvent && styles.pressedEvent,
                ]}
              >
                <View>
                  <Text style={styles.eventName}>Event Name: {event.eventName}</Text>
                  <Text>{event.description}</Text>
                </View>
              </RectButton>

              {/* Delete Button */}
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDeletePress(event._id)}
              >
                <Image source={deleteIcon} style={styles.deleteIcon} />
              </Pressable>
            </View>
          ))
        ) : (
          <Text>Loading events...</Text>
        )}
      </ScrollView>
    </>
  );
};



const styles = StyleSheet.create({
  container: {
    padding: 10,
    maxHeight: '25%',
    maxWidth: '90vw',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerContainer: {
    textAlign: 'left',
    marginTop: '2vh',
  },
  eventContainer: {
    position: 'relative', // Make the container a positioned element
    flexDirection: 'row', // Add flexDirection to align content in a row
    marginRight: 10,
  },
  eventContent: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '40vw', // Set a fixed width for each event container
  },
  pressedEvent: {
    backgroundColor: '#ddd',
  },
  eventName: {
    fontWeight: 'bold',
    width: '100%',
  },
  deleteButton: {
    position: 'absolute', // Position the delete button absolutely
    top: 5, // Adjust the top position
    right: 5, // Adjust the right position
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'transparent', // Make the background transparent
  },
  deleteIcon: {
    width: 20, // Set the width of the icon
    height: 20, // Set the height of the icon
  },
});

export default MyEvents;
