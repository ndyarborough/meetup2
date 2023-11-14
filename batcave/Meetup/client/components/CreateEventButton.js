import React from 'react';
import { Pressable, Button } from 'react-native';

const CreateEventButton = ({ navigation, userInfo }) => {
  return (
    <Pressable onPress={() => navigation.navigate('CreateEvent', { user: userInfo })}>
      <Button title="Create Event" />
    </Pressable>
  );
};

export default CreateEventButton;
