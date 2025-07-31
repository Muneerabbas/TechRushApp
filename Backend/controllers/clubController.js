// controllers/clubController.js
const Club = require('../models/Club');
const User = require('../models/User');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');
const fs = require('fs').promises; // Required for file system operations

/**
 * @description Create a new club, now with optional file upload.
 */
exports.createClub = async (req, res, next) => {
  try {
    const { name, description, membershipType, subscriptionFee, subscriptionFrequency } = req.body;

    if (!name || !description) {
      if (req.file) await fs.unlink(req.file.path); 
      return res.status(400).json({ message: 'Club name and description are required.' });
    }

    if (membershipType === 'Subscription' && (!subscriptionFee || subscriptionFee <= 0)) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ message: 'Subscription-based clubs must have a fee greater than zero.' });
    }

    const clubExists = await Club.findOne({ name });
    if (clubExists) {
        if (req.file) await fs.unlink(req.file.path);
        return res.status(400).json({ message: `A club with the name "${name}" already exists.` });
    }

    // Set the path for the cover image if a file was uploaded
    const coverImage = req.file ? `/uploads/${req.file.filename}` : '';

    const club = new Club({
        name,
        description,
        creator: req.user._id,
        membershipType,
        subscriptionFee: membershipType === 'Subscription' ? subscriptionFee : 0,
        subscriptionFrequency: membershipType === 'Subscription' ? subscriptionFrequency : null,
        coverImage: coverImage,
    });

    await club.save();
    logger.info(`Club "${name}" created by ${req.user.email}`);
    res.status(201).json({ message: 'Club created successfully', club });
  } catch (error) {
    // If any other error occurs after file upload, delete the file
    if (req.file) {
      await fs.unlink(req.file.path).catch(err => console.error("Error deleting file on failure:", err));
    }
    next(error);
  }
};

/**
 * @description Add a new organizer to a club.
 */
exports.addOrganizer = async (req, res, next) => {
    try {
        const { clubId } = req.params;
        const { newOrganizerId } = req.body;

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found.' });
        }

        // Check if the current user is an organizer
        if (!club.organizers.includes(req.user._id)) {
            return res.status(403).json({ message: 'Forbidden. Only existing organizers can add new ones.' });
        }

        // Check if the new organizer is a valid user and not already an organizer
        const newOrganizer = await User.findById(newOrganizerId);
        if (!newOrganizer) {
            return res.status(404).json({ message: 'User to be added as organizer not found.' });
        }
        if (club.organizers.includes(newOrganizerId)) {
            return res.status(400).json({ message: 'This user is already an organizer.' });
        }

        club.organizers.push(newOrganizerId);
        // If the new organizer was a regular member, remove them from the members list
        club.members = club.members.filter(member => !member.user.equals(newOrganizerId));
        
        await club.save();

        // Notify the new organizer
        await new Notification({
            user: newOrganizerId,
            message: `You have been made an organizer for the club: "${club.name}".`,
            type: 'Club',
            relatedId: club._id,
        }).save();

        logger.info(`User ${newOrganizerId} was added as an organizer to "${club.name}" by ${req.user.email}`);
        res.status(200).json({ message: 'New organizer added successfully.', club });

    } catch (error) {
        next(error);
    }
};

/**
 * @description Get a list of all available clubs.
 */
exports.getAllClubs = async (req, res, next) => {
    try {
        const clubs = await Club.find().select('name description coverImage membershipType');
        res.status(200).json(clubs);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Get detailed information about a single club.
 */
exports.getClubDetails = async (req, res, next) => {
    try {
        const club = await Club.findById(req.params.clubId)
            .populate('organizers', 'name profilePicture')
            .populate('members.user', 'name profilePicture')
            .populate('pendingRequests', 'name profilePicture');

        if (!club) {
            return res.status(404).json({ message: 'Club not found.' });
        }
        res.status(200).json(club);
    } catch (error) {
        next(error);
    }
};

/**
 * @description Allow a student to request to join a club.
 */
exports.requestToJoinClub = async (req, res, next) => {
    try {
        const club = await Club.findById(req.params.clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found.' });
        }

        const userId = req.user._id;

        if (club.members.some(m => m.user.equals(userId)) || club.organizers.includes(userId)) {
            return res.status(400).json({ message: 'You are already a member of this club.' });
        }
        if (club.pendingRequests.includes(userId)) {
            return res.status(400).json({ message: 'You already have a pending request to join this club.' });
        }

        club.pendingRequests.push(userId);
        await club.save();
        
        const notifications = club.organizers.map(orgId => ({
            user: orgId,
            message: `${req.user.name} has requested to join your club, "${club.name}".`,
            type: 'Club',
            relatedId: club._id,
        }));
        await Notification.insertMany(notifications);

        logger.info(`${req.user.email} requested to join club "${club.name}"`);
        res.status(200).json({ message: 'Your request to join the club has been sent.' });
    } catch (error) {
        next(error);
    }
};

/**
 * @description Allow a club organizer to approve or deny a join request.
 */
exports.manageJoinRequest = async (req, res, next) => {
    try {
        const { studentId, action } = req.body;
        if (!['approve', 'deny'].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'deny'." });
        }

        const club = await Club.findById(req.params.clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found.' });
        }

        if (!club.organizers.includes(req.user._id)) {
            return res.status(403).json({ message: 'Forbidden. Only club organizers can manage requests.' });
        }

        if (!club.pendingRequests.includes(studentId)) {
            return res.status(404).json({ message: 'This user does not have a pending request.' });
        }
        club.pendingRequests = club.pendingRequests.filter(id => !id.equals(studentId));

        let notificationMessage = '';
        if (action === 'approve') {
            club.members.push({ user: studentId });
            notificationMessage = `Your request to join "${club.name}" has been approved.`;
            logger.info(`Request from ${studentId} to join "${club.name}" was approved by ${req.user.email}`);
        } else {
            notificationMessage = `Your request to join "${club.name}" has been denied.`;
            logger.info(`Request from ${studentId} to join "${club.name}" was denied by ${req.user.email}`);
        }
        
        await club.save();

        await new Notification({
            user: studentId,
            message: notificationMessage,
            type: 'Club',
            relatedId: club._id
        }).save();

        res.status(200).json({ message: `Request has been successfully ${action}d.`, club });
    } catch (error) {
        next(error);
    }
};
