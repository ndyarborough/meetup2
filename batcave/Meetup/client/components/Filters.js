// Filters.js
import React from 'react';
import { View, Text, StyleSheet, Pressable, Button } from 'react-native';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
// needed for time picker
import 'react-time-picker/dist/TimePicker.css';

const Filters = ({ startDate, endDate, startTime, endTime, handleDateChange, handleTimeChange, onFilterPress }) => {
    return (
        <View style={{ padding: '1em', marginLeft: '20.5vw', marginTop: '3vh', marginBottom: '3vh', maxWidth: '50vw', overflow: 'hidden', borderColor: 'black', borderWidth: 1 }}>
            <View>
                <Text style={styles.header}>Filters</Text>
            </View>
            <View>
                <Text>Start Date:</Text>
                <DatePicker
                    style={{ maxWidth: '100%' }}
                    portalId="root-portal"
                    selected={startDate}
                    onChange={(date) => handleDateChange(date, 'start')}
                    className="red"
                />

                <Text>End Date:</Text>
                <DatePicker
                    portalId="root-portal"
                    selected={endDate}
                    onChange={(date) => handleDateChange(date, 'end')}
                />

                <View>
                    <Text>Start Time:</Text>
                    <TimePicker
                        value={startTime}
                        onChange={(time) => handleTimeChange(time, 'start')}
                        disableClock={true}
                    />

                    <Text>End Time:</Text>
                    <TimePicker
                        value={endTime}
                        onChange={(time) => handleTimeChange(time, 'end')}
                        disableClock={true}
                    />
                </View>

            </View>
            <Pressable onPress={() => {onFilterPress();}}>
  <Text style={{ backgroundColor: 'rgb(0, 170, 255)', color: 'white', borderColor: 'black', borderWidth: 1, textAlign: 'center' }}>Apply Filter</Text>
</Pressable>
        </View>
    );


};

const styles = StyleSheet.create({
    header: {
        fontWeight: 500,
        fontSize: '1.5em'
    }
})

export default Filters;
