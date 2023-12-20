import Event from "../models/Event.js";
import User from "../models/User.js";

/* CREATE */
export const createEvent = async (req, res) => {
  try {
    const { userId, description,location,date,time,category,venue, picturePath } = req.body;
    const user = await User.findById(userId);
    const newEvent = new Event({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      date,
      time,
      category,
      location,
      venue,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newEvent.save();

    const event = await Event.find();
    res.status(201).json(event);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedEvents = async (req, res) => {
  try {
    const event = await Event.find();
    res.status(200).json(event);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const event = await Event.find({ userId });
    res.status(200).json(event);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likeEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const event = await Event.findById(id);
    const isLiked = event.likes.get(userId);

    if (isLiked) {
      event.likes.delete(userId);
    } else {
      event.likes.set(userId, true);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { likes: event.likes },
      { new: true }
    );

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



/* DELETE */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await Event.findByIdAndRemove(id);  

 const event = await Event.find();
 res.status(201).json(event);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* ADMIN: Update Event Status */
export const approveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    // Ensure that the new status is a valid option (e.g., 'approved', 'rejected')
    const validStatusOptions = ['pending', 'approved', 'rejected'];
    if (!validStatusOptions.includes(newStatus)) {
      return res.status(400).json({ status: 'error', msg: 'Invalid status option.' });
    }

    // Find the event by ID and update the status
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: { status: newStatus } },
      { new: true }
    );

    const event = await Event.find();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};