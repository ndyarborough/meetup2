import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomNavBar from './BottomNavbar';

const EventDetails = ({route, navigation}) => {
  const { eventId } = route.params;
  const [event, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {

    fetch(`http://localhost:3000/event/fetch/${eventId}`) 
    .then((response) => response.json())
    .then((data) => {
      setEventData(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });

    // eventApi.getOne().then(event => setEventData(events)) instead of above ^
  }, []);
  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading event data...</Text>
      ) : (
    <View style={styles.container}>
     
      <Text>Events</Text>
      <Text style={styles.headerText}>{event.eventName}</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{new Date(event.date).toLocaleDateString()}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Duration:</Text>
        <Text style={styles.value}>{event.duration} hours</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{event.address}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Capacity:</Text>
        <Text style={styles.value}>{event.capacity} people</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{event.description}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Host:</Text>
        <Text style={styles.value}>{event.host}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Recurring:</Text>
        <Text style={styles.value}>{event.reacurring ? "Yes" : "No"}</Text>
      </View>
    </View>
    
  )} </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
});

export default EventDetails;