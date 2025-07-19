const mongoose = require('mongoose');

const expoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  booth: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true,
    default: 'TBD'
  },
  speaker: {
    type: String,
    required: true,
    default: 'TBD'
  },
  attendeeList: [
    {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      }
    }
  ],
  exhibitorList: [
    {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      companyName: {
        type: String,
        required: true
      },
      productsServices: {
        type: String,
        required: true
      },
      documents: {
        type: String,
        required: true
      },
    }
  ],
  exhibitorRequests: [
    {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      companyName: {
        type: String,
        required: true
      },
      productsServices: {
        type: String,
        required: true
      },
      documents: {
        type: String,
        required: true
      },
    }
  ]

});

// Virtuals to calculate attendeeCount and exhibitorCount dynamically
expoSchema.virtual('attendeeCount').get(function () {
  return this.attendeeList.length;
});

expoSchema.virtual('exhibitorCount').get(function () {
  return this.exhibitorList.length;
});

// Ensure virtuals are included when converting documents to JSON or Objects
expoSchema.set('toJSON', { virtuals: true });
expoSchema.set('toObject', { virtuals: true });

const ExpoModal = mongoose.model('Expo', expoSchema);

module.exports = ExpoModal;
