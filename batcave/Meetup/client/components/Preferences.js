import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import Toast from 'react-native-toast-message';
import userApi from '../api/userApi';

const Preferences = ({ route, navigation }) => {
  const [preferences, setPreferences] = useState(null);
  const [userInfo, setUserInfo] = useState(null)
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        console.log()
        const user = route.params.userInfo
        setUserInfo(user)
        const savedPreferences = await userApi.getPreferences(user._id);
        const notificationPreference = savedPreferences[0].receiveNotifications;
        const rsvpVisibilityPreference = savedPreferences[0].rsvpVisibility;

        setPreferences(prevPreferences => ({
          ...prevPreferences,
          receiveNotifications: notificationPreference,
          rsvpVisibility: rsvpVisibilityPreference,
        }));
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchUserPreferences();
  }, []);

  const handleToggleNotifications = () => {
    // Toggle the state for receiving notifications
    setPreferences(prevPreferences => ({
      ...prevPreferences,
      receiveNotifications: !prevPreferences.receiveNotifications,
    }));
  };

  const handleToggleRSVPVisibility = () => {
    setPreferences(prevPreferences => ({
      ...prevPreferences,
      rsvpVisibility: !prevPreferences.rsvpVisibility,
    }));
  };


  const handleSavePreferences = async () => {
    try {
      // Make API request to save preferences
      await userApi.savePreferences(userInfo._id, preferences);

      // Display a success toast message
      Toast.show({
        type: 'success',
        text1: 'Preferences Saved',
        visibilityTime: 3000, // 3 seconds
        autoHide: true,
        topOffset: 30,
      });
    } catch (error) {
      // Display an error toast message
      Toast.show({
        type: 'error',
        text1: 'Error saving preferences',
        visibilityTime: 3000, // 3 seconds
        autoHide: true,
        topOffset: 30,
      });
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <View style={styles.container}>
      {!preferences ? <Text>Loading Preferences</Text> :
        <View>
          <Text style={styles.title}>My Preferences</Text>
          {/* Receive notifications */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.label}>Receive Notifications</Text>
            <Switch
              value={preferences.receiveNotifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={preferences.receiveNotifications ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          {/* Rsvp Visibility */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.label}>RSVP Visibility</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={preferences.rsvpVisibility}
                onValueChange={handleToggleRSVPVisibility}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={preferences.rsvpVisibility ? '#f5dd4b' : '#f4f3f4'}
              />
              {/* <Text>{preferences.rsvpVisibility ? 'Enabled' : 'Disabled'}</Text> */}
            </View>
          </View>
          {/* Save Preferences Button */}
          <Pressable onPress={handleSavePreferences} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </Pressable>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  preferenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Preferences;
