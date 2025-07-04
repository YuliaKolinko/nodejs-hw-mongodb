import mongoose from 'mongoose';

const contactsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Contact = mongoose.model('Contact', contactsSchema);

export default Contact;
