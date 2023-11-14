import React from 'react';
import { ScrollView } from 'react-native';
import EventItem from './EventItem';

const EventList = ({ events, handleRSVP, handleViewDetails, handleReportPost, userInfo }) => {
  return (
    <ScrollView style={{ marginLeft: '15vw' }}>
      {events.map(item => (
        <EventItem
          key={item._id}
          event={item}
          handleRSVP={handleRSVP}
          handleViewDetails={handleViewDetails}
          handleReportPost={handleReportPost}
          userInfo={userInfo}
        />
      ))}
    </ScrollView>
  );
};

export default EventList;
