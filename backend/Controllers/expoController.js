const ExpoModal = require("../Models/ExpoSchema");

const expoController = {
  createExpo: async (req, res) => {
    const { title, imgUrl, date, location, description, booth, time, speaker, attendeeCount, exhibitorCount } = req.body;

    try {
      // Create a new Event document
      const newExpo = new ExpoModal({
        title,
        imgUrl,
        date,
        location,
        description,
        booth,
        // time,
        // speaker,
        // attendeeCount,
        // exhibitorCount
      });

      // Save the event to the database
      await newExpo.save();

      // Respond with the created event
      res.status(201).json({
        message: 'Event created successfully!',
        event: newExpo
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({
        message: 'Error creating event',
        error: error.message
      });
    }
  },
  updateExpo: async (req, res) => {
    const { id } = req.params; // Get the expo ID from the URL
    const { title, date, imgUrl, description, location, booth } = req.body; // Extract fields from the request body

    try {
      // Validate the incoming data
      if (!title || !date || !imgUrl || !description || !location || !booth) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Find the expo by ID and update it
      const updatedExpo = await ExpoModal.findByIdAndUpdate(
        id,
        { title, date, imgUrl, description, location, booth },
        { new: true, runValidators: true } // Return the updated document and run schema validators
      );

      if (!updatedExpo) {
        return res.status(404).json({ message: 'Expo not found' });
      }

      res.status(200).json({ message: 'Expo updated successfully', data: updatedExpo });
    } catch (error) {
      console.error('Error updating expo:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  getAllExpo: async (req, res) => {
    const expos = await ExpoModal.find()
    if (expos.length > 0) {
      res.json({
        message: "expo found",
        data: expos,
        status: true
      })
    } else {
      res.json({
        message: "No expos found",
        status: false
      })
    }
  },
  getSingleExpo: async (req, res) => {
    const { id } = req.params

    const expo = await ExpoModal.findById(id)

    if (!expo) {
      res.json({
        message: "Expo not found",
        status: false
      })
    } else {
      res.json({
        message: "Expo found",
        data: expo,
        status: true
      })
    }
  },
  // Update expo schedule
  scheduleExpo: async (req, res) => {
    const { id } = req.params; // Get the expo ID from the URL
    const { title, date, time, speaker, location } = req.body; // Extract fields from the request body

    try {
      // Validate the incoming data
      if (!title || !date || !time || !speaker || !location) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Find the expo by ID and update it
      const updatedExpo = await ExpoModal.findByIdAndUpdate(
        id,
        { title, date, time, speaker, location },
        { new: true, runValidators: true } // Return the updated document and run schema validators
      );

      if (!updatedExpo) {
        return res.status(404).json({ message: 'Expo not found' });
      }

      res.status(200).json({ message: 'Expo updated successfully', data: updatedExpo });
    } catch (error) {
      console.error('Error updating expo:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  deleteExpo: async (req, res) => {
    const { id } = req.params;

    try {
      // Find the expo by ID and delete it
      const deletedExpo = await ExpoModal.findByIdAndDelete(id);

      if (!deletedExpo) {
        return res.status(404).json({
          status: false,
          message: 'Expo not found'
        });
      }

      res.status(200).json({
        status: true,
        message: 'Expo deleted successfully',
        data: deletedExpo
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'An error occurred while deleting the expo',
        error: error.message
      });
    }
  },
  attendeeRegister: async (req, res) => {
    const { expoId, name, email } = req.body;

    // Validate the input
    if (!expoId || !name || !email) {
      return res.status(400).json({ message: 'expoId, name, and email are required' });
    }

    try {
      // Find the Expo by ID
      const expo = await ExpoModal.findById(expoId);

      if (!expo) {
        return res.status(404).json({ message: 'Expo not found' });
      }

      // Check if the attendee is already registered
      const isAlreadyRegistered = expo.attendeeList.some(
        (attendee) => attendee.email === email
      );

      if (isAlreadyRegistered) {
        return res.json({ message: 'Attendee already registered', status: false });
      }

      // Add the new attendee to the attendee list
      expo.attendeeList.push({ name, email });

      // Save the updated Expo document
      await expo.save();

      return res.status(200).json({
        message: 'Successfully registered for the expo',
        attendeeCount: expo.attendeeList.length,
        attendeeList: expo.attendeeList,
        status: true
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  exhibitorRequest: async (req, res) => {
    const { expoId, name, email, companyName, productsServices, documents } = req.body;
    try {
      const expo = await ExpoModal.findById(expoId);
      if (!expo) {
        return res.status(404).json({ message: 'Expo not found' });
      }
      expo.exhibitorRequests.push({ name, email, companyName, productsServices, documents });
      await expo.save();
      res.status(200).json({ message: 'Exhibitor request submitted successfully', status: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  acceptExhibitorRequest: async (req, res) => {
    const { expoId } = req.params;
    const { name, email } = req.body;
    try {
      const expo = await ExpoModal.findById(expoId);
      if (!expo) {
        return res.status(404).json({ message: 'Expo not found' });
      }

      const requestIndex = expo.exhibitorRequests.findIndex(request => request.email === email);
      if (requestIndex === -1) {
        return res.status(404).json({ message: 'Exhibitor request not found' });
      }

      const [acceptedExhibitor] = expo.exhibitorRequests.splice(requestIndex, 1);
      expo.exhibitorList.push(acceptedExhibitor);
      await expo.save();

      res.status(200).json({ message: 'Exhibitor request accepted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllExhibitorsRequest: async (req, res) => {
    try {
      // Fetch all expos and project only the exhibitorRequests field
      const expos = await ExpoModal.find({});

      const exhibitorRequests = expos.map(expo => ({
        title: expo.title,
        exhibitorRequests: expo.exhibitorRequests
      }));

      res.status(200).json({
        status: true,
        message: 'Exhibitor requests fetched successfully',
        data: exhibitorRequests
      });
    } catch (error) {
      console.error('Error fetching exhibitor requests:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error'
      });
    }
  },
  approveExhibitorRequest: async (req, res) => {
    const { expoId, exhibitorRequestId } = req.body;
  
    try {
      // Find the expo by ID
      const expo = await ExpoModal.findById(expoId);
  
      if (!expo) {
        return res.status(404).json({ message: 'Expo not found' });
      }
  
      // Find the exhibitor request by requestId
      const exhibitorRequest = expo.exhibitorRequests.id(exhibitorRequestId);
  
      if (!exhibitorRequest) {
        return res.status(404).json({ message: 'Exhibitor request not found' });
      }
  
      // Add the exhibitor request to exhibitorList
      expo.exhibitorList.push(exhibitorRequest);
  
      // Remove the exhibitor request from exhibitorRequests
      expo.exhibitorRequests.pull(exhibitorRequestId);
  
      // Save the updated expo document
      await expo.save();
  
      return res.status(200).json({ message: 'Exhibitor approved successfully', expo });
    } catch (error) {
      console.error('Error approving exhibitor:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  rejectExhibitorRequest: async (req, res) => {
    const { expoId, exhibitorRequestId } = req.body;

    try {
        const expo = await ExpoModal.findById(expoId);
        if (!expo) {
            return res.status(404).json({ status: false, message: 'Expo not found' });
        }

        // Filter out the rejected exhibitor request
        expo.exhibitorRequests = expo.exhibitorRequests.filter(
            (request) => request._id.toString() !== exhibitorRequestId
        );

        await expo.save();
        res.status(200).json({ status: true, message: 'Exhibitor request rejected successfully', expo });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error rejecting exhibitor request', error });
    }
}
}
module.exports = expoController