import { apiBaseUrl } from '../utils/apiUtils';

const eventApi = {
  getEvents: async () => {
    const response = await fetch(`${apiBaseUrl}/event/fetch`);

    const events = await response.json();
    return events;
  },
  create: async (formData) => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };

    const response = await fetch(`${apiBaseUrl}/event/create`, requestOptions);

    const event = await response.json();
    return event;
  },

  rsvp: async (eventId, hostId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/event/rsvp/${eventId}/${hostId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      throw new Error('Failed to RSVP to event');
    }
  }, 

  delete: async (eventId, userId) => {
    const requestOptions = {
      method: 'DELETE', // Change this to 'DELETE'
      headers: { 'Content-Type': 'application/json' },
    };
  
    const response = await fetch(`${apiBaseUrl}/event/delete/${eventId}/${userId}`, requestOptions); // Adjust the endpoint
  
    if (response.status === 200) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Failed to delete event');
    }
  },
  reportEvent: async (eventId, reportData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/event/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          reportData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error reporting event:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  },
}

export default eventApi;