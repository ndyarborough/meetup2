import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet } from 'react-native';
import TimePicker from 'react-time-picker'; // Import the TimePicker component
import DatePicker from 'react-datepicker';
// needed for date picker to display properly
import 'react-datepicker/dist/react-datepicker.css';
import eventApi from '../api/eventApi';
// needed for time picker to display properly
import 'react-time-picker/dist/TimePicker.css';


const CreateEvent = ({ route, navigation }) => {
  const [userInfo, setUserInfo] = useState(route.params.user);

  // Once when the page loads
  useEffect(() => {
    // Format the start and end times before updating formData
    const formattedStartTime = formatTime(formData.startTime);
    const formattedEndTime = formatTime(formData.endTime);

    setFormData({
      ...formData,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      host: userInfo._id
    });
    console.log(userInfo);
  }, []);

  const formatTime = (time) => {
    if (typeof time === 'string') {
      // Assuming the time format is 'HH:mm am/pm'
      const [hours, minutes] = time.split(':');
      const [rawHours, ampm] = hours.split(' ');
      const formattedHours = ampm.toLowerCase() === 'pm' ? parseInt(rawHours, 10) + 12 : rawHours;
      const formattedTime = `${formattedHours}:${minutes}`;
      return formattedTime;
    } else if (time instanceof Date) {
      // If time is a Date object, format it as needed
      // Example: return `${time.getHours()}:${time.getMinutes()}`;
      return time.toISOString().substr(11, 5); // Using ISO format (HH:mm)
    }
  
    // Handle other cases if needed
    return time;
  };

  const defaultStartTime = new Date();
  const defaultEndTime = new Date();


  const [formData, setFormData] = useState({
    eventName: '',
    date: new Date(),
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    duration: '',
    address: '',
    capacity: '',
    description: '',
    host: '',
    recurring: false,
  });

  const [validationErrors, setValidationErrors] = useState([]);

  const validateEventName = (eventName) => {
    return eventName.length > 0;
  };

  const validateDuration = (duration) => {
    return !isNaN(parseFloat(duration)) && isFinite(duration) && duration > 0;
  };

  const validateAddress = (address) => {
    return address.length > 0;
  };

  const validateCapacity = (capacity) => {
    return !isNaN(parseInt(capacity)) && isFinite(capacity) && capacity > 0;
  };

  const validateTime = (time) => {
    // Add your time validation logic here if needed
    return true; // For now, assuming time is valid
  };

  const handleSubmit = async () => {
    console.log(formData)
    // Perform client-side validations
    const errors = [];

    if (!validateEventName(formData.eventName)) {
      errors.push('Event Name is required');
    }

    if (!validateDuration(formData.duration)) {
      errors.push('Duration must be a number');
    }

    if (!validateAddress(formData.address)) {
      errors.push('Address is required');
    }

    if (!validateCapacity(formData.capacity)) {
      errors.push('Capacity must be a number');
    }

    // Add time validations if needed
    if (!validateTime(formData.startTime)) {
      errors.push('Invalid start time');
    }

    if (!validateTime(formData.endTime)) {
      errors.push('Invalid end time');
    }

    // Update the state with validation errors
    setValidationErrors(errors);

    // If there are no validation errors, submit the form
    if (errors.length === 0) {
      // Use eventAPI to handle backend transfer
      const sendData = await eventApi.create(formData);
      if (sendData) {
        navigation.navigate('ViewProfile', { user: userInfo });
      }
    }
  };

  return (
    <>
      <View style={styles.container}>
        {validationErrors.length > 0 && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Validation Errors:</Text>
            {validationErrors.map((error, index) => (
              <Text key={index} style={styles.errorText}>
                {error}
              </Text>
            ))}
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={formData.eventName}
          onChangeText={(text) => setFormData({ ...formData, eventName: text })}
        />
        <Text>Date</Text>
        <DatePicker
          portalId="root-portal"
          selected={new Date(formData.date)}
          onChange={(date) => {setFormData({ ...formData, date })}}
        />
        <Text>Start Time</Text>
        <TimePicker
          style={styles.input}
          value={formData.startTime}
          disableClock={true}
          onChange={(time) => setFormData({ ...formData, startTime: time })}
        />
        <Text>Start Time</Text>
        <TimePicker
          style={styles.input}
          value={formData.endTime}
          disableClock={true}
          onChange={(time) => setFormData({ ...formData, endTime: time })}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration (hours)"
          value={formData.duration}
          onChangeText={(text) => setFormData({ ...formData, duration: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Capacity"
          value={formData.capacity}
          onChangeText={(text) => setFormData({ ...formData, capacity: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Recurring</Text>
          <Switch
            value={formData.recurring}
            onValueChange={(value) => setFormData({ ...formData, recurring: value })}
          />
        </View>
        <Button title="Submit" onPress={handleSubmit} color="blue" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#FFD2D2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
});

export default CreateEvent;
