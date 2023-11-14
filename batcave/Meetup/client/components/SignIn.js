import { React, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Button, View, Pressable } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import userApi from '../api/userApi';

const SignIn = ({ onPress, navigation }) => {

  // If user session is available, skip sign in and go to view profile
  useEffect(() => {
    AsyncStorage.getItem('@user')
      .then(user => {
        if (user) navigation.navigate('ViewProfile')
      })
  }, [])

  // Form Data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  // Validation Errors, shown on screen when submit doesn't go through
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  // Errors from the database upon form submit, handled and converted to Validation Errors
  const [dbErrors, setDbErrors] = useState({
    general: ''
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    const errors = {};
    // Validation
    if (formData.username.length < 4 || formData.username.length > 8) {
      errors.username = 'Username must be 4-8 characters';
    }
    if (!formData.email.endsWith('@uncc.edu') && !formData.email.endsWith('@charlotte.edu')) {
      errors.email = 'Email must end with @uncc.edu or @charlotte.edu';
    }
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    if (formData.password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setValidationErrors(errors);

    // If there are no validation errors submit the form
    if (Object.keys(errors).length === 0) {

      const { username, email, password, fullName } = formData
      userApi.register(username, email, password, fullName)
        .then(async (response) => {
          if (!(response.status == 400)) {
            console.log(response.user)
            await AsyncStorage.setItem('@user', JSON.stringify(response.user));
            navigation.navigate('ViewProfile', {user: JSON.stringify(response.user)})

          } else {
            setDbErrors({ general: 'Username or email already in use' })
          }


        })
        .catch((error) => {
          console.log('Network Error:', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome to Meetup!</Text>
      <Text style={styles.errorText}>{dbErrors.general}</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={formData.username}
        onChangeText={(text) => handleChange('username', text)}
      />
      <Text style={styles.errorText}>{validationErrors.username}</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={formData.fullName}
        onChangeText={(text) => handleChange('fullName', text)}
      />
      <Text style={styles.errorText}>{validationErrors.fullName}</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
      />
      <Text style={styles.errorText}>{validationErrors.email}</Text>

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry={true}
      />
      <Text style={styles.errorText}>{validationErrors.password}</Text>

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={formData.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        secureTextEntry={true}
      />
      <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>

      <Button title="Submit" onPress={() => handleSubmit()} />
      <StatusBar style="auto" />
      <Text>Or</Text>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#007bff',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default SignIn;