import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import userApi from '../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleLogin = () => {
        userApi.login(username, password)
            .then(response => {
                if (response.success == true) {
                    console.log('Login successful:', response)
                    const user = response.user
                    AsyncStorage.setItem('@user', JSON.stringify(user))
                        .then(
                            navigation.navigate('ViewProfile')
                        )
                } else {
                    console.log('Login failed:', response)
                    setValidationError('Username or password is incorrect')
                }
            })
            .catch(error => {
                console.error('Login error: ', error)
            })
    };

    return (
        <View style={styles.container}>
            
            <Text style={styles.heading}>Login</Text>
            {validationError !== '' && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{validationError}</Text>
                </View>
            )}
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={text => setUsername(text)}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
                value={password}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    errorContainer: {
        borderColor: 'red',
        borderWidth: 1,
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
    },
});

export default Login;
