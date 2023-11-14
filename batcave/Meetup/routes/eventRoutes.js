const express = require('express');

const User = require('../models/User');
const router = express.Router();
const Event = require('../models/Event'); //Import event model
const mongoose = require('mongoose');

// Route for event creation
router.post('/create', async (req, res) => {
  const { eventName, date, startTime, endTime, duration, address, capacity, description, host, recurring } = req.body;

  try {
    // Parse the date, startTime, and endTime to valid Date objects
    const parsedDate = new Date(date);
    const parsedStartTime = new Date(`1970-01-01T${startTime}`);
    const parsedEndTime = new Date(`1970-01-01T${endTime}`);

    // Create a new event
    const event = new Event({
      eventName,
      date: parsedDate,
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      duration,
      address,
      capacity,
      description,
      host,
      recurring,
    });
    await event.save();

    // Find the user by the host ID
    const user = await User.findById(host);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('create was called');
    // Update the user's events array
    user.events.push(event);
    await user.save();

    res.json({ message: 'Event successfully created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Event creation failed' });
  }
});

  // Route for event deletion
router.delete('/delete/:eventId/:userId', async (req, res) => {
    const { eventId, userId } = req.params;
  
    try {
      // Find the event by its ID
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Check if the user is the host of the event
      if (event.host.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized: You are not the host of this event' });
      }
  
      // Remove the event from the user's events array
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const eventIndex = user.events.indexOf(eventId);
      if (eventIndex !== -1) {
        user.events.splice(eventIndex, 1);
      }
  
      // Remove the event from the database
      await Event.findOneAndDelete(event);
      await user.save();
  
      res.json({ message: 'Event successfully deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Event deletion failed' });
    }
  });
  
  

//Route for fetching event data
router.get('/fetch', async (req, res) => {
    try{
        const event = await Event.find();
        res.json(event);
    }catch (error){
        console.error('Error fetching events:', error);
        res.status(500).json({message: 'Error fetching event data'});
    }
});

router.get('/fetch/:eventId', async (req, res) => {
    try{
        const eventId = new mongoose.Types.ObjectId(req.params.eventId);
        const event = await Event.findById(eventId);
        res.json(event);
    }catch (error){
        console.error('Error fetching events:', error);
        res.status(500).json({message: 'Error fetching event data'});
    }
});

//Route for deleting event
router.post('/delete-event', async (req, res)=> {
    const eventId = req.body.eventId;

    Event.findByIdAndRemove(eventId, (err, result)=>{
        if(err){
            res.status(500).json({error: 'Could not delete event'});
        } else{
            res.status(200).json({message: 'Event successfully deleted'});
        }
    })
});

//Route for updating event
router.post('/update-event', async (req, res) =>{
    const eventId = req.body.eventId;
    const updatedData = {
        eventName: req.body.eventName,
        date: req.body.date,
        duration: req.body.duration,
        address: req.body.address,
        capacity: req.body.capacity,
        description: req.body.description,
        host: req.body.host,
        reacurring: req.body.reacurring,
    };

    Event.findByIdAndUpdate(eventId, updatedData, {new: true}, (err, updatedEvent) =>{
        if (err){
            res.status(500).json({error: 'Could not update event'});
        } else{
            res.status(200).json(updatedEvent);
        }
    })
})

router.post('/rsvp/:eventId/:userId', async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.params.userId;

    try {
        // Find the event by its ID
        const event = await Event.findOne({ _id: eventId });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the user is already in the rsvps array
        const userIndex = event.rsvps.users.findIndex(user => user.toString() === userId);

        if (userIndex !== -1) {
            // If user is already in the RSVP list, remove them
            event.rsvps.users.splice(userIndex, 1);
            res.status(200).json({ message: `You are no longer RSVP\'d for \"${event.eventName}\"`, event });
        } else {
            // If user is not in the RSVP list, add them
            event.rsvps.users.push(userId);
            res.status(200).json({ message: `You have RSVP\'d for \"${event.eventName}\"`, event });  
        }

        // Save the updated event
        await event.save();

        // Update the user's rsvps array
        const user = await User.findOne({ _id: userId });

        if (user) {
            // Check if the event is already in the user's rsvps array
            const eventIndex = user.rsvps.findIndex(event => event.toString() === eventId);

            if (eventIndex !== -1) {
                // If the event is already in the user's rsvps, remove it
                user.rsvps.splice(eventIndex, 1);
            } else {
                // If the event is not in the user's rsvps, add it
                user.rsvps.push(eventId);
            }

            // Save the updated user
            await user.save();
        }

    } catch (error) {
        console.error('Error adding/removing user to/from RSVPs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/report', async (req, res) => {
    try {
      const { eventId, reportData } = req.body;
  
      // Validate or sanitize the input as needed
  
      // Find the event by ID
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      // Update the event with the report data
      event.reports.push(reportData);
      await event.save();
  
      // Respond with a success message or updated event data
      res.json({ message: 'Event reported successfully', updatedEvent: event });
    } catch (error) {
      console.error('Error reporting event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;