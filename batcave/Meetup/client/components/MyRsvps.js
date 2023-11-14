import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import userApi from '../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventApi from '../api/eventApi';

const MyRsvps = ({ navigation, myRsvps, userId, setRsvps }) => {
  const [pressedEvent, setPressedEvent] = useState(null);

  useEffect(() => {
    const fetchUserRsvps = async () => {
      try {
        const rsvpsData = await userApi.getMyRsvps(userId);
        setRsvps(rsvpsData);
      } catch (error) {
        console.error('Error fetching user rsvps:', error);
      }
    };

    fetchUserRsvps();
  }, []);

  const handleEventPress = (eventId) => {
    setPressedEvent(eventId);
    navigation.navigate('EventDetails', { eventId });
  };

  const handleCancelRsvpPress = (eventId) => {
    // Logic to cancel RSVP goes here
    eventApi.rsvp(eventId, userId)
        .then((result) => {
            setRsvps((rsvps) => rsvps.filter((e) => e._id !== eventId));
            // Update the local state with the updated events list
            
        })
        .catch(error => console.error('Error canceling RSVP:', error));
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My RSVPs</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.container}>
        {myRsvps ? (
          myRsvps.map((event) => (
            <View key={event._id} style={styles.eventContainer}>
              {/* Event Details */}
              <RectButton
                onPress={() => handleEventPress(event._id)}
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

              {/* Cancel RSVP Button */}
              <Pressable
                style={styles.cancelRsvpButton}
                onPress={() => handleCancelRsvpPress(event._id)}
              >
                <Text style={styles.cancelRsvpText}>Cancel RSVP</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text>Loading RSVPs...</Text>
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
    fontSize: '12rem'
  },
  eventContainer: {
    position: 'relative',
    flexDirection: 'row',
    marginRight: 10,
  },
  eventContent: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '40vw',
  },
  pressedEvent: {
    backgroundColor: '#ddd',
  },
  eventName: {
    fontWeight: 'bold',
    width: '100%',
  },
  cancelRsvpButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  cancelRsvpText: {
    color: 'white',
  },
});

export default MyRsvps;