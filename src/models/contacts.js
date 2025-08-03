import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: String,
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactsSchema.methods.toJSON = function () {
  const contact = this.toObject();
  delete contact.__v;
  return contact;
};

const Contact = model('Contact', contactsSchema);
export default Contact;
