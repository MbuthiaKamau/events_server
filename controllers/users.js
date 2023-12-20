import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndRemove(id);

    const users = await User.find();
    res.status(201).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* ADMIN: Update User Status */
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    // Ensure that the new status is a valid option (e.g., 'approved', 'rejected')
    const validStatusOptions = ['pending', 'approved', 'rejected'];
    if (!validStatusOptions.includes(newStatus)) {
      return res.status(400).json({ status: 'error', msg: 'Invalid status option.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { status: newStatus } },
      { new: true }
    );
    const users = await User.find();
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};