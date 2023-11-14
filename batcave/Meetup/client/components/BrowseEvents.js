// BrowseEvents.js
import React, { useState, useEffect } from 'react';
import { View, Pressable, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import EventList from './EventList';
import Filters from './Filters';
import eventApi from '../api/eventApi';

const BrowseEvents = ({ route, navigation, userInfo, setUserInfo }) => {
  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState([]);  // New state for the original unfiltered events
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('12:00');

  const handleViewDetails = (eventId) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const handleRSVP = (eventId, userId) => {
    eventApi.rsvp(eventId, userId)
      .then(response => {
        setRsvpMessage(response.message);
        setTimeout(() => {
          setRsvpMessage('');
        }, 3000);
      })
      .catch(error => {
        console.error('Error RSVPing to event:', error);
      });
  };

  const handleReportPost = (eventId, eventName) => {
    const reportData = {
      userId: userInfo._id,
      reason: 'Inappropriate content',
    };

    eventApi.reportEvent(eventId, reportData)
      .then(response => {
        console.log('Event reported successfully:', response);
        Toast.show({
          type: 'success',
          text1: `${eventName} reported for inappropriate conduct`,
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 30,
        });
      })
      .catch(error => {
        console.error('Error reporting event:', error);
      });
  };

  const handleDateChange = (date, type) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleTimeChange = (time, type) => {
    if (type === 'start') {
      setStartTime(time);
    } else {
      setEndTime(time);
    }
  };

  const handleFilterButtonPress = () => {
    // Filter events based on selected date range and time range
    const filteredEvents = originalEvents.filter((event) => {
      const eventDate = new Date(event.date);

      // Adjust start date to the beginning of the day
      startDate.setHours(0, 0, 0, 0);

      // Adjust end date to the end of the day
      endDate.setHours(23, 59, 59, 999);

      // Parse event start time
      const eventStartTimeParts = event.startTime.split(':');
      const eventStartTime = new Date(eventDate);
      eventStartTime.setHours(parseInt(eventStartTimeParts[0], 10));
      eventStartTime.setMinutes(parseInt(eventStartTimeParts[1], 10));

      // Parse event end time
      const eventEndTimeParts = event.endTime.split(':');
      const eventEndTime = new Date(eventDate);
      eventEndTime.setHours(parseInt(eventEndTimeParts[0], 10));
      eventEndTime.setMinutes(parseInt(eventEndTimeParts[1], 10));

      // Check if the event's date is within the selected range
      const isDateInRange = eventDate >= startDate && eventDate <= endDate;

      // Add conditions for time filtering
      const isStartTimeInRange = eventStartTime.toLocaleTimeString('en-US', { hour12: false }) >= startTime;
      const isEndTimeInRange = eventEndTime.toLocaleTimeString('en-US', { hour12: false }) <= endTime;

      // Example: Include event in filteredEvents only if date and time conditions are met
      return isDateInRange  && isStartTimeInRange && isEndTimeInRange;
    });

    // Update the events state with the filtered events
    setEvents(filteredEvents);
  };

  useEffect(() => {
    eventApi.getEvents()
      .then(events => {
        setEvents(events);
        setOriginalEvents(events);  // Save the original unfiltered events
        console.log(events);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  return (
    <>
      <View style={{ alignItems: 'center' }}>
        <Pressable style={{ marginTop: '3vh', alignItems: 'center', padding: '1em', backgroundColor: 'rgb(0, 170, 255)', borderColor: 'black', borderWidth: 1, borderRadius: 8 }} onPress={() => navigation.navigate('CreateEvent', { user: userInfo })}>
          <Text style={{ color: 'white' }}>Create Event</Text>
        </Pressable>
      </View>

      <Filters
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        handleDateChange={handleDateChange}
        handleTimeChange={handleTimeChange}
        onFilterPress={handleFilterButtonPress}
      />

      <EventList
        events={events}
        handleRSVP={handleRSVP}
        handleViewDetails={handleViewDetails}
        handleReportPost={handleReportPost}
        userInfo={userInfo}
      />

      {rsvpMessage ? (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 10 }}>
          <Text style={{ color: 'white' }}>{rsvpMessage}</Text>
        </View>
      ) : null}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

export default BrowseEvents;
