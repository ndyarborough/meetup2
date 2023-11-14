import { apiBaseUrl } from '../utils/apiUtils';

const userApi = {
  getUserInfo: async (userId) => {
    const response = await fetch(`${apiBaseUrl}/user/getUserInfo/${userId}`);
    const userInfo = await response.json();
    return response;
  },
  register: async (username, email, password, fullName) => {
    const response = await fetch(`${apiBaseUrl}/user/register/${username}/${email}/${password}/${fullName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const newUser = await response.json();
    return newUser;
  },
  login: async (username, password) => {
    const response = await fetch(`${apiBaseUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const loggedInUser = await response.json();
    return loggedInUser;
  },
  sendMessage: async (senderId, receiverId, content) => {
    const response = await fetch(`${apiBaseUrl}/user/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId,
        receiverId,
        content
      }),
    });
  },
  getMyEvents: async (userId) => {
    const response = await fetch(`${apiBaseUrl}/user/myEvents/${userId}`);
    const myEvents = await response.json();
    console.log(myEvents)
    return myEvents;
  },
  getMyRsvps: async(userId) => {
    const response = await fetch(`${apiBaseUrl}/user/myRsvps/${userId}`);
    const myRsvps = await response.json();
    return myRsvps;
  },
  getPreferences: async (userId) => {
      const response = await fetch(`${apiBaseUrl}/user/preferences/${userId}`);
      const myPreferences = await response.json();
      return myPreferences;
  },
  savePreferences: async (userId, preferences) => {
    const response = await fetch(`${apiBaseUrl}/user/preferences/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
    });

    if (response.ok) {
        const result = await response.json();
        return result;
    } else {
        const error = await response.json();
        throw new Error(error.message);
    }
},
}

export default userApi;