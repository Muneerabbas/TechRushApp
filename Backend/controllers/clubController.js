// controllers/clubController.js
const Club = require('../models/Club');
const User = require('../models/User');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

/**
 * @description Create a new club. Only accessible by Admins.
 */
exports.createClub = async (req, res, next) => {
  try {
    const { name, description, membershipType, subscriptionFee, subscriptionFrequency } = req.body;

    if (membershipType === 'Subscription' && (!subscriptionFee || subscriptionFee <= 0)) {
        return res.status(400).json({ message: 'Subscription-based clubs must have a fee greater than zero.' });
    }

    const clubExists = await Club.findOne({ name });
    if (clubExists) {
        return res.status(400).json({ message: `A club with the name "${name}" already exists.` });
    }

    const club = new Club({
        name,
        description,
        creator: req.user._id, // The logged-in admin is the creator
        membershipType,
        subscriptionFee: membershipType === 'Subscription' ? subscriptionFee : 0,
        subscriptionFrequency: membershipType === 'Subscription' ? subscriptionFrequency : null,
    });

    await club.save();
    logger.info(`Club "${name}" created by admin ${req.user.email}`);
    res.status(201).json({ message: 'Club created successfully', club });
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
            .populate('members.user', 'name profilePicture');

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

        // Check if user is already a member, organizer, or has a pending request
        if (club.members.some(m => m.user.equals(userId)) || club.organizers.includes(userId)) {
            return res.status(400).json({ message: 'You are already a member of this club.' });
        }
        if (club.pendingRequests.includes(userId)) {
            return res.status(400).json({ message: 'You already have a pending request to join this club.' });
        }

        club.pendingRequests.push(userId);
        await club.save();
        
        // Notify organizers
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
        const { studentId, action } = req.body; // action can be 'approve' or 'deny'
        if (!['approve', 'deny'].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'deny'." });
        }

        const club = await Club.findById(req.params.clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found.' });
        }

        // Check if the requester is an organizer
        if (!club.organizers.includes(req.user._id)) {
            return res.status(403).json({ message: 'Forbidden. Only club organizers can manage requests.' });
        }

        // Remove the student from pending requests
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

        // Notify the student of the decision
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
