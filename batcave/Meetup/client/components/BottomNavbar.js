import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const BottomNavbar = ({userInfo}) => {
  const navigation = useNavigation(); // Use useNavigation to get the navigation object
  return (
    <View style={styles.navbar}>
      {/* Column 1 */}
      <TouchableOpacity
        style={styles.column}
        onPress={() => navigation.navigate('ViewProfile', {user: JSON.stringify(userInfo)})}
      >
        <Image source={require('../assets/profile.png')} style={styles.icon} />
        <Text style={styles.text}>My Profile</Text>
      </TouchableOpacity>

      {/* Column 2 */}
      <TouchableOpacity
        style={styles.column}
        onPress={() => navigation.navigate('BrowseEvents', {user: userInfo})}
      >
        <Image source={require('../assets/browse.png')} style={styles.icon} />
        <Text style={styles.text}>Browse Events</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#00AAFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
});

export default BottomNavbar;
